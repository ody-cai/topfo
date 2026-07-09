// PUT /api/applications/:id — 更新申请状态/内容

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPut(context) {
  const { request, env, params } = context;

  if (!context.userId) {
    return Response.json({ error: '请先登录' }, { status: 401, headers: corsHeaders() });
  }

  try {
    const appId = parseInt(params.id, 10);
    if (isNaN(appId)) {
      return Response.json({ error: 'Invalid application ID' }, { status: 400, headers: corsHeaders() });
    }

    // 验证所有权
    const existing = await env.topfo_chat.prepare(
      'SELECT id FROM applications WHERE id = ? AND user_id = ?'
    ).bind(appId, context.userId).first();

    if (!existing) {
      return Response.json({ error: '申请不存在或无权操作' }, { status: 404, headers: corsHeaders() });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: corsHeaders() });
    }

    const { status, priority, deadline, notes } = body;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // 构建动态更新，只更新提供的字段
    const allowedFields = { status, priority, deadline, notes };
    const setClauses = [];
    const params_list = [];

    for (const [key, value] of Object.entries(allowedFields)) {
      if (value !== undefined) {
        setClauses.push(`${key} = ?`);
        params_list.push(value);
      }
    }

    if (setClauses.length === 0) {
      return Response.json({ error: '没有要更新的字段' }, { status: 400, headers: corsHeaders() });
    }

    setClauses.push('updated_at = ?');
    params_list.push(now);
    params_list.push(appId); // for WHERE
    params_list.push(context.userId);

    await env.topfo_chat.prepare(
      `UPDATE applications SET ${setClauses.join(', ')} WHERE id = ? AND user_id = ?`
    ).bind(...params_list).run();

    return Response.json({ message: '已更新', id: appId }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}
