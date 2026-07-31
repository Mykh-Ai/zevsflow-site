# Google Gmail OAuth callback gateway

Status: implemented locally, disabled until external configuration and
deployment.

The Worker exposes:

```text
GET /oauth/google/integration/callback
```

It is a narrow server-side transport gateway. It does not exchange OAuth
tokens, select a workspace, persist business state, call Gmail, or grant Google
Drive access.

## Required Worker environment

```text
GOOGLE_INTEGRATION_CALLBACK_UPSTREAM_URL
GOOGLE_INTEGRATION_CALLBACK_PROXY_SECRET
```

- `GOOGLE_INTEGRATION_CALLBACK_UPSTREAM_URL` must be an HTTPS URL for the
  private OfficeFlow callback service.
- `GOOGLE_INTEGRATION_CALLBACK_PROXY_SECRET` must be at least 32 characters and
  must exactly match the backend secret.
- Both values are secrets/configuration supplied in the hosting environment;
  neither belongs in git or browser JavaScript.

The public callback accepts only the bounded Google response parameters,
forwards only `state`, `code`, or `error`, and returns a minimal Slovak success
or failure page. It sets no-store, no-referrer, CSP, and noindex response
headers. Provider diagnostics, authorization codes, state, tokens, email,
workspace IDs, and upstream URLs must never be rendered.

## Launch gates

Public search indexing remains independently controlled and is currently
enabled. It does not enable Gmail OAuth.

Before configuring this gateway in production:

1. enable the Gmail API in the approved Google Cloud project;
2. register the exact callback URI;
3. request only OIDC identity scopes and
   `https://www.googleapis.com/auth/gmail.readonly`;
4. complete the required Google restricted-scope verification;
5. synchronize `/google-data`, privacy, and deletion wording with the actually
   launched behavior;
6. deploy the internal callback first and verify secret-bound connectivity;
7. run lint, tests, build, and a controlled end-to-end callback smoke;
8. keep the backend `GOOGLE_GMAIL_ENABLED=0` until every gate passes.

No deployment or external credential change is part of the local repository
implementation.
