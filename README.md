# ZevsFlow website

Source code for the ZevsFlow marketing and compliance website.

## Stack

- Next.js 16
- React 19
- TypeScript
- Vinext and Vite
- Cloudflare Workers-compatible production output
- Plain CSS in `app/globals.css`
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
public routes, the demo video, `robots.txt`, `sitemap.xml`, and the branded 404
response.

## Routes

- `/`
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

Unknown paths are handled by `app/not-found.tsx`.

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
canonical `.sk` route set so the same reviewed route list is ready for the
public launch.

Do not flip the flag until the requirements in
`docs/PUBLIC_LAUNCH_CHECKLIST.md` are complete.

## Hosting

`.openai/hosting.json` identifies the earlier OpenAI Sites project and is kept
only to preserve that deployment identity. The portable production build is
Cloudflare Workers-compatible. The primary production hostname is
`https://zevsflow.sk`; indexing remains disabled until the public launch gate.
