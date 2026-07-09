// GET /api/schools — 从 D1 查询学校列表（含 programs）
// 支持 ?category=CS&province=ON&coop=true 过滤

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
    const province = url.searchParams.get('province');
    const coop = url.searchParams.get('coop');

    let whereClauses = [];
    let params = [];

    if (province) {
      whereClauses.push('s.province = ?');
      params.push(province.toUpperCase());
    }

    let joinClause = '';
    if (category || coop === 'true') {
      joinClause = 'JOIN programs p2 ON p2.school_id = s.id';
      if (category) {
        whereClauses.push('p2.category = ?');
        params.push(category.toLowerCase());
      }
      if (coop === 'true') {
        whereClauses.push('p2.has_coop = 1');
      }
    }

    const whereSQL = whereClauses.length > 0 ? 'AND ' + whereClauses.join(' AND ') : '';

    const query = `
      SELECT s.*,
        (SELECT json_group_array(json_object(
          'id', p.id, 'category', p.category, 'gpa_min', p.gpa_min,
          'label', p.label, 'ielts_min', p.ielts_min,
          'has_coop', p.has_coop, 'coop_note', p.coop_note,
          'dual_type', p.dual_type, 'dual_thr', p.dual_thr,
          'note', p.note, 'note_detail', p.note_detail
        )) FROM programs p WHERE p.school_id = s.id) as programs
      FROM schools s ${joinClause}
      WHERE 1=1 ${whereSQL}
      GROUP BY s.id
      ORDER BY
        CASE s.tier WHEN 't1' THEN 1 WHEN 't2' THEN 2 WHEN 't3' THEN 3 WHEN 'au' THEN 4 END,
        s.name
    `;

    let schools = [];
    try {
      const result = await env.topfo_chat.prepare(query).bind(...params).all();
      schools = (result.results || []).map(s => ({
        ...s,
        programs: s.programs ? JSON.parse(s.programs) : [],
        is_foundation: !!s.is_foundation
      }));
    } catch {
      // D1 不可用，返回空列表
      return Response.json({ schools: [] }, {
        headers: { ...corsHeaders(), 'Cache-Control': 'public, max-age=60' }
      });
    }

    return Response.json({ schools }, {
      headers: {
        ...corsHeaders(),
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (e) {
    return Response.json({ schools: [] }, { headers: corsHeaders() });
  }
}
