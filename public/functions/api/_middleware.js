// JWT 验证中间件 - 保护 /api/ 路由
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  return bytes;
}

async function verifyJWT(token, secretHex) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payloadB64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(payloadB64));
    if (claims.exp < Math.floor(Date.now() / 1000)) return null;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", hexToBytes(secretHex), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sigB64 = parts[2].replace(/-/g, "+").replace(/_/g, "/");
    const sig = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0));
    const ok = await crypto.subtle.verify("HMAC", key, sig, encoder.encode(`${parts[0]}.${parts[1]}`));
    return ok ? claims : null;
  } catch { return null; }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // 只处理 /api/ 路径
  if (!url.pathname.startsWith("/api/")) {
    return next();
  }

  // 公开 API 端点不检查 JWT
  const publicPaths = ["/api/login", "/api/auth/register", "/api/schools", "/api/rankings"];
  if (publicPaths.some(p => url.pathname.startsWith(p))) {
    return next();
  }

  // OPTIONS 预检请求不检查
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  // 检查 Authorization header
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders() });
  }

  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret) {
    return Response.json({ error: "Server configuration error" }, { status: 500, headers: corsHeaders() });
  }

  const claims = await verifyJWT(auth.slice(7), jwtSecret);
  if (!claims) {
    return Response.json({ error: "Invalid or expired token" }, { status: 401, headers: corsHeaders() });
  }

  // 把 claims 传递给下游 handler
  context.data = { claims };
  return next();
}
