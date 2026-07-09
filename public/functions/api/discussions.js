// GET/POST /api/discussions — 社区讨论 (no-cache v2)
// GET: 获取讨论列表，支持分页(limit/offset)、分类(category)筛选
// POST: 创建新讨论主题

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

// 获取讨论列表
export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 100);
    const offset = Math.max(parseInt(url.searchParams.get('offset') || '0', 10), 0);

    let conditions = [];
    let params = [];

    // 软删除过滤
    conditions.push("(d.is_deleted IS NULL OR d.is_deleted = 0)");

    if (category) {
      conditions.push('d.category = ?');
      params.push(category.toLowerCase());
    }

    const whereSQL = 'WHERE ' + conditions.join(' AND ');

    // 查总数
    let countResult = { total: 0 };
    try {
      countResult = await env.topfo_chat.prepare(
        `SELECT COUNT(*) as total FROM discussions d ${whereSQL}`
      ).bind(...params).first();
    } catch {
      // D1 不可用，返回空列表
      return Response.json({ discussions: [], total: 0, limit, offset }, { headers: corsHeaders() });
    }

    // 查列表（含评论数）
    const query = `
      SELECT d.*,
        (SELECT COUNT(*) FROM comments c WHERE c.discussion_id = d.id) as comment_count
      FROM discussions d
      ${whereSQL}
      ORDER BY d.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const result = await env.topfo_chat.prepare(query).bind(...params, limit, offset).all();

    return Response.json({
      discussions: result.results || [],
      total: countResult?.total || 0,
      limit,
      offset
    }, {
      headers: {
        ...corsHeaders(),
        'Cache-Control': 'no-cache, must-revalidate'
      }
    });
  } catch (e) {
    return Response.json({ discussions: [], total: 0, limit, offset }, { headers: corsHeaders() });
  }
}

// 创建新讨论
export async function onRequestPost(context) {
  const { request, env } = context;

  if (!context.data.userId) {
    return Response.json({ error: '请先登录' }, { status: 401, headers: corsHeaders() });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: corsHeaders() });
    }

    const { title, content, category } = body;

    if (!title || !title.trim()) {
      return Response.json({ error: '标题不能为空' }, { status: 400, headers: corsHeaders() });
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const result = await env.topfo_chat.prepare(
      `INSERT INTO discussions (user_id, title, content, category, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(context.data.userId, title.trim(), content || null, category || null, now, now).run();

    return Response.json({
      id: result.meta.last_row_id,
      message: '讨论已发布'
    }, { status: 201, headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}
