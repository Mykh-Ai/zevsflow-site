# Public Pilot Application Flow — Architecture Design Proof

Verdict: ready_for_handoff

## 1. Task Identity And Product Need

Task id / name: `PUBLIC_PILOT_APPLICATION_FLOW`

Business need: ZevsFlow needs a clear conversion path from the marketing site to a structured request for a paid one-process pilot. The current home-page CTA only scrolls to a generic email contact, while the `200 €` pilot and `Implementácia od 750 €` information are available only on the deeper custom-automation page.

User-visible outcome: A visitor can open `/pilot`, read the exact pilot scope and price, complete a short structured questionnaire, pass anti-bot verification, and submit the request to Zevs s. r. o. The request does not create an order, contract, invoice, or payment obligation.

Current Product Truth status: partial. The existing site states `Platený pilot · 200 €` and `Implementácia · od 750 €`, but has no structured application flow.

Target Product Truth status: implemented for structured pilot applications, subject to Cloudflare production bindings and live delivery verification. The public site truthfully states that the pilot costs exactly `200 €`, Zevs s. r. o. is not a VAT payer, and a later implementation starts from `750 €`.

Risk level: medium. The flow accepts personal/contact data and triggers an external email side effect, but accepts no files, credentials, payments, or destructive actions.

Architect: ChatGPT / GPT-5.6 Thinking

Date: 2026-07-26

Approval: The requester explicitly approved implementation after approving the price, the continued `Implementácia od 750 €` statement, and the Cloudflare-owned submission route.

## 2. Architecture Classification

Chosen class: multi-step public website subflow with a server-side side effect.

Why this is not a new bot top-level action: The flow belongs to the ZevsFlow marketing website, not OfficeFlow / FakturaBot runtime routing. It does not create a Telegram/WhatsApp canonical action, FSM token, or bounded LLM route.

Existing flow extended: public marketing CTA and the existing custom-automation offer page.

Existing runtime owner:

- `app/page.tsx::Home` — current homepage CTA and offer context.
- `app/automatizacia-na-mieru/page.tsx::CustomAutomationPage` — current `200 €` pilot and `od 750 €` implementation statements.
- `worker/index.ts::worker.fetch` — Cloudflare Worker request entry point.

Evidence:

- `app/page.tsx` — current `Prebrať môj proces` and generic mail CTA.
- `app/automatizacia-na-mieru/page.tsx` — current sales sequence with `Platený pilot · 200 €` and `Implementácia · od 750 €`.
- `worker/index.ts` — all requests pass through one Cloudflare Worker before the vinext router.

## 3. Canonical Action Contract

This website flow does not add a bot canonical action token.

Public website action: `submit_pilot_application`

Status after implementation: implemented, but operationally enabled only when required Cloudflare bindings/secrets are present.

Plain-language meaning: Submit a non-binding request to discuss a paid ZevsFlow pilot for one clearly bounded business process.

Runtime owner: `worker/pilot-application.ts::handlePilotApplicationRequest`.

Entry modes:

- link/button from homepage;
- link/button from site header;
- link/button from `/automatizacia-na-mieru`;
- direct navigation to `/pilot`;
- form submit from `/pilot`.

Not supported:

- voice input;
- bot commands;
- file uploads;
- payment;
- automatic contract/order creation.

## 4. Semantic Boundary Matrix

| User meaning / example | Expected action | Why | Must not become |
|---|---|---|---|
| “Chcem pilot pre spracovanie bločkov.” | Open `/pilot`, submit application | Clear commercial request for the bounded pilot | Technical support request |
| “Koľko stojí pilot?” | Read-only price information | Informational question | Form submission |
| “Mám problém s existujúcim riešením.” | `/support` | Existing customer/support need | New pilot application |
| “Pošlem vám faktúry a zmluvy.” | Explain that the public form accepts no files | Sensitive data is out of scope before agreement | File upload/storage |
| “Objednávam a platím 200 €.” | Clarify that submission is non-binding | No payment or contract exists on the site | Automatic order/invoice/payment |
| “Chcem kompletnú implementáciu.” | Pilot request or individual contact, with `od 750 €` context | Full implementation requires scoping | Promise of fixed `750 €` total |
| Empty or vague process description | Validation error, remain in form | Missing bounded business need | Email side effect |

Ambiguous action hint:

- meaning: Visitor has not described a concrete repeatable process.
- positive examples: “Každý týždeň prepisujeme hodiny pracovníkov z WhatsAppu do tabuľky.”
- not_this: “Chcem AI pre firmu.”

## 5. Structured Slot Contract

| Slot | Type / allowed values | Source | Required | Default owner | Invalid behavior | Precision boundary |
|---|---|---|---|---|---|---|
| `businessType` | `szco`, `sro`, `other` | HTML select | yes | none | field error | exact enum |
| `companyName` | trimmed text, max 120 | visitor | no | empty | field error if too long | no registry lookup |
| `industry` | text, 2–120 | visitor | yes | none | field error | plain text only |
| `processType` | bounded enum | HTML select | yes | none | field error | exact enum |
| `processDescription` | text, 20–2000 | visitor | yes | none | field error | no files/HTML |
| `currentMethod` | text, max 1200 | visitor | no | empty | field error | no files/HTML |
| `expectedResult` | text, 10–1200 | visitor | yes | none | field error | no files/HTML |
| `contactName` | text, 2–120 | visitor | yes | none | field error | plain text |
| `email` | valid email, max 254 | visitor | yes | none | field error | reply address only |
| `phone` | text, max 80 | visitor | no | empty | field error | no phone validation claim |
| `privacyAccepted` | boolean `true` | checkbox | yes | false | field error | explicit acceptance required |
| `turnstileToken` | string, 1–2048 | Turnstile widget | yes | none | fail closed | server validated, single-use |
| `website` | honeypot, must be empty | hidden field | no | empty | return neutral accepted response with no email | bots only |

Validation owner: deterministic Worker code. No LLM, STT, or inference is used.

## 6. Public Route And Convergence Map

| Entry mode | Public entry | Guards before business logic | Resolver/helper | Shared owner | Result |
|---|---|---|---|---|---|
| homepage button | `/pilot` | none | Next route | `/pilot` page | form page |
| header button | `/pilot` | none | Next route | `/pilot` page | form page |
| custom automation CTA | `/pilot` | none | Next route | `/pilot` page | form page |
| config request | `GET /api/pilot-config` | method/path | Worker router | config handler | enabled/site key or disabled |
| form submit | `POST /api/pilot-application` | method, body size, content type, origin, config, validation, Turnstile | deterministic validator | application handler | email sent or explicit error |
| direct email fallback | `mailto:info@zevsflow.sk` | user-controlled email client | none | Email Routing to Gmail mailbox | manual contact |

Public routing happens once in `worker.fetch`: API paths are intercepted; all other routes converge to the existing vinext handler.

## 7. FSM Graph And State Ownership

This is not a persistent server FSM. The browser component owns a bounded ephemeral UI state machine.

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

| State | Entry condition | Accepted inputs | Unknown behavior | Side effects allowed | Success state | Back/cancel | Stale behavior |
|---|---|---|---|---|---|---|---|
| `LOADING_CONFIG` | page mounted | none | wait | none | `READY` or `UNAVAILABLE` | normal navigation | refetch on reload |
| `UNAVAILABLE` | missing production binding/key | email fallback | none | user may open mail client | terminal/manual | normal navigation | reload after config |
| `READY` | config loaded, Turnstile rendered | form edit/submit | field error | none before valid submit | `SUBMITTING` | normal navigation | expired token resets widget |
| `VALIDATION_ERROR` | client/server validation failure | corrected fields | preserve data | none | `READY` | normal navigation | no persisted state |
| `SUBMITTING` | one valid submit attempt | no second submit | button disabled | Turnstile validation and email send | `SUCCESS` | no duplicate action | request timeout/error returns to `READY` |
| `SUCCESS` | email binding confirms send | start another request or leave | none | none | terminal | normal navigation | reload returns empty form |
| `DELIVERY_ERROR` | temporary/config/email failure | retry or email fallback | preserve fields | no additional effect until retry | `READY` | normal navigation | Turnstile reset required |

No form content is persisted in local storage, D1, KV, R2, cookies, or server application storage.

## 8. Decision, Confirmation, And Callback Contract

There is no business confirmation callback. The submit button is the explicit user decision.

Decision family: submit/non-submit.

Canonical outputs:

- submit validated application;
- remain in form;
- use direct email fallback;
- navigate away.

Button token: ordinary HTML submit action.

Context required: valid form, privacy acceptance, valid Turnstile token, enabled server configuration.

Expiry: Turnstile tokens expire after five minutes and are single-use.

Idempotency behavior:

- the UI disables duplicate submit while a request is in flight;
- Turnstile rejects token replay;
- no automatic retry after a successful email send;
- a visitor may intentionally submit a new application with a new token.

Wrong-state/stale behavior: missing, expired, duplicated, or invalid Turnstile tokens fail closed with no email.

## 9. Side-Effect And Ownership Map

| Side effect | Trigger | Python/JS owner | Validation before effect | Rollback / fail-safe | Idempotency |
|---|---|---|---|---|---|
| Turnstile Siteverify call | valid local form | Worker handler | config, origin, body, fields | no email on failure | single-use token |
| email to company Gmail | successful Turnstile validation | `env.EMAIL.send` | all slots, Turnstile action/hostname | safe error, no application DB write | UI lock + token replay protection |
| form reset | successful API response | browser component | confirmed send response | not reset on failure | once per successful response |
| noindex state | not changed in this task | `app/site-config.ts` | final live acceptance pending | remains disabled | n/a |

No DB writes, file writes, uploads, payments, invoice creation, or external CRM writes are allowed.

## 10. Authorization, Tenant, And Precision Boundaries

This is a public unauthenticated lead form; there is no tenant account context.

Security boundaries:

- HTTPS and same-origin API path;
- POST origin must match an allowed ZevsFlow hostname;
- strict JSON body size and type checks;
- deterministic allowlists and length limits;
- honeypot field;
- server-side Turnstile verification;
- email binding restricted in Cloudflare configuration to the company destination where possible;
- no sensitive request body logging;
- no files, passwords, API keys, OAuth tokens, or payment details.

The public Turnstile site key may be returned by `/api/pilot-config`. The Turnstile secret must exist only as a Worker secret.

## 11. User-Facing Response And Exit Contract

Success purpose: confirm that the request reached ZevsFlow and explain that the team will reply using the submitted contact.

Success copy target: `Ďakujeme. Vašu žiadosť sme prijali. Ozveme sa vám na uvedený kontakt.`

Validation outcome: show a concise general message and field-level errors; keep all entered values.

Turnstile outcome: explain that verification expired or failed and ask the visitor to try again; reset widget.

Delivery/config outcome: do not claim receipt. Preserve form data and offer the public email `info@zevsflow.sk`; delivery remains routed internally to the configured Gmail mailbox.

Keyboard: native website controls only. No bot keyboard.

Final state after success: no pending server state; form is reset.

## 12. Product Truth And InfoHelp Contract

Capability id: `public_pilot_application`

Status after implementation: implemented in code; production-ready only after Cloudflare Turnstile and email bindings are configured and live-tested.

What ZevsFlow can truthfully say:

- paid pilot for one bounded process costs `200 €`;
- Zevs s. r. o. is not a VAT payer;
- later implementation starts from `750 €` and depends on actual scope;
- application submission is non-binding;
- no payment is taken on the website;
- the public form accepts descriptions and contact details, not files;
- form data is sent to the company Gmail mailbox through Cloudflare infrastructure;
- the application is not stored in a separate ZevsFlow application database.

Limitations:

- acceptance of a pilot is not automatic;
- `200 €` does not include unlimited functions, full production rollout, paid third-party services, or permanent support;
- email delivery depends on configured Cloudflare bindings;
- Google OAuth launch remains a separate gate.

Forbidden claims:

- “Every requested automation costs 200 €.”
- “Submitting the form orders and pays for the pilot.”
- “Complete implementation costs exactly 750 €.”
- “No processor ever handles form data.”

Answer to “Can you do this?”: `Pošlite krátku žiadosť. Najskôr overíme, či sa jeden vybraný proces zmestí do rozsahu pilotu za 200 €.`

Answer to “How do I use this?”: `Otvorte stránku Pilot za 200 €, opíšte jeden opakujúci sa proces a uveďte kontakt. Formulár nevyžaduje technické zadanie ani prílohy.`

## 13. Negative-Space And Regression Contract

The change must not:

- remove or break the demo route and video;
- replace `/support` with the sales form;
- turn informational price views into form submissions;
- change the existing data/security pages or Google OAuth behavior;
- accept file uploads;
- create a public payment flow;
- store leads in D1/R2/KV;
- expose Turnstile secrets, email-binding credentials, or the internal Gmail delivery address;
- log contact form content;
- promise implementation for a fixed `750 €`;
- enable public indexing before live production acceptance;
- alter `.eu` redirect behavior;
- reintroduce OfficeFlow or private-preview wording.

## 14. Acceptance Scenario Contract

### Scenario 1 — Homepage entry

Precondition: site loaded.

Input: click `Pilot za 200 €`.

Expected route: `/pilot`.

Expected side effect: none.

Expected outcome: scope, price, non-binding notice, and questionnaire visible.

### Scenario 2 — Complete happy path

Precondition: Cloudflare site key, secret, and email binding configured.

Inputs: valid required fields, privacy checked, valid Turnstile.

Expected state: `READY -> SUBMITTING -> SUCCESS`.

Expected side effect: exactly one email to the configured company Gmail.

Expected final state: form reset, no server pending state.

### Scenario 3 — Missing required field

Input: submit without process description.

Expected state: `READY -> VALIDATION_ERROR -> READY`.

Expected side effect: none.

Expected outcome: field error; other values preserved.

### Scenario 4 — Invalid email

Input: malformed email.

Expected side effect: none.

Expected outcome: email field error.

### Scenario 5 — Expired/replayed Turnstile

Input: invalid or reused token.

Expected side effect: no email.

Expected outcome: safe verification error and widget reset.

### Scenario 6 — Honeypot

Input: non-empty hidden `website` field.

Expected side effect: no email.

Expected outcome: neutral accepted response, preventing bot feedback.

### Scenario 7 — Double click

Input: click submit twice while first request is pending.

Expected side effect: at most one browser request; Turnstile replay also fails closed.

### Scenario 8 — Email service unavailable

Precondition: binding unavailable or send throws.

Expected side effect: no claimed success.

Expected outcome: fields preserved, public `info@zevsflow.sk` fallback shown.

### Scenario 9 — Oversized request

Input: request exceeding configured body limit.

Expected side effect: none.

Expected outcome: `413` safe error.

### Scenario 10 — Wrong origin/method

Input: cross-origin POST or non-POST to submission endpoint.

Expected side effect: none.

Expected outcome: `403` or `405`.

### Scenario 11 — No production config

Precondition: missing site key/secret/email binding.

Expected outcome: form is visibly unavailable and direct email fallback remains usable.

### Scenario 12 — Regression

Precondition: existing site routes.

Expected outcome: home, automation, data/security, legal pages, video, sitemap, robots, and 404 continue to pass rendered-output tests.

## 15. Out Of Scope And Known Architecture Gaps

- no payment processor;
- no automatic invoice;
- no calendar booking;
- no CRM/database lead storage;
- no file upload;
- no marketing subscription checkbox;
- no automated acceptance/rejection decision;
- no guaranteed response time;
- no Google OAuth enablement;
- no public indexing flip until the live form is configured and verified;
- Cloudflare dashboard onboarding of Email Service, verified destination, Turnstile widget, bindings, and secrets requires account-level configuration outside the repository.

## 16. Evidence Index

- `Top_Level_Subflow_Architecture_Design_Proof_Contract.md` — mandatory design-proof contract reviewed before implementation.
- `app/page.tsx::Home` — current homepage and generic CTA.
- `app/automatizacia-na-mieru/page.tsx::CustomAutomationPage` — current `200 €` pilot and `od 750 €` implementation Product Truth.
- `app/site-chrome.tsx::SiteHeader` — current header CTA.
- `app/site-config.ts` — current noindex gate and public route list.
- `app/privacy/page.tsx` — current contact/data-processing information.
- `worker/index.ts::worker.fetch` — single Worker entry and API interception point.
- `vite.config.ts` — Cloudflare Vite/runtime configuration.
- `tests/rendered-html.test.mjs` — current production-render regression suite.
- Requester approval in project conversation, 2026-07-26.
