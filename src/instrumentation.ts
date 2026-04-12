import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NODE_ENV === "production"
  ) {
    await import("../sentry.server.config");
  }

  if (
    process.env.NEXT_RUNTIME === "edge" &&
    process.env.NODE_ENV === "production"
  ) {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;

/* 
Data we can collect:

1. logs: text records of events happening
2. metrics: data that has to do with numbers
3. traces: journey of a request through your system

Telemetry backends:
loki for logs
prometheus for metrics
zipkin for traces

visualization tool Grafana
*/
