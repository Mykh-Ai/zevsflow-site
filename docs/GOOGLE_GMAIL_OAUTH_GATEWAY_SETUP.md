# Google Gmail OAuth callback gateway

Status: implemented locally; production transport configuration is external.

The Worker exposes GET /oauth/google/integration/callback.

It is a narrow server-side relay gateway. It does not exchange OAuth tokens,
select a workspace, persist business state, call Gmail, or grant Google Drive
access.

## Required Worker environment

- GOOGLE_INTEGRATION_CALLBACK_UPSTREAM_URL must be the HTTPS URL of the
  OfficeFlow callback relay endpoint behind Cloudflare Tunnel.
- GOOGLE_INTEGRATION_CALLBACK_PROXY_SECRET must be at least 32 characters and
  must exactly match the backend secret.
- Both values are runtime configuration. The secret belongs only in Worker and
  backend secret storage, never in git, callback URLs, or browser JavaScript.

## Signed relay contract

The public callback accepts only bounded Google response parameters. It keeps
only state plus exactly one of code or error, adds an issuance timestamp,
serializes the bounded payload as base64url, and authenticates that exact
encoded value with HMAC-SHA256 using the proxy secret.

The Worker responds with a no-store 302 to the configured Tunnel endpoint
using only payload and signature query parameters. The backend:

1. requires exactly one payload and signature;
2. verifies the HMAC in constant time before OAuth or database work;
3. rejects relays older than five minutes or too far in the future;
4. re-applies field and size bounds;
5. relies on the existing one-time OAuth state/nonce and admin/workspace gates;
6. returns a minimal Slovak browser result with CSP, no-referrer, no-store, and
   noindex headers.

The relay exists because a normal Worker subrequest to a public Cloudflare
Tunnel hostname can be rejected by Cloudflare routing. No inbound VPS port is
published, and the Tunnel endpoint remains unusable without a valid signed,
short-lived payload. The OAuth code already arrives in the browser-visible
Google callback URL; the relay must never render it or log it.

Provider diagnostics, tokens, email, workspace IDs, the proxy secret, and
upstream configuration must never be rendered.

## Launch gates

Public search indexing remains independently enabled. It does not enable Gmail
OAuth.

Before production consent:

1. enable the Gmail API in the approved Google Cloud project;
2. register the exact public callback URI;
3. request only OIDC identity scopes and gmail.readonly;
4. complete the required Google restricted-scope verification;
5. synchronize /google-data, privacy, and deletion wording with launched
   behavior;
6. deploy the callback listener and outbound-only Tunnel;
7. run lint, tests, build, signed-relay negative tests, and a controlled
   end-to-end callback smoke;
8. complete /gmail_connect only with the configured workspace administrator
   and expected Google account.