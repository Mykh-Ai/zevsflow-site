import assert from "node:assert/strict";
import test from "node:test";
import {
  handlePilotApplicationRequest,
  handlePilotConfigRequest,
  validatePilotApplication,
} from "../worker/pilot-application.ts";

const validApplication = {
  businessType: "sro",
  companyName: "Test s. r. o.",
  industry: "Elektroinštalácie",
  processType: "documents",
  processDescription: "Každý týždeň ručne prepisujeme údaje z bločkov do tabuľky.",
  currentMethod: "Fotografie posielame cez WhatsApp a potom ich prepisujeme do Excelu.",
  expectedResult: "Potvrdený záznam a mesačný prehľad bez ručného prepisovania.",
  contactName: "Ján Testovací",
  email: "jan@example.com",
  phone: "+421 900 000 000",
  privacyAccepted: true,
  turnstileToken: "valid-token",
  website: "",
};

function configuredEnv(sent) {
  return {
    TURNSTILE_SITE_KEY: "site-key",
    TURNSTILE_SECRET_KEY: "secret-key",
    PILOT_EMAIL_RECIPIENT: "private-recipient@example.test",
    PILOT_EMAIL_FROM: "pilot@zevsflow.sk",
    EMAIL: {
      async send(message) {
        sent.push(message);
        return { messageId: "message-1" };
      },
    },
  };
}

function requestFor(body, extraHeaders = {}) {
  return new Request("https://zevsflow.sk/api/pilot-application", {
    method: "POST",
    headers: {
      origin: "https://zevsflow.sk",
      "content-type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
}

function validDeps(overrides = {}) {
  return {
    fetch: async () => Response.json({
      success: true,
      hostname: "zevsflow.sk",
      action: "pilot_application",
    }),
    now: () => new Date("2026-07-26T08:00:00.000Z"),
    ...overrides,
  };
}

test("validates the bounded pilot application slots", () => {
  const result = validatePilotApplication(validApplication);
  assert.deepEqual(result.fieldErrors, {});
  assert.equal(result.value?.businessType, "sro");
  assert.equal(result.value?.email, "jan@example.com");
});

test("rejects incomplete or malformed applications before side effects", () => {
  const result = validatePilotApplication({
    ...validApplication,
    businessType: "unknown",
    processDescription: "Krátke",
    expectedResult: "",
    email: "nie-email",
    privacyAccepted: false,
    turnstileToken: "",
  });

  assert.ok(result.fieldErrors.businessType);
  assert.ok(result.fieldErrors.processDescription);
  assert.ok(result.fieldErrors.expectedResult);
  assert.ok(result.fieldErrors.email);
  assert.ok(result.fieldErrors.privacyAccepted);
  assert.ok(result.fieldErrors.turnstileToken);
  assert.equal(result.value, undefined);
});

test("keeps the public config fail-closed until all bindings exist", async () => {
  const disabled = handlePilotConfigRequest(
    new Request("https://zevsflow.sk/api/pilot-config"),
    {},
  );
  const disabledBody = await disabled.json();
  assert.equal(disabled.status, 200);
  assert.equal(disabledBody.enabled, false);
  assert.equal(disabledBody.siteKey, null);

  const missingPrivateRecipientEnv = configuredEnv([]);
  delete missingPrivateRecipientEnv.PILOT_EMAIL_RECIPIENT;
  const missingPrivateRecipient = handlePilotConfigRequest(
    new Request("https://zevsflow.sk/api/pilot-config"),
    missingPrivateRecipientEnv,
  );
  const missingPrivateRecipientBody = await missingPrivateRecipient.json();
  assert.equal(missingPrivateRecipientBody.enabled, false);
  assert.equal(missingPrivateRecipientBody.fallbackEmail, "info@zevsflow.sk");

  const sent = [];
  const enabled = handlePilotConfigRequest(
    new Request("https://zevsflow.sk/api/pilot-config"),
    configuredEnv(sent),
  );
  const enabledBody = await enabled.json();
  assert.equal(enabledBody.enabled, true);
  assert.equal(enabledBody.siteKey, "site-key");
  assert.equal(enabledBody.fallbackEmail, "info@zevsflow.sk");
});

test("returns the public contact address when the form is unavailable", async () => {
  const response = await handlePilotApplicationRequest(
    requestFor(validApplication),
    {},
    validDeps(),
  );
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.ok, false);
  assert.equal(body.code, "FORM_UNAVAILABLE");
  assert.equal(body.fallbackEmail, "info@zevsflow.sk");
});

test("sends one escaped email after successful Turnstile verification", async () => {
  const sent = [];
  const response = await handlePilotApplicationRequest(
    requestFor({
      ...validApplication,
      processDescription: "Spracovať <script>alert('x')</script> bez ručného prepisovania.",
    }),
    configuredEnv(sent),
    validDeps(),
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "private-recipient@example.test");
  assert.equal(sent[0].replyTo.email, "jan@example.com");
  assert.match(sent[0].subject, /ZevsFlow pilot:/);
  assert.match(sent[0].html, /&lt;script&gt;/);
  assert.doesNotMatch(sent[0].html, /<script>/);
  assert.match(sent[0].text, /2026-07-26T08:00:00.000Z/);
});

test("fails closed for wrong origin", async () => {
  const sent = [];
  let verified = false;
  const response = await handlePilotApplicationRequest(
    requestFor(validApplication, { origin: "https://example.com" }),
    configuredEnv(sent),
    validDeps({ fetch: async () => { verified = true; return Response.json({ success: true }); } }),
  );

  assert.equal(response.status, 403);
  assert.equal(verified, false);
  assert.equal(sent.length, 0);
});

test("does not send when Turnstile rejects or mismatches the action", async () => {
  const sent = [];
  const response = await handlePilotApplicationRequest(
    requestFor(validApplication),
    configuredEnv(sent),
    validDeps({
      fetch: async () => Response.json({
        success: true,
        hostname: "zevsflow.sk",
        action: "different_action",
      }),
    }),
  );
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.equal(body.code, "TURNSTILE_ERROR");
  assert.equal(sent.length, 0);
});

test("honeypot submissions receive a neutral response without verification or email", async () => {
  const sent = [];
  let verified = false;
  const response = await handlePilotApplicationRequest(
    requestFor({ ...validApplication, website: "https://spam.example" }),
    configuredEnv(sent),
    validDeps({ fetch: async () => { verified = true; return Response.json({ success: true }); } }),
  );
  const body = await response.json();

  assert.equal(response.status, 202);
  assert.equal(body.ok, true);
  assert.equal(verified, false);
  assert.equal(sent.length, 0);
});

test("reports delivery failure without claiming the application was received", async () => {
  const env = configuredEnv([]);
  env.EMAIL = {
    async send() {
      throw new Error("email-unavailable");
    },
  };

  const response = await handlePilotApplicationRequest(
    requestFor(validApplication),
    env,
    validDeps(),
  );
  const body = await response.json();

  assert.equal(response.status, 502);
  assert.equal(body.ok, false);
  assert.equal(body.code, "DELIVERY_ERROR");
  assert.equal(body.fallbackEmail, "info@zevsflow.sk");
});
