// POST /api/discussions/:id/comments — 添加讨论回复

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

// 获取评论列表
export async function onRequestGet(context) {
  const { env, params } = context;
  try {
    const discussionId = parseInt(params.id, 10);
    if (isNaN(discussionId)) {
      return Response.json({ error: 'Invalid discussion ID' }, { status: 400, headers: corsHeaders() });
    }

    const result = await env.topfo_chat.prepare(
      `SELECT c.* FROM comments c
       WHERE c.discussion_id = ? AND (c.is_deleted IS NULL OR c.is_deleted = 0)
       ORDER BY c.created_at ASC`
    ).bind(discussionId).all();

    return Response.json({ comments: result.results || [] }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}

// 添加回复
export async function onRequestPost(context) {
  const { request, env, params } = context;

  if (!context.data.userId) {
    return Response.json({ error: '请先登录' }, { status: 401, headers: corsHeaders() });
  }

  try {
    const discussionId = parseInt(params.id, 10);
    if (isNaN(discussionId)) {
      return Response.json({ error: 'Invalid discussion ID' }, { status: 400, headers: corsHeaders() });
    }

    // 验证讨论存在且未删除
    const discussion = await env.topfo_chat.prepare(
      'SELECT id FROM discussions WHERE id = ? AND (is_deleted IS NULL OR is_deleted = 0)'
    ).bind(discussionId).first();

    if (!discussion) {
      return Response.json({ error: '讨论不存在或已被删除' }, { status: 404, headers: corsHeaders() });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: corsHeaders() });
    }

    const content = (body.content || '').trim();
    if (!content) {
      return Response.json({ error: '回复内容不能为空' }, { status: 400, headers: corsHeaders() });
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const result = await env.topfo_chat.prepare(
      `INSERT INTO comments (discussion_id, user_id, content, created_at)
       VALUES (?, ?, ?, ?)`
    ).bind(discussionId, context.data.userId, content, now).run();

    // 更新讨论的 updated_at
    await env.topfo_chat.prepare(
      'UPDATE discussions SET updated_at = ? WHERE id = ?'
    ).bind(now, discussionId).run();

    return Response.json({
      id: result.meta.last_row_id,
      message: '回复已添加'
    }, { status: 201, headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}
