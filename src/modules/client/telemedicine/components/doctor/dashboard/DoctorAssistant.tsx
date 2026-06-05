"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  ChevronRight,
  Database,
  Send,
  Square,
  Stethoscope,
} from "lucide-react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TAppointment } from "@/modules/shared/entities/models/telemedicine/appointment";

// ─── Message types ────────────────────────────────────────────────────────────

type TChatMessage = {
  key: string;
  role: "user" | "assistant";
  content: string;
};
type TToolCall = {
  key: string;
  role: "tool_call";
  toolName: string;
  query: string;
};
type TToolResult = {
  key: string;
  role: "tool_result";
  toolName: string;
  rows: Record<string, unknown>[] | null;
  success: boolean;
};
type TMessage = TChatMessage | TToolCall | TToolResult;

// ─── Stream event types ───────────────────────────────────────────────────────

type StreamEvent =
  | { kind: "text_delta"; token: string }
  | { kind: "text_complete" }
  | { kind: "tool_start"; toolName: string; query: string }
  | {
      kind: "tool_result";
      toolName: string;
      rows: Record<string, unknown>[] | null;
      success: boolean;
    }
  | { kind: "session_id"; id: string }
  | { kind: "done"; sessionId?: string }
  | { kind: "noop" };

function parseLine(raw: string): StreamEvent {
  const line = raw.startsWith("data:") ? raw.slice(5).trim() : raw.trim();
  if (!line) return { kind: "noop" };
  if (line === "[DONE]") return { kind: "done" };
  if (
    raw.startsWith("event:") ||
    raw.startsWith("id:") ||
    raw.startsWith("retry:")
  )
    return { kind: "noop" };

  try {
    const p = JSON.parse(line);
    switch (p.type) {
      case "text_delta": {
        const token = p.message ?? p.data?.content ?? p.content ?? "";
        return { kind: "text_delta", token: String(token) };
      }
      case "text_complete":
        return { kind: "text_complete" };
      case "tool_start": {
        const query = p.query?.query ?? JSON.stringify(p.query ?? {}, null, 2);
        return { kind: "tool_start", toolName: p.name ?? "query", query };
      }
      case "tool_result": {
        let rows: Record<string, unknown>[] | null = null;
        try {
          const raw = p.output ?? p.results;
          const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
          rows = Array.isArray(parsed)
            ? parsed
            : parsed != null
              ? [parsed]
              : null;
        } catch {
          /* ignore */
        }
        return {
          kind: "tool_result",
          toolName: p.tool ?? p.name ?? "query",
          rows,
          success: p.success ?? true,
        };
      }
      case "agent_end":
        return { kind: "done", sessionId: p.session_id };
      default: {
        if (p.session_id) return { kind: "session_id", id: p.session_id };
        // legacy fallbacks
        const flat = p.content ?? p.text ?? p.delta;
        if (typeof flat === "string")
          return { kind: "text_delta", token: flat };
        if (Array.isArray(p.choices)) {
          const c = p.choices[0]?.delta?.content;
          if (c !== undefined) return { kind: "text_delta", token: String(c) };
          if (p.choices[0]?.finish_reason) return { kind: "done" };
        }
        return { kind: "noop" };
      }
    }
  } catch {
    return raw.trim()
      ? { kind: "text_delta", token: raw.trim() }
      : { kind: "noop" };
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SqlQueryBlock({
  toolName,
  query,
}: {
  toolName: string;
  query: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-muted/40 text-xs overflow-hidden">
      <button
        className="flex w-full items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <Database className="size-3 shrink-0 text-primary" />
        <span className="font-medium flex-1 text-left capitalize">
          {toolName.replace(/_/g, " ")}
        </span>
        {expanded ? (
          <ChevronDown className="size-3" />
        ) : (
          <ChevronRight className="size-3" />
        )}
      </button>
      {expanded && (
        <pre className="px-3 pb-3 text-[11px] text-foreground/80 overflow-x-auto whitespace-pre leading-relaxed border-t border-border">
          {query}
        </pre>
      )}
    </div>
  );
}

function ResultTable({ rows }: { rows: Record<string, unknown>[] }) {
  if (rows.length === 0)
    return (
      <p className="text-xs text-muted-foreground py-1 px-2">
        No rows returned.
      </p>
    );

  const columns = Object.keys(rows[0]);

  return (
    <div className="rounded-lg border border-border text-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="border-collapse w-max">
          <thead className="bg-muted">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-left font-semibold text-foreground whitespace-nowrap border-b border-border"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b border-border last:border-0",
                  i % 2 === 0 ? "bg-background" : "bg-muted/30",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-3 py-2 text-foreground/80 whitespace-nowrap max-w-[160px] truncate"
                  >
                    {row[col] === null || row[col] === undefined ? (
                      <span className="text-muted-foreground/60 italic">
                        null
                      </span>
                    ) : (
                      String(row[col])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildApiMessage(text: string, apt: TAppointment | null): string {
  if (!apt) return text;
  const parts: string[] = [];
  if (apt.fhirAppointmentId != null)
    parts.push(`appointment_id=${apt.fhirAppointmentId}`);
  if (apt.patient?.fhirPatientId != null)
    parts.push(`patient_id=${apt.patient.fhirPatientId}`);
  if (apt.fhirEncounterId != null)
    parts.push(`encounter_id=${apt.fhirEncounterId}`);
  return parts.length ? `[FHIR context: ${parts.join(", ")}]\n\n${text}` : text;
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  selectedAppointment: TAppointment | null;
}

export function DoctorAssistant({ selectedAppointment }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [liveText, setLiveText] = useState("");

  const abortRef = useRef<AbortController | null>(null);
  const liveRef = useRef("");
  const bottomRef = useRef<HTMLDivElement>(null);

  console.log(messages);

  useEffect(() => {
    setMessages([]);
    setSessionId(null);
    setLiveText("");
    liveRef.current = "";
  }, [selectedAppointment?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveText]);

  const stopStreaming = useCallback(() => abortRef.current?.abort(), []);

  const flushText = useCallback(() => {
    const text = liveRef.current;
    liveRef.current = "";
    setLiveText("");
    if (text.trim()) {
      setMessages((prev) => [
        ...prev,
        { key: nanoid(), role: "assistant", content: text },
      ]);
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      setMessages((prev) => [
        ...prev,
        { key: nanoid(), role: "user", content: text },
      ]);
      setInput("");
      setIsStreaming(true);
      liveRef.current = "";
      setLiveText("");

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/text-to-sql-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: buildApiMessage(text, selectedAppointment),
            session_id: sessionId,
          }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Agent responded ${res.status}`);

        const sid = res.headers.get("X-Session-Id");
        if (sid) setSessionId(sid);

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let leftover = "";

        outer: while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const lines = (
            leftover + decoder.decode(value, { stream: true })
          ).split("\n");
          leftover = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.trim()) continue;
            const event = parseLine(line);
            switch (event.kind) {
              case "text_delta":
                liveRef.current += event.token;
                setLiveText(liveRef.current);
                break;
              case "tool_start":
                if (liveRef.current.trim()) flushText();
                setMessages((prev) => [
                  ...prev,
                  {
                    key: nanoid(),
                    role: "tool_call",
                    toolName: event.toolName,
                    query: event.query,
                  },
                ]);
                break;
              case "tool_result":
                setMessages((prev) => [
                  ...prev,
                  {
                    key: nanoid(),
                    role: "tool_result",
                    toolName: event.toolName,
                    rows: event.rows,
                    success: event.success,
                  },
                ]);
                break;
              case "session_id":
                setSessionId(event.id);
                break;
              case "done":
                if (event.sessionId) setSessionId(event.sessionId);
                break outer;
            }
          }
        }

        if (leftover.trim()) {
          const event = parseLine(leftover);
          if (event.kind === "text_delta") liveRef.current += event.token;
          if (event.kind === "session_id") setSessionId(event.id);
        }
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Failed to get response. Please try again.");
        }
      } finally {
        flushText();
        setIsStreaming(false);
      }
    },
    [isStreaming, selectedAppointment, sessionId, flushText],
  );

  const patientName = selectedAppointment?.patient?.personal?.name;
  const hasFhirContext =
    selectedAppointment != null &&
    (selectedAppointment.fhirAppointmentId != null ||
      selectedAppointment.patient?.fhirPatientId != null);

  return (
    <>
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
          className="flex h-full w-[520px] flex-col gap-0 p-0 sm:max-w-[520px]"
        >
          <SheetHeader className="border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Bot className="size-4 text-primary-foreground" />
              </div>
              <SheetTitle className="text-base">Medical Assistant</SheetTitle>
            </div>
            {selectedAppointment && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {patientName && (
                  <Badge variant="secondary" className="text-xs">
                    <span className="font-semibold">Patient:</span>
                    {patientName}
                  </Badge>
                )}
                {hasFhirContext && (
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground"
                  >
                    EMR Data
                  </Badge>
                )}
              </div>
            )}
          </SheetHeader>

          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 py-3">
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

            <div className="flex flex-col gap-3 min-w-0 w-full">
              {messages.map((msg) => {
                if (msg.role === "user")
                  return (
                    <div key={msg.key} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-primary-foreground">
                        {msg.content}
                      </div>
                    </div>
                  );
                if (msg.role === "assistant")
                  return (
                    <div key={msg.key} className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                        {msg.content}
                      </div>
                    </div>
                  );
                if (msg.role === "tool_call") return null;
                if (msg.role === "tool_result")
                  return (
                    <div
                      key={msg.key}
                      className="w-full min-w-0 overflow-hidden"
                    >
                      {msg.rows ? (
                        <ResultTable rows={msg.rows} />
                      ) : (
                        <p className="text-xs text-muted-foreground px-2">
                          {msg.success ? "No rows returned." : "Query failed."}
                        </p>
                      )}
                    </div>
                  );
                return null;
              })}

              {isStreaming && (
                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">
                    {liveText || (
                      <span className="inline-flex gap-0.5 items-center">
                        <span className="animate-bounce size-1 rounded-full bg-muted-foreground [animation-delay:0ms]" />
                        <span className="animate-bounce size-1 rounded-full bg-muted-foreground [animation-delay:150ms]" />
                        <span className="animate-bounce size-1 rounded-full bg-muted-foreground [animation-delay:300ms]" />
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t px-4 py-3">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
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
