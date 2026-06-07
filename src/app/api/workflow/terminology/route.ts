/**
 * GET /api/workflow/terminology
 *
 * Server-side proxy for terminology concept lookups used by the A2UI
 * TerminologySelect catalog component. Routes to the terminology service
 * (TERMINOLOGY_SERVICE_URL / NEXT_PUBLIC_TERMINOLOGY_SERVICE_URL).
 *
 * Mode A — field concepts (HL7 value sets):
 *   ?resource=Condition&field=clinicalStatus
 *   → /api/v1/terminology/concepts?resource=...&field=...
 *
 * Mode B — system full-text search (LOINC, SNOMED, ICD-10, RxNorm):
 *   ?system=http://loinc.org&query=blood+pressure
 *   → /api/v1/terminology/search?q=...&system=...
 *
 * Both modes return: { concepts: ConceptResponse[] }
 */

const TERMINOLOGY_BASE =
  process.env.FHIR_SERVER_URL ?? process.env.NEXT_PUBLIC_FHIR_SERVER_URL;

export async function GET(req: Request) {
  if (!TERMINOLOGY_BASE) {
    return Response.json(
      { error: "TERMINOLOGY_SERVICE_URL is not configured" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  const resource = searchParams.get("resource");
  const field = searchParams.get("field");
  const system = searchParams.get("system");
  const query = searchParams.get("query") ?? "";

  const isSystemSearch = system !== null || (!resource && !field && query);

  if (!isSystemSearch && (!resource || !field)) {
    return Response.json(
      { error: "Provide either (resource + field) or system" },
      { status: 400 },
    );
  }

  try {
    let concepts: unknown[];

    if (isSystemSearch) {
      const params = new URLSearchParams({ q: query, limit: "20" });
      if (system) params.set("system", system);

      const res = await fetch(
        `${TERMINOLOGY_BASE}/api/v1/terminology/search?${params}`,
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error(`Terminology search error: ${res.status}`);
      const data = await res.json();
      // /terminology/search returns { total, limit, offset, data: [...] }
      concepts = Array.isArray(data.data) ? data.data : [];
    } else {
      const params = new URLSearchParams({
        resource: resource!,
        field: field!,
      });
      if (query) params.set("q", query);

      const res = await fetch(
        `${TERMINOLOGY_BASE}/api/v1/terminology/concepts?${params}`,
        { next: { revalidate: 3600 } },
      );
      if (!res.ok) throw new Error(`Terminology concepts error: ${res.status}`);
      const data = await res.json();
      // /terminology/concepts returns { concepts: [...] }
      concepts = Array.isArray(data.concepts) ? data.concepts : [];
    }

    return Response.json({ concepts });
  } catch (error) {
    console.error("[workflow/terminology] Failed:", error);
    return Response.json(
      { error: "Failed to fetch terminology" },
      { status: 500 },
    );
  }
}
