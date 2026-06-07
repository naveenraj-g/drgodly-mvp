import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const base = process.env.FHIR_SERVER_URL;

  if (!base) {
    return NextResponse.json(
      { error: "FHIR_SERVER_URL is not configured" },
      { status: 500 },
    );
  }

  const params = request.nextUrl.searchParams.toString();
  const upstream = `${base}/api/v1/terminology/search?${params}`;

  try {
    const res = await fetch(upstream, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[terminology/search] proxy error:", err);
    return NextResponse.json({ error: "Terminology service unavailable" }, { status: 502 });
  }
}
