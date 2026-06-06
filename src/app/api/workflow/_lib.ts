/**
 * Shared utilities for the /api/workflow route family.
 */

import type { WorkflowStepDefinition, StepContextOutput, ContextResolverDef } from "@/types/workflow";
import { getJWTToken } from "@/modules/server/auth/jwt-token";

export { getJWTToken };

export function sortedSteps(steps: WorkflowStepDefinition[]): WorkflowStepDefinition[] {
  return [...steps].sort((a, b) => a.sequence_number - b.sequence_number);
}

export function resolveUrl(template: string, context: Record<string, unknown>): string {
  const merged: Record<string, unknown> = {
    fhir_server_url: process.env.FHIR_SERVER_URL ?? "",
    terminology_server_url:
      process.env.TERMINOLOGY_SERVICE_URL ??
      process.env.NEXT_PUBLIC_TERMINOLOGY_SERVICE_URL ??
      "",
    ...context,
  };
  return template.replace(/\$(\w+)/g, (_, key) => String(merged[key] ?? ""));
}

export function extractOutputs(
  outputs: Record<string, StepContextOutput>,
  response: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, def] of Object.entries(outputs)) {
    if (!def.field) {
      result[key] = response;
    } else {
      const value = def.field.split(".").reduce<unknown>(
        (acc, k) =>
          acc != null && typeof acc === "object"
            ? (acc as Record<string, unknown>)[k]
            : undefined,
        response,
      );
      if (value !== undefined) result[key] = value;
    }
  }
  return result;
}

export function cleanFormData(data: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (
      value !== "" &&
      value !== undefined &&
      value !== null &&
      !(typeof value === "number" && isNaN(value))
    ) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export async function runContextResolvers(
  resolvers: ContextResolverDef[],
  sessionContext: Record<string, unknown>,
  token: string,
): Promise<Record<string, unknown>> {
  const results = await Promise.all(
    resolvers.map((r) => runContextResolver(r, sessionContext, token)),
  );
  return Object.assign({}, ...results);
}

export async function runContextResolver(
  resolver: NonNullable<WorkflowStepDefinition["context_resolver"]>,
  sessionContext: Record<string, unknown>,
  token: string,
): Promise<Record<string, unknown>> {
  const url = resolveUrl(resolver.url, sessionContext);
  const res = await fetch(url, {
    method: resolver.method,
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: resolver.timeout_ms ? AbortSignal.timeout(resolver.timeout_ms) : undefined,
  });
  if (!res.ok) throw new Error(`Context resolver failed: ${res.status}`);
  const body = await res.json();
  return resolver.context_key ? { [resolver.context_key]: body } : body;
}
