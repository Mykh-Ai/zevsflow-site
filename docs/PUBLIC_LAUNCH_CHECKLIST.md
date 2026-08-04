# ZevsFlow public launch checklist

Status: launch preparation in progress.

Primary production hostname: `https://zevsflow.sk`

Redirect domain: `https://zevsflow.eu` → `https://zevsflow.sk`

## Completed

- ZevsFlow branding is present in the repository.
- The site is deployed as a Cloudflare Worker.
- `zevsflow.sk` is connected as the primary hostname.
- Root and `www` variants work.
- `zevsflow.eu` and `www.zevsflow.eu` redirect to the `.sk` domain.
- HTTPS is active.
- Canonical, Open Graph, Twitter, favicon, and Slovak locale metadata exist.
- Legal and Google information routes exist.
- A custom 404 page, `robots.txt`, and `sitemap.xml` are defined.
- `info@zevsflow.sk` is the public contact; form delivery remains internal to `officezevs2024@gmail.com`.
- The public offer shows `Pilot za 200 €` and `Implementácia od 750 €`.
- The site states that Zevs s. r. o. is not a VAT payer.
- `/pilot` contains the approved scope, exclusions, non-binding notice, and short questionnaire.
- The form accepts no files and takes no payment.
- The Worker validates bounded fields, checks same-origin requests, verifies Turnstile server-side, and sends through a restricted email binding.
- The form stores no separate lead record in D1, KV, or R2.
- Public preview/development commentary was removed from the visible site.

## Current launch gate

Public search indexing is intentionally disabled in `app/site-config.ts`:

```ts
export const PUBLIC_INDEXING_ENABLED = false;
```

Both page metadata and `robots.txt` use this value. Do not change it until the blockers below are closed.

## Blocking items before public indexing

### 1. Cloudflare pilot-form setup and live acceptance

Complete the account-level steps in `docs/CLOUDFLARE_PILOT_FORM_SETUP.md`:

- verify `officezevs2024@gmail.com` as the permitted destination;
- ensure the `EMAIL` send binding can use `pilot@zevsflow.sk`;
- create a Turnstile managed widget for `zevsflow.sk` and `www.zevsflow.sk`;
- add `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` as Worker secrets;
- deploy the reviewed commit;
- confirm `/api/pilot-config` returns `enabled: true`;
- submit a real test application;
- confirm exactly one email arrives and reply-to points to the applicant;
- confirm invalid, stale, and incomplete submissions do not send email.

Do not claim a successful online submission until email delivery is confirmed.

### 2. Legal and Product Truth review

Review at least:

- `/pilot`
- `/privacy`
- `/terms`
- `/cookies`
- `/google-data`
- `/data-deletion`
- `/support`

Confirm that the public text matches the real operating model:

- pilot price is exactly `200 €`;
- Zevs s. r. o. is not a VAT payer;
- implementation starts from `750 €` and is individually scoped;
- application submission is non-binding;
- no payment or file upload exists on the public site;
- Cloudflare and Google are named for the form path;
- form submissions are sent to Gmail and are not stored in a separate ZevsFlow lead database;
- retention, backups, support, and processor descriptions do not promise behavior that is not operational.

A Slovak legal specialist should review the legal wording before broad paid promotion or public Google OAuth verification. This does not require a branded domain mailbox.

### 3. Final production verification

Verify after the final deploy:

- home page and every route in `PUBLIC_ROUTES` return `200`;
- `/pilot` renders correctly on Android, iPhone, and desktop;
- an unknown path returns the branded `404` page with status `404`;
- the demo video works on Android, iPhone, and desktop;
- navigation, pilot CTA links, email links, and footer links work;
- the Turnstile widget is usable with keyboard navigation;
- success is shown only after confirmed email delivery;
- form values remain available after a recoverable error;
- `zevsflow.sk`, `www.zevsflow.sk`, `zevsflow.eu`, and `www.zevsflow.eu` behave as intended;
- no browser shows a certificate warning;
- no OfficeFlow name, old preview hostname, token, secret, internal path, or private launch commentary is exposed;
- mobile layout remains usable at narrow widths.

### 4. Google OAuth launch gate

Public search indexing and public Google OAuth are separate decisions.

Before a public Google OAuth flow is enabled, align the verified domain, OAuth branding, requested scopes, privacy policy, Google-data page, deletion procedure, and the actual application behavior. Indexing the marketing site does not by itself enable Google OAuth.

## Non-blocking later improvement

After the first commercial revenue, separate branded routes may supplement the general public contact, for example:

- `support@zevsflow.sk`
- `privacy@zevsflow.sk`

This is a branding and operational improvement, not a prerequisite for the first sale or for indexing the current marketing site.

## Public launch procedure

1. Complete the Cloudflare pilot-form setup and live acceptance test.
2. Complete legal and Product Truth review.
3. Run `npm run lint`.
4. Run `npm test`.
5. Change `PUBLIC_INDEXING_ENABLED` to `true` in `app/site-config.ts`.
6. Run lint and tests again.
7. Deploy the exact reviewed commit.
8. Confirm that page metadata no longer contains `noindex`.
9. Confirm that `/robots.txt` allows crawling.
10. Confirm that `/sitemap.xml` lists `/pilot` and the canonical `.sk` URLs.
11. Add `zevsflow.sk` to Google Search Console and submit the sitemap.

## Rollback

If a public-launch or form-delivery problem is found:

- set `PUBLIC_INDEXING_ENABLED` back to `false` if indexing was enabled;
- disable one required form secret if the online form must fail closed;
- deploy;
- confirm the public `info@zevsflow.sk` fallback remains visible;
- fix and re-test before reopening indexing or online submission.
