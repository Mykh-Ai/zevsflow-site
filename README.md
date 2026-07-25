# OfficeFlow website

Source code for the OfficeFlow marketing and compliance website currently
published as a private OpenAI Sites preview.

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

`npm test` performs a production build and then checks the rendered routes and
metadata.

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

## Assets

- `public/media/officeflow-demo.mp4` — product workflow demo
- `public/media/officeflow-demo-poster.webp` — video poster
- `public/favicon.svg`
- `public/file.svg`
- `public/globe.svg`
- `public/window.svg`
- `.vinext/fonts/` — local Inter and Manrope font files and stylesheets

## SEO and indexing

The current private preview intentionally declares `noindex, nofollow` through
the Next.js metadata in `app/layout.tsx`. There is no standalone `robots.txt`
or sitemap in this version. Do not remove the noindex configuration until the
site is ready for a public launch.

## Hosting

`.openai/hosting.json` identifies the existing OpenAI Sites project and is kept
to preserve the exact current hosting configuration. This GitHub repository
is a portable source copy; the currently deployed `chatgpt.site` version still
depends on the separate internal Sites source repository and deployment
lifecycle unless it is explicitly reconfigured later.

No DNS or Cloudflare custom-domain configuration is part of this repository
transfer.
