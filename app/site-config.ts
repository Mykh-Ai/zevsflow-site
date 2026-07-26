export const SITE_URL = "https://zevsflow.sk";

export const SITE_TITLE = "ZevsFlow — AI automatizácia na mieru";

export const SITE_DESCRIPTION =
  "Kontrolovaná AI automatizácia pre konkrétne firemné procesy.";

// Public indexing is enabled after the live pilot form, Turnstile, and email
// delivery acceptance checks completed successfully.
export const PUBLIC_INDEXING_ENABLED = true;

export const PUBLIC_ROUTES = [
  "/",
  "/pilot",
  "/automatizacia-na-mieru",
  "/data-a-bezpecnost",
  "/privacy",
  "/terms",
  "/cookies",
  "/google-data",
  "/data-deletion",
  "/support",
] as const;
