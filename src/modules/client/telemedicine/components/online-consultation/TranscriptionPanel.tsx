"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Transcript = {
  name: string;
  text: string;
  timestamp: string;
};

interface Props {
  roomId: string;
  transcripts: Transcript[];
  setTranscripts: (transcript: {
    name: string;
    text: string;
    timestamp: string;
  }) => void;
}

export function TranscriptPanel({
  transcripts,
  setTranscripts,
  roomId,
}: Props) {
  const [error, setError] = useState<string | null>();

  const bottomRef = useRef<HTMLDivElement>(null);

  // Start Transcriber
  useEffect(() => {
    fetch("/api/livekit-start-transcriber", {
      method: "POST",
      body: JSON.stringify({ roomId }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => console.log(res.json()))
      .catch((e) => setError("Failed to get transcripts"));
  }, [roomId]);

  // SSE Subscription
  useEffect(() => {
    setError(null);
    const pyUrl = "https://agent.drgodly.com";

    if (!pyUrl) {
      setError("Failed to get transcripts");
    }

    // disconnect this when meeting finished
    // eventSource.close();
    const eventSource = new EventSource(
      `${pyUrl}/transcript-stream?roomId=${roomId}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.text) {
          // Format timestamp HH:MM from ISO or raw
          let timeStr = "";
          try {
            const date = new Date(data.timestamp);
            timeStr = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          } catch {
            timeStr = "";
          }

          if (error) setError(null);
          setTranscripts({
            timestamp: timeStr,
            name: data.participantName,
            text: data.text,
          });
        }
      } catch (e) {
        console.log(e);
        setError("Failed to get transcripts");
      }
    };

    eventSource.onerror = (err) => {
      console.log("SSE Error", err);
      setError("Failed to get transcripts");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [roomId]);

  // Auto-scroll
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcripts]);

  return (
    <div className="bg-secondary rounded-md flex flex-col overflow-y-auto h-full">
      <div className="p-4 border-b border-border font-semibold text-foreground/90">
        Live Transcript
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <p className="text-destructive inline-flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </p>
        )}

        {!error && transcripts.length === 0 && (
          <div className="text-muted-foreground text-sm text-center italic mt-10">
            Waiting for speech...
          </div>
        )}

        {!error &&
          transcripts.map((t, i) => (
            <div key={i} className="flex flex-col start">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-muted-foreground font-mono">
                  [{t.timestamp}]
                </span>
                <span className="text-sm font-semibold text-primary">
                  {t.name}
                </span>
              </div>
              <p className="text-foreground/80 text-sm pl-1">{t.text}</p>
            </div>
          ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
