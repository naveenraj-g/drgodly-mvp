// app/api/coach/route.ts
import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";

export const runtime = "edge";
const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(req: NextRequest) {
  const { dialogue, prevSuggestions = [], lang = "en" } = await req.json();

  const system = [
    "You assist a doctor during a live teleconsultation.",
    "Return ONE follow-up QUESTION only (no preamble).",
    "Be specific, empathetic, clinically relevant.",
    "Prefer SOCRATES clarifications, red flags, meds, allergies, relevant history.",
    "Max 22 words. Avoid diagnosis statements. Match conversation language.",
  ].join(" ");

  const prompt = `
Recent dialogue (latest last):
${dialogue}

Previously suggested questions (avoid repeating):
${
  prevSuggestions.length
    ? prevSuggestions.map((q: any, i: any) => `${i + 1}. ${q}`).join("\n")
    : "(none)"
}

The patient just finished speaking. Provide the NEXT BEST QUESTION for the doctor to ask.
`.trim();

  try {
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system,
      prompt,
      temperature: 0.5,
      maxOutputTokens: 100,
    });
    return result.toTextStreamResponse();
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to suggest." }, { status: 500 });
  }
}
