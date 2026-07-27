# ZevsFlow Site Information Architecture V1 — Architecture Design Proof

**Verdict:** `needs_architecture_revision`

**Task:** `ZEVSFLOW_SITE_INFORMATION_ARCHITECTURE_V1`  
**Repository:** `Mykh-Ai/zevsflow-site`  
**Date:** 2026-07-27

## 1. Product Need

The current website mixes three different entities:

1. **Zevs s. r. o.** — the legal operator and contracting company;
2. **ZevsFlow** — the brand and delivery model for custom automation;
3. **OfficeFlow** — the owner's existing Telegram assistant/product with the ability to connect additional users.

The target architecture must explain not only the brand hierarchy, but also the commercial boundary between standard OfficeFlow use and ZevsFlow custom work.

### Canonical commercial model

**OfficeFlow standard service**

- the existing OfficeFlow Telegram bot;
- runs on ZevsFlow infrastructure;
- additional users can be connected;
- available from `7 € / mesiac` when the existing functionality is sufficient;
- light configuration is possible within this model, including examples such as:
  - invoice layout;
  - work-time sheet layout;
  - company profile and basic presentation settings;
- this is not a `200 €` pilot.

**ZevsFlow custom project**

A ZevsFlow pilot is the correct route when the customer needs any of the following:

- a process outside the OfficeFlow standard functional core;
- broader functional changes or new integrations;
- OfficeFlow-based functionality deployed on the customer's own server;
- a separately designed assistant for the customer's business;
- a custom architecture, hosting model, rules, or workflow that requires project work.

The pilot price is `200 €` for one bounded process. Production implementation is priced separately after the pilot.

The resulting custom assistant may use any name chosen by the customer. The name **OfficeFlow** identifies the owner's existing product, not every assistant built by ZevsFlow.

### User-visible outcome

A visitor must understand:

- what ZevsFlow is;
- what OfficeFlow is;
- which OfficeFlow functions already work;
- when OfficeFlow from `7 € / mesiac` is suitable;
- which light configuration can remain within the standard service;
- when the request becomes a ZevsFlow custom pilot;
- that the customer's custom assistant does not have to be called OfficeFlow;
- that the `200 €` pilot is not the OfficeFlow monthly price.

### Risk

`medium-high` because the site is public and indexed, commercial wording changes, and the existing pilot form has an email side effect.

---

## 2. Baseline And Local Commit Guard

### Remote audited baseline

`921f42047f9e1237fa1081b001b7d183166ce219` — `Preserve runtime variables across deploys`

### Local unpushed baseline declared by the product owner

`3a551dd295294728c148137b43acd2a400049d89`

The local commit is not available on GitHub. Its content must not be guessed.

Before implementation, the agent must:

1. verify that local `HEAD` is `3a551dd295294728c148137b43acd2a400049d89` and the working tree is clean;
2. inspect:
   - `git show --stat --oneline 3a551dd295294728c148137b43acd2a400049d89`;
   - `git show --name-status 3a551dd295294728c148137b43acd2a400049d89`;
   - `git diff 921f42047f9e1237fa1081b001b7d183166ce219..3a551dd295294728c148137b43acd2a400049d89`;
3. determine whether it changes indexing, metadata, robots, sitemap, tests, Cloudflare config, routes, or homepage copy;
4. preserve its intent;
5. never hard-reset, overwrite, or silently drop it.

No implementation handoff may claim a complete read-only audit until this reconciliation is performed.

---

## 3. Architecture Classification

This is a material redesign of public website information architecture and conversion routing.

It is not a new OfficeFlow/FakturaBot top-level action, FSM, callback, or Telegram runtime flow. It changes the marketing website and preserves the existing bounded pilot form.

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

### New proposed route owners

- `app/officeflow/page.tsx::OfficeFlowPage`
- `app/kontakt/page.tsx::ContactDecisionPage`

---

## 4. Canonical Public Actions

### `explore_officeflow`

Learn about the existing OfficeFlow Telegram product, available functions, ZevsFlow-hosted model, price from `7 € / mesiac`, and light configuration boundary.

**Owner:** `/officeflow`  
**Side effect:** none

### `request_officeflow_standard`

Express interest in using the existing OfficeFlow product on ZevsFlow infrastructure.

**Correct when:**

- the existing functional core is sufficient;
- only light configuration is needed;
- the customer accepts ZevsFlow-hosted operation.

**Owner:** `/kontakt#officeflow-standard`  
**V1 side effect:** explicit user-clicked email only

### `explore_zevsflow_custom`

Learn about custom automation services, including custom processes and custom OfficeFlow-based deployments.

**Owner:** `/automatizacia-na-mieru`  
**Side effect:** none

### `request_custom_pilot`

Submit a non-binding request for one bounded ZevsFlow pilot for `200 €`.

This action covers both:

1. a process outside the OfficeFlow standard core;
2. an OfficeFlow-based solution that requires the customer's own server, broader customization, new integrations, or custom architecture.

**Owner:** `/pilot` and the existing Worker API  
**Side effect:** one validated email after server-side checks

### `request_support`

Open existing support information.

**Owner:** `/support`

---

## 5. Semantic Boundary Matrix

| User meaning / example | Correct answer or route | Why | Must not become |
|---|---|---|---|
| “Chcem hotového asistenta na faktúry, bločky a pracovný čas.” | Offer OfficeFlow from `7 € / mesiac` if ZevsFlow hosting, existing functions, and light configuration are sufficient | This is the existing OfficeFlow product | automatic custom pilot |
| The same customer requires deployment on their own server | ZevsFlow custom pilot | The hosting/architecture boundary changes | `7 €` standard OfficeFlow promise |
| The same customer needs major new functions or integrations | ZevsFlow custom pilot | The request exceeds standard/light configuration | claim that everything is included in OfficeFlow monthly price |
| “Potrebujem automatizovať prijímanie objednávok z troch systémov.” | ZevsFlow custom pilot | This is a distinct cross-system custom process | OfficeFlow feature claim |
| “Ako funguje váš produkt?” | `/officeflow` | Product information request | pilot form submission |
| “Čo viete automatizovať na mieru?” | `/automatizacia-na-mieru` | Service information request | OfficeFlow-only route |
| “Koľko stojí OfficeFlow?” | Explain `od 7 € mesačne` on ZevsFlow infrastructure with existing functions and light configuration | Approved standard service boundary | `200 €` pilot price |
| “Chcem vlastný server.” | ZevsFlow custom pilot | Client-hosted deployment is project work | standard OfficeFlow monthly plan |
| “Chcem vlastného asistenta s iným názvom.” | ZevsFlow custom pilot | Custom assistant may use the customer's chosen name | force the OfficeFlow name |
| “Mám problém s už nasadeným riešením.” | `/support` | Existing-client support path | new sales lead |
| “Ako používate Google Drive?” | data/security route | Compliance information | sales form |
| “Zatvorte mi účtovníctvo za rok.” | boundary explanation | OfficeFlow is not an accountant | guaranteed capability |

### Required answer example

**Question:** `Potrebujem automatizovať prijímanie objednávok z troch systémov.`

**Canonical answer:**

> Prijímanie objednávok z troch systémov nie je štandardná funkcia OfficeFlow. Ide o automatizáciu na mieru cez ZevsFlow.
>
> Najskôr v pilote za 200 € overíme jeden presne ohraničený proces: z ktorých systémov objednávky prichádzajú, aké údaje treba prevziať, ako ich zjednotiť, ktoré výnimky musí riešiť človek a aký má byť výsledok.
>
> Ak sa riešenie potvrdí, produkčná implementácia, integrácie a prevádzka sa nacenia podľa skutočného rozsahu. Výsledný asistent môže mať vlastný názov a fungovať v infraštruktúre klienta alebo v dohodnutom spravovanom prostredí.

---

## 6. Structured Decision Slots

| Slot | Allowed values | Meaning | Boundary |
|---|---|---|---|
| `solutionType` | `officeflow_standard`, `officeflow_custom`, `custom_assistant`, `support`, `data_security` | requested commercial path | never infer a write side effect |
| `hostingModel` | `zevsflow_hosted`, `client_hosted`, `unknown` | where the assistant runs | `client_hosted` routes to custom pilot |
| `customizationLevel` | `none`, `light`, `broad`, `unknown` | degree of requested change | `light` may remain in OfficeFlow standard; `broad` routes to custom pilot |
| `productName` | `officeflow`, `customer_selected`, `unknown` | public name of the assistant | custom assistant does not have to use OfficeFlow name |
| `capabilityFit` | `standard_fit`, `outside_standard`, `unknown` | whether existing OfficeFlow functions are enough | outside standard routes to pilot |
| `contactTopic` | `officeflow_standard`, `officeflow_custom`, `custom_process`, `support` | contact decision | no automatic form submission |

### Resolution order

1. Does the request fit the existing OfficeFlow functional core?
2. Is ZevsFlow-hosted operation acceptable?
3. Is only light configuration needed?
4. If all three are true, route to OfficeFlow standard from `7 € / mesiac`.
5. If any answer is no, route to the ZevsFlow custom pilot.

---

## 7. OfficeFlow Product Truth

OfficeFlow is:

- the owner's existing Telegram bot/product;
- able to connect additional users;
- operated on ZevsFlow infrastructure in the standard service model;
- available from `7 € / mesiac` when the existing functional core is sufficient;
- compatible with light configuration such as invoice and work-time sheet layouts;
- not the generic name for every assistant built by ZevsFlow.

### Approved available functions

These seven capabilities already work and must not be labelled `partial`, `MVP`, `limited`, `planned`, or `experimental`:

1. outgoing invoices;
2. receipts (`bločky`);
3. incoming invoices;
4. invoice analytics;
5. expense analytics;
6. work-time tracking;
7. Google Drive integration.

### Light configuration within OfficeFlow standard

Public copy may state that light configuration is possible, including examples such as:

- invoice layout;
- work-time sheet layout;
- company details and basic presentation settings.

This must not become a promise that every template change, integration, business rule, or workflow extension is included in `7 € / mesiac`.

### Custom boundary

The request becomes a ZevsFlow custom project when it requires:

- the customer's own server;
- new integrations;
- a new process outside the OfficeFlow standard core;
- major functional extension;
- custom architecture or security model;
- a separately designed assistant.

A custom assistant may be named by the customer.

### Unresolved public claims

Do not publish as available without explicit approval:

- bank statements;
- Gmail intake as an OfficeFlow product feature;
- monthly closing preparation;
- annual closing preparation;
- WhatsApp as a current OfficeFlow channel;
- cashflow, VAT, tax, or full-accounting analytics.

---

## 8. Safe Product Answers

### “Čo je OfficeFlow?”

> OfficeFlow je existujúci Telegram asistent ZevsFlow pre faktúry, bločky, prijaté faktúry, prehľady výdavkov a faktúr, pracovný čas a Google Drive. K OfficeFlow možno pripájať ďalších používateľov.

### “Koľko stojí OfficeFlow?”

> Ak vám vyhovuje existujúci funkcional, prevádzka na infraštruktúre ZevsFlow a stačí ľahké prispôsobenie, napríklad vzhľad faktúry alebo výkazu pracovného času, OfficeFlow je dostupný od 7 € mesačne.

### “Kedy potrebujem pilot?”

> Pilot ZevsFlow za 200 € je potrebný, keď chcete vlastný server, širšiu úpravu OfficeFlow, nové integrácie alebo úplne iný firemný proces. Po pilote sa samostatne nacení produkčná implementácia a prevádzka.

### “Musí sa môj asistent volať OfficeFlow?”

> Nie. OfficeFlow je názov existujúceho produktu ZevsFlow. Asistent vytvorený na mieru môže mať názov, ktorý si zvolí zákazník.

### “Stojí OfficeFlow 200 €?”

> Nie. OfficeFlow začína od 7 € mesačne v štandardnom modeli. Suma 200 € je cena pilotu jedného procesu pre riešenie na mieru alebo pre OfficeFlow nasadený mimo štandardného modelu.

### “Nahrádza OfficeFlow účtovníka?”

> Nie. OfficeFlow spracúva a organizuje údaje a podklady v podporovanom rozsahu; nenahrádza odbornú účtovnú ani daňovú zodpovednosť.

---

## 9. Target Route Map

```text
/
├── /officeflow
│   ├── /kontakt#officeflow-standard
│   │   └── OfficeFlow on ZevsFlow infrastructure, from 7 €/month
│   └── /pilot
│       └── own server / broader customization / new integrations
├── /automatizacia-na-mieru
│   └── /pilot
│       └── custom process or custom assistant
├── /kontakt
│   ├── OfficeFlow standard -> explicit email in V1
│   ├── OfficeFlow custom/client-hosted -> /pilot
│   ├── other custom automation -> /pilot
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

The homepage presents ZevsFlow as the company brand for automation and clearly introduces OfficeFlow as the existing product.

Primary actions:

- `Pozrieť OfficeFlow`
- `Automatizácia na mieru`

The `200 €` pilot must not appear as the universal first step for every OfficeFlow customer.

### `/officeflow`

Must explain:

- what OfficeFlow is;
- the seven available functions;
- Telegram and additional-user model;
- ZevsFlow-hosted standard service;
- price from `7 € / mesiac`;
- light configuration examples;
- the boundary that own-server or broader work goes through a ZevsFlow pilot;
- two distinct CTAs:
  - `Chcem OfficeFlow od 7 € mesačne`;
  - `Potrebujem vlastný server alebo širšiu úpravu`.

### `/automatizacia-na-mieru`

Owns:

- custom processes outside OfficeFlow;
- custom assistants;
- custom OfficeFlow-based deployment and integration work;
- one-process pilot for `200 €`;
- production implementation priced separately.

### `/pilot`

Remains the bounded ZevsFlow pilot form.

It may receive requests for:

- a completely custom process;
- a custom assistant;
- OfficeFlow on the customer's server;
- OfficeFlow with broad customization or new integrations.

It is not the OfficeFlow monthly subscription form.

---

## 10. Navigation State Graph

```text
HOME
  -> OFFICEFLOW_INFORMATION
      -> OFFICEFLOW_STANDARD_CONTACT
      -> OFFICEFLOW_CUSTOM_DECISION
          -> ZEVSFLOW_PILOT
  -> CUSTOM_AUTOMATION_INFORMATION
      -> ZEVSFLOW_PILOT
  -> DATA_SECURITY
  -> SUPPORT
```

### Existing pilot form state graph

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

No new persistent FSM, localStorage, cookie, D1, KV, R2, or CRM state is introduced.

---

## 11. Confirmation And Side-Effect Contract

### OfficeFlow standard contact

- explicit visitor action;
- opens a pre-addressed email in V1;
- no automatic submission;
- no payment;
- no contract creation.

### ZevsFlow pilot submission

Preserve the existing contract:

- explicit submit button;
- required privacy acknowledgement;
- valid Turnstile token;
- duplicate submit blocked while submitting;
- stale or failed Turnstile fails closed;
- success only after successful email delivery;
- submission is not an order, contract, invoice, or payment obligation.

### Side effects

| Side effect | Trigger | Owner | Guard |
|---|---|---|---|
| route navigation | explicit link click | browser/Next | valid route |
| OfficeFlow standard email | explicit contact click | browser | user action |
| Turnstile verification | valid pilot submit | Worker | same origin, config, validation |
| pilot email | verified pilot submit | `env.EMAIL.send` | server validation + Turnstile |
| sitemap/metadata update | deploy | Next build | tests |

The redesign must not add payment, file upload, CRM, D1, KV, R2, analytics cookies, or new external processors.

---

## 12. Existing Pilot Slot Contract

Preserve the current fields and validation:

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

The form may be used for OfficeFlow custom/client-hosted work, but not for a normal OfficeFlow standard subscription from `7 € / mesiac`.

---

## 13. Authorization And Precision Boundaries

### Public routes

- unauthenticated and read-only;
- no tenant context;
- no OfficeFlow production-data access;
- no OAuth connection;
- no personal-data collection except the existing pilot form and explicit email contact.

### Existing pilot API

Preserve:

- same-origin POST;
- strict JSON and size limits;
- bounded enums and lengths;
- privacy acknowledgement;
- honeypot;
- server-side Turnstile checks;
- restricted email binding;
- no sensitive body logging;
- no D1/KV/R2 lead storage.

### Pricing precision

The website may say:

- OfficeFlow starts from `7 € / mesiac` on ZevsFlow infrastructure;
- light configuration such as invoice or work-time sheet layout is possible;
- own-server, broader customization, new integrations, or a different process require a ZevsFlow pilot for `200 €`;
- production implementation is priced separately after the pilot.

It must not say:

- every OfficeFlow deployment costs exactly `7 €`;
- every customization is included in `7 €`;
- light layout changes always require a pilot;
- OfficeFlow on the customer's server is included in the standard monthly price;
- every custom assistant is called OfficeFlow;
- the `200 €` pilot is the OfficeFlow subscription price.

---

## 14. Negative Space And Regression Contract

The migration must not:

1. rename the company, domain, repository, or ZevsFlow brand;
2. call ZevsFlow itself the OfficeFlow bot;
3. describe every assistant built by ZevsFlow as OfficeFlow;
4. hide that OfficeFlow is the owner's existing Telegram bot/product;
5. hide that additional users can be connected to OfficeFlow;
6. hide or contradict `OfficeFlow od 7 € mesačne`;
7. route every OfficeFlow lead automatically to the pilot;
8. claim that light invoice/work-time layout configuration always requires a pilot;
9. claim that own-server deployment is included in the standard OfficeFlow monthly price;
10. limit the pilot only to processes unrelated to OfficeFlow;
11. apply the `200 €` pilot price as the OfficeFlow monthly price;
12. force the OfficeFlow name on a custom client assistant;
13. mark the seven approved capabilities as partial or experimental;
14. publish unresolved functions as available;
15. weaken Turnstile, validation, email, or fail-closed behavior;
16. add payment, file upload, CRM, D1, KV, or R2 lead storage;
17. remove legal or Google-data routes;
18. break canonical `.sk` URLs or `.eu` redirects;
19. omit `/officeflow` or `/kontakt` from sitemap and route tests;
20. reset or overwrite local commit `3a551dd...`;
21. preserve tests that contradict actual indexing configuration;
22. invent testimonials, customer counts, savings, or guarantees;
23. modify OfficeFlow/FakturaBot runtime code.

### Known remote inconsistency

Remote `main` currently has `PUBLIC_INDEXING_ENABLED = true`, while rendered tests still expect `noindex, nofollow` and `Disallow: /`.

The local commit may already fix this. It must be inspected before changing tests.

---

## 15. Acceptance Scenarios

### A1 — Standard OfficeFlow fit

**Input:** customer wants invoices, receipts, incoming invoices, analytics, work time, and Google Drive.  
**Conditions:** ZevsFlow-hosted operation is acceptable and only light configuration is needed.  
**Expected:** offer OfficeFlow from `7 € / mesiac`.  
**Must not:** force the customer into the pilot.

### A2 — Light OfficeFlow configuration

**Input:** customer wants a different invoice layout or work-time sheet layout.  
**Expected:** explain that light configuration is possible within the OfficeFlow standard model.  
**Must not:** automatically classify it as broad custom work.

### A3 — OfficeFlow on customer server

**Input:** customer wants the same OfficeFlow functions on their own server.  
**Expected:** route to ZevsFlow pilot for `200 €`; implementation priced separately.  
**Must not:** promise the `7 €` standard plan.

### A4 — OfficeFlow broad extension

**Input:** customer wants new integrations or major functional changes.  
**Expected:** route to ZevsFlow pilot.  
**Must not:** claim all changes are included in the monthly price.

### A5 — Distinct custom process

**Input:** `Potrebujem automatizovať prijímanie objednávok z troch systémov.`  
**Expected:** explain that this is ZevsFlow custom automation, offer the `200 €` pilot, and explain separate production pricing.  
**Must not:** call it a standard OfficeFlow function.

### A6 — Customer-selected assistant name

**Input:** customer wants a custom assistant with their own name.  
**Expected:** allow any customer-selected name.  
**Must not:** require the name OfficeFlow.

### A7 — OfficeFlow route

`/officeflow` returns `200`, shows seven available functions, Telegram/additional-user model, price from `7 € / mesiac`, light customization boundary, and both standard/custom CTAs.

### A8 — Pilot happy path

Valid form + privacy + valid Turnstile sends exactly one email and shows success only after delivery.

### A9 — Pilot invalid input

No email; field errors are shown and values remain available for correction.

### A10 — Stale Turnstile

No email; safe error and reset.

### A11 — SEO coverage

`/officeflow` and `/kontakt` have canonical metadata, appear in sitemap, and are covered by rendered-route tests.

### A12 — Indexing consistency

When `PUBLIC_INDEXING_ENABLED = true`, metadata, robots, and tests all expect index/follow and crawling.

### A13 — Local commit preservation

Implementation starts from and preserves `3a551dd...`; no hard reset or silent overwrite occurs.

### A14 — Demo preservation

The current non-autoplay demo remains accessible and is recontextualized as OfficeFlow product evidence.

### A15 — Mobile navigation

OfficeFlow standard, OfficeFlow custom, general custom automation, and support paths remain reachable on a narrow viewport.

---

## 16. Out Of Scope

- OfficeFlow/FakturaBot runtime changes;
- new Telegram actions or FSMs;
- payment and subscription billing implementation;
- user onboarding implementation;
- new OfficeFlow contact API;
- CRM or lead database;
- Google OAuth changes;
- Cloudflare email or Turnstile changes;
- DNS/domain changes;
- analytics/cookie system;
- unsupported testimonials or case studies;
- final legal review;
- exact tariff matrix beyond `od 7 € / mesiac`;
- exact production implementation price after pilot.

### Unresolved Product Truth

The following require explicit owner approval or repository evidence before public publication:

- bank-statement availability;
- Gmail intake as a customer-facing OfficeFlow function;
- monthly closing preparation boundary;
- annual closing preparation boundary;
- WhatsApp support;
- cashflow, VAT, tax, or full-accounting analytics.

---

## 17. Evidence Index

### Remote repository evidence

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

### Product-owner statements approved in conversation

- ZevsFlow is the custom automation brand and delivery model;
- OfficeFlow is the owner's existing Telegram bot/product;
- additional users can be connected to OfficeFlow;
- the seven listed OfficeFlow capabilities already work;
- standard OfficeFlow on ZevsFlow infrastructure starts from `7 € / mesiac`;
- light configuration such as invoice and work-time sheet layouts is possible in the standard model;
- OfficeFlow on the customer's server or with broad changes routes through a ZevsFlow pilot;
- a custom client assistant may use any customer-selected name;
- the `200 €` pilot covers one bounded custom process;
- local commit `3a551dd...` is clean and must be preserved.

---

## Architecture Review Gate

This proof is **not yet `ready_for_handoff`**.

It may become `ready_for_handoff` only after:

1. product-owner approval of this corrected OfficeFlow/ZevsFlow commercial boundary;
2. inspection and reconciliation of local commit `3a551dd...`;
3. explicit resolution or exclusion of bank statements, closing preparation, Gmail, and WhatsApp wording;
4. approval of the V1 contact mechanism;
5. reconciliation of the indexing-test contradiction.

After approval, create:

`docs/specs/ZEVSFLOW_SITE_ARCHITECTURE_INTEGRATION_SPEC.md`

Only after that specification is approved may an implementation prompt be written.
