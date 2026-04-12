import * as Sentry from "@sentry/nextjs";

// Only initialize Sentry in production
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN, // ✅ correct variable name
    tracesSampleRate: 0, // no performance tracing
    enableLogs: false, // disable noisy logs in prod
    replaysSessionSampleRate: 0, // disable replay
    replaysOnErrorSampleRate: 0, // disable replay on error
    sendDefaultPii: true, // send user info if available
  });
}
