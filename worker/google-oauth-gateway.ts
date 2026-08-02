const CALLBACK_PATH = "/oauth/google/integration/callback";
const ALLOWED_PARAMETERS = new Set([
  "state",
  "code",
  "error",
  "error_description",
  "scope",
  "authuser",
  "prompt",
  "iss",
]);
const MAX_QUERY_PARAMETERS = 8;
const MAX_VALUE_LENGTH = 4096;
const MAX_PAYLOAD_BYTES = 8192;

export interface GoogleOAuthGatewayEnv {
  GOOGLE_INTEGRATION_CALLBACK_UPSTREAM_URL?: string;
  GOOGLE_INTEGRATION_CALLBACK_PROXY_SECRET?: string;
}

export interface GoogleOAuthGatewayDeps {
  now: () => number;
  sign: (secret: string, payload: string) => Promise<string>;
}
type CallbackPayload = {
  state: string;
  code?: string;
  error?: string;
};

export async function handleGoogleOAuthGateway(
  request: Request,
  env: GoogleOAuthGatewayEnv,
  deps: GoogleOAuthGatewayDeps = {
    now: Date.now,
    sign: hmacSha256,
  },
): Promise<Response> {
  if (request.method !== "GET") {
    return html(false, 405, { Allow: "GET" });
  }
  const upstream = normalize(env.GOOGLE_INTEGRATION_CALLBACK_UPSTREAM_URL);
  const secret = normalize(env.GOOGLE_INTEGRATION_CALLBACK_PROXY_SECRET);
  if (!isHttps(upstream) || secret.length < 32) {
    return html(false, 503);
  }
  const parsed = boundedPayload(new URL(request.url));
  if (!parsed) {
    return html(false, 400);
  }
  const relay = {
    ...parsed,
    issued_at: Math.floor(deps.now() / 1000),
  };
  const encoded = base64UrlEncode(JSON.stringify(relay));
  let signature: string;
  try {
    signature = await deps.sign(secret, encoded);
  } catch (error) {
    console.error("google_oauth_gateway_relay_sign_failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return html(false, 502);
  }
  const target = new URL(upstream);
  target.search = new URLSearchParams({
    payload: encoded,
    signature,
  }).toString();
  return new Response(null, {
    status: 302,
    headers: {
      location: target.href,
      "cache-control": "no-store",
      "content-security-policy": "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      "referrer-policy": "no-referrer",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
    },
  });
}
function boundedPayload(url: URL): CallbackPayload | null {
  const entries = [...url.searchParams.entries()];
  if (entries.length === 0 || entries.length > MAX_QUERY_PARAMETERS) {
    return null;
  }
  const counts = new Map<string, number>();
  for (const [name, value] of entries) {
    if (!ALLOWED_PARAMETERS.has(name) || value.length > MAX_VALUE_LENGTH) {
      return null;
    }
    counts.set(name, (counts.get(name) ?? 0) + 1);
    if (counts.get(name)! > 1) {
      return null;
    }
  }
  const state = normalize(url.searchParams.get("state"));
  const code = normalize(url.searchParams.get("code"));
  const error = normalize(url.searchParams.get("error"));
  const issuer = normalize(url.searchParams.get("iss"));
  if (issuer && issuer !== "https://accounts.google.com") {
    return null;
  }
  if (!state || (!code && !error) || (code && error)) {
    return null;
  }
  const payload: CallbackPayload = { state };
  if (code) payload.code = code;
  if (error) payload.error = error;
  if (new TextEncoder().encode(JSON.stringify(payload)).byteLength > MAX_PAYLOAD_BYTES) {
    return null;
  }
  return payload;
}

function base64UrlEncode(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

async function hmacSha256(secret: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
function html(success: boolean, status: number, extraHeaders: HeadersInit = {}): Response {
  const title = success ? "Pripojenie bolo dokončené" : "Pripojenie sa nepodarilo";
  const message = success
    ? "Google účet bol bezpečne spracovaný. Môžete sa vrátiť do Telegramu."
    : "Požiadavku nebolo možné dokončiť. Vráťte sa do Telegramu a skúste pripojenie znova.";
  const body = `<!doctype html><html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title} | ZevsFlow</title></head><body><main><h1>${title}</h1><p>${message}</p></main></body></html>`;
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      "referrer-policy": "no-referrer",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      ...extraHeaders,
    },
  });
}

function normalize(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isHttps(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export { CALLBACK_PATH };
