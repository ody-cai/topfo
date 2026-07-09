// GET /api/notifications — 获取当前用户通知
// 支持 ?mark_read=true 标记全部已读

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

// 获取通知
export async function onRequestGet(context) {
  const { request, env } = context;

  if (!context.data.userId) {
    return Response.json({ error: '请先登录' }, { status: 401, headers: corsHeaders() });
  }

  try {
    const url = new URL(request.url);
    const markRead = url.searchParams.get('mark_read') === 'true';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 200);
    const unreadOnly = url.searchParams.get('unread') === 'true';

    if (markRead) {
      await env.topfo_chat.prepare(
        'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0'
      ).bind(context.data.userId).run();
    }

    let conditions = ['n.user_id = ?'];
    let params = [context.data.userId];

    if (unreadOnly) {
      conditions.push('n.is_read = 0');
    }

    const whereSQL = 'WHERE ' + conditions.join(' AND ');

    const query = `
      SELECT n.* FROM notifications n
      ${whereSQL}
      ORDER BY n.created_at DESC
      LIMIT ?
    `;

    const result = await env.topfo_chat.prepare(query).bind(...params, limit).all();

    // 查未读数
    const unreadResult = await env.topfo_chat.prepare(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0'
    ).bind(context.data.userId).first();

    return Response.json({
      notifications: (result.results || []).map(n => ({ ...n, is_read: !!n.is_read })),
      unread_count: unreadResult?.count || 0
    }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}

// 创建通知（系统内部或管理员调用）
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

    const { target_user_id, title, content } = body;

    if (!title || !target_user_id) {
      return Response.json({ error: 'target_user_id and title required' }, { status: 400, headers: corsHeaders() });
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const result = await env.topfo_chat.prepare(
      `INSERT INTO notifications (user_id, title, content, is_read, created_at)
       VALUES (?, ?, ?, 0, ?)`
    ).bind(target_user_id, title, content || null, now).run();

    return Response.json({
      id: result.meta.last_row_id,
      message: '通知已发送'
    }, { status: 201, headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}
