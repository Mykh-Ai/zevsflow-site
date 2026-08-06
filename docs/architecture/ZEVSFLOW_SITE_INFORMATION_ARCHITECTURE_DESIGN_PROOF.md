# ZevsFlow Site Information Architecture V1 — Architecture Design Proof

**Verdict:** `needs_architecture_revision`

**Task:** `ZEVSFLOW_SITE_INFORMATION_ARCHITECTURE_V1`  
**Repository:** `Mykh-Ai/zevsflow-site`  
**Date:** 2026-07-27

---

## 1. Product Need

The current website mixes three entities and two delivery models:

1. **Zevs s. r. o.** — legal operator and contracting company;
2. **ZevsFlow** — brand and delivery model for custom business-process automation;
3. **OfficeFlow** — the owner's existing Telegram assistant/product, to which additional users can be connected.

### Canonical commercial model

**OfficeFlow standard**

- runs on ZevsFlow infrastructure;
- uses the existing OfficeFlow functional core;
- may include light configuration such as invoice layout, work-time-sheet layout, company data and basic presentation settings;
- starts from `7 € / mesiac` when the existing functionality is sufficient;
- is not a `200 €` pilot.

**ZevsFlow custom project**

A bounded ZevsFlow pilot for `200 €` is the correct route when the customer requires:

- their own server;
- broader OfficeFlow changes;
- new integrations;
- a process outside the OfficeFlow standard core;
- custom architecture or security boundaries;
- a separately designed assistant.

Production implementation and operation are priced separately after the pilot. A custom assistant may use a customer-selected name. The name **OfficeFlow** identifies the owner's existing product, not every assistant delivered by ZevsFlow.

### User-visible outcome

A visitor must understand:

- what ZevsFlow is;
- what OfficeFlow is;
- which OfficeFlow business workflows already work;
- when OfficeFlow standard from `7 € / mesiac` is suitable;
- what light configuration can remain in the standard model;
- when a request becomes a ZevsFlow custom project;
- that `200 €` is a pilot price, not the OfficeFlow monthly price;
- that Google Drive is an optional storage/archive integration, not a business workflow;
- where to go for support and data/security information.

### Risk

`medium-high` because the site is public and indexed, commercial wording changes, and the existing pilot form has an external email side effect.

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
3. determine whether it changes indexing, metadata, robots, sitemap, tests, Cloudflare config, routes or homepage copy;
4. preserve its intent;
5. never hard-reset, overwrite or silently drop it.

No implementation handoff may claim a complete read-only audit until this reconciliation is performed.

---

## 3. Architecture Classification

This is a material redesign of public website information architecture and conversion routing.

It is **not** a new OfficeFlow/FakturaBot top-level action, FSM, callback or Telegram runtime flow. It changes only the marketing website and preserves the existing bounded pilot form.

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

Learn about the existing OfficeFlow Telegram product, available business workflows, ZevsFlow-hosted standard model, price from `7 € / mesiac`, light-configuration boundary and storage options.

**Owner:** `/officeflow`  
**Side effect:** none

### `request_officeflow_standard`

Express interest in using the existing OfficeFlow product on ZevsFlow infrastructure.

**Correct when:**

- the existing functional core is sufficient;
- only light configuration is needed;
- ZevsFlow-hosted operation is acceptable.

**Owner:** `/kontakt#officeflow-standard`  
**V1 side effect:** explicit user-clicked email only

### `explore_zevsflow_custom`

Learn about custom automation services, including custom processes and custom OfficeFlow-based deployments.

**Owner:** `/automatizacia-na-mieru`  
**Side effect:** none

### `request_custom_pilot`

Submit a non-binding request for one bounded ZevsFlow pilot for `200 €`.

This action covers:

1. a process outside the OfficeFlow standard core;
2. OfficeFlow on the customer's own server;
3. broader OfficeFlow customization, new integrations or custom architecture;
4. a separately designed assistant that may use the customer's chosen name.

**Owner:** `/pilot` and the existing Worker API  
**Side effect:** one validated email after server-side checks

### `request_support`

Open existing support information.

**Owner:** `/support`

---

## 5. Semantic Boundary Matrix

| User meaning / example | Correct answer or route | Why | Must not become |
|---|---|---|---|
| “Chcem hotového asistenta na faktúry, bločky a pracovný čas.” | Offer OfficeFlow from `7 € / mesiac` if ZevsFlow hosting, existing functions and light configuration are sufficient | Existing OfficeFlow product | automatic custom pilot |
| The same customer requires their own server | ZevsFlow custom pilot | Hosting and architecture boundary changes | `7 €` standard promise |
| The same customer needs major new functions or integrations | ZevsFlow custom pilot | Request exceeds standard/light configuration | claim that everything is included in the monthly price |
| “Potrebujem automatizovať prijímanie objednávok z troch systémov.” | ZevsFlow custom pilot | Distinct cross-system process | OfficeFlow feature claim |
| “Ako funguje váš produkt?” | `/officeflow` | Product information | pilot submission |
| “Čo viete automatizovať na mieru?” | `/automatizacia-na-mieru` | Service information | OfficeFlow-only route |
| “Koľko stojí OfficeFlow?” | Explain `od 7 € mesačne` with ZevsFlow hosting, existing functions and light configuration | Approved standard boundary | `200 €` pilot price |
| “Chcem vlastný server.” | ZevsFlow custom pilot | Client-hosted deployment is project work | standard monthly plan |
| “Kde sa ukladajú moje dokumenty?” | Explain OfficeFlow system storage first; Google Drive may be an additional configured archive | Drive is storage/integration, not workflow | list Drive beside invoices or work time |
| “Mám problém s už nasadeným riešením.” | `/support` | Existing-client support | new-sales lead |
| “Zatvorte mi účtovníctvo za rok.” | Boundary explanation | OfficeFlow is not an accountant | guaranteed capability |
| “Spracúvate bankové výpisy?” | Only approved current-status wording | Availability not approved here | claim that it is already available |

### Required answer — custom process

**Question:** `Potrebujem automatizovať prijímanie objednávok z troch systémov.`

> Prijímanie objednávok z troch systémov nie je štandardná funkcia OfficeFlow. Ide o automatizáciu na mieru cez ZevsFlow.
>
> Najskôr v pilote za 200 € overíme jeden presne ohraničený proces: z ktorých systémov objednávky prichádzajú, aké údaje treba prevziať, ako ich zjednotiť, ktoré výnimky musí riešiť človek a aký má byť výsledok.
>
> Ak sa riešenie potvrdí, produkčná implementácia, integrácie a prevádzka sa nacenia podľa skutočného rozsahu. Výsledný asistent môže mať vlastný názov a fungovať v infraštruktúre klienta alebo v dohodnutom spravovanom prostredí.

### Required answer — document storage

**Question:** `Kde sa ukladajú moje dokumenty?`

> Dokumenty a ich údaje sa ukladajú v systéme OfficeFlow. Pri dohodnutom a nakonfigurovanom nastavení možno potvrdené doklady a vybrané faktúry zároveň archivovať na Google Drive.
>
> Google Drive je doplnkový spôsob archivácie. Lokálne uloženie dokumentu samo osebe neznamená, že bol upload na Google Drive už úspešne dokončený.

---

## 6. Structured Decision Slots

| Slot | Allowed values | Meaning | Boundary |
|---|---|---|---|
| `solutionType` | `officeflow_standard`, `officeflow_custom`, `custom_assistant`, `support`, `data_security` | requested commercial path | never infer a write side effect |
| `hostingModel` | `zevsflow_hosted`, `client_hosted`, `unknown` | where the assistant runs | `client_hosted` routes to custom pilot |
| `customizationLevel` | `none`, `light`, `broad`, `unknown` | degree of requested change | `light` may remain standard; `broad` routes to pilot |
| `capabilityFit` | `standard_fit`, `outside_standard`, `unknown` | whether existing OfficeFlow functions are enough | outside standard routes to pilot |
| `storageModel` | `officeflow_system`, `google_drive_archive`, `unknown` | storage/archive option | Drive must not be treated as a workflow |
| `contactTopic` | `officeflow_standard`, `officeflow_custom`, `custom_process`, `support` | contact decision | no automatic submission |

### Resolution order

1. Does the request fit the existing OfficeFlow functional core?
2. Is ZevsFlow-hosted operation acceptable?
3. Is only light configuration needed?
4. If all three are true, route to OfficeFlow standard from `7 € / mesiac`.
5. If any answer is no, route to the ZevsFlow custom pilot.
6. Explain document storage separately from business functions.

### Existing pilot form slots

Preserve:

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

OfficeFlow standard interest must not be silently forced into one-custom-process slots.

---

## 7. OfficeFlow Product Truth

OfficeFlow is:

- the owner's existing Telegram bot/product;
- able to connect additional users;
- operated on ZevsFlow infrastructure in the standard model;
- available from `7 € / mesiac` when the existing core is sufficient;
- compatible with light configuration such as invoice and work-time-sheet layouts;
- not the generic name for every assistant built by ZevsFlow.

### Approved business workflows

These six business workflows already work and must not be labelled `partial`, `MVP`, `limited`, `planned` or `experimental` in public marketing copy:

1. outgoing invoices;
2. receipts (`bločky`);
3. incoming invoices;
4. invoice analytics;
5. expense analytics;
6. work-time tracking.

### Document storage and Google Drive

Google Drive is **not** a seventh business workflow.

Its correct public role is:

- documents and their data are stored in the OfficeFlow system;
- with an agreed, enabled and configured integration, confirmed accounting documents and selected invoices may additionally be archived on Google Drive;
- Drive upload is a separate setup/integration concern;
- local save does not prove successful Drive upload;
- the public site must not imply universal, automatic or per-client Drive availability unless the deployment proves it.

This matches current InfoHelp/Product Truth framing: Google Drive is a setup-dependent archive integration, uploads are asynchronous, and successful local save is not evidence of successful upload.

### Light configuration within OfficeFlow standard

Public copy may mention:

- invoice layout;
- work-time-sheet layout;
- company details;
- basic presentation settings.

It must not promise that every template change, integration, business rule or workflow extension is included in `7 € / mesiac`.

### Custom boundary

The request becomes a ZevsFlow custom project when it requires:

- the customer's own server;
- new integrations;
- a new process outside the standard core;
- major functional extension;
- custom architecture or security model;
- a separately designed assistant.

A custom assistant may be named by the customer. This is an internal architecture/naming boundary, **not a prominent public FAQ question**.

### Unresolved public claims

Do not publish as available without explicit approval:

- bank statements;
- Gmail intake as an OfficeFlow product feature;
- monthly closing preparation;
- annual closing preparation;
- WhatsApp as a current OfficeFlow channel;
- cashflow, VAT, tax or full-accounting analytics.

---

## 8. Safe Public Answers

### “Čo je OfficeFlow?”

> OfficeFlow je Telegram asistent pre faktúry, bločky, prijaté faktúry, prehľady výdavkov a faktúr a evidenciu pracovného času. K OfficeFlow možno pripájať ďalších používateľov.

### “Čo už OfficeFlow vie?”

> Vie pracovať s vystavenými faktúrami, bločkami a prijatými faktúrami, pripravovať prehľady faktúr a výdavkov a evidovať pracovný čas.

### “Koľko stojí OfficeFlow?”

> Ak vám vyhovuje existujúci funkcional, prevádzka na infraštruktúre ZevsFlow a stačí ľahké prispôsobenie, napríklad vzhľad faktúry alebo výkazu pracovného času, OfficeFlow je dostupný od 7 € mesačne.

### “Kedy potrebujem pilot?”

> Pilot ZevsFlow za 200 € je potrebný, keď chcete vlastný server, širšiu úpravu OfficeFlow, nové integrácie alebo úplne iný firemný proces. Po pilote sa samostatne nacení produkčná implementácia a prevádzka.

### “Kde sa ukladajú moje dokumenty?”

> Dokumenty a ich údaje sa ukladajú v systéme OfficeFlow. Pri dohodnutom a nakonfigurovanom nastavení možno potvrdené doklady a vybrané faktúry zároveň archivovať na Google Drive.

### “Stojí OfficeFlow 200 €?”

> Nie. OfficeFlow začína od 7 € mesačne v štandardnom modeli. Suma 200 € je cena pilotu jedného procesu pre riešenie na mieru alebo pre OfficeFlow nasadený mimo štandardného modelu.

### “Nahrádza OfficeFlow účtovníka?”

> Nie. OfficeFlow spracúva a organizuje údaje a podklady v podporovanom rozsahu; nenahrádza odbornú účtovnú ani daňovú zodpovednosť.

The public FAQ must not contain the artificial architecture question `Musí sa môj asistent volať OfficeFlow?`. The customer-selected-name rule remains in Product Truth and negative space only.

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

### Homepage

Primary actions:

- `Pozrieť OfficeFlow`
- `Automatizácia na mieru`

The `200 €` pilot must not be the universal first action for every OfficeFlow customer.

### `/officeflow`

Must explain:

- what OfficeFlow is;
- the six available business workflows;
- Telegram and additional-user model;
- ZevsFlow-hosted standard service;
- price from `7 € / mesiac`;
- light configuration examples;
- storage in OfficeFlow and optional configured Drive archive;
- own-server/broader work goes through a ZevsFlow pilot;
- two distinct CTAs:
  - `Chcem OfficeFlow od 7 € mesačne`;
  - `Potrebujem vlastný server alebo širšiu úpravu`.

### `/automatizacia-na-mieru`

Owns:

- custom processes outside or beyond OfficeFlow;
- OfficeFlow-based client-hosted/custom deployments;
- one-process method;
- pilot for `200 €`;
- production implementation priced separately.

### `/pilot`

Remains the bounded custom-project pilot form. It is not an OfficeFlow standard order form.

### `/kontakt`

Decision hub:

- OfficeFlow standard -> explicit email;
- OfficeFlow custom/client-hosted -> `/pilot`;
- other custom automation -> `/pilot`;
- existing client -> `/support`.

---

## 10. State Graph And Ownership

```text
HOME
  -> OFFICEFLOW_INFORMATION
      -> OFFICEFLOW_STANDARD_CONTACT
      -> ZEVSFLOW_CUSTOM_PILOT
  -> CUSTOM_AUTOMATION_INFORMATION
      -> ZEVSFLOW_CUSTOM_PILOT
          -> PILOT_FORM
  -> DATA_SECURITY
  -> SUPPORT
```

Existing pilot-form states remain:

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

---

## 11. Confirmation, Callback And Side-Effect Contract

### Route decisions

Normal links only. Repeated navigation is safe and has no write side effect.

### OfficeFlow standard contact

An explicit visitor click opens a pre-addressed email. No automatic submission occurs.

### Pilot submission

Preserve:

- explicit submit button;
- privacy acknowledgement;
- valid Turnstile token;
- duplicate submit blocked while submitting;
- stale/failed Turnstile fails closed;
- success only after successful email delivery;
- submission is not an order, contract, invoice or payment obligation.

### Side effects

| Side effect | Trigger | Owner | Guard |
|---|---|---|---|
| route navigation | link click | browser/Next | valid href |
| OfficeFlow email client | explicit contact click | browser | user action |
| Turnstile verification | valid pilot submit | Worker | same origin, config, validation |
| pilot email | verified pilot submit | `env.EMAIL.send` | server validation + Turnstile |
| sitemap/metadata update | deploy | Next build | tests |

The redesign must not add payment, file upload, lead database, CRM writes, analytics cookies or new external processors.

---

## 12. Authorization And Precision Boundaries

### Public routes

- unauthenticated and read-only;
- no tenant context;
- no OfficeFlow production-data access;
- no OAuth connection;
- no personal-data collection on new information routes in V1.

### Existing pilot API

Preserve:

- same-origin POST;
- strict JSON and size limits;
- bounded enums and lengths;
- privacy acknowledgement;
- honeypot;
- server-side Turnstile action and hostname checks;
- restricted email binding;
- no sensitive-body logging;
- no D1/KV/R2 lead storage.

### Pricing precision

The site may say:

- OfficeFlow standard `od 7 € mesačne` when existing functions, ZevsFlow hosting and light configuration are sufficient;
- own-server, broad customization, new integrations and other custom processes go through the `200 €` pilot;
- production implementation is priced separately.

It must not say:

- every OfficeFlow deployment costs exactly `7 €`;
- every customization is included in `7 €`;
- OfficeFlow standard costs `200 €`;
- `Implementácia od 750 €` is automatically the OfficeFlow standard price.

---

## 13. Negative Space And Regression Contract

The migration must not:

1. rename the company, domain, repository or ZevsFlow brand;
2. turn the homepage into an OfficeFlow-only landing page;
3. keep calling ZevsFlow itself the product assistant;
4. hide OfficeFlow as merely a generic example;
5. send every OfficeFlow prospect directly to the custom pilot;
6. apply the `200 €` pilot price to OfficeFlow standard;
7. hide or contradict `OfficeFlow od 7 € mesačne` for the standard model;
8. imply that `7 €` includes own-server deployment, every customization, every integration or every non-standard feature;
9. apply `Implementácia od 750 €` automatically as the OfficeFlow standard price;
10. list Google Drive beside invoices, analytics or work time as if it were a business workflow;
11. imply local save proves successful Drive upload;
12. imply universal or per-client Drive availability without setup/deployment evidence;
13. mark the six approved business workflows as partial or experimental in public copy;
14. publish bank statements or closing preparation as available without approval;
15. promise WhatsApp as a current OfficeFlow channel without evidence;
16. weaken Turnstile, validation, email or fail-closed behavior;
17. add payment, file upload, CRM, D1, KV or R2 lead storage;
18. remove legal or Google-data routes;
19. break canonical `.sk` URLs or `.eu` redirects;
20. disable indexing without an explicit rollback decision;
21. omit `/officeflow` or `/kontakt` from sitemap and route tests;
22. reset or overwrite local commit `3a551dd...`;
23. preserve tests that contradict actual indexing configuration;
24. invent testimonials, customer counts, savings or guarantees;
25. modify OfficeFlow/FakturaBot runtime code;
26. expose the internal naming boundary as a prominent FAQ such as `Musí sa môj asistent volať OfficeFlow?`.

### Known remote inconsistency

Remote `main` has `PUBLIC_INDEXING_ENABLED = true`, while rendered tests still expect `noindex, nofollow` and `Disallow: /`.

The local commit may already fix this. Inspect it before changing tests.

---

## 14. Acceptance Scenarios

### A1 — Brand hierarchy

Opening `/` clearly distinguishes ZevsFlow custom delivery from OfficeFlow standard.

### A2 — OfficeFlow workflows

`/officeflow` shows six approved business workflows as available. Google Drive appears separately under storage/integrations.

### A3 — OfficeFlow standard price

`/officeflow` states `od 7 € mesačne` and explains ZevsFlow hosting plus light-configuration boundaries.

### A4 — Standard contact

`Chcem OfficeFlow od 7 € mesačne` routes to `/kontakt#officeflow-standard`, not the pilot form.

### A5 — Client-hosted/custom OfficeFlow

`Potrebujem vlastný server alebo širšiu úpravu` routes to `/pilot`.

### A6 — Custom process

An order-intake process from three systems routes to the ZevsFlow pilot and is not claimed as an OfficeFlow feature.

### A7 — Storage explanation

A storage question explains OfficeFlow system storage first and Drive as an optional configured archive. It does not claim that every local save is already uploaded.

### A8 — Public FAQ quality

The public FAQ contains real customer questions. The artificial naming question is absent.

### A9 — Pilot happy path

Valid form + privacy + valid Turnstile sends exactly one email and shows success only after delivery.

### A10 — Pilot invalid input

No email; field errors are shown and values remain available for correction.

### A11 — Stale Turnstile

No email; safe error and reset.

### A12 — Support separation

Existing-client technical issues route to `/support`, not sales.

### A13 — Unsupported accounting claim

Full closing or tax filing receives a boundary explanation, not a guaranteed capability claim.

### A14 — SEO coverage

`/officeflow` and `/kontakt` have canonical metadata, appear in sitemap and are covered by rendered-route tests.

### A15 — Indexing consistency

When indexing is enabled, metadata, robots and tests consistently expect index/follow and crawling.

### A16 — Local commit preservation

Implementation inspects and preserves `3a551dd...`; no hard reset or silent overwrite occurs.

### A17 — Demo preservation

The existing user-controlled non-autoplay demo remains available and is contextualized as OfficeFlow evidence.

### A18 — Mobile navigation

Product, custom service and primary CTAs remain reachable without horizontal overflow.

---

## 15. Out Of Scope And Known Gaps

Out of scope:

- OfficeFlow/FakturaBot runtime changes;
- new bot actions or FSMs;
- new OfficeFlow contact API;
- CRM or lead database;
- payment/subscription billing implementation;
- Google OAuth changes;
- Cloudflare email or Turnstile changes;
- DNS/domain changes;
- analytics/cookie system;
- unsupported testimonials or case studies;
- final legal review;
- tariff matrix beyond the approved `od 7 € / mesiac` statement;
- pricing of production implementation and non-standard work.

Still unresolved for public publication:

- bank-statement availability;
- Gmail intake as a customer-facing function;
- monthly/annual closing preparation boundary;
- WhatsApp support;
- cashflow, VAT, tax or full-accounting analytics;
- final V1 contact mechanism approval;
- local commit reconciliation.

---

## 16. Evidence Index

### Mandatory contract

- `Top_Level_Subflow_Architecture_Design_Proof_Contract.md`

### Site repository evidence

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

### Ai_assistant evidence for Google Drive framing

- `docs/Info_Help_Guidance_Layer.md`
  - treats Drive as a separate storage/capability question;
- `docs/Product_Truth_Layer.md`
  - classifies Drive under the `google_drive` integration domain and requires setup/external credentials;
- `bot/services/product_truth.py`
  - describes partial owner-OAuth document archival, asynchronous upload and setup requirements;
- `bot/services/info_help.py`
  - states that local save does not prove Drive upload success and presents Drive as archival rather than a business workflow.

### Product-owner-approved facts

- OfficeFlow is the owner's existing Telegram product;
- additional users can be connected;
- six business workflows are available;
- light layout customization may remain in the standard model;
- standard hosted use starts from `7 € / mesiac`;
- own server, broader changes, new integrations and other processes route through the `200 €` ZevsFlow pilot;
- Google Drive is a storage/archive option, not a business workflow;
- a custom assistant may use a customer-selected name, but that is not a public FAQ topic;
- local commit `3a551dd...` is clean and must be preserved.

---

## Architecture Review Gate

This proof is **not yet `ready_for_handoff`**.

It may become `ready_for_handoff` only after:

1. product-owner approval of the route and commercial separation;
2. inspection and reconciliation of local commit `3a551dd...`;
3. resolution or explicit exclusion of bank statements, closing preparation, Gmail and WhatsApp wording;
4. approval of the V1 OfficeFlow contact mechanism;
5. approval of the separate storage/Google Drive wording;
6. reconciliation of the indexing-test contradiction.

After approval, create:

`docs/specs/ZEVSFLOW_SITE_ARCHITECTURE_INTEGRATION_SPEC.md`

Only after that specification is approved may an implementation prompt be written.
