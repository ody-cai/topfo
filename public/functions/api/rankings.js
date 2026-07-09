// GET /api/rankings — 返回排名数据，与网站 rankings.js 完全同步
// 通过正则从 rankings.js 提取 RANK_DATA 和 RANK_PROGS 对象

export async function onRequest(context) {
  try {
    const url = new URL('/js/rankings.js', context.request.url);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`rankings.js not found: ${response.status}`);
    
    const jsContent = await response.text();
    
    // 提取 RANK_DATA = {...};
    const rankDataMatch = jsContent.match(/const\s+RANK_DATA\s*=\s*({[\s\S]*?});\s*const\s+RANK_PROGS/);
    if (!rankDataMatch) throw new Error('RANK_DATA not found in rankings.js');
    
    // 提取 RANK_PROGS = [...];
    const rankProgsMatch = jsContent.match(/const\s+RANK_PROGS\s*=\s*(\[[\s\S]*?\]);/);
    if (!rankProgsMatch) throw new Error('RANK_PROGS not found in rankings.js');
    
    // 将 JS 对象字面量转为 JSON
    const dataJson = jsToJson(rankDataMatch[1]);
    const progsJson = jsToJson(rankProgsMatch[1]);
    
    return new Response(JSON.stringify({
      programs: JSON.parse(progsJson),
      data: JSON.parse(dataJson),
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
 * 处理：单引号→双引号、无引号 key→双引号 key、尾逗号移除、'—'→"—"
 */
function jsToJson(jsLiteral) {
  let s = jsLiteral.trim();
  
  // 1. 处理字符串：将单引号字符串转为双引号
  // 先保护已存在的双引号字符串，再将单引号字符串转双引号
  s = s.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, (_, inner) => {
    return '"' + inner.replace(/"/g, '\\"') + '"';
  });
  
  // 2. 给无引号的 key 加双引号: key: → "key":
  s = s.replace(/([{,]\s*)([a-zA-Z_]\w*)\s*:/g, '$1"$2":');
  
  // 3. 移除尾逗号（JSON 不允许）
  s = s.replace(/,(\s*[}\]])/g, '$1');
  
  return s;
}
