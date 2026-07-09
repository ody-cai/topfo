// GET /api/schools — 返回学校/专业/梯队数据，与网站 data.js 完全同步
// 通过正则从 data.js 提取 SCHOOLS / TIERS / PROGRAMS 对象

export async function onRequest(context) {
  try {
    const url = new URL('/js/data.js', context.request.url);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`data.js not found: ${response.status}`);
    
    const jsContent = await response.text();
    
    // 提取 PROGRAMS = {...};
    const progsMatch = jsContent.match(/const\s+PROGRAMS\s*=\s*({[\s\S]*?});/);
    if (!progsMatch) throw new Error('PROGRAMS not found');
    
    // 提取 TIERS = [...];
    const tiersMatch = jsContent.match(/const\s+TIERS\s*=\s*(\[[\s\S]*?\]);/);
    if (!tiersMatch) throw new Error('TIERS not found');
    
    // 提取 SCHOOLS = {...};
    const schoolsMatch = jsContent.match(/const\s+SCHOOLS\s*=\s*({[\s\S]*?});/);
    if (!schoolsMatch) throw new Error('SCHOOLS not found');
    
    const progsJson = jsToJson(progsMatch[1]);
    const tiersJson = jsToJson(tiersMatch[1]);
    const schoolsJson = jsToJson(schoolsMatch[1]);
    
    return new Response(JSON.stringify({
      tiers: JSON.parse(tiersJson),
      programs: JSON.parse(progsJson),
      schools: JSON.parse(schoolsJson),
      updated: new Date().toISOString().split('T')[0]
    }), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

/**
 * 将 JS 对象/数组字面量转为 JSON 字符串
 */
function jsToJson(jsLiteral) {
  let s = jsLiteral.trim();
  
  // 单引号字符串 → 双引号
  s = s.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, (_, inner) => {
    return '"' + inner.replace(/"/g, '\\"') + '"';
  });
  
  // 无引号 key → "key"
  s = s.replace(/([{,]\s*)([a-zA-Z_]\w*)\s*:/g, '$1"$2":');
  
  // 移除尾逗号
  s = s.replace(/,(\s*[}\]])/g, '$1');
  
  return s;
}
