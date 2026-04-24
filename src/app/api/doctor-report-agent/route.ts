import { NextRequest, NextResponse } from "next/server";
import { getAgentToken } from "@/modules/server/auth/agent-token";

export async function POST(req: NextRequest) {
  try {
    const token = await getAgentToken();
    const body = await req.json();
    const agentUrl = process.env.DOCTOR_REPORT_AGENT_URL;

    if (!agentUrl) {
      return NextResponse.json(
        { error: "DOCTOR_REPORT_AGENT_URL is not configured" },
        { status: 500 },
      );
    }

    const upstream = await fetch(agentUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Doctor report agent request failed" },
        { status: upstream.status },
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (err: any) {
    if (err.message?.includes("Failed to fetch agent token")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[doctor-report-agent] proxy error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
