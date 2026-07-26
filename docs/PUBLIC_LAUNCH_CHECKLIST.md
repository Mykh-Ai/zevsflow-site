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

## Current launch gate

Public search indexing is intentionally disabled in `app/site-config.ts`:

```ts
export const PUBLIC_INDEXING_ENABLED = false;
```

Both page metadata and `robots.txt` use this value. Do not change it until the blockers below are closed.

## Blocking items before public indexing

### 1. Branded email addresses

Create and verify the production contact addresses before replacing the current Gmail address:

- `info@zevsflow.sk`
- `support@zevsflow.sk`
- `privacy@zevsflow.sk`

Replace the temporary Gmail address in contact calls to action, support, privacy, and data-deletion pages only after mail delivery and replies are tested.

### 2. Legal review

The current legal pages are explicitly marked as working drafts. A Slovak legal specialist must review at least:

- `/privacy`
- `/terms`
- `/cookies`
- `/google-data`
- `/data-deletion`

Do not remove the draft notice or describe the text as final before that review.

### 3. Product and data-processing truth

Before public launch, document only the services that actually run. Confirm and publish the real values for:

- service model: client infrastructure, managed environment, or both;
- processors and subprocessors;
- countries or regions of processing;
- retention periods;
- backup deletion behavior;
- support and incident-response terms;
- Google Drive and Gmail scopes actually requested;
- the real disconnect and deletion procedure.

Do not fill these fields with planned behavior presented as current behavior.

### 4. Final production verification

Verify after the final deploy:

- home page and every route in `PUBLIC_ROUTES` return `200`;
- an unknown path returns the branded `404` page with status `404`;
- the demo video works on Android, iPhone, and desktop;
- navigation, CTA links, email links, and footer links work;
- `zevsflow.sk`, `www.zevsflow.sk`, `zevsflow.eu`, and `www.zevsflow.eu` behave as intended;
- no browser shows a certificate warning;
- no OfficeFlow name, old preview hostname, token, secret, or internal path is exposed;
- mobile layout and keyboard navigation remain usable.

### 5. Google OAuth launch gate

Before a public Google OAuth flow is enabled, align the verified domain, OAuth branding, requested scopes, privacy policy, Google-data page, deletion procedure, and the actual application behavior.

## Public launch procedure

1. Finish branded email setup and update the site copy.
2. Complete legal and product-truth review.
3. Run `npm run lint`.
4. Run `npm test`.
5. Change `PUBLIC_INDEXING_ENABLED` to `true` in `app/site-config.ts`.
6. Run lint and tests again.
7. Deploy the exact reviewed commit.
8. Confirm that page metadata no longer contains `noindex`.
9. Confirm that `/robots.txt` allows crawling.
10. Confirm that `/sitemap.xml` lists the canonical `.sk` URLs.
11. Add `zevsflow.sk` to Google Search Console and submit the sitemap.

## Rollback

If a public-launch problem is found, set `PUBLIC_INDEXING_ENABLED` back to `false`, deploy, and fix the issue before reopening indexing.
