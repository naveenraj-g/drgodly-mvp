export async function register() {}

export function onRequestError(
  error: unknown,
  _request: unknown,
  _context: unknown
) {
  console.error(error);
}

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
