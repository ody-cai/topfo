// GET/POST /api/applications — 申请记录管理
// GET: 获取当前用户的申请列表，支持 ?status=planning 过滤
// POST: 创建新的申请记录

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

// 获取申请列表
export async function onRequestGet(context) {
  const { request, env } = context;

  if (!context.userId) {
    return Response.json({ error: '请先登录' }, { status: 401, headers: corsHeaders() });
  }

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    let conditions = ['a.user_id = ?'];
    let params = [context.userId];

    if (status) {
      conditions.push('a.status = ?');
      params.push(status.toLowerCase());
    }

    const whereSQL = 'WHERE ' + conditions.join(' AND ');

    const query = `
      SELECT a.*,
        s.name as school_name, s.city, s.province, s.tier,
        p.category as program_category, p.gpa_min, p.ielts_min, p.has_coop
      FROM applications a
      LEFT JOIN schools s ON s.id = a.school_id
      LEFT JOIN programs p ON p.id = a.program_id
      ${whereSQL}
      ORDER BY a.updated_at DESC
    `;

    const result = await env.topfo_chat.prepare(query).bind(...params).all();

    const applications = (result.results || []).map(a => ({
      ...a,
      has_coop: !!a.has_coop
    }));

    return Response.json({ applications }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}

// 创建新申请
export async function onRequestPost(context) {
  const { request, env } = context;

  if (!context.userId) {
    return Response.json({ error: '请先登录' }, { status: 401, headers: corsHeaders() });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: corsHeaders() });
    }

    const { school_id, program_id, deadline, priority, notes } = body;

    if (!school_id) {
      return Response.json({ error: 'school_id is required' }, { status: 400, headers: corsHeaders() });
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const insertResult = await env.topfo_chat.prepare(
      `INSERT INTO applications (user_id, school_id, program_id, deadline, priority, notes, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'planning', ?, ?)`
    ).bind(
      context.userId,
      parseInt(school_id, 10),
      program_id ? parseInt(program_id, 10) : null,
      deadline || null,
      priority || 'medium',
      notes || null,
      now, now
    ).run();

    return Response.json({
      id: insertResult.meta.last_row_id,
      message: '申请已创建'
    }, { status: 201, headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}
