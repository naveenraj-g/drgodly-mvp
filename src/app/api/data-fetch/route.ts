/**
 * POST /api/data-fetch
 *
 * Generic server-side proxy used by A2UI DataTable components to fetch
 * paginated / filtered data from the FHIR server with Bearer auth.
 *
 * Request body:
 *   { url: string, queryParams?: Record<string, any>, dataPath?: string, totalPath?: string }
 *
 * Response:
 *   { rows: any[], total: number, raw: any }
 */

import { getJWTToken } from "@/modules/server/auth/jwt-token";

function getAtPath(obj: unknown, path: string): unknown {
  if (!path) return obj;
  return path.split(".").reduce((o: unknown, k) =>
    o != null && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined, obj);
}

function extractRows(raw: unknown, dataPath?: string): unknown[] {
  if (dataPath) {
    const val = getAtPath(raw, dataPath);
    return Array.isArray(val) ? val : [];
  }
  if (Array.isArray(raw)) return raw;
  const r = raw as Record<string, unknown>;
  for (const key of ["data", "items", "results", "entry", "records", "rows"]) {
    if (Array.isArray(r?.[key])) return r[key] as unknown[];
  }
  return [];
}

function extractTotal(raw: unknown, totalPath?: string, rowCount = 0): number {
  if (totalPath) {
    const val = getAtPath(raw, totalPath);
    return typeof val === "number" ? val : Number(val) || rowCount;
  }
  const r = raw as Record<string, unknown>;
  for (const key of ["total", "count", "totalCount", "total_count"]) {
    if (typeof r?.[key] === "number") return r[key] as number;
  }
  return (getAtPath(raw, "meta.total") ?? getAtPath(raw, "meta.count") ?? rowCount) as number;
}

export async function POST(req: Request) {
  const { url, queryParams = {}, dataPath, totalPath } = await req.json();

  if (!url) {
    return Response.json({ error: "url is required" }, { status: 400 });
  }

  const token = await getJWTToken();

  const resolvedUrl = url.startsWith("/")
    ? `${process.env.FHIR_SERVER_URL ?? ""}${url}`
    : url;

  const params = new URLSearchParams(
    Object.entries(queryParams as Record<string, unknown>)
      .filter(([, v]) => v != null && v !== "")
      .map(([k, v]) => [k, String(v)]),
  );

  const fullUrl = params.toString() ? `${resolvedUrl}?${params}` : resolvedUrl;

  const upstream = await fetch(fullUrl, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });

  if (!upstream.ok) {
    return Response.json(
      { error: `Upstream error: ${upstream.status} ${upstream.statusText}` },
      { status: upstream.status },
    );
  }

  const raw = await upstream.json();
  const rows = extractRows(raw, dataPath);
  const total = extractTotal(raw, totalPath, rows.length);

  return Response.json({ rows, total, raw });
}
