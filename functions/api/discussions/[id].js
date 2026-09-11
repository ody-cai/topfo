// DELETE /api/discussions/[id] — 软删除讨论（仅作者可删）
// 删除后其他人不可见，但后端保留完整数据

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestDelete(context) {
  const { request, env, params } = context;

  if (!context.data.userId) {
    return Response.json({ error: '请先登录' }, { status: 401, headers: corsHeaders() });
  }

  const discussionId = params.id;
  if (!discussionId) {
    return Response.json({ error: '缺少讨论 ID' }, { status: 400, headers: corsHeaders() });
  }

  try {
    // 查帖子确认作者
    const discussion = await env.topfo_chat.prepare(
      `SELECT id, user_id, title, content FROM discussions WHERE id = ? AND (is_deleted IS NULL OR is_deleted = 0)`
    ).bind(parseInt(discussionId, 10)).first();

    if (!discussion) {
      return Response.json({ error: '讨论不存在或已被删除' }, { status: 404, headers: corsHeaders() });
    }

    // 仅作者可删
    if (discussion.user_id !== context.data.userId) {
      return Response.json({ error: '只能删除自己的讨论' }, { status: 403, headers: corsHeaders() });
    }

    // 软删除：标记 + 清空标题/内容但保留备份痕迹
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    await env.topfo_chat.prepare(
      `UPDATE discussions SET is_deleted = 1, updated_at = ? WHERE id = ?`
    ).bind(now, parseInt(discussionId, 10)).run();

    return Response.json({
      message: '讨论已删除（后端已备份）',
      id: parseInt(discussionId, 10)
    }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}
