# ZevsFlow Site Information Architecture V1 — Architecture Design Proof

**Verdict:** `needs_architecture_revision`

**Task:** `ZEVSFLOW_SITE_INFORMATION_ARCHITECTURE_V1`  
**Repository:** `Mykh-Ai/zevsflow-site`  
**Date:** 2026-07-27

## 1. Product Need

The current website mixes three different entities:

1. **Zevs s. r. o.** — legal operator and contracting company;
2. **ZevsFlow** — brand for custom business-process automation;
3. **OfficeFlow** — the first proprietary product created under ZevsFlow.

The target website must make this hierarchy obvious and separate the OfficeFlow product journey from the custom-automation pilot journey.

### User-visible outcome

A visitor must understand:

- what ZevsFlow is;
- what OfficeFlow is;
- which OfficeFlow functions already work;
- that OfficeFlow starts from `7 € / mesiac` when its existing standard functionality is sufficient;
- that additional setup, templates, integrations and non-standard work are priced separately;
- that the `200 €` pilot belongs only to custom automation;
- where to go for OfficeFlow, custom automation, support and data/security information.

### Risk

`medium-high` because the site is public and indexed, commercial wording changes, and the existing pilot form has an email side effect.

## 2. Baseline And Local Commit Guard

### Remote audited baseline

`921f42047f9e1237fa1081b001b7d183166ce219` — `Preserve runtime variables across deploys`

### Local unpushed baseline declared by the product owner

`3a551dd295294728c148137b43acd2a400049d89`

The local commit is not available on GitHub. Its content must not be guessed.

Before implementation, the agent must:

1. verify `HEAD` and a clean working tree;
2. inspect:
   - `git show --stat --oneline 3a551dd295294728c148137b43acd2a400049d89`;
   - `git show --name-status 3a551dd295294728c148137b43acd2a400049d89`;
   - `git diff 921f42047f9e1237fa1081b001b7d183166ce219..3a551dd295294728c148137b43acd2a400049d89`;
3. determine whether it changes indexing, metadata, robots, sitemap, tests, Cloudflare config, routes or homepage copy;
4. preserve its intent;
5. never hard-reset, overwrite or silently drop it.

## 3. Architecture Classification

This is a material redesign of public information architecture and conversion routing.

It is **not** a new OfficeFlow/FakturaBot top-level action, FSM or callback flow. It changes only the marketing website and preserves the existing bounded pilot form.

### Existing owners

- `app/page.tsx::Home`
- `app/site-chrome.tsx::SiteHeader`
- `app/site-chrome.tsx::SiteFooter`
- `app/automatizacia-na-mieru/page.tsx::CustomAutomationPage`
- `app/pilot/page.tsx::PilotPage`
- `app/pilot/pilot-application-form.tsx::PilotApplicationForm`
- `worker/pilot-application.ts::handlePilotApplicationRequest`
- `app/site-config.ts::PUBLIC_ROUTES`
- `app/layout.tsx::metadata`

### New route owners

- `app/officeflow/page.tsx::OfficeFlowPage`
- `app/kontakt/page.tsx::ContactDecisionPage`

## 4. Canonical Public Actions

### `explore_zevsflow`

Learn about custom automation services.  
Owners: `/` and `/automatizacia-na-mieru`.  
Side effect: none.

### `explore_officeflow`

Learn about the existing OfficeFlow product and its available functions.  
Owner: `/officeflow`.  
Side effect: none.

### `request_custom_pilot`

Submit a non-binding request for one bounded custom process pilot for `200 €`.  
Owner: `/pilot` and the current Worker API.  
Side effect: one validated email after successful server-side checks.

### `contact_about_officeflow`

Express interest in an OfficeFlow demonstration or implementation.  
Owner: `/kontakt`.  
V1 side effect: explicit user-clicked `mailto:` only.  
No new API, CRM, database or payment.

### `request_support`

Open existing support information.  
Owner: `/support`.

## 5. Semantic Boundary Matrix

| User meaning | Correct route/action | Must not become |
|---|---|---|
| Wants invoices, receipts, incoming invoices or work-time functions | OfficeFlow | custom pilot by default |
| Wants a new order/email/approval workflow | custom automation | OfficeFlow feature claim |
| Wants to understand the product | `/officeflow` | form submission |
| Wants a `200 €` pilot | `/pilot` | OfficeFlow purchase |
| Asks OfficeFlow price | explain `od 7 € mesačne` for existing standard functionality | `200 €` pilot price |
| Needs support | `/support` | sales funnel |
| Asks about Google data | data/security routes | sales form |
| Asks for full accounting or tax filing | boundary explanation | accountant-replacement promise |
| Asks about bank statements | only approved current-status wording | automatic “available” claim |

### Ambiguous: “Chcem asistenta pre firmu”

Route by need:

- invoices, receipts, incoming invoices, analytics, work time, Google Drive → OfficeFlow;
- other workflows → custom automation.

### Ambiguous: “Chcem automatizovať doklady”

Show OfficeFlow first. Offer custom automation only when the requested process exceeds OfficeFlow's approved boundary.

## 6. Product Truth

### Zevs s. r. o.

- legal operator;
- contracting entity;
- appears in legal pages, footer, offers and agreements.

### ZevsFlow

- brand for custom automation on demand;
- serves small businesses, SZČO and micro-enterprises;
- is not the OfficeFlow product itself.

### OfficeFlow

- first proprietary ZevsFlow product;
- an administrative assistant with an existing working core;
- adapted to the client's company profile, rules, templates and integrations;
- standard existing functionality is available from `7 € / mesiac`;
- additional configuration, integrations and non-standard extensions are priced separately.

### Approved available OfficeFlow functions

These seven functions already work and must not be labelled `partial`, `MVP`, `limited`, `planned` or `experimental`:

1. outgoing invoices;
2. receipts (`bločky`);
3. incoming invoices;
4. invoice analytics;
5. expense analytics;
6. work-time tracking;
7. Google Drive integration.

### Unresolved public claims

Do not publish as available without explicit approval:

- bank statements;
- Gmail intake as a product feature;
- monthly closing preparation;
- annual closing preparation;
- WhatsApp as a current OfficeFlow channel;
- cashflow, VAT, tax or full-accounting analytics.

### Safe pricing answers

**Koľko stojí OfficeFlow?**

> Ak firme vyhovuje existujúci štandardný funkcional, OfficeFlow je dostupný od 7 € mesačne. Dodatočná konfigurácia, šablóny, integrácie alebo neštandardné rozšírenia sa naceňujú osobitne.

**Stojí OfficeFlow 200 €?**

> Nie. 200 € je cena ohraničeného pilotu jedného procesu v službe automatizácie na mieru. OfficeFlow je samostatný produkt dostupný od 7 € mesačne, ak postačuje jeho existujúci funkcional.

**Nahrádza OfficeFlow účtovníka?**

> Nie. OfficeFlow spracúva a organizuje firemné údaje a podklady v podporovanom rozsahu; nenahrádza odbornú účtovnú ani daňovú zodpovednosť.

## 7. Target Route Map

```text
/
├── /officeflow
│   └── /kontakt#officeflow
├── /automatizacia-na-mieru
│   └── /pilot
├── /kontakt
│   ├── OfficeFlow -> mailto in V1
│   ├── custom automation -> /pilot
│   └── existing client -> /support
├── /data-a-bezpecnost
├── /privacy
├── /terms
├── /cookies
├── /google-data
├── /data-deletion
└── /support
```

### Homepage role

The homepage sells ZevsFlow as custom automation and exposes OfficeFlow as its first product.

Primary actions:

- `Pozrieť OfficeFlow`
- `Automatizácia na mieru`

The `200 €` pilot must not be the universal Hero action.

### `/officeflow`

Owns:

- product explanation;
- seven available functions;
- demo;
- adaptation model;
- price from `7 € / mesiac`;
- one-time and non-standard work boundary;
- safety and accountant-replacement boundary;
- OfficeFlow-specific contact CTA.

### `/automatizacia-na-mieru`

Owns:

- custom processes outside or beyond OfficeFlow;
- one-process method;
- pilot for `200 €`;
- implementation from `750 €` for custom automation.

### `/pilot`

Remains only the bounded custom-automation pilot form. It is not an OfficeFlow order form.

### `/kontakt`

A decision hub, not a duplicate form:

- OfficeFlow interest → explicit `mailto:`;
- custom automation → `/pilot`;
- support → `/support`.

## 8. State Graph

### Navigation

```text
HOME
  -> OFFICEFLOW_INFORMATION
      -> OFFICEFLOW_CONTACT_DECISION
  -> CUSTOM_AUTOMATION_INFORMATION
      -> PILOT_INFORMATION
          -> PILOT_FORM
  -> DATA_SECURITY
  -> SUPPORT
```

### Existing pilot form

```text
LOADING_CONFIG
  -> UNAVAILABLE
  -> READY
      -> VALIDATION_ERROR -> READY
      -> SUBMITTING
          -> SUCCESS
          -> DELIVERY_ERROR -> READY
          -> TURNSTILE_ERROR -> READY
```

No new persistent FSM, localStorage, cookie, D1, KV, R2 or CRM state is introduced.

## 9. Decision, Confirmation And Callback Contract

### Product/service choice

Normal route links only. Repeated navigation is safe and has no write side effect.

### OfficeFlow contact

An explicit visitor click opens a pre-addressed email. No automatic submission occurs.

### Pilot submission

Preserve the existing contract:

- explicit submit button;
- required privacy acknowledgement;
- valid Turnstile token;
- duplicate submit blocked while submitting;
- stale or failed Turnstile fails closed;
- success only after successful email delivery;
- submission is not an order, contract, invoice or payment obligation.

## 10. Side Effects And Ownership

| Side effect | Trigger | Owner | Guard |
|---|---|---|---|
| route navigation | link click | browser/Next | valid href |
| OfficeFlow email client | explicit contact click | browser | user action |
| Turnstile verification | valid pilot submit | Worker | same origin, config, validation |
| pilot email | verified pilot submit | `env.EMAIL.send` | server validation + Turnstile |
| sitemap/metadata update | deploy | Next build | tests |

The redesign must not add:

- payment;
- file upload;
- lead database;
- CRM write;
- marketing subscription;
- analytics cookies;
- new external processors.

## 11. Existing Pilot Slot Contract

Preserve these fields and their validation:

- `businessType`
- `companyName`
- `industry`
- `processType`
- `processDescription`
- `currentMethod`
- `expectedResult`
- `contactName`
- `email`
- `phone`
- `privacyAccepted`
- `turnstileToken`
- honeypot `website`

An OfficeFlow lead must not be silently forced into these one-custom-process slots.

## 12. Authorization And Precision Boundaries

### New public routes

- unauthenticated and read-only;
- no tenant context;
- no OfficeFlow production-data access;
- no OAuth connection;
- no personal-data collection in V1.

### Existing pilot API

Preserve:

- same-origin POST;
- strict JSON and size limit;
- bounded enums and lengths;
- privacy acknowledgement;
- honeypot;
- server-side Turnstile action and hostname checks;
- restricted email binding;
- no sensitive body logging;
- no D1/KV/R2 lead storage.

### Pricing precision

The website may say:

- OfficeFlow `od 7 € mesačne` when existing standard functionality is sufficient;
- extra configuration, integrations and non-standard extensions are separate.

It must not say:

- every OfficeFlow deployment costs exactly `7 €`;
- all customization is included in `7 €`;
- OfficeFlow costs `200 €`;
- custom implementation from `750 €` is automatically the OfficeFlow price.

## 13. Negative Space And Regression Contract

The migration must not:

1. rename the company, domain, repository or ZevsFlow brand;
2. turn the homepage into an OfficeFlow-only landing page;
3. keep calling ZevsFlow itself the product assistant;
4. hide OfficeFlow as merely a generic example;
5. send OfficeFlow prospects directly to the custom pilot without explanation;
6. apply the `200 €` pilot price to OfficeFlow;
7. hide or contradict `OfficeFlow od 7 € mesačne`;
8. imply that `7 €` includes every customization, integration or hosting model;
9. apply `Implementácia od 750 €` automatically to OfficeFlow;
10. mark the seven approved functions as partial or experimental;
11. publish unresolved functions as available;
12. weaken Turnstile, validation, email or fail-closed behavior;
13. add payment, file upload, CRM, D1, KV or R2 lead storage;
14. remove legal or Google-data routes;
15. break canonical `.sk` URLs or `.eu` redirects;
16. disable indexing without an explicit rollback decision;
17. omit `/officeflow` or `/kontakt` from sitemap and route tests;
18. reset or overwrite local commit `3a551dd...`;
19. preserve tests that contradict actual indexing configuration;
20. invent testimonials, customer counts, savings or guarantees;
21. modify OfficeFlow/FakturaBot runtime code.

### Known remote inconsistency

Remote `main` currently has `PUBLIC_INDEXING_ENABLED = true`, while rendered tests still expect `noindex, nofollow` and `Disallow: /`.

The local commit may already fix this. It must be inspected before changing tests.

## 14. Acceptance Scenarios

### A1 — Brand hierarchy

Opening `/` clearly distinguishes ZevsFlow service from OfficeFlow product and shows separate CTAs.

### A2 — OfficeFlow route

`/officeflow` returns `200`, shows all seven approved functions as available, and contains no partial/MVP labels.

### A3 — OfficeFlow price

`/officeflow` states `od 7 € mesačne` and explains that additional customization and integrations are separate.

### A4 — Price separation

OfficeFlow is never described as the `200 €` pilot. The pilot remains a custom-automation offer.

### A5 — Custom service

`/automatizacia-na-mieru` explains the bounded custom process, pilot price and custom implementation boundary.

### A6 — OfficeFlow contact

OfficeFlow CTA leads to `/kontakt#officeflow`, not directly to the pilot form.

### A7 — Pilot happy path

Valid form + privacy + valid Turnstile sends exactly one email and shows success only after delivery.

### A8 — Pilot invalid input

No email; field errors are displayed and values remain available for correction.

### A9 — Stale Turnstile

No email; safe error and reset.

### A10 — Support separation

Existing-client technical issue routes to `/support`, not to sales.

### A11 — Unsupported accounting claim

Full year closing or tax filing receives a boundary explanation, not a guaranteed capability claim.

### A12 — SEO coverage

`/officeflow` and `/kontakt` have canonical metadata, appear in sitemap and are covered by rendered-route tests.

### A13 — Indexing consistency

When `PUBLIC_INDEXING_ENABLED = true`, metadata, robots and tests all expect index/follow and crawling. Any rollback changes all layers consistently.

### A14 — Local commit preservation

Implementation starts from and preserves `3a551dd...`; no hard reset or silent overwrite occurs.

### A15 — Demo preservation

The current non-autoplay user-controlled demo remains available and is recontextualized as OfficeFlow product evidence.

### A16 — Mobile navigation

OfficeFlow, custom automation and the main CTA remain reachable without horizontal overflow on a narrow mobile viewport.

## 15. Out Of Scope

- OfficeFlow/FakturaBot runtime changes;
- new bot actions or FSMs;
- new OfficeFlow contact API;
- CRM or lead database;
- payment and subscription billing implementation;
- user accounts or onboarding;
- Google OAuth changes;
- Cloudflare email or Turnstile changes;
- DNS/domain changes;
- analytics/cookie system;
- unsupported testimonials or case studies;
- final legal review;
- tariff matrix beyond the approved `od 7 € / mesiac` statement;
- pricing of customization, hosting, integrations and non-standard work.

## 16. Evidence Index

Repository evidence reviewed from remote baseline:

- `app/page.tsx`
- `app/site-chrome.tsx`
- `app/site-config.ts`
- `app/layout.tsx`
- `app/automatizacia-na-mieru/page.tsx`
- `app/pilot/page.tsx`
- `app/pilot/pilot-application-form.tsx`
- `app/process-demo.tsx`
- `app/data-a-bezpecnost/page.tsx`
- `worker/pilot-application.ts`
- `tests/rendered-html.test.mjs`

Product-owner statements approved in conversation:

- ZevsFlow is custom automation;
- OfficeFlow is the product;
- the seven listed OfficeFlow capabilities already work;
- OfficeFlow starts from `7 € / mesiac` when existing functionality is sufficient;
- the `200 €` pilot belongs only to custom automation;
- local commit `3a551dd...` is clean and must be preserved.

## Architecture Review Gate

This proof is **not yet `ready_for_handoff`**.

It may become `ready_for_handoff` only after:

1. product-owner approval of the route and conversion separation;
2. inspection and reconciliation of local commit `3a551dd...`;
3. explicit resolution or exclusion of bank statements, closing preparation, Gmail and WhatsApp wording;
4. approval of the V1 OfficeFlow `mailto:` contact mechanism;
5. reconciliation of the indexing-test contradiction.

After approval, create:

`docs/specs/ZEVSFLOW_SITE_ARCHITECTURE_INTEGRATION_SPEC.md`

Only after that specification is approved may an implementation prompt be written.
