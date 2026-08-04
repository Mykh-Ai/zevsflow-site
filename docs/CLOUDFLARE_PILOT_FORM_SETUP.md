# Cloudflare setup for the ZevsFlow pilot form

The repository contains the `/pilot` page and the Worker endpoints:

- `GET /api/pilot-config`
- `POST /api/pilot-application`

The form remains fail-closed until the Cloudflare account has a Turnstile widget, two Worker secrets, and the verified email destination used by the `EMAIL` binding.

## 1. Verify the destination Gmail address

In the Cloudflare dashboard for the account that owns `zevsflow.sk`:

1. Open **Email** / **Email Routing** or **Email Service**.
2. Add `officezevs2024@gmail.com` as a destination address.
3. Open the verification email in Gmail and confirm the destination.
4. Keep Cloudflare DNS authoritative for `zevsflow.sk`.

The repository declares a restricted send binding:

```ts
send_email: [
  {
    name: "EMAIL",
    destination_address: "officezevs2024@gmail.com",
  },
]
```

Do not rename the binding unless `worker/index.ts` and `worker/pilot-application.ts` are updated at the same time.

## 2. Onboard the sender domain

Open **Compute / Email Service / Email Sending** and onboard `zevsflow.sk` if Cloudflare asks for sender-domain setup.

Allow Cloudflare to add the required SPF, DKIM, bounce-routing, and DMARC-related DNS records. Do not remove the existing website, redirect, or mailbox MX/TXT records without reviewing the exact conflict.

The Worker sends form notifications from:

```text
pilot@zevsflow.sk
```

This is a technical sender for the Worker and is not a public mailbox. Replies go to the applicant because the message uses the applicant's email as `Reply-To`.

## 3. Create the Turnstile widget

1. Open **Turnstile** in the Cloudflare dashboard.
2. Create a widget named `ZevsFlow pilot form`.
3. Choose the managed widget type.
4. Add these hostnames:
   - `zevsflow.sk`
   - `www.zevsflow.sk`
5. Do not enable pre-clearance for this form.
6. Copy the generated site key and secret key.

The client uses the Turnstile action:

```text
pilot_application
```

The Worker validates the token server-side and requires both the action and hostname to match.

## 4. Add Worker secrets

Open the `zevsflow-site` Worker and add these encrypted secrets:

```text
TURNSTILE_SITE_KEY=<Turnstile site key>
TURNSTILE_SECRET_KEY=<Turnstile secret key>
```

Although a Turnstile site key is public by design, it is kept as a runtime secret here so a normal code deployment does not need to contain account-specific values.

Do not commit either value to GitHub.

Optional variables are supported but normally unnecessary because safe defaults are already in code:

```text
PILOT_EMAIL_RECIPIENT=officezevs2024@gmail.com
PILOT_EMAIL_FROM=pilot@zevsflow.sk
```

## 5. Deploy and verify the runtime gate

After the destination is verified and the secrets exist, deploy the branch or reviewed `main` commit.

Open:

```text
https://zevsflow.sk/api/pilot-config
```

Expected response:

```json
{
  "enabled": true,
  "siteKey": "<public site key>",
  "fallbackEmail": "info@zevsflow.sk"
}
```

If `enabled` is `false`, at least one of these is missing:

- `EMAIL` binding;
- `TURNSTILE_SITE_KEY`;
- `TURNSTILE_SECRET_KEY`;
- sender or recipient configuration.

## 6. Live acceptance test

Use a real browser on `https://zevsflow.sk/pilot`.

1. Confirm that Turnstile loads.
2. Submit a complete test application.
3. Confirm that the page shows the success message only after delivery.
4. Confirm that exactly one email arrives at `officezevs2024@gmail.com`.
5. Confirm that replying to the email addresses the applicant.
6. Submit an invalid form and confirm that no email arrives.
7. Wait more than five minutes before submitting and confirm that an expired Turnstile token fails safely.
8. Confirm that the form accepts no files and takes no payment.
9. Confirm that request content is not written to Worker logs.

## 7. Indexing gate

Do not enable public indexing merely because the code is merged.

After the live form acceptance test and final legal/content review:

```ts
export const PUBLIC_INDEXING_ENABLED = true;
```

Then re-run lint and tests, deploy, verify `/robots.txt` and `/sitemap.xml`, and submit the sitemap in Google Search Console.

## Rollback

If form delivery fails after deployment:

- remove or disable one of the Turnstile secrets to make `/api/pilot-config` return `enabled: false`;
- the page will show the public `info@zevsflow.sk` fallback instead of pretending that online submission works;
- keep `PUBLIC_INDEXING_ENABLED = false` until the problem is resolved.
