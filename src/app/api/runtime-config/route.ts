import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    livekitUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL,
    vapiPublicKey: process.env.NEXT_PUBLIC_VAPI_API_KEY,
    pyAgent: process.env.NEXT_PUBLIC_PY_AGENT_URL,
    vapiAgentId: process.env.NEXT_PUBLIC_VAPI_AGENT_ID,
  });
}
