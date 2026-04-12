import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { transformStream } from "@crayonai/stream";
import { DBMessage, getMessageStore } from "./messageStore";
import { tools } from "./tools";
import { telemedicineSystemPrompt } from "./prompt";
import {
  addMessages,
  getLLMThreadMessages,
} from "@/modules/client/home/threadService";
import { ChatCompletionMessageParam } from "openai/resources";

type ThreadId = string;

export async function POST(req: NextRequest) {
  try {
    const { prompt, threadId, responseId } = (await req.json()) as {
      prompt: {
        role: "user";
        content: string;
        id: string;
      };
      threadId: ThreadId;
      responseId: string;
    };

    const client = new OpenAI({
      baseURL: "https://api.thesys.dev/v1/embed/",
      apiKey: process.env.THESYS_API_KEY,
    });

    const messageStore = getMessageStore(threadId);

    messageStore.addMessage(prompt);

    const llmStream = await client.chat.completions.runTools({
      model: "c1/anthropic/claude-sonnet-4/v-20250617",
      messages: [
        { role: "system", content: telemedicineSystemPrompt },
        ...messageStore.getOpenAICompatibleMessageList(),
      ],
      tools,
      tool_choice: "auto",
      stream: true,
    });

    // const runToolsResponse = client.chat.completions.runTools({
    //   model: "c1/anthropic/claude-3.5-sonnet/v-20250617", // available models: https://docs.thesys.dev/guides/models-pricing#model-table
    //   messages: [
    //     { role: "system", content: telemedicineSystemPrompt },
    //     ...(await getLLMThreadMessages(threadId)),
    //     {
    //       role: "user",
    //       content: prompt.content!,
    //     },
    //   ],
    //   stream: true,
    //   tools,
    // });

    // const allRunToolsMessages: ChatCompletionMessageParam[] = [];
    // let isError = false;

    // runToolsResponse.on("error", () => {
    //   isError = true;
    // });

    // runToolsResponse.on("message", (message) => {
    //   allRunToolsMessages.push(message);
    // });

    // runToolsResponse.on("end", async () => {
    //   // store messages on end only if there is no error
    //   if (isError) {
    //     return;
    //   }

    //   const runToolsMessagesWithId = allRunToolsMessages.map((m, index) => {
    //     const id =
    //       allRunToolsMessages.length - 1 === index // for last message (the response shown to user), use the responseId as provided by the UI
    //         ? responseId
    //         : crypto.randomUUID();

    //     return {
    //       ...m,
    //       id,
    //     };
    //   });

    //   const messagesToStore = [prompt, ...runToolsMessagesWithId];

    //   await addMessages(threadId, ...messagesToStore);
    // });

    // const llmStream = await runToolsResponse;

    // const responseStream = transformStream(llmStream, (chunk) => {
    //   return chunk.choices[0]?.delta?.content;
    // });

    //

    const responseStream = transformStream(
      llmStream,
      (chunk) => {
        // const delta = chunk?.choices?.[0]?.delta;
        // return delta.content;
        return chunk.choices[0]?.delta?.content || "";
      },
      {
        onEnd: ({ accumulated }) => {
          const message = accumulated.filter((message) => message).join("");
          messageStore.addMessage({
            role: "assistant",
            content: message,
            id: responseId,
          });
        },
      },
    ) as ReadableStream;

    return new NextResponse(responseStream as ReadableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.log({ err });
  }
}
