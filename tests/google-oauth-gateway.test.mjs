import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";

import { handleGoogleOAuthGateway } from "../worker/google-oauth-gateway.ts";


const env = {
  GOOGLE_INTEGRATION_CALLBACK_UPSTREAM_URL:
    "https://backend.example.test/internal/oauth/google/integration/callback",
  GOOGLE_INTEGRATION_CALLBACK_PROXY_SECRET: "s".repeat(32),
};

const fixedNow = 1_785_682_800_000;

function relayDeps(record = {}) {
  return {
    now: () => fixedNow,
    sign: async (secret, payload) => {
      record.secret = secret;
      record.payload = payload;
      return createHmac("sha256", secret).update(payload).digest("hex");
    },
  };
}

function decodedRelay(response) {
  const location = new URL(response.headers.get("location"));
  const encoded = location.searchParams.get("payload");
  return {
    location,
    encoded,
    body: JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")),
    signature: location.searchParams.get("signature"),
  };
}


test("relays only bounded callback fields with a signed short-lived payload", async () => {
  const signed = {};
  const response = await handleGoogleOAuthGateway(
    new Request(
      "https://zevsflow.sk/oauth/google/integration/callback?state=state-token&code=code-token&scope=openid",
    ),
    env,
    relayDeps(signed),
  );

  assert.equal(response.status, 302);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  const relay = decodedRelay(response);
  assert.equal(
    relay.location.origin + relay.location.pathname,
    env.GOOGLE_INTEGRATION_CALLBACK_UPSTREAM_URL,
  );
  assert.deepEqual(relay.body, {
    state: "state-token",
    code: "code-token",
    issued_at: Math.floor(fixedNow / 1000),
  });
  assert.equal(relay.encoded, signed.payload);
  assert.equal(signed.secret, env.GOOGLE_INTEGRATION_CALLBACK_PROXY_SECRET);
  assert.equal(
    relay.signature,
    createHmac("sha256", env.GOOGLE_INTEGRATION_CALLBACK_PROXY_SECRET)
      .update(relay.encoded)
      .digest("hex"),
  );
  assert.doesNotMatch(response.headers.get("location"), /openid|ssss/);
  assert.equal(await response.text(), "");
});


test("relays a bounded Google rejection without provider description", async () => {
  const response = await handleGoogleOAuthGateway(
    new Request(
      "https://zevsflow.sk/oauth/google/integration/callback?state=state-token&error=access_denied&error_description=private",
    ),
    env,
    relayDeps(),
  );

  assert.equal(response.status, 302);
  const relay = decodedRelay(response);
  assert.deepEqual(relay.body, {
    state: "state-token",
    error: "access_denied",
    issued_at: Math.floor(fixedNow / 1000),
  });
  assert.doesNotMatch(response.headers.get("location"), /private/);
});


test("rejects missing state, duplicate, unknown, and oversized parameters", async () => {
  let calls = 0;
  const deps = {
    now: () => fixedNow,
    sign: async () => {
      calls += 1;
      return "a".repeat(64);
    },
  };
  const urls = [
    "https://zevsflow.sk/oauth/google/integration/callback?code=x",
    "https://zevsflow.sk/oauth/google/integration/callback?state=a&state=b&code=x",
    "https://zevsflow.sk/oauth/google/integration/callback?state=a&code=x&unknown=y",
    "https://zevsflow.sk/oauth/google/integration/callback?state=a&code=" + "x".repeat(4097),
  ];
  for (const url of urls) {
    const response = await handleGoogleOAuthGateway(new Request(url), env, deps);
    assert.equal(response.status, 400);
  }
  assert.equal(calls, 0);
});


test("fails closed for missing config and relay-signing failure", async () => {
  const request = new Request(
    "https://zevsflow.sk/oauth/google/integration/callback?state=a&code=b",
  );
  assert.equal(
    (await handleGoogleOAuthGateway(request, {}, relayDeps())).status,
    503,
  );
  const failed = await handleGoogleOAuthGateway(request, env, {
    now: () => fixedNow,
    sign: async () => {
      throw new Error("signing failed");
    },
  });
  assert.equal(failed.status, 502);
  assert.doesNotMatch(await failed.text(), /signing failed/);
});


test("default signer produces a valid HMAC-SHA256 relay signature", async () => {
  const response = await handleGoogleOAuthGateway(
    new Request(
      "https://zevsflow.sk/oauth/google/integration/callback?state=a&code=b",
    ),
    env,
  );
  const relay = decodedRelay(response);
  assert.equal(
    relay.signature,
    createHmac("sha256", env.GOOGLE_INTEGRATION_CALLBACK_PROXY_SECRET)
      .update(relay.encoded)
      .digest("hex"),
  );
});