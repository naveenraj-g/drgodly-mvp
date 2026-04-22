import { headers } from "next/headers";

const FHIR_BASE_URL = process.env.FHIR_SERVER_URL!;
const AUTH_URL = process.env.BETTER_AUTH_URL!;

/**
 * Fetches a short-lived JWT from Better Auth's JWT plugin endpoint.
 * Called server-side inside a Next.js request context so the current
 * session cookie is forwarded automatically via the request headers.
 */
async function getFhirToken(): Promise<string> {
  const hdrs = await headers();

  const res = await fetch(`${AUTH_URL}/api/auth/token`, {
    method: "GET",
    headers: hdrs,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch FHIR auth token: ${res.status}`);
  }

  const data = await res.json();
  // Better Auth JWT plugin returns { token: string }
  const token: string | undefined = data.token ?? data.jwt ?? data.access_token;

  if (!token) {
    throw new Error(
      `FHIR auth token not found in response: ${JSON.stringify(data)}`,
    );
  }

  return token;
}

/**
 * Makes an authenticated request to the FHIR server.
 * Throws if the response is not OK.
 * Returns undefined for 204 No Content responses.
 */
export async function fhirRequest<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  const token = await getFhirToken();

  const res = await fetch(`${FHIR_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      `FHIR [${method} ${path}] ${res.status}: ${JSON.stringify(data)}`,
    );
  }

  return data as T;
}
