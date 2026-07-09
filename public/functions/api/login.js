// POST /api/login - PBKDF2-SHA256 password verification + JWT issue
const PW_SALT = "6537689ccc9064f9b12b5379837eacf2";
const PW_HASH = "3a2461f7988fbce6135ec558a301fb53dd2c80bb0350c485a385fe19f74d3344";
const JWT_SECRET = "2baea092dd1542e27bdbbde82a3491cb5e3e30cfcd1fba8f4c5e5731b22859a0";

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

function b64url(buf) {
  return btoa(String.fromCharCode(...buf)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmacSign(data, keyHex) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", hexToBytes(keyHex), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return new Uint8Array(sig);
}

async function pbkdf2Verify(password, saltHex, hashHex) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: hexToBytes(saltHex), iterations: 100000, hash: "SHA-256" },
    key, 256
  );
  return bytesToHex(new Uint8Array(derived)) === hashHex;
}

async function issueJWT(username) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { sub: username, role: "user", iat: now, exp: now + 86400 };
  const headerB64 = b64url(new TextEncoder().encode(JSON.stringify(header)));
  const payloadB64 = b64url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmacSign(`${headerB64}.${payloadB64}`, JWT_SECRET);
  return `${headerB64}.${payloadB64}.${b64url(sig)}`;
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
    const { request } = context;
    const body = await request.text();
    let username, password;
    try { ({ username, password } = JSON.parse(body)); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400, headers: corsHeaders() }); }

    if (!username || !password) return Response.json({ error: "Missing username or password" }, { status: 400, headers: corsHeaders() });
    if (username !== "caiqijun") return Response.json({ error: "Invalid credentials" }, { status: 401, headers: corsHeaders() });

    const ok = await pbkdf2Verify(password, PW_SALT, PW_HASH);
    if (!ok) return Response.json({ error: "Invalid credentials" }, { status: 401, headers: corsHeaders() });

    const token = await issueJWT(username);
    return Response.json({ token, user: { name: "奇均", display: "奇均" } }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: "Internal error: " + e.message }, { status: 500, headers: corsHeaders() });
  }
}
