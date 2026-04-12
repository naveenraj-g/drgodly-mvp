import { NextResponse } from "next/server";
import Vapi from "@vapi-ai/web";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const vapi = new Vapi(process.env.VAPI_PRIVATE_KEY!);

    // This adds Authorization header internally
    const call = await vapi.start(body);

    return NextResponse.json(call);
  } catch (error: any) {
    console.error("Vapi start error:", error);

    return NextResponse.json(
      {
        error: "Failed to start Vapi call",
        details: error?.message ?? error,
      },
      { status: 500 }
    );
  }
}
