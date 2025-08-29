// Minimal PostHog stub. Only activates when keys exist.
// Client: pageview on route change; Server: log events without PII.

export type PosthogEventProps = Record<string, string | number | boolean | null | undefined>;

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || process.env.POSTHOG_HOST || "https://us.i.posthog.com";

let initialized = false;

export function initPosthog() {
  if (!POSTHOG_KEY || initialized) return false;
  initialized = true;
  return true;
}

export function trackServerEvent(event: string, properties?: PosthogEventProps) {
  if (!initialized) return;
  try {
    // Replace with real server-side ingestion later; no PII
    console.log("[PostHog] event", {
      event,
      properties,
      host: POSTHOG_HOST,
    });
  } catch {}
}

export function trackClientPageview(pathname: string) {
  if (!initialized) return;
  try {
    console.log("[PostHog] pageview", { pathname });
  } catch {}
}


