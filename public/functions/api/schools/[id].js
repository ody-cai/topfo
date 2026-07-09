// GET /api/schools/:id — 单个学校详情（含 programs + 可选 rankings）

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
  const { env, params } = context;
  try {
    const schoolId = parseInt(params.id, 10);
    if (isNaN(schoolId)) {
      return Response.json({ error: 'Invalid school ID' }, { status: 400, headers: corsHeaders() });
    }

    const url = new URL(context.request.url);
    const includeRankings = url.searchParams.get('include_rankings') === 'true';

    // 1. 查学校
    const schoolResult = await env.topfo_chat.prepare(
      'SELECT * FROM schools WHERE id = ?'
    ).bind(schoolId).first();

    if (!schoolResult) {
      return Response.json({ error: 'School not found' }, { status: 404, headers: corsHeaders() });
    }

    // 2. 查 programs
    const programsResult = await env.topfo_chat.prepare(
      `SELECT id, category, gpa_min, label, ielts_min, has_coop, coop_note,
              dual_type, dual_thr, note, note_detail
       FROM programs WHERE school_id = ? ORDER BY category`
    ).bind(schoolId).all();

    const school = {
      ...schoolResult,
      programs: programsResult.results || [],
      is_foundation: !!schoolResult.is_foundation
    };

    // 3. 可选：查 rankings
    if (includeRankings) {
      const rankingsResult = await env.topfo_chat.prepare(
        `SELECT * FROM rankings WHERE school = ? ORDER BY category, source`
      ).bind(schoolResult.name).all();
      school.rankings = rankingsResult.results || [];
    }

    return Response.json({ school }, {
      headers: {
        ...corsHeaders(),
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}
