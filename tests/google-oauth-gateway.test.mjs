import assert from "node:assert/strict";
import test from "node:test";

import { handleGoogleOAuthGateway } from "../worker/google-oauth-gateway.ts";


const env = {
  GOOGLE_INTEGRATION_CALLBACK_UPSTREAM_URL:
    "https://backend.example.test/internal/oauth/google/integration/callback",
  GOOGLE_INTEGRATION_CALLBACK_PROXY_SECRET: "s".repeat(32),
};


test("forwards only bounded callback fields and keeps the secret server-side", async () => {
  let outbound;
  const response = await handleGoogleOAuthGateway(
    new Request(
      "https://zevsflow.sk/oauth/google/integration/callback?state=state-token&code=code-token&scope=openid",
    ),
    env,
    {
      fetch: async (url, init) => {
        outbound = { url, init };
        return new Response('{"success":true}', { status: 200 });
      },
    },
  );
  assert.equal(response.status, 200);
  assert.equal(outbound.url, env.GOOGLE_INTEGRATION_CALLBACK_UPSTREAM_URL);
  assert.equal(
    outbound.init.headers["x-zevsflow-callback-secret"],
    env.GOOGLE_INTEGRATION_CALLBACK_PROXY_SECRET,
  );
  assert.deepEqual(JSON.parse(outbound.init.body), {
    state: "state-token",
    code: "code-token",
  });
  const browser = await response.text();
  assert.doesNotMatch(browser, /state-token|code-token|backend\.example|ssss/);
});


test("forwards a bounded Google rejection without provider description", async () => {
  let body;
  const response = await handleGoogleOAuthGateway(
    new Request(
      "https://zevsflow.sk/oauth/google/integration/callback?state=state-token&error=access_denied&error_description=private",
    ),
    env,
    {
      fetch: async (_url, init) => {
        body = JSON.parse(init.body);
        return new Response('{"success":false}', { status: 400 });
      },
    },
  );
  assert.deepEqual(body, { state: "state-token", error: "access_denied" });
  assert.equal(response.status, 400);
  assert.doesNotMatch(await response.text(), /private|access_denied|state-token/);
});


test("rejects missing state, duplicate, unknown, and oversized parameters", async () => {
  let calls = 0;
  const deps = {
    fetch: async () => {
      calls += 1;
      return new Response("", { status: 200 });
    },
  };
  const urls = [
    "https://zevsflow.sk/oauth/google/integration/callback?code=x",
    "https://zevsflow.sk/oauth/google/integration/callback?state=a&state=b&code=x",
    "https://zevsflow.sk/oauth/google/integration/callback?state=a&code=x&unknown=y",
    `https://zevsflow.sk/oauth/google/integration/callback?state=a&code=${"x".repeat(4097)}`,
  ];
  for (const url of urls) {
    const response = await handleGoogleOAuthGateway(new Request(url), env, deps);
    assert.equal(response.status, 400);
  }
  assert.equal(calls, 0);
});


test("fails closed for missing config and upstream failure", async () => {
  const request = new Request(
    "https://zevsflow.sk/oauth/google/integration/callback?state=a&code=b",
  );
  assert.equal(
    (await handleGoogleOAuthGateway(request, {}, { fetch })).status,
    503,
  );
  const failed = await handleGoogleOAuthGateway(request, env, {
    fetch: async () => {
      throw new Error("timeout");
    },
  });
  assert.equal(failed.status, 502);
  assert.doesNotMatch(await failed.text(), /timeout/);
});
