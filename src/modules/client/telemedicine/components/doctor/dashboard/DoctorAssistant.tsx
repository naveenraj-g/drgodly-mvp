"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Send, Square, Stethoscope } from "lucide-react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TAppointment } from "@/modules/shared/entities/models/telemedicine/appointment";

type TMessage = {
  key: string;
  from: "user" | "assistant";
  content: string;
};

interface Props {
  selectedAppointment: TAppointment | null;
}

function buildApiMessage(userText: string, appointment: TAppointment | null): string {
  if (!appointment) return userText;

  const parts: string[] = [];
  if (appointment.fhirAppointmentId != null) {
    parts.push(`appointment_id=${appointment.fhirAppointmentId}`);
  }
  if (appointment.patient?.fhirPatientId != null) {
    parts.push(`patient_id=${appointment.patient.fhirPatientId}`);
  }
  if (appointment.fhirEncounterId != null) {
    parts.push(`encounter_id=${appointment.fhirEncounterId}`);
  }

  if (parts.length === 0) return userText;
  return `[FHIR context: ${parts.join(", ")}]\n\n${userText}`;
}

function parseChunkLine(raw: string): { token: string | null; done: boolean; sessionId?: string } {
  const line = raw.startsWith("data:") ? raw.slice(5).trim() : raw.trim();
  if (!line || line === "[DONE]") return { token: null, done: line === "[DONE]" };
  if (raw.startsWith("event:") || raw.startsWith("id:") || raw.startsWith("retry:")) {
    return { token: null, done: false };
  }

  try {
    const parsed = JSON.parse(line);
    const { type, data } = parsed;

    if (type === "text_delta") return { token: data?.content ?? "", done: false };
    if (type === "agent_end") return { token: null, done: true, sessionId: parsed.session_id };
    if (type === "text_complete") return { token: null, done: false };
    if (["token", "message", "chunk", "stream", "text"].includes(type)) {
      const text = data?.content ?? parsed.content ?? parsed.text ?? parsed.delta ?? "";
      return { token: String(text), done: false };
    }
    if (["done", "end", "finish"].includes(type)) {
      return { token: null, done: true, sessionId: parsed.session_id };
    }
    if (Array.isArray(parsed.choices)) {
      const content = parsed.choices[0]?.delta?.content;
      if (content !== undefined) return { token: String(content), done: false };
      if (parsed.choices[0]?.finish_reason) return { token: null, done: true };
    }
    const flat = parsed.content ?? parsed.text ?? parsed.delta;
    if (typeof flat === "string") return { token: flat, done: false };
    if (typeof parsed === "string") return { token: parsed, done: false };
    return { token: null, done: false };
  } catch {
    return { token: line, done: false };
  }
}

export function DoctorAssistant({ selectedAppointment }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");

  const abortRef = useRef<AbortController | null>(null);
  const liveTextRef = useRef("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Reset session when selected appointment changes
  useEffect(() => {
    setMessages([]);
    setSessionId(null);
    setLiveTranscript("");
    liveTextRef.current = "";
  }, [selectedAppointment?.id]);

  // Auto-scroll to bottom on new messages or live transcript update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveTranscript]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: TMessage = { key: nanoid(), from: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsStreaming(true);
      liveTextRef.current = "";
      setLiveTranscript("");

      const controller = new AbortController();
      abortRef.current = controller;

      const apiMessage = buildApiMessage(text, selectedAppointment);

      try {
        const res = await fetch("/api/text-to-sql-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: apiMessage, session_id: sessionId }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Agent responded ${res.status}`);

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

        if (leftover.trim()) {
          const result = parseChunkLine(leftover);
          if (result.token !== null) appendToken(result.token);
          if (result.sessionId) setSessionId(result.sessionId);
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          // silently swallow cancel
        } else {
          console.error("[DoctorAssistant] stream error:", err);
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
      }
    },
    [isStreaming, selectedAppointment, sessionId],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const patientName = selectedAppointment?.patient?.personal?.name;
  const hasFhirContext =
    selectedAppointment != null &&
    (selectedAppointment.fhirAppointmentId != null ||
      selectedAppointment.patient?.fhirPatientId != null);

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-3",
          "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90",
          "transition-all duration-200 hover:shadow-xl hover:scale-105",
        )}
        aria-label="Open assistant"
      >
        <Stethoscope className="size-5" />
        <span className="text-sm font-medium">Assistant</span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex h-full w-[420px] flex-col gap-0 p-0 sm:max-w-[420px]"
        >
          <SheetHeader className="border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Bot className="size-4 text-primary-foreground" />
              </div>
              <SheetTitle className="text-base">Medical Assistant</SheetTitle>
            </div>

            {/* Appointment context badge */}
            {selectedAppointment && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {patientName && (
                  <Badge variant="secondary" className="text-xs">
                    Patient: {patientName}
                  </Badge>
                )}
                {hasFhirContext && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    FHIR context attached
                  </Badge>
                )}
              </div>
            )}
          </SheetHeader>

          {/* Messages area */}
          <ScrollArea className="flex-1 min-h-0 px-4 py-3">
            {messages.length === 0 && !isStreaming && (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <Bot className="size-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">How can I help?</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedAppointment
                      ? "Ask anything about this appointment or patient data."
                      : "Select an appointment or ask a general question."}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.key}
                  className={cn(
                    "flex",
                    msg.from === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                      msg.from === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm",
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Live streaming transcript */}
              {isStreaming && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">
                    {liveTranscript || (
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="inline-flex gap-0.5">
                          <span className="animate-bounce size-1 rounded-full bg-muted-foreground [animation-delay:0ms]" />
                          <span className="animate-bounce size-1 rounded-full bg-muted-foreground [animation-delay:150ms]" />
                          <span className="animate-bounce size-1 rounded-full bg-muted-foreground [animation-delay:300ms]" />
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="border-t px-4 py-3">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask something…"
                disabled={isStreaming}
                className="flex-1 text-sm"
              />
              {isStreaming ? (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={stopStreaming}
                  className="shrink-0"
                >
                  <Square className="size-4" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="shrink-0"
                >
                  <Send className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
