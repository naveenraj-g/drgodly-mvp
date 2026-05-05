import { NextRequest, NextResponse } from "next/server";
import { getAgentToken } from "@/modules/server/auth/agent-token";

export async function POST(req: NextRequest) {
  try {
    const token = await getAgentToken();
    const body = await req.json();

    const assessmentPlanUrl = process.env.ASSESSMENT_PLAN_AGENT_URL;
    const doctorReportUrl = process.env.DOCTOR_REPORT_AGENT_URL;

    if (!assessmentPlanUrl || !doctorReportUrl) {
      return NextResponse.json(
        {
          error:
            "ASSESSMENT_PLAN_AGENT_URL or DOCTOR_REPORT_AGENT_URL is not configured",
        },
        { status: 500 },
      );
    }

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    };

    const [assessmentRes, doctorRes] = await Promise.all([
      fetch(assessmentPlanUrl, fetchOptions),
      fetch(doctorReportUrl, fetchOptions),
    ]);

    if (!assessmentRes.ok || !doctorRes.ok) {
      const failedUrl = !assessmentRes.ok ? "assessment-plan" : "doctor-report";
      const status = !assessmentRes.ok
        ? assessmentRes.status
        : doctorRes.status;
      return NextResponse.json(
        { error: `${failedUrl} agent request failed` },
        { status },
      );
    }

    const [assessmentData, doctorData] = await Promise.all([
      assessmentRes.json(),
      doctorRes.json(),
    ]);

    const assessmentPlan = assessmentData?.data ?? assessmentData;
    const soapReport = doctorData?.data ?? doctorData;

    const merged = {
      soap_report: soapReport,
      assessment_plan: assessmentPlan,
      generated_at: new Date().toISOString(),
    };

    return NextResponse.json(merged);
  } catch (err: any) {
    if (err.message?.includes("Failed to fetch agent token")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[full-report-agent] proxy error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
