// Minimal Sentry stub that only activates when DSN exists.
// No PII should be sent; only high-level error/event metadata.

type Event = {
  message?: string;
  level?: "error" | "warning" | "info";
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
};

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
const SENTRY_ENV = process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV;

let initialized = false;

export function initSentry() {
  if (!SENTRY_DSN || initialized) return false;
  initialized = true;
  return true;
}

export function captureException(error: unknown, context?: { tags?: Record<string, string>; extra?: Record<string, unknown> }) {
  if (!initialized) return;
  try {
    // Replace with real Sentry SDK if added later
    console.error("[Sentry] exception", {
      type: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      tags: context?.tags,
      extra: context?.extra,
      env: SENTRY_ENV,
    });
  } catch {}
}

export function captureMessage(message: string, event: Event = {}) {
  if (!initialized) return;
  try {
    console.log("[Sentry] message", { message, ...event, env: SENTRY_ENV });
  } catch {}
}

export function withSentryRoute<T extends (...args: any[]) => Promise<Response>>(handler: T, name: string): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (async function sentryWrapped(this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
    if (!initialized) return (await handler.apply(this, args)) as unknown as ReturnType<T>;
    try {
      const res = await handler.apply(this, args);
      return res as unknown as ReturnType<T>;
    } catch (err) {
      captureException(err, { tags: { route: name }, extra: { kind: "api_route" } });
      throw err;
    }
  }) as unknown as T;
}


