import { streamText, UIMessage, convertToModelMessages } from "ai";
// import { createOpenAI } from "@ai-sdk/openai";
import { groq } from "@ai-sdk/groq";
import { SYSTEM_PROMPT } from "./prompt";

// export const groq = createOpenAI({
//   baseURL: "https://api.groq.com/openai/v1",
//   apiKey: process.env.GROQ_API_TEST_KEY!,
// });

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  try {
    const response = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: SYSTEM_PROMPT,
      // prompt: `Generate UI for: ${prompt}. Return only JSON.`,
      messages: convertToModelMessages(messages),
    });

    return response.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error generating UI:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate UI",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
