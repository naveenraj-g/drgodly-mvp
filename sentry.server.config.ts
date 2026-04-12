import * as Sentry from "@sentry/nextjs";

// ✅ Only run this block in production
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN, // ✅ Correct variable name
    enabled: true, // No need for condition again
    tracesSampleRate: 0, // Disable tracing
    enableLogs: false, // Disable noisy logs in prod
    sendDefaultPii: true, // Optional: include user data
    replaysSessionSampleRate: 0, // Disable replay
    replaysOnErrorSampleRate: 0, // Disable replay on error
  });
}
