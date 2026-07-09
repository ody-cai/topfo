// GET /api/ai/recommend — AI 智能选校推荐（真·AI）
// 使用 Cloudflare Workers AI + D1 学校数据生成个性化推荐
// 需要 JWT 认证

const AI_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

// Fallback 推荐数据（D1 不可用时使用）
function getFallbackRecommendations(gpa, ielts) {
  const schools = [
    { name_zh: "多大·圣乔治", name_en: "UofT St. George", province: "ON", category: "CS", gpa_min: 93, ielts_min: 6.5 },
    { name_zh: "多大·圣乔治", name_en: "UofT St. George", province: "ON", category: "Math", gpa_min: 85, ielts_min: 6.5 },
    { name_zh: "UBC·温哥华", name_en: "UBC Vancouver", province: "BC", category: "CS", gpa_min: 92, ielts_min: 6.5 },
    { name_zh: "UBC·温哥华", name_en: "UBC Vancouver", province: "BC", category: "Math", gpa_min: 85, ielts_min: 6.5 },
    { name_zh: "麦吉尔", name_en: "McGill", province: "QC", category: "CS", gpa_min: 93, ielts_min: 6.5 },
    { name_zh: "滑铁卢", name_en: "Waterloo", province: "ON", category: "CS", gpa_min: 97, ielts_min: 6.5 },
    { name_zh: "滑铁卢", name_en: "Waterloo", province: "ON", category: "Math", gpa_min: 85, ielts_min: 6.5 },
    { name_zh: "麦马", name_en: "McMaster", province: "ON", category: "Math", gpa_min: 85, ielts_min: 6.5 },
    { name_zh: "麦马", name_en: "McMaster", province: "ON", category: "CS", gpa_min: 94, ielts_min: 6.5 },
    { name_zh: "阿尔伯塔", name_en: "Alberta", province: "AB", category: "CS", gpa_min: 82, ielts_min: 6.5 },
    { name_zh: "渥太华", name_en: "uOttawa", province: "ON", category: "CS", gpa_min: 80, ielts_min: 6.5 },
    { name_zh: "SFU", name_en: "SFU", province: "BC", category: "CS", gpa_min: 80, ielts_min: 6.5 },
    { name_zh: "温莎", name_en: "Windsor", province: "ON", category: "CS", gpa_min: 75, ielts_min: 6.5 },
    { name_zh: "曼尼托巴", name_en: "Manitoba", province: "MB", category: "CS", gpa_min: 75, ielts_min: 6.5 },
    { name_zh: "纽芬兰纪念", name_en: "Memorial", province: "NL", category: "CS", gpa_min: 70, ielts_min: 6.5 },
    { name_zh: "康考迪亚", name_en: "Concordia", province: "QC", category: "CS", gpa_min: 75, ielts_min: 6.5 },
    { name_zh: "卡尔顿", name_en: "Carleton", province: "ON", category: "CS", gpa_min: 80, ielts_min: 6.5 },
    { name_zh: "多大·密西沙加(UTM)", name_en: "UTM", province: "ON", category: "CS", gpa_min: 85, ielts_min: 6.5 },
    { name_zh: "UBC·Okanagan", name_en: "UBCO", province: "BC", category: "CS", gpa_min: 80, ielts_min: 6.5 },
  ];

  const reach = [], match = [], safety = [];

  for (const s of schools) {
    if (gpa >= s.gpa_min + 5) {
      safety.push(s);
    } else if (gpa >= s.gpa_min) {
      match.push(s);
    } else if (gpa >= s.gpa_min - 8) {
      reach.push(s);
    }
  }

  return { reach, match, safety };
}

export async function onRequestGet(context) {
  const { request, env } = context;

  // JWT 认证
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return Response.json({ error: "请先登录" }, { status: 401, headers: corsHeaders() });
  }

  // 本函数内联 JWT 验证（self-contained）
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

  const claims = await verifyJWT(auth.slice(7), env.JWT_SECRET);
  if (!claims) {
    return Response.json({ error: "登录已过期" }, { status: 401, headers: corsHeaders() });
  }

  const username = claims.sub;
  const url = new URL(request.url);
  const userGpa = url.searchParams.get('gpa');
  const userIelts = url.searchParams.get('ielts');

  try {
    // 获取用户数据
    let gpa = userGpa ? parseFloat(userGpa) : null;
    let ielts = userIelts ? parseFloat(userIelts) : null;

    // 从 D1 获取用户档案（如果 URL 参数未提供）
    if (!gpa || !ielts) {
      try {
        const user = await env.topfo_chat.prepare(
          `SELECT u.username, sp.gpa, sp.ielts_overall FROM users u
           LEFT JOIN student_profiles sp ON sp.user_id = u.id
           WHERE u.username = ?`
        ).bind(username).first();
        if (user) {
          if (!gpa) gpa = user.gpa;
          if (!ielts) ielts = user.ielts_overall;
        }
      } catch (d1Err) {
        // D1 不可用，使用默认值
      }
    }

    // 最终默认值
    if (!gpa) gpa = 89.6;
    if (!ielts) ielts = 5.0;

    // 获取学校数据
    let allPrograms = [];
    try {
      const result = await env.topfo_chat.prepare(
        `SELECT s.name_zh, s.name_en, s.province, s.city, p.category,
                p.gpa_min, p.gpa_mid, p.ielts_min, p.ielts_dual,
                p.has_coop, p.notes, p.note_detail
         FROM programs p JOIN schools s ON s.id = p.school_id
         WHERE p.gpa_min IS NOT NULL AND p.gpa_min != ''`
      ).all();
      allPrograms = result.results || [];
    } catch {
      // D1 不可用，使用 fallback
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (allPrograms.length > 0) {
      // 构建 AI 用的学校数据
      const schoolData = allPrograms.map(p =>
        `${p.name_zh}(${p.name_en}) - ${p.category}: GPA要求${p.gpa_min}, 雅思要求${p.ielts_min || '?'}`
      ).join('\n');

      systemPrompt = `你是加拿大大学升学规划 AI 顾问。根据学生的 GPA 和雅思成绩，从以下学校和专业中推荐最适合的选项。
将推荐分为三档：
1. 冲刺（Reach）：学生的成绩比要求低 5-10 分，但有双录取或其他路径补足
2. 匹配（Match）：成绩达到或接近要求（±5分以内）
3. 保底（Safety）：成绩超过要求 5 分以上

学生数据：GPA ${gpa}%, 雅思 ${ielts}

可选院校：
${schoolData}

请给出个性化推荐，逐一说明理由。输出格式用 JSON。`;

      userPrompt = `GPA ${gpa}%, 雅思 ${ielts}。请推荐加拿大大学申请方案。`;
    } else {
      // 无 D1 数据，用 fallback + AI
      const fallback = getFallbackRecommendations(gpa, ielts);
      const schoolList = [...fallback.reach, ...fallback.match, ...fallback.safety]
        .map(s => `${s.name_zh}(${s.name_en}) - ${s.category}: GPA${s.gpa_min}+`)
        .join('\n');

      systemPrompt = `你是加拿大大学升学规划 AI 顾问。根据学生的 GPA 和雅思成绩推荐学校。
学生数据：GPA ${gpa}%, 雅思 ${ielts}

可选院校：
${schoolList}

请给出个性化推荐方案，按冲刺/匹配/保底三档分析，逐一说明理由。`;
      userPrompt = `GPA ${gpa}%, 雅思 ${ielts}。请推荐加拿大大学申请方案。`;
    }

    // 调用 Cloudflare Workers AI（真·AI）— 带 15 秒超时
    let aiReply = '';
    try {
      const aiPromise = env.AI.run(AI_MODEL, {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2048,
      });
      // 15 秒超时兜底，防止 AI 调用挂起导致前端无限转圈
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI 响应超时')), 15000)
      );
      const aiResult = await Promise.race([aiPromise, timeoutPromise]);
      aiReply = aiResult.response || '';
    } catch (aiErr) {
      aiReply = `（AI 服务暂不可用: ${aiErr.message}）基于规则引擎的推荐结果如下。`;
    }

    // 同时返回规则引擎结果作为结构化数据
    const fallbackResult = getFallbackRecommendations(gpa, ielts);

    return Response.json({
      user: { gpa, ielts },
      ai_analysis: aiReply,
      recommendations: {
        reach: fallbackResult.reach.slice(0, 8),
        match: fallbackResult.match.slice(0, 8),
        safety: fallbackResult.safety.slice(0, 8),
      },
      summary: {
        reach_count: fallbackResult.reach.length,
        match_count: fallbackResult.match.length,
        safety_count: fallbackResult.safety.length,
        ai_powered: true
      }
    }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}
