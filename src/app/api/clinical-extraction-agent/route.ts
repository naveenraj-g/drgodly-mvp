import { NextRequest, NextResponse } from "next/server";
import { getAgentToken } from "@/modules/server/auth/agent-token";

export async function POST(req: NextRequest) {
  try {
    const token = await getAgentToken();
    const body = await req.json();
    const agentUrl = process.env.AGENT_CLINICAL_API_URL;

    if (!agentUrl) {
      return NextResponse.json(
        { error: "AGENT_CLINICAL_API_URL is not configured" },
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
        { error: "Clinical extraction agent request failed" },
        { status: upstream.status },
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.log(err);
    if (err.message?.includes("Failed to fetch agent token")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[clinical-extraction-agent] proxy error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
