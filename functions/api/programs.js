// GET /api/programs — 查询所有专业方向，按类别和学校分组
// 支持 ?category=CS&school_id=1 过滤

const PROG_CATEGORIES = {
  cs:'计算机', eng:'工程', math:'数学', psych:'心理学',
  biz:'商科', health:'健康科学', sci:'理科综合', social:'社会科学'
};

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

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const schoolId = url.searchParams.get('school_id');

    let conditions = [];
    let params = [];

    if (category) {
      conditions.push('p.category = ?');
      params.push(category.toLowerCase());
    }
    if (schoolId) {
      conditions.push('p.school_id = ?');
      params.push(parseInt(schoolId, 10));
    }

    const whereSQL = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const query = `
      SELECT p.*, s.name as school_name, s.tier as school_tier, s.province
      FROM programs p
      JOIN schools s ON s.id = p.school_id
      ${whereSQL}
      ORDER BY
        CASE s.tier WHEN 't1' THEN 1 WHEN 't2' THEN 2 WHEN 't3' THEN 3 WHEN 'au' THEN 4 END,
        s.name, p.category
    `;

    const result = await env.topfo_chat.prepare(query).bind(...params).all();

    const programs = (result.results || []).map(p => ({
      ...p,
      has_coop: !!p.has_coop,
      category_name: PROG_CATEGORIES[p.category] || p.category
    }));

    return Response.json({ programs }, {
      headers: {
        ...corsHeaders(),
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}
