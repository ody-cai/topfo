// POST /api/auth/register - 用户注册
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

async function pbkdf2Hash(password, saltHex) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: hexToBytes(saltHex), iterations: 100000, hash: "SHA-256" },
    key, 256
  );
  return bytesToHex(new Uint8Array(derived));
}

function generateSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.text();
    let username, password, display_name, email;
    try {
      ({ username, password, display_name, email } = JSON.parse(body));
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400, headers: corsHeaders() });
    }

    if (!username || !password) {
      return Response.json({ error: "Missing required fields: username, password" }, { status: 400, headers: corsHeaders() });
    }
    if (username.length < 3 || username.length > 32) {
      return Response.json({ error: "Username must be 3-32 characters" }, { status: 400, headers: corsHeaders() });
    }
    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400, headers: corsHeaders() });
    }

    // 检查用户名是否已存在
    const existing = await env.topfo_chat.prepare(
      `SELECT username FROM users WHERE username = ?`
    ).bind(username).first();

    if (existing) {
      return Response.json({ error: "Username already exists" }, { status: 409, headers: corsHeaders() });
    }

    // 生成 salt 并计算密码 hash
    const salt = generateSalt();
    const passwordHash = await pbkdf2Hash(password, salt);
    const displayName = display_name || username;

    // 插入用户
    await env.topfo_chat.prepare(
      `INSERT INTO users (username, password_hash, salt, role, display_name, email) VALUES (?, ?, ?, 'student', ?, ?)`
    ).bind(username, passwordHash, salt, displayName, email || null).run();

    // 创建空的学生档案
    await env.topfo_chat.prepare(
      `INSERT INTO student_profiles (username, gpa, ielts, target_schools, counselor_notes) VALUES (?, NULL, NULL, NULL, NULL)`
    ).bind(username).run();

    return Response.json({ ok: true }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: "Internal error: " + e.message }, { status: 500, headers: corsHeaders() });
  }
}
