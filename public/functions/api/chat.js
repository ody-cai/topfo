// POST /api/chat - AI 升学顾问（Cloudflare Workers AI + D1 云同步，多用户）
// v4 - D1 持久化聊天记录、自动加载 3 天上下文、自动归档
const AI_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

const SYSTEM_PROMPT = `你是蔡奇均的专属 AI 升学顾问，职责是帮助他规划加拿大大学申请。

## 蔡奇均的基本档案
- 中加学籍（中国加拿大双学籍）
- GPA：89.6%（百分制）
- 雅思总分：5.0（听力4.5 / 阅读4.5 / 写作5.5 / 口语5.0）
- 目标雅思：6.5（单项不低于6.0）
- 意向专业：计算机科学(CS)、理科综合

## 已追踪的26所加拿大院校
包含分校区：多伦多大学(UTSG/UTSC/UTM)、UBC(UBCV/UBCO)、麦吉尔、滑铁卢、麦马、阿尔伯塔、皇后、渥太华、SFU、约克、温莎、曼尼托巴、纽芬兰纪念、康考迪亚、卡尔顿、圭尔夫、劳里埃、布鲁克、TMU、维多利亚、达尔豪斯、卡尔加里、萨省大学。

## 关键录取数据和策略（核心记忆）
1. **现实可行（GPA够+雅思双录门槛已达标）**：渥太华、SFU、温莎、曼尼托巴、纽芬兰纪念、康考迪亚
2. **需冲刺（GPA踩线/差一点）**：麦马(MELD双录雅思5.0已达标)、多大分校区、皇后、Guelph CS(89%踩线)
3. **难度大**：多大主校UTSG、滑铁卢
4. **重要发现**：数学比CS好进9分(麦马85 vs 94)；心理比CS好进10-15分
5. **双录取限制**：多大IFP仅覆盖Arts&Sci/Arch/Music(不含工程和Rotman)；阿尔伯塔EAP不含工程
6. **澳洲预科备选**：UNSW Extended预科(雅思5.0达标)、昆士兰、阿德莱德

## 回答原则
- 基于蔡奇均的实际数据给出个性化建议
- 不要编造不存在的录取要求
- 如果问到不在这26所院校范围内的学校，诚实告知暂未收录
- 回答简洁有力，不要长篇大论
- 如果蔡奇均更新了GPA或雅思，分析对新录取可能性的影响
- 可以用中文或中英混合回答`;

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  return bytes;
}

async function verifyJWT(token, jwtSecret) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payloadB64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(payloadB64));
    if (claims.exp < Math.floor(Date.now() / 1000)) return null;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", hexToBytes(jwtSecret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sigB64 = parts[2].replace(/-/g, "+").replace(/_/g, "/");
    const sig = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0));
    const ok = await crypto.subtle.verify("HMAC", key, sig, encoder.encode(`${parts[0]}.${parts[1]}`));
    return ok ? claims : null;
  } catch { return null; }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

// GET /api/chat — 获取聊天记录（最近3天未归档）
export async function onRequestGet(context) {
  const { request, env } = context;

  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return Response.json({ error: "请先登录" }, { status: 401, headers: corsHeaders() });
  }

  const claims = await verifyJWT(auth.slice(7), env.JWT_SECRET);
  if (!claims) {
    return Response.json({ error: "登录已过期" }, { status: 401, headers: corsHeaders() });
  }

  if (claims.role !== "student" && claims.role !== "consultant" && claims.role !== "admin") {
    return Response.json({ error: "无权限使用聊天功能" }, { status: 403, headers: corsHeaders() });
  }

  const url = new URL(request.url);
  const archive = url.searchParams.get("archive") === "true";
  const since = url.searchParams.get("since"); // 可选：按日期筛选

  try {
    let query, params;
    if (archive) {
      // 获取归档消息
      if (since) {
        query = `SELECT id, role, content, archived, created_at FROM chat_messages WHERE user_id = ? AND archived = 1 AND created_at >= ? ORDER BY created_at ASC`;
        params = [claims.sub, since];
      } else {
        query = `SELECT id, role, content, archived, created_at FROM chat_messages WHERE user_id = ? AND archived = 1 ORDER BY created_at DESC LIMIT 100`;
        params = [claims.sub];
      }
    } else {
      // 获取最近 3 天活跃消息
      const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().replace("T", " ").substring(0, 19);
      query = `SELECT id, role, content, archived, created_at FROM chat_messages WHERE user_id = ? AND archived = 0 AND created_at >= ? ORDER BY created_at ASC`;
      params = [claims.sub, threeDaysAgo];
    }

    const result = await env.topfo_chat.prepare(query).bind(...params).all();
    const messages = (result.results || []).map(r => ({
      id: r.id,
      role: r.role,
      content: r.content,
      archived: !!r.archived,
      created_at: r.created_at
    }));

    return Response.json({ messages }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: `获取聊天记录失败: ${e.message}` }, { status: 500, headers: corsHeaders() });
  }
}

// POST /api/chat — 发送消息并获取 AI 回复
export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. 鉴权
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return Response.json({ error: "请先登录" }, { status: 401, headers: corsHeaders() });
  }

  const claims = await verifyJWT(auth.slice(7), env.JWT_SECRET);
  if (!claims) {
    return Response.json({ error: "登录已过期，请重新登录" }, { status: 401, headers: corsHeaders() });
  }

  if (claims.role !== "student" && claims.role !== "consultant" && claims.role !== "admin") {
    return Response.json({ error: "无权限使用聊天功能" }, { status: 403, headers: corsHeaders() });
  }

  // 2. 解析消息
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求格式错误" }, { status: 400, headers: corsHeaders() });
  }

  const userMessage = body.message || "";
  if (!userMessage || !userMessage.trim()) {
    return Response.json({ error: "消息不能为空" }, { status: 400, headers: corsHeaders() });
  }

  const userId = claims.sub;
  const now = new Date().toISOString().replace("T", " ").substring(0, 19);

  try {
    // 3. 保存用户消息到 D1
    await env.topfo_chat.prepare(
      `INSERT INTO chat_messages (user_id, role, content, archived, created_at) VALUES (?, 'user', ?, 0, ?)`
    ).bind(userId, userMessage.trim(), now).run();

    // 4. 自动归档 3 天前的消息
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().replace("T", " ").substring(0, 19);
    await env.topfo_chat.prepare(
      `UPDATE chat_messages SET archived = 1 WHERE user_id = ? AND archived = 0 AND created_at < ?`
    ).bind(userId, threeDaysAgo).run();

    // 5. 加载最近 3 天历史作为上下文
    const historyResult = await env.topfo_chat.prepare(
      `SELECT role, content FROM chat_messages WHERE user_id = ? AND created_at >= ? ORDER BY created_at ASC`
    ).bind(userId, threeDaysAgo).all();

    const historyMessages = (historyResult.results || []).map(r => ({
      role: r.role,
      content: r.content
    }));

    // 6. 组装 AI 调用消息（系统提示 + 最近历史 + 当前消息，上限 20 条）
    const aiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...historyMessages.slice(-19) // 留一条位置给当前消息（当前已包含在历史中）
    ];

    // 7. 调用 Cloudflare Workers AI
    const aiResult = await env.AI.run(AI_MODEL, {
      messages: aiMessages,
      temperature: 0.7,
      max_tokens: 2048,
    });

    const reply = aiResult.response || "（未收到回复）";

    // 8. 保存 AI 回复到 D1
    await env.topfo_chat.prepare(
      `INSERT INTO chat_messages (user_id, role, content, archived, created_at) VALUES (?, 'assistant', ?, 0, ?)`
    ).bind(userId, reply, new Date().toISOString().replace("T", " ").substring(0, 19)).run();

    return Response.json({ reply }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: `AI 服务异常: ${e.message || e}` }, { status: 502, headers: corsHeaders() });
  }
}
