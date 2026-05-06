import { NextRequest } from "next/server";
import { getVitals, transformVitalsToLifestyle } from "@/modules/server/fhir/vitals";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const patient_id = searchParams.get("patient_id");
  const org_id = searchParams.get("org_id");
  const recorded_at_from = searchParams.get("recorded_at_from");
  const recorded_at_to = searchParams.get("recorded_at_to");
  const limit = searchParams.get("limit");

  try {
    const result = await getVitals({
      patient_id: patient_id ? parseInt(patient_id, 10) : undefined,
      org_id: org_id ?? undefined,
      recorded_at_from: recorded_at_from ?? undefined,
      recorded_at_to: recorded_at_to ?? undefined,
      limit: limit ? parseInt(limit, 10) : 200,
    });

    return Response.json(transformVitalsToLifestyle(result.data));
  } catch {
    return Response.json(null, { status: 200 });
  }
}
