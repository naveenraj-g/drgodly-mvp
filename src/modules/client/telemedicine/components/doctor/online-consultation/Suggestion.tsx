"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type TranscriptItem = {
  name: string;
  text: string;
  timestamp: string;
};

function roleFromName(name: string): "DOCTOR" | "PATIENT" {
  const s = name.toLowerCase();
  if (s.includes("(doctor)")) return "DOCTOR";
  if (s.includes("(patient)")) return "PATIENT";
  return s.includes("doctor") ? "DOCTOR" : "PATIENT";
}

// Trigger a suggestion after this many patient turns since the last suggestion
const PATIENT_TURNS_BEFORE_SUGGEST = 2;

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++)
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return String(h);
}

export default function Suggestion({
  transcripts,
  notes = "",
  lang = "en",
  maxTurns = 18,
  cooldownMs = 900,
}: {
  transcripts: TranscriptItem[];
  notes?: string;
  lang?: string;
  maxTurns?: number;
  cooldownMs?: number;
}) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[][]>([]);

  const abortRef = useRef<AbortController | null>(null);
  const lastCtxHashRef = useRef("");
  const lastFireAtRef = useRef(0);
  const patientTurnCountRef = useRef(0);

  const { conversation, lastRole, lastText } = useMemo(() => {
    const recent = transcripts.slice(-maxTurns).filter((t) => t.text?.trim());
    const lines = recent.map(
      (t) => `${roleFromName(t.name)}: ${t.text.trim()}`,
    );
    if (notes?.trim()) {
      lines.push(`DOCTOR NOTES: ${notes.trim()}`);
    }
    const last = recent.at(-1);
    return {
      conversation: lines,
      lastRole: last ? roleFromName(last.name) : undefined,
      lastText: last?.text?.trim() || "",
    };
  }, [transcripts, notes, maxTurns]);

  async function generate() {
    const now = Date.now();
    if (now - lastFireAtRef.current < cooldownMs) return;

    const ctxHash = hash(
      conversation.join("\n") + "::" + history.flat().join("|") + "::" + lang,
    );
    if (ctxHash === lastCtxHashRef.current) return;

    lastCtxHashRef.current = ctxHash;
    lastFireAtRef.current = now;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setQuestions([]);
    setLoading(true);

    try {
      const res = await fetch("/api/suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation }),
        signal: ac.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const fetched: string[] = Array.isArray(data?.questions)
        ? data.questions.filter((q: any) => typeof q === "string" && q.trim())
        : [];

      if (fetched.length > 0) {
        setQuestions(fetched);
        setHistory((h) =>
          h.length >= 4 ? [...h.slice(1), fetched] : [...h, fetched],
        );
      }
    } catch {
      // ignore AbortError / transient errors
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!lastRole || !lastText) return;
    if (lastRole === "PATIENT") {
      patientTurnCountRef.current += 1;
      if (patientTurnCountRef.current >= PATIENT_TURNS_BEFORE_SUGGEST) {
        patientTurnCountRef.current = 0;
        generate();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastRole, lastText]);

  return (
    <div className="rounded-2xl border p-4 space-y-3 bg-secondary overflow-auto max-h-64">
      <div className="text-xs font-medium text-muted-foreground">
        Suggested questions
      </div>

      {loading ? (
        <div className="text-xs text-muted-foreground animate-pulse">
          Generating suggestions…
        </div>
      ) : questions.length > 0 ? (
        <ol className="space-y-1.5 list-none">
          {questions.map((q, i) => (
            <li key={i} className="flex gap-2 text-sm text-black dark:text-white">
              <span className="shrink-0 w-4 text-muted-foreground font-mono">
                {i + 1}.
              </span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="text-xs text-muted-foreground">
          — waiting for patient —
        </div>
      )}

      {history.length > 0 && (
        <div className="pt-2 border-t space-y-2">
          <div className="text-[11px] text-muted-foreground">
            Previous suggestions
          </div>
          {history.slice(0, -1).map((set, si) => (
            <ol key={si} className="space-y-1 list-none">
              {set.map((q, qi) => (
                <li
                  key={qi}
                  className="flex gap-2 text-xs text-muted-foreground"
                >
                  <span className="shrink-0 w-4 font-mono">{qi + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
          ))}
        </div>
      )}
    </div>
  );
}
