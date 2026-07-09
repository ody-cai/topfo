// POST /api/reminders — 创建截止日期提醒
// GET /api/reminders — 获取当前用户的提醒列表

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

// 获取提醒列表
export async function onRequestGet(context) {
  const { request, env } = context;

  if (!context.data.userId) {
    return Response.json({ error: '请先登录' }, { status: 401, headers: corsHeaders() });
  }

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status'); // pending / done / all
    const upcoming = url.searchParams.get('upcoming') === 'true';

    let conditions = ['r.user_id = ?'];
    let params = [context.data.userId];

    if (status === 'done') {
      conditions.push('r.is_done = 1');
    } else if (status === 'pending' || upcoming) {
      conditions.push('r.is_done = 0');
    }

    const whereSQL = 'WHERE ' + conditions.join(' AND ');

    const result = await env.topfo_chat.prepare(
      `SELECT r.* FROM reminders r ${whereSQL} ORDER BY r.deadline ASC, r.created_at DESC`
    ).bind(...params).all();

    return Response.json({
      reminders: (result.results || []).map(r => ({ ...r, is_done: !!r.is_done }))
    }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}

// 创建提醒
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

    const { title, deadline, notes } = body;

    if (!title || !title.trim()) {
      return Response.json({ error: '标题不能为空' }, { status: 400, headers: corsHeaders() });
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const result = await env.topfo_chat.prepare(
      `INSERT INTO reminders (user_id, title, deadline, notes, is_done, created_at)
       VALUES (?, ?, ?, ?, 0, ?)`
    ).bind(context.data.userId, title.trim(), deadline || null, notes || null, now).run();

    return Response.json({
      id: result.meta.last_row_id,
      message: '提醒已创建'
    }, { status: 201, headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}
