// GET /api/rankings — 从 D1 rankings 表查询排名数据
// 支持 ?source=QS&year=2027&type=overall 过滤

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
    const source = url.searchParams.get('source');
    const year = url.searchParams.get('year');
    const type = url.searchParams.get('type');

    let conditions = [];
    let params = [];

    if (source) {
      conditions.push('r.source = ?');
      params.push(source.toLowerCase());
    }
    if (year) {
      conditions.push('r.year = ?');
      params.push(parseInt(year, 10));
    }
    if (type) {
      conditions.push('r.category = ?');
      params.push(type.toLowerCase());
    }

    const whereSQL = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    // 获取排名数据
    const query = `
      SELECT r.*
      FROM rankings r
      ${whereSQL}
      ORDER BY
        CASE r.category
          WHEN 'overall' THEN 0 WHEN 'cs' THEN 1 WHEN 'eng' THEN 2
          WHEN 'math' THEN 3 WHEN 'psych' THEN 4 WHEN 'biz' THEN 5
          WHEN 'health' THEN 6 WHEN 'sci' THEN 7 WHEN 'social' THEN 8
          ELSE 9
        END,
        CASE WHEN CAST(r.rank AS INTEGER) > 0 THEN CAST(r.rank AS INTEGER) ELSE 9999 END
    `;

    const result = await env.topfo_chat.prepare(query).bind(...params).all();

    // 按 category 分组
    const grouped = {};
    for (const row of (result.results || [])) {
      const cat = row.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({
        id: row.id,
        school: row.school,
        city: row.city,
        source: row.source,
        rank: row.rank,
        year: row.year
      });
    }

    return Response.json({ data: grouped, programs: Object.keys(grouped) }, {
      headers: {
        ...corsHeaders(),
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}
