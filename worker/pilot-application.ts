const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const DEFAULT_RECIPIENT = "officezevs2024@gmail.com";
const DEFAULT_SENDER = "pilot@zevsflow.sk";
const MAX_BODY_BYTES = 20_000;
const TURNSTILE_ACTION = "pilot_application";

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailMessageBuilder {
  from: string | EmailAddress;
  to: string | EmailAddress | Array<string | EmailAddress>;
  replyTo?: string | EmailAddress;
  subject: string;
  text?: string;
  html?: string;
}

export interface SendEmailBinding {
  send(message: EmailMessageBuilder): Promise<{ messageId?: string }>;
}

export interface PilotApplicationEnv {
  EMAIL?: SendEmailBinding;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  PILOT_EMAIL_RECIPIENT?: string;
  PILOT_EMAIL_FROM?: string;
}

export interface PilotApplicationDeps {
  fetch: typeof fetch;
  now: () => Date;
}

interface TurnstileVerification {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
}

interface RawPilotApplication {
  businessType?: unknown;
  companyName?: unknown;
  industry?: unknown;
  processType?: unknown;
  processDescription?: unknown;
  currentMethod?: unknown;
  expectedResult?: unknown;
  contactName?: unknown;
  email?: unknown;
  phone?: unknown;
  privacyAccepted?: unknown;
  turnstileToken?: unknown;
  website?: unknown;
}

export interface PilotApplication {
  businessType: "szco" | "sro" | "other";
  companyName: string;
  industry: string;
  processType:
    | "documents"
    | "invoices"
    | "work_time"
    | "email_files"
    | "reports_alerts"
    | "other";
  processDescription: string;
  currentMethod: string;
  expectedResult: string;
  contactName: string;
  email: string;
  phone: string;
  privacyAccepted: true;
  turnstileToken: string;
  website: string;
}

export interface ValidationResult {
  value?: PilotApplication;
  fieldErrors: Record<string, string>;
}

const businessTypeLabels: Record<PilotApplication["businessType"], string> = {
  szco: "SZČO",
  sro: "s. r. o.",
  other: "Iné",
};

const processTypeLabels: Record<PilotApplication["processType"], string> = {
  documents: "Doklady a bločky",
  invoices: "Faktúry",
  work_time: "Pracovný čas",
  email_files: "Email a súbory",
  reports_alerts: "Reporty a upozornenia",
  other: "Iný proces",
};

function json(body: unknown, status = 200, extraHeaders: HeadersInit = {}): Response {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
      "x-content-type-options": "nosniff",
      ...extraHeaders,
    },
  });
}

function methodNotAllowed(allowed: string): Response {
  return json(
    { ok: false, message: "Táto požiadavka nie je povolená." },
    405,
    { allow: allowed },
  );
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function setLengthError(
  fieldErrors: Record<string, string>,
  field: string,
  value: string,
  min: number,
  max: number,
  requiredMessage: string,
): void {
  if (value.length < min) {
    fieldErrors[field] = requiredMessage;
  } else if (value.length > max) {
    fieldErrors[field] = `Maximálna dĺžka je ${max} znakov.`;
  }
}

function looksLikeEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validatePilotApplication(raw: RawPilotApplication): ValidationResult {
  const fieldErrors: Record<string, string> = {};
  const businessType = normalizeString(raw.businessType);
  const companyName = normalizeString(raw.companyName);
  const industry = normalizeString(raw.industry);
  const processType = normalizeString(raw.processType);
  const processDescription = normalizeString(raw.processDescription);
  const currentMethod = normalizeString(raw.currentMethod);
  const expectedResult = normalizeString(raw.expectedResult);
  const contactName = normalizeString(raw.contactName);
  const email = normalizeString(raw.email).toLowerCase();
  const phone = normalizeString(raw.phone);
  const turnstileToken = normalizeString(raw.turnstileToken);
  const website = normalizeString(raw.website);

  if (!(["szco", "sro", "other"] as const).includes(businessType as PilotApplication["businessType"])) {
    fieldErrors.businessType = "Vyberte typ podnikania.";
  }

  if (companyName.length > 120) {
    fieldErrors.companyName = "Maximálna dĺžka je 120 znakov.";
  }

  setLengthError(fieldErrors, "industry", industry, 2, 120, "Uveďte oblasť podnikania.");

  if (!(["documents", "invoices", "work_time", "email_files", "reports_alerts", "other"] as const).includes(processType as PilotApplication["processType"])) {
    fieldErrors.processType = "Vyberte typ procesu.";
  }

  setLengthError(
    fieldErrors,
    "processDescription",
    processDescription,
    20,
    2_000,
    "Opíšte jeden opakujúci sa proces aspoň v niekoľkých vetách.",
  );

  if (currentMethod.length > 1_200) {
    fieldErrors.currentMethod = "Maximálna dĺžka je 1200 znakov.";
  }

  setLengthError(
    fieldErrors,
    "expectedResult",
    expectedResult,
    10,
    1_200,
    "Uveďte, aký výsledok od pilotu očakávate.",
  );

  setLengthError(fieldErrors, "contactName", contactName, 2, 120, "Uveďte kontaktné meno.");

  if (!looksLikeEmail(email)) {
    fieldErrors.email = "Uveďte platnú emailovú adresu.";
  }

  if (phone.length > 80) {
    fieldErrors.phone = "Maximálna dĺžka je 80 znakov.";
  }

  if (raw.privacyAccepted !== true) {
    fieldErrors.privacyAccepted = "Pred odoslaním potvrďte oboznámenie s ochranou súkromia.";
  }

  if (turnstileToken.length < 1 || turnstileToken.length > 2_048) {
    fieldErrors.turnstileToken = "Dokončite bezpečnostné overenie.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  return {
    fieldErrors,
    value: {
      businessType: businessType as PilotApplication["businessType"],
      companyName,
      industry,
      processType: processType as PilotApplication["processType"],
      processDescription,
      currentMethod,
      expectedResult,
      contactName,
      email,
      phone,
      privacyAccepted: true,
      turnstileToken,
      website,
    },
  };
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return false;
  }

  try {
    const requestUrl = new URL(request.url);
    const originUrl = new URL(origin);
    const local = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
    const validProtocol = originUrl.protocol === "https:" || (local && originUrl.protocol === "http:");
    return validProtocol && originUrl.host === requestUrl.host;
  } catch {
    return false;
  }
}

function configuration(env: PilotApplicationEnv) {
  const siteKey = normalizeString(env.TURNSTILE_SITE_KEY);
  const secretKey = normalizeString(env.TURNSTILE_SECRET_KEY);
  const recipient = normalizeString(env.PILOT_EMAIL_RECIPIENT) || DEFAULT_RECIPIENT;
  const sender = normalizeString(env.PILOT_EMAIL_FROM) || DEFAULT_SENDER;
  const enabled = Boolean(siteKey && secretKey && env.EMAIL && recipient && sender);

  return { enabled, siteKey, secretKey, recipient, sender };
}

export function handlePilotConfigRequest(request: Request, env: PilotApplicationEnv): Response {
  if (request.method !== "GET") {
    return methodNotAllowed("GET");
  }

  const config = configuration(env);
  return json({
    enabled: config.enabled,
    siteKey: config.enabled ? config.siteKey : null,
    fallbackEmail: config.recipient,
  });
}

async function parseJsonBody(request: Request): Promise<RawPilotApplication | null> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return null;
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    throw new RangeError("request-body-too-large");
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    throw new RangeError("request-body-too-large");
  }

  try {
    const value = JSON.parse(text) as unknown;
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as RawPilotApplication)
      : null;
  } catch {
    return null;
  }
}

async function verifyTurnstile(
  request: Request,
  env: PilotApplicationEnv,
  token: string,
  deps: PilotApplicationDeps,
): Promise<boolean> {
  const config = configuration(env);
  if (!config.secretKey) {
    return false;
  }

  const remoteIp = request.headers.get("cf-connecting-ip") ?? "";
  const body = new URLSearchParams({
    secret: config.secretKey,
    response: token,
  });
  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const response = await deps.fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as TurnstileVerification;
  const requestHost = new URL(request.url).hostname.toLowerCase();
  const verifiedHost = normalizeString(result.hostname).toLowerCase();

  return Boolean(
    result.success &&
      result.action === TURNSTILE_ACTION &&
      verifiedHost === requestHost,
  );
}

function sanitizeSubjectPart(value: string): string {
  return value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function line(label: string, value: string): string {
  return `${label}: ${value || "—"}`;
}

function buildEmail(application: PilotApplication, env: PilotApplicationEnv, now: Date): EmailMessageBuilder {
  const config = configuration(env);
  const businessType = businessTypeLabels[application.businessType];
  const processType = processTypeLabels[application.processType];
  const companyForSubject = sanitizeSubjectPart(application.companyName || application.contactName);
  const subject = `ZevsFlow pilot: ${sanitizeSubjectPart(processType)} — ${companyForSubject}`;

  const text = [
    "Nová žiadosť o pilot ZevsFlow",
    "",
    line("Typ podnikania", businessType),
    line("Názov firmy", application.companyName),
    line("Oblasť podnikania", application.industry),
    line("Typ procesu", processType),
    "",
    "Čo chce záujemca automatizovať:",
    application.processDescription,
    "",
    "Ako proces rieši dnes:",
    application.currentMethod || "—",
    "",
    "Očakávaný výsledok:",
    application.expectedResult,
    "",
    line("Kontaktná osoba", application.contactName),
    line("Email", application.email),
    line("Telefón / WhatsApp / Telegram", application.phone),
    line("Oboznámenie s ochranou súkromia", "áno"),
    line("Prijaté", now.toISOString()),
    "",
    "Poznámka: Odoslanie formulára nie je objednávkou ani záväzkom zaplatiť.",
  ].join("\n");

  const html = `
    <h1>Nová žiadosť o pilot ZevsFlow</h1>
    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
      <tr><th align="left">Typ podnikania</th><td>${escapeHtml(businessType)}</td></tr>
      <tr><th align="left">Názov firmy</th><td>${escapeHtml(application.companyName || "—")}</td></tr>
      <tr><th align="left">Oblasť podnikania</th><td>${escapeHtml(application.industry)}</td></tr>
      <tr><th align="left">Typ procesu</th><td>${escapeHtml(processType)}</td></tr>
      <tr><th align="left">Kontaktná osoba</th><td>${escapeHtml(application.contactName)}</td></tr>
      <tr><th align="left">Email</th><td>${escapeHtml(application.email)}</td></tr>
      <tr><th align="left">Telefón / WhatsApp / Telegram</th><td>${escapeHtml(application.phone || "—")}</td></tr>
      <tr><th align="left">Prijaté</th><td>${escapeHtml(now.toISOString())}</td></tr>
    </table>
    <h2>Čo chce záujemca automatizovať</h2>
    <p style="white-space:pre-wrap">${escapeHtml(application.processDescription)}</p>
    <h2>Ako proces rieši dnes</h2>
    <p style="white-space:pre-wrap">${escapeHtml(application.currentMethod || "—")}</p>
    <h2>Očakávaný výsledok</h2>
    <p style="white-space:pre-wrap">${escapeHtml(application.expectedResult)}</p>
    <p><strong>Oboznámenie s ochranou súkromia:</strong> áno</p>
    <p><small>Odoslanie formulára nie je objednávkou ani záväzkom zaplatiť.</small></p>
  `;

  return {
    from: { email: config.sender, name: "ZevsFlow" },
    to: config.recipient,
    replyTo: { email: application.email, name: application.contactName },
    subject,
    text,
    html,
  };
}

export async function handlePilotApplicationRequest(
  request: Request,
  env: PilotApplicationEnv,
  deps: PilotApplicationDeps = { fetch, now: () => new Date() },
): Promise<Response> {
  if (request.method !== "POST") {
    return methodNotAllowed("POST");
  }

  if (!isSameOrigin(request)) {
    return json({ ok: false, message: "Požiadavku sa nepodarilo overiť." }, 403);
  }

  const config = configuration(env);
  if (!config.enabled) {
    return json(
      {
        ok: false,
        code: "FORM_UNAVAILABLE",
        message: "Formulár je dočasne nedostupný. Napíšte nám priamo email.",
        fallbackEmail: config.recipient,
      },
      503,
    );
  }

  let raw: RawPilotApplication | null;
  try {
    raw = await parseJsonBody(request);
  } catch (error) {
    if (error instanceof RangeError) {
      return json({ ok: false, message: "Odoslané údaje sú príliš veľké." }, 413);
    }
    return json({ ok: false, message: "Údaje sa nepodarilo spracovať." }, 400);
  }

  if (!raw) {
    return json({ ok: false, message: "Údaje sa nepodarilo spracovať." }, 400);
  }

  if (normalizeString(raw.website)) {
    return json({ ok: true }, 202);
  }

  const validation = validatePilotApplication(raw);
  if (!validation.value) {
    return json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Skontrolujte označené polia.",
        fieldErrors: validation.fieldErrors,
      },
      400,
    );
  }

  let turnstileValid = false;
  try {
    turnstileValid = await verifyTurnstile(
      request,
      env,
      validation.value.turnstileToken,
      deps,
    );
  } catch (error) {
    console.error(
      "Pilot application Turnstile verification failed",
      error instanceof Error ? error.name : "unknown",
    );
  }

  if (!turnstileValid) {
    return json(
      {
        ok: false,
        code: "TURNSTILE_ERROR",
        message: "Bezpečnostné overenie zlyhalo alebo vypršalo. Skúste to znova.",
      },
      403,
    );
  }

  try {
    await env.EMAIL!.send(buildEmail(validation.value, env, deps.now()));
    return json({
      ok: true,
      message: "Ďakujeme. Vašu žiadosť sme prijali. Ozveme sa vám na uvedený kontakt.",
    });
  } catch (error) {
    console.error(
      "Pilot application delivery failed",
      error instanceof Error ? error.name : "unknown",
    );
    return json(
      {
        ok: false,
        code: "DELIVERY_ERROR",
        message: "Žiadosť sa nepodarilo doručiť. Skúste to znova alebo nám napíšte priamo email.",
        fallbackEmail: config.recipient,
      },
      502,
    );
  }
}
