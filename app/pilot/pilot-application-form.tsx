"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const DEFAULT_FALLBACK_EMAIL = "officezevs2024@gmail.com";
const TURNSTILE_SCRIPT_ID = "zevsflow-turnstile-script";

type TurnstileOptions = {
  sitekey: string;
  action: string;
  language: string;
  theme: "auto";
  size: "normal";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
};

type TurnstileApi = {
  render(container: HTMLElement, options: TurnstileOptions): string;
  reset(widgetId?: string): void;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type PilotConfig = {
  enabled: boolean;
  siteKey: string | null;
  fallbackEmail: string;
};

type ApiResponse = {
  ok?: boolean;
  code?: string;
  message?: string;
  fallbackEmail?: string;
  fieldErrors?: Record<string, string>;
};

let turnstileScriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("browser-required"));
  }

  if (window.turnstile) {
    return Promise.resolve();
  }

  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");

    const handleLoad = () => {
      if (window.turnstile) {
        resolve();
      } else {
        reject(new Error("turnstile-api-unavailable"));
      }
    };
    const handleError = () => reject(new Error("turnstile-script-failed"));

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existing) {
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return turnstileScriptPromise;
}

function FieldError({ field, errors }: { field: string; errors: Record<string, string> }) {
  const error = errors[field];
  return error ? <span className="field-error" id={`${field}-error`}>{error}</span> : null;
}

function describedBy(field: string, errors: Record<string, string>): string | undefined {
  return errors[field] ? `${field}-error` : undefined;
}

export function PilotApplicationForm() {
  const [config, setConfig] = useState<PilotConfig | null>(null);
  const [configError, setConfigError] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileError, setTurnstileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fallbackEmail, setFallbackEmail] = useState(DEFAULT_FALLBACK_EMAIL);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadConfig() {
      try {
        const response = await fetch("/api/pilot-config", {
          cache: "no-store",
          headers: { accept: "application/json" },
        });
        const value = (await response.json()) as PilotConfig;
        if (cancelled) return;
        setConfig(value);
        setFallbackEmail(value.fallbackEmail || DEFAULT_FALLBACK_EMAIL);
      } catch {
        if (!cancelled) {
          setConfigError(true);
        }
      }
    }

    void loadConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!config?.enabled || !config.siteKey || !turnstileContainerRef.current) {
      return;
    }

    let cancelled = false;

    async function renderWidget() {
      try {
        await loadTurnstileScript();
        if (cancelled || !window.turnstile || !turnstileContainerRef.current) {
          return;
        }

        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
        }

        widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: config.siteKey!,
          action: "pilot_application",
          language: "sk",
          theme: "auto",
          size: "normal",
          callback: (token) => {
            setTurnstileToken(token);
            setTurnstileError("");
            setFieldErrors((current) => {
              const next = { ...current };
              delete next.turnstileToken;
              return next;
            });
          },
          "expired-callback": () => {
            setTurnstileToken("");
            setTurnstileError("Bezpečnostné overenie vypršalo. Obnovte ho pred odoslaním.");
          },
          "error-callback": () => {
            setTurnstileToken("");
            setTurnstileError("Bezpečnostné overenie sa nepodarilo načítať. Skúste obnoviť stránku.");
          },
        });
        setTurnstileReady(true);
      } catch {
        if (!cancelled) {
          setTurnstileError("Bezpečnostné overenie sa nepodarilo načítať. Skúste obnoviť stránku.");
        }
      }
    }

    void renderWidget();

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [config]);

  function resetTurnstile() {
    setTurnstileToken("");
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSuccessMessage("");
    setFormMessage("");
    setFieldErrors({});

    if (!turnstileToken) {
      setFieldErrors({ turnstileToken: "Dokončite bezpečnostné overenie." });
      return;
    }

    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = {
      businessType: values.get("businessType"),
      companyName: values.get("companyName"),
      industry: values.get("industry"),
      processType: values.get("processType"),
      processDescription: values.get("processDescription"),
      currentMethod: values.get("currentMethod"),
      expectedResult: values.get("expectedResult"),
      contactName: values.get("contactName"),
      email: values.get("email"),
      phone: values.get("phone"),
      privacyAccepted: values.get("privacyAccepted") === "on",
      website: values.get("website"),
      turnstileToken,
    };

    setSubmitting(true);

    try {
      const response = await fetch("/api/pilot-application", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const value = (await response.json()) as ApiResponse;

      if (response.ok && value.ok) {
        setSuccessMessage(
          value.message ?? "Ďakujeme. Vašu žiadosť sme prijali. Ozveme sa vám na uvedený kontakt.",
        );
        form.reset();
        resetTurnstile();
        return;
      }

      setFallbackEmail(value.fallbackEmail || fallbackEmail);
      setFieldErrors(value.fieldErrors ?? {});
      setFormMessage(value.message ?? "Žiadosť sa nepodarilo odoslať. Skúste to znova.");
      resetTurnstile();
    } catch {
      setFormMessage("Žiadosť sa nepodarilo odoslať. Skúste to znova alebo nám napíšte priamo email.");
      resetTurnstile();
    } finally {
      setSubmitting(false);
    }
  }

  if (!config && !configError) {
    return <div className="form-status" role="status">Pripravujeme bezpečný formulár…</div>;
  }

  if (configError || !config?.enabled) {
    return (
      <div className="form-status form-status-warning" role="status">
        <h2>Online formulár ešte nie je aktívny.</h2>
        <p>Žiadosť môžete zatiaľ poslať priamo na <a href={`mailto:${fallbackEmail}?subject=ZevsFlow%20%E2%80%93%20pilot%20za%20200%20%E2%82%AC`}>{fallbackEmail}</a>.</p>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="form-status form-status-success" role="status" tabIndex={-1}>
        <p className="eyebrow"><span /> Žiadosť odoslaná</p>
        <h2>{successMessage}</h2>
        <p>Odoslanie formulára nie je objednávkou ani záväzkom zaplatiť. Najskôr spoločne overíme rozsah pilotu.</p>
        <button className="button button-ghost" type="button" onClick={() => setSuccessMessage("")}>Poslať ďalšiu žiadosť</button>
      </div>
    );
  }

  return (
    <form className="pilot-form" ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="honeypot-field" aria-hidden="true">
        <label htmlFor="website">Webová stránka</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset>
        <legend>O vašej firme</legend>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="businessType">Typ podnikania <span aria-hidden="true">*</span></label>
            <select id="businessType" name="businessType" defaultValue="" required aria-invalid={Boolean(fieldErrors.businessType)} aria-describedby={describedBy("businessType", fieldErrors)}>
              <option value="" disabled>Vyberte možnosť</option>
              <option value="szco">SZČO</option>
              <option value="sro">s. r. o.</option>
              <option value="other">Iné</option>
            </select>
            <FieldError field="businessType" errors={fieldErrors} />
          </div>

          <div className="form-field">
            <label htmlFor="companyName">Názov firmy <span className="optional">nepovinné</span></label>
            <input id="companyName" name="companyName" type="text" maxLength={120} autoComplete="organization" aria-invalid={Boolean(fieldErrors.companyName)} aria-describedby={describedBy("companyName", fieldErrors)} />
            <FieldError field="companyName" errors={fieldErrors} />
          </div>

          <div className="form-field form-field-wide">
            <label htmlFor="industry">Oblasť podnikania <span aria-hidden="true">*</span></label>
            <input id="industry" name="industry" type="text" minLength={2} maxLength={120} required placeholder="Napríklad elektroinštalácie, účtovníctvo alebo stavebníctvo" aria-invalid={Boolean(fieldErrors.industry)} aria-describedby={describedBy("industry", fieldErrors)} />
            <FieldError field="industry" errors={fieldErrors} />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Proces pre pilot</legend>
        <div className="form-grid">
          <div className="form-field form-field-wide">
            <label htmlFor="processType">Oblasť procesu <span aria-hidden="true">*</span></label>
            <select id="processType" name="processType" defaultValue="" required aria-invalid={Boolean(fieldErrors.processType)} aria-describedby={describedBy("processType", fieldErrors)}>
              <option value="" disabled>Vyberte najbližšiu možnosť</option>
              <option value="documents">Doklady a bločky</option>
              <option value="invoices">Faktúry</option>
              <option value="work_time">Pracovný čas</option>
              <option value="email_files">Email a súbory</option>
              <option value="reports_alerts">Reporty a upozornenia</option>
              <option value="other">Iný proces</option>
            </select>
            <FieldError field="processType" errors={fieldErrors} />
          </div>

          <div className="form-field form-field-wide">
            <label htmlFor="processDescription">Čo chcete automatizovať? <span aria-hidden="true">*</span></label>
            <textarea id="processDescription" name="processDescription" minLength={20} maxLength={2000} rows={6} required placeholder="Opíšte jednu opakujúcu sa situáciu: čo ju spúšťa, aké údaje prichádzajú a čo dnes musí človek robiť ručne." aria-invalid={Boolean(fieldErrors.processDescription)} aria-describedby={describedBy("processDescription", fieldErrors)} />
            <FieldError field="processDescription" errors={fieldErrors} />
          </div>

          <div className="form-field form-field-wide">
            <label htmlFor="currentMethod">Ako tento proces riešite dnes? <span className="optional">nepovinné</span></label>
            <textarea id="currentMethod" name="currentMethod" maxLength={1200} rows={4} placeholder="Napríklad cez WhatsApp, email, Excel alebo ručné prepisovanie." aria-invalid={Boolean(fieldErrors.currentMethod)} aria-describedby={describedBy("currentMethod", fieldErrors)} />
            <FieldError field="currentMethod" errors={fieldErrors} />
          </div>

          <div className="form-field form-field-wide">
            <label htmlFor="expectedResult">Aký výsledok očakávate? <span aria-hidden="true">*</span></label>
            <textarea id="expectedResult" name="expectedResult" minLength={10} maxLength={1200} rows={4} required placeholder="Čo má byť po dokončení pilotu rýchlejšie, jednoduchšie alebo spoľahlivejšie?" aria-invalid={Boolean(fieldErrors.expectedResult)} aria-describedby={describedBy("expectedResult", fieldErrors)} />
            <FieldError field="expectedResult" errors={fieldErrors} />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Kontakt</legend>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="contactName">Meno a priezvisko <span aria-hidden="true">*</span></label>
            <input id="contactName" name="contactName" type="text" minLength={2} maxLength={120} required autoComplete="name" aria-invalid={Boolean(fieldErrors.contactName)} aria-describedby={describedBy("contactName", fieldErrors)} />
            <FieldError field="contactName" errors={fieldErrors} />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
            <input id="email" name="email" type="email" maxLength={254} required autoComplete="email" inputMode="email" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={describedBy("email", fieldErrors)} />
            <FieldError field="email" errors={fieldErrors} />
          </div>

          <div className="form-field form-field-wide">
            <label htmlFor="phone">Telefón, WhatsApp alebo Telegram <span className="optional">nepovinné</span></label>
            <input id="phone" name="phone" type="text" maxLength={80} autoComplete="tel" aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={describedBy("phone", fieldErrors)} />
            <FieldError field="phone" errors={fieldErrors} />
          </div>
        </div>
      </fieldset>

      <div className="privacy-confirmation">
        <label>
          <input name="privacyAccepted" type="checkbox" required aria-invalid={Boolean(fieldErrors.privacyAccepted)} aria-describedby={describedBy("privacyAccepted", fieldErrors)} />
          <span>Oboznámil/a som sa s informáciami o <a href="/privacy" target="_blank" rel="noreferrer">ochrane súkromia</a>. Súhlasím s použitím uvedených údajov na vybavenie tejto žiadosti.</span>
        </label>
        <FieldError field="privacyAccepted" errors={fieldErrors} />
      </div>

      <div className="turnstile-area">
        <div ref={turnstileContainerRef} />
        {!turnstileReady && !turnstileError ? <span className="form-help">Načítava sa bezpečnostné overenie…</span> : null}
        {turnstileError ? <span className="field-error">{turnstileError}</span> : null}
        <FieldError field="turnstileToken" errors={fieldErrors} />
      </div>

      <p className="form-safety-note">Do formulára neposielajte heslá, API kľúče, OAuth tokeny ani citlivé dokumenty. Prílohy sa neprijímajú.</p>

      {formMessage ? (
        <div className="form-message form-message-error" role="alert">
          <p>{formMessage}</p>
          <p>Priamy kontakt: <a href={`mailto:${fallbackEmail}?subject=ZevsFlow%20%E2%80%93%20pilot%20za%20200%20%E2%82%AC`}>{fallbackEmail}</a></p>
        </div>
      ) : null}

      <button className="button pilot-submit" type="submit" disabled={submitting || !turnstileReady}>
        {submitting ? "Odosielame…" : "Odoslať žiadosť o pilot"}
      </button>
      <p className="form-footnote">Odoslanie formulára nie je objednávkou ani záväzkom zaplatiť.</p>
    </form>
  );
}
