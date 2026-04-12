// components/CoachSuggestion.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type TranscriptItem = {
  name: string; // e.g. "Alice (Doctor)" or "Bob (Patient)"
  text: string;
  timestamp: string; // ISO string or sortable
};

function roleFromName(name: string): "DOCTOR" | "PATIENT" {
  const s = name.toLowerCase();
  if (s.includes("(doctor)")) return "DOCTOR";
  if (s.includes("(patient)")) return "PATIENT";
  return s.includes("doctor") ? "DOCTOR" : "PATIENT";
}

function hash(str: string) {
  // lightweight UI-only hash for dedupe
  let h = 0;
  for (let i = 0; i < str.length; i++)
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return String(h);
}

export default function Suggestion({
  transcripts,
  lang = "en",
  maxTurns = 18,
  cooldownMs = 900,
}: {
  transcripts: TranscriptItem[];
  lang?: string;
  maxTurns?: number;
  cooldownMs?: number;
}) {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const lastCtxHashRef = useRef("");
  const lastFireAtRef = useRef(0);
  const [history, setHistory] = useState<string[]>([]); // prior suggestions to avoid repeats

  // Build LLM context from the last N items
  const { dialogue, lastRole, lastText } = useMemo(() => {
    const recent = transcripts.slice(-maxTurns);
    const lines = recent
      .filter((t) => t.text?.trim())
      .map((t) => `${roleFromName(t.name)}: ${t.text.trim()}`);
    const last = recent.at(-1);
    return {
      dialogue: lines.join("\n"),
      lastRole: last ? roleFromName(last.name) : undefined,
      lastText: last?.text?.trim() || "",
    };
  }, [transcripts, maxTurns]);

  // Call /api/coach and stream the question
  async function generate() {
    const now = Date.now();
    if (now - lastFireAtRef.current < cooldownMs) return;

    const ctxHash = hash(dialogue + "::" + history.join("|") + "::" + lang);
    if (ctxHash === lastCtxHashRef.current) return;

    lastCtxHashRef.current = ctxHash;
    lastFireAtRef.current = now;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setSuggestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dialogue,
          prevSuggestions: history,
          lang,
        }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setSuggestion(acc); // live stream
      }
      const finalQ = acc.trim();
      if (finalQ) {
        setHistory((h) =>
          h.length >= 6 ? [...h.slice(1), finalQ] : [...h, finalQ]
        );
      }
    } catch {
      // ignore AbortError / transient errors
    } finally {
      setLoading(false);
    }
  }

  // Trigger automatically:
  // - latest line from PATIENT → generate
  // - latest line from DOCTOR → do nothing (prevents laggy/late suggestions)
  useEffect(() => {
    if (!lastRole) return;
    if (lastRole === "PATIENT" && lastText) {
      generate();
    } else {
      // doctor spoke; if a request was in flight, let it finish or be replaced on next patient line
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastRole, lastText, dialogue, lang, history]);

  return (
    <div className="rounded-2xl border p-4 space-y-2 bg-secondary max-h-40 overflow-auto">
      <div className="text-xs text-muted-foreground">
        Suggested next question
      </div>
      <div className="min-h-8 text-sm whitespace-pre-wrap text-black dark:text-white">
        {loading
          ? suggestion || "Generating…"
          : suggestion || "— waiting for patient —"}
      </div>
      {/* optional: show a tiny history under it */}
      {history.length > 0 && (
        <div className="pt-2 border-t">
          <div className="text-[11px] text-muted-foreground mb-1">
            Previous suggestions
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {history.map((q, i) => (
              <li key={i} className="text-xs text-black dark:text-white">
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
