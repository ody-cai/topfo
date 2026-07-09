// GET /api/me/data - JWT-protected personal data
const JWT_SECRET = "2baea092dd1542e27bdbbde82a3491cb5e3e30cfcd1fba8f4c5e5731b22859a0";
const ENC_SALT = "256c9f62e326df395ec4d34de82146a3";
const ENC_IV = "664024bd3c0c7b6e01c02fd3";
const ENC_TAG = "e8f4950c1aa5a307471f506a9faa11d2";
const ENC_DATA = "ea02761e53d7b63eb35e1c4fa1c40ba2b99b85508c266994a8bb5dfe91198c6aead394e6c671c10eaa85fb55a4d039b2b557a83f8be95746645791f86764f10ce35dcd0b55eabf435e2a95bace5f93eff008acb3e69e6f39b4a29b";
const PASSWORD = "20262026";

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  return bytes;
}

async function verifyJWT(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payloadB64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(payloadB64));
    if (claims.exp < Math.floor(Date.now() / 1000)) return null;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", hexToBytes(JWT_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sigB64 = parts[2].replace(/-/g, "+").replace(/_/g, "/");
    const sig = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0));
    const ok = await crypto.subtle.verify("HMAC", key, sig, encoder.encode(`${parts[0]}.${parts[1]}`));
    return ok ? claims : null;
  } catch { return null; }
}

async function decryptPersonalData() {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(PASSWORD), "PBKDF2", false, ["deriveBits"]);
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: hexToBytes(ENC_SALT), iterations: 100000, hash: "SHA-256" },
    keyMaterial, 256
  );
  const aesKey = await crypto.subtle.importKey("raw", derived, "AES-GCM", false, ["decrypt"]);
  const ciphertext = new Uint8Array([...hexToBytes(ENC_DATA), ...hexToBytes(ENC_TAG)]);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: hexToBytes(ENC_IV) }, aesKey, ciphertext);
  return JSON.parse(new TextDecoder().decode(plaintext));
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
  const { request } = context;
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders() });
  }

  const claims = await verifyJWT(auth.slice(7));
  if (!claims) {
    return Response.json({ error: "Invalid or expired token" }, { status: 401, headers: corsHeaders() });
  }

  try {
    const data = await decryptPersonalData();
    return Response.json(data, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ error: "Decryption failed" }, { status: 500, headers: corsHeaders() });
  }
}
