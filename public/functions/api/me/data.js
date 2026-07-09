// GET /api/me/data - JWT-protected personal data from D1 (with fallback)

// Fallback data for when D1 migration hasn't been run
const FALLBACK_DATA = {
  caiqijun: {
    gpa: 89.6,
    ielts: { overall: 5.0, listening: 4.5, reading: 4.5, writing: 5.5, speaking: 5.0 },
    target_majors: ["CS", "Science"],
    notes: "中加学籍，目标加拿大大学CS/理科综合"
  }
};

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

    // 1. Try D1 first
    try {
      // Get user id first
      const user = await env.topfo_chat.prepare(
        `SELECT id FROM users WHERE username = ?`
      ).bind(username).first();

      if (user) {
        // Get profile using user_id
        const profile = await env.topfo_chat.prepare(
          `SELECT gpa, ielts_overall, ielts_listening, ielts_reading, ielts_writing, ielts_speaking, target_majors, notes FROM student_profiles WHERE user_id = ?`
        ).bind(user.id).first();

        if (profile) {
          return Response.json({
            gpa: profile.gpa,
            ielts: {
              overall: profile.ielts_overall,
              listening: profile.ielts_listening,
              reading: profile.ielts_reading,
              writing: profile.ielts_writing,
              speaking: profile.ielts_speaking
            },
            target_majors: profile.target_majors ? JSON.parse(profile.target_majors) : null,
            notes: profile.notes
          }, { headers: corsHeaders() });
        }
      }
    } catch (d1Err) {
      // D1 not available - fall through to fallback
    }

    // 2. Fallback to hardcoded data
    const fallback = FALLBACK_DATA[username];
    if (fallback) {
      return Response.json(fallback, { headers: corsHeaders() });
    }

    return Response.json({
      gpa: null,
      ielts: null,
      target_majors: null,
      notes: null
    }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: "Failed to load profile: " + e.message }, { status: 500, headers: corsHeaders() });
  }
}
