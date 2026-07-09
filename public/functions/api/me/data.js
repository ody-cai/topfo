// GET /api/me/data - JWT-protected personal data from D1
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  return bytes;
}

async function verifyJWT(token, jwtSecret) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payloadB64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(payloadB64));
    if (claims.exp < Math.floor(Date.now() / 1000)) return null;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", hexToBytes(jwtSecret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sigB64 = parts[2].replace(/-/g, "+").replace(/_/g, "/");
    const sig = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0));
    const ok = await crypto.subtle.verify("HMAC", key, sig, encoder.encode(`${parts[0]}.${parts[1]}`));
    return ok ? claims : null;
  } catch { return null; }
}

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
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders() });
  }

  const claims = await verifyJWT(auth.slice(7), env.JWT_SECRET);
  if (!claims) {
    return Response.json({ error: "Invalid or expired token" }, { status: 401, headers: corsHeaders() });
  }

  try {
    const { sub: username, role } = claims;

    // demo 用户不返回个人数据
    if (role === "demo") {
      return Response.json({ gpa: null, ielts: null }, { headers: corsHeaders() });
    }

    // 从 D1 查询学生档案
    const profile = await env.topfo_chat.prepare(
      `SELECT gpa, ielts, target_schools, counselor_notes FROM student_profiles WHERE username = ?`
    ).bind(username).first();

    if (!profile) {
      return Response.json({
        gpa: null,
        ielts: null,
        target_schools: null,
        counselor_notes: null
      }, { headers: corsHeaders() });
    }

    return Response.json({
      gpa: profile.gpa,
      ielts: profile.ielts,
      target_schools: profile.target_schools,
      counselor_notes: profile.counselor_notes
    }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: "Failed to load profile: " + e.message }, { status: 500, headers: corsHeaders() });
  }
}
