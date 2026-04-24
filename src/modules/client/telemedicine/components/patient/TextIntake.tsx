"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Loader2, Send, Square } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { bookIntakeAppointment } from "../../server-actions/appointment-action";
import { TSharedUser } from "@/modules/shared/types";
import { usePatientModalStore } from "../../stores/patient-modal-store";
import ConversationChat from "./chat/Conversation";

type TMessageItem = {
  key: string;
  from: "user" | "assistant";
  content?: string;
  versions?: { id: string; content: string }[];
  attachments?: {
    type: "file";
    url: string;
    mediaType: string;
    filename?: string;
  }[];
};

interface TProps {
  user: TSharedUser;
}

function TextIntake({ user }: TProps) {
  const openModal = usePatientModalStore((state) => state.onOpen);

  const [messages, setMessages] = useState<TMessageItem[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [endingPhase, setEndingPhase] = useState<"idle" | "report" | "saving">("idle");

  const abortRef = useRef<AbortController | null>(null);
  const liveTextRef = useRef("");

  const { execute, isPending } = useServerAction(bookIntakeAppointment, {
    onSuccess({ data }) {
      toast.success("Intake session completed.", {
        description: "You can now book an appointment with a doctor!",
      });
      openModal({ type: "intakeComplete", intakeAppointmentId: data.id });
    },
    onError() {
      toast.error("Something went wrong!", {
        description: "Please try again later.",
      });
    },
  });

  const parseChunkLine = useCallback(
    (
      raw: string,
    ): { token: string | null; done: boolean; sessionId?: string } => {
      const line = raw.startsWith("data:") ? raw.slice(5).trim() : raw.trim();

      if (!line || line === "[DONE]")
        return { token: null, done: line === "[DONE]" };
      if (
        raw.startsWith("event:") ||
        raw.startsWith("id:") ||
        raw.startsWith("retry:")
      )
        return { token: null, done: false };

      try {
        const parsed = JSON.parse(line);
        const { type, data } = parsed;

        // Incremental token: { type: "text_delta", data: { content: "..." } }
        if (type === "text_delta") {
          return { token: data?.content ?? "", done: false };
        }

        // End of stream: { type: "agent_end", ... }
        if (type === "agent_end") {
          return { token: null, done: true, sessionId: parsed.session_id };
        }

        // text_complete is the full assembled text — skip it, already streamed
        if (type === "text_complete") {
          return { token: null, done: false };
        }

        // Generic { type: "token"|"message"|"chunk", content/data.content: string }
        if (
          type === "token" ||
          type === "message" ||
          type === "chunk" ||
          type === "stream" ||
          type === "text"
        ) {
          const text =
            data?.content ??
            parsed.content ??
            parsed.text ??
            parsed.delta ??
            "";
          return { token: String(text), done: false };
        }

        // Done signals
        if (type === "done" || type === "end" || type === "finish") {
          return { token: null, done: true, sessionId: parsed.session_id };
        }

        // OpenAI delta: { choices: [{ delta: { content: "..." } }] }
        if (Array.isArray(parsed.choices)) {
          const content = parsed.choices[0]?.delta?.content;
          if (content !== undefined)
            return { token: String(content), done: false };
          if (parsed.choices[0]?.finish_reason)
            return { token: null, done: true };
        }

        // Flat fallback
        const flat = parsed.content ?? parsed.text ?? parsed.delta;
        if (typeof flat === "string") return { token: flat, done: false };
        if (typeof parsed === "string") return { token: parsed, done: false };

        return { token: null, done: false };
      } catch {
        return { token: line, done: false };
      }
    },
    [],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: TMessageItem = {
        key: nanoid(),
        from: "user",
        content: text,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsStreaming(true);
      liveTextRef.current = "";
      setLiveTranscript("");

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/intake-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, session_id: sessionId }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Agent responded ${res.status}`);
        }

        const newSessionId = res.headers.get("X-Session-Id");
        if (newSessionId) setSessionId(newSessionId);

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let leftover = "";

        const appendToken = (token: string) => {
          liveTextRef.current += token;
          setLiveTranscript(liveTextRef.current);
        };

        outer: while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = (leftover + chunk).split("\n");
          leftover = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.trim()) continue;
            const result = parseChunkLine(line);
            if (result.sessionId) setSessionId(result.sessionId);
            if (result.token !== null) appendToken(result.token);
            if (result.done) break outer;
          }
        }

        // flush any remaining partial line
        if (leftover.trim()) {
          const result = parseChunkLine(leftover);
          if (result.token !== null) appendToken(result.token);
          if (result.sessionId) setSessionId(result.sessionId);
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          toast.info("Streaming cancelled.");
        } else {
          console.error("Stream error:", err);
          toast.error("Failed to get response. Please try again.");
        }
      } finally {
        const finalText = liveTextRef.current;
        liveTextRef.current = "";
        setLiveTranscript("");
        if (finalText.trim()) {
          setMessages((prev) => [
            ...prev,
            { key: nanoid(), from: "assistant", content: finalText },
          ]);
        }
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming, sessionId, parseChunkLine],
  );

  const cancelStream = () => abortRef.current?.abort();

  const generateReport = async (
    conversation: TMessageItem[]
  ): Promise<unknown> => {
    try {
      const formatted = conversation.map((m) => {
        const text = m.content ?? m.versions?.[0]?.content ?? "";
        const speaker =
          m.from === "assistant" ? "appointment-intake-agent" : "patient";
        return `${speaker}: ${text}`;
      });

      const res = await fetch("/api/assessment-plan-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation: formatted }),
      });

      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const endChat = async () => {
    if (isStreaming) cancelStream();
    if (messages.length === 0) {
      toast.info("No conversation to save yet.");
      return;
    }
    try {
      setEndingPhase("report");
      const intakeReport = await generateReport(messages);
      setEndingPhase("saving");
      await execute({
        orgId: user.orgId,
        patientUserId: user.id,
        intakeConversation: messages,
        intakeReport,
      });
    } finally {
      setEndingPhase("idle");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full overflow-hidden h-[calc(100dvh-152px)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border bg-card shadow-sm">
        <div
          className={`bg-primary/10 rounded-full p-2 shrink-0 ${
            isStreaming ? "animate-pulse-scale" : ""
          }`}
        >
          <Brain className="size-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-none">Bezs AI</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Intake Assistant
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`size-2 rounded-full ${
              isStreaming ? "bg-amber-400 animate-pulse" : "bg-emerald-500"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {isStreaming ? "Thinking..." : "Online"}
          </span>
        </div>
      </div>

      <ConversationChat
        messages={messages}
        liveTranscript={liveTranscript}
        liveRole={isStreaming ? "assistant" : null}
        isLoading={isStreaming}
        user={user}
      />

      <div className="flex gap-2 items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isStreaming || endingPhase !== "idle"}
          className="flex-1"
        />
        {isStreaming ? (
          <Button
            size="icon"
            variant="outline"
            onClick={cancelStream}
            title="Stop"
          >
            <Square className="size-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || endingPhase !== "idle"}
          >
            <Send className="size-4" />
          </Button>
        )}
        <Button
          size="sm"
          variant="destructive"
          onClick={endChat}
          disabled={endingPhase !== "idle" || (messages.length === 0 && !isStreaming)}
          className="px-4 rounded-2xl h-7"
        >
          {endingPhase === "report" ? (
            <>
              <Loader2 className="animate-spin mr-1 size-3" />
              Generating...
            </>
          ) : endingPhase === "saving" ? (
            <>
              <Loader2 className="animate-spin mr-1 size-3" />
              Saving...
            </>
          ) : (
            "End Chat"
          )}
        </Button>
      </div>
    </div>
  );
}

export default TextIntake;
