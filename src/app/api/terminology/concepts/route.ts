import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const base =
    process.env.TERMINOLOGY_SERVICE_URL ??
    process.env.NEXT_PUBLIC_TERMINOLOGY_SERVICE_URL;

  if (!base) {
    return NextResponse.json(
      { error: "TERMINOLOGY_SERVICE_URL is not configured" },
      { status: 500 },
    );
  }

  const params = request.nextUrl.searchParams.toString();
  const upstream = `${base}/api/v1/terminology/concepts?${params}`;

  try {
    const res = await fetch(upstream, { next: { revalidate: 3600 } });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[terminology/concepts] proxy error:", err);
    return NextResponse.json({ error: "Terminology service unavailable" }, { status: 502 });
  }
}
