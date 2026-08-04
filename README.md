# ZevsFlow website

Source code for the ZevsFlow marketing, pilot-application, and compliance website.

## Stack

- Next.js 16
- React 19
- TypeScript
- Vinext and Vite
- Cloudflare Workers-compatible production output
- Plain CSS in `app/globals.css` and `app/pilot.css`
- Locally bundled Inter and Manrope fonts under `.vinext/fonts/`

## Requirements

- Node.js `>=22.13.0`
- npm
- Linux with `bash`, `flock`, `curl`, and GNU `timeout` for the supplied
  bounded install/build scripts

## Install

```bash
npm run install:ci
```

The locked dependencies are installed from `package-lock.json`. A regular
`npm ci` can also be used in an environment that does not need the Sites
runtime wrappers.

## Development

```bash
npm run dev
```

The Vite development server normally listens on port `4173`.

## Production build

```bash
npm run build
npm run validate:artifact
```

The deployable output is written to `dist/`. Its Worker entry point is
`dist/server/index.js`, and the Sites manifest is copied to
`dist/.openai/hosting.json`.

## Run the production build

```bash
npm run start
```

Build before starting the production server.

## Checks

```bash
npm run lint
npm test
```

`npm test` performs a production build and then checks rendered metadata,
public routes, the demo video, pilot pricing, `robots.txt`, `sitemap.xml`, the
branded 404 response, and the bounded Worker validation/email side-effect
contract for pilot applications.

## Routes

- `/`
- `/pilot`
- `/automatizacia-na-mieru`
- `/data-a-bezpecnost`
- `/privacy`
- `/terms`
- `/cookies`
- `/google-data`
- `/data-deletion`
- `/support`
- `/robots.txt`
- `/sitemap.xml`
- `/api/pilot-config`
- `/api/pilot-application`

Unknown paths are handled by `app/not-found.tsx`.

## Pilot application flow

The public `/pilot` page presents:

- one bounded process pilot for `200 €`;
- the statement that Zevs s. r. o. is not a VAT payer;
- implementation from `750 €` after pilot evaluation;
- a non-binding questionnaire without files or payment.

The browser fetches public runtime readiness from `/api/pilot-config`. The form
is enabled only when the Worker has both Turnstile secrets, the `EMAIL` binding,
and a private `PILOT_EMAIL_RECIPIENT` runtime secret. The destination is managed
only in Cloudflare and is not stored in this repository. Submissions are
validated deterministically, verified through Turnstile Siteverify, and sent to
that verified private destination. The Worker does not create a D1, KV, or R2
lead record. Public contact and form fallback links use `info@zevsflow.sk`.

Cloudflare account setup and live acceptance steps are documented in
`docs/CLOUDFLARE_PILOT_FORM_SETUP.md`.

The approved architecture proof is stored in
`docs/architecture/PUBLIC_PILOT_APPLICATION_FLOW_ARCHITECTURE_DESIGN_PROOF.md`.

## Assets

- `public/media/zevsflow-demo.mp4` — product workflow demo
- `public/media/zevsflow-demo-poster.webp` — video poster
- `public/favicon.svg`
- `public/opengraph-image.png`
- `public/file.svg`
- `public/globe.svg`
- `public/window.svg`
- `.vinext/fonts/` — local Inter and Manrope font files and stylesheets

## SEO and indexing

Canonical site metadata and the launch gate are centralized in
`app/site-config.ts`. Public indexing remains intentionally disabled while
`PUBLIC_INDEXING_ENABLED` is `false`.

`app/layout.tsx` applies the matching `noindex, nofollow` metadata, and
`app/robots.ts` disallows crawling. `app/sitemap.ts` already defines the
canonical `.sk` route set, including `/pilot`, so the reviewed route list is
ready for public launch.

Do not flip the flag until the requirements in
`docs/PUBLIC_LAUNCH_CHECKLIST.md` are complete and the live form acceptance test
has passed.

## Hosting

`.openai/hosting.json` identifies the earlier OpenAI Sites project and is kept
only to preserve that deployment identity. The portable production build is
Cloudflare Workers-compatible. The primary production hostname is
`https://zevsflow.sk`; indexing remains disabled until the public launch gate.
