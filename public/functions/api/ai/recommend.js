// GET /api/ai/recommend — AI 智能选校推荐
// 基于用户 GPA 和雅思成绩，匹配 programs 并分为 reach / match / safety 三档
// 需要 JWT 认证（user_id 从中间件获取）

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

// 将 GPA 字符串（如 "85-90%"、"Low 80s"）转为数值下限
function parseGpaMin(gpaStr) {
  if (!gpaStr || gpaStr === '—' || gpaStr.startsWith('预科')) return null;
  // "85-90%" -> 85
  const rangeMatch = gpaStr.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (rangeMatch) return parseInt(rangeMatch[1], 10);
  // "Low 80s" -> 80, "Mid-high 80s" -> 85, "High 90s" -> 90
  const lowMatch = gpaStr.match(/low\s*(\d+)/i);
  if (lowMatch) return parseInt(lowMatch[1], 10);
  const midMatch = gpaStr.match(/mid.*?(\d+)/i);
  if (midMatch) return parseInt(midMatch[1], 10) - 5;
  const highMatch = gpaStr.match(/high\s*(\d+)/i);
  if (highMatch) return parseInt(highMatch[1], 10);
  // 单个数字 "85"
  const singleMatch = gpaStr.match(/^(\d+)/);
  if (singleMatch) return parseInt(singleMatch[1], 10);
  return null;
}

// 解析雅思字符串，返回最低总分
function parseIeltsMin(ieltsStr) {
  if (!ieltsStr || ieltsStr === '—' || ieltsStr.startsWith('预科')) return null;
  const match = ieltsStr.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : null;
}

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!context.userId) {
    return Response.json({ error: '请先登录' }, { status: 401, headers: corsHeaders() });
  }

  try {
    const url = new URL(request.url);
    const userGpa = url.searchParams.get('gpa');
    const userIelts = url.searchParams.get('ielts');

    const gpa = userGpa ? parseFloat(userGpa) : 89.6;   // 默认蔡奇均的 GPA
    const ielts = userIelts ? parseFloat(userIelts) : 5.0; // 默认雅思

    // 查询所有有 GPA 数据的 programs（排除澳洲预科）
    const query = `
      SELECT p.*, s.name as school_name, s.tier, s.province, s.city,
             s.tuition, s.tuition_rmb
      FROM programs p
      JOIN schools s ON s.id = p.school_id
      WHERE p.gpa_min IS NOT NULL AND p.gpa_min != '—' AND p.label != 'na'
        AND s.tier != 'au'
      ORDER BY s.tier, s.name, p.category
    `;

    const result = await env.topfo_chat.prepare(query).all();

    const reach = [];
    const match = [];
    const safety = [];

    for (const prog of (result.results || [])) {
      const gpaRequired = parseGpaMin(prog.gpa_min);
      if (gpaRequired === null) continue;

      const ieltsRequired = parseIeltsMin(prog.ielts_min);
      const label = prog.label;

      const hasDual = prog.dual_type && prog.dual_type !== '—' && prog.dual_type !== 'no';

      // 根据 label 分类
      if (label === 'hard') {
        reach.push(prog);
      } else if (label === 'close') {
        // 如果 GAP 在 5 分以内算 match，否则 reach
        if (gpaRequired - gpa <= 5 && gpaRequired - gpa >= 0) {
          match.push(prog);
        } else if (gpa >= gpaRequired) {
          match.push(prog);
        } else {
          reach.push(prog);
        }
      } else if (label === 'ok') {
        if (hasDual && ielts < (ieltsRequired || 6.5)) {
          // 有双录且雅思不够直录，仍算 safety
          safety.push(prog);
        } else if (gpa >= gpaRequired) {
          safety.push(prog);
        } else {
          match.push(prog);
        }
      }
    }

    // 澳洲保底
    const auQuery = `
      SELECT p.*, s.name as school_name, s.tier, s.province, s.city,
             s.tuition, s.tuition_rmb
      FROM programs p
      JOIN schools s ON s.id = p.school_id
      WHERE s.tier = 'au' AND p.label != 'na'
    `;
    const auResult = await env.topfo_chat.prepare(auQuery).all();
    const australia = (auResult.results || []).map(p => ({
      ...p,
      has_coop: !!p.has_coop
    }));

    // 添加 has_coop 布尔转换
    const mapProg = p => ({ ...p, has_coop: !!p.has_coop });

    return Response.json({
      user: { gpa, ielts },
      recommendations: {
        reach: reach.map(mapProg),
        match: match.map(mapProg),
        safety: safety.map(mapProg),
        australia: australia.map(mapProg)
      },
      summary: {
        reach_count: reach.length,
        match_count: match.length,
        safety_count: safety.length,
        australia_count: australia.length
      }
    }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}
