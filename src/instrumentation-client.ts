import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN, // ✅ corrected variable name (DSN not DNS)
    enabled: true,
    integrations: [],
    tracesSampleRate: 0, // disable tracing unless you need it
    enableLogs: false, // no extra console output
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: true,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
