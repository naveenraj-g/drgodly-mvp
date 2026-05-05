"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { toast } from "sonner";
import { RoomControlUI } from "../../online-consultation/RoomControl";
import { TranscriptPanel } from "../../online-consultation/TranscriptionPanel";
import { Button } from "@/components/ui/button";
import { Clock, Loader2, MessageSquare, MessageSquareOff } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

type Transcript = {
  name: string;
  text: string;
  timestamp: string;
};

type Details = {
  doctor: {
    name: string | undefined;
    speciality: string;
  };
  patient: {
    name: string | undefined;
  };
};

export default function Consult({
  roomId,
  participant,
  details,
}: {
  roomId: string;
  participant: { name?: string };
  details: Details;
}) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isEnded, setIsEnded] = useState(false);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [livekitUrl, setLivekitUrl] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch("/api/livekit-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId, name: participant.name }),
        });
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
        toast.error("Something went wrong");
      }
    })();
  }, [roomId, participant.name]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/runtime-config", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch runtime config");
        const data = await res.json();
        setLivekitUrl(data.livekitUrl);
      } catch {
        toast.error("Failed to connect", {
          description: "Please try again later.",
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (!token || !livekitUrl) return;
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [token, livekitUrl]);

  if (!token || !livekitUrl) {
    return (
      <div className="flex items-center justify-center mt-20">
        <p className="inline-flex items-center gap-2 text-muted-foreground">
          <Loader2 className="animate-spin" /> Connecting to consultation...
        </p>
      </div>
    );
  }

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return h > 0 ? `${h}:${m}:${sec}` : `${m}:${sec}`;
  };

  const onLeave = () => {
    setIsEnded(true);
    setTranscripts([]);
    toast.success("Consultation ended");
    router.push("/bezs/telemedicine/patient/appointments");
  };

  function captureTranscript(transcript: Transcript) {
    setTranscripts((prev) => [...prev, transcript]);
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={livekitUrl}
      data-lk-theme="default"
      onDisconnected={onLeave}
      className="!bg-transparent !shadow-none !h-[calc(100vh-182px)]"
      style={
        {
          "--lk-accent-bg": "var(--primary)",
          "--lk-accent-fg": "var(--primary-foreground)",
        } as React.CSSProperties
      }
    >
      <div className="flex flex-col h-full w-full gap-2">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-secondary border border-border shrink-0">
          <div className="flex items-center gap-4">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">
                Live
              </span>
            </div>

            <div className="h-4 w-px bg-border" />

            <div className="text-sm leading-tight">
              <p className="text-muted-foreground text-xs">Doctor</p>
              <p className="font-medium text-secondary-foreground">
                {details.doctor.name}
                <span className="text-muted-foreground font-normal text-xs ml-1">
                  · {details.doctor.speciality}
                </span>
              </p>
            </div>

            <div className="h-4 w-px bg-border" />

            <div className="text-sm leading-tight">
              <p className="text-muted-foreground text-xs">Patient</p>
              <p className="font-medium text-secondary-foreground">
                {details.patient.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Timer */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground px-3 py-1 rounded-lg bg-background border border-border">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-mono tabular-nums text-xs">
                {formatTime(elapsed)}
              </span>
            </div>

            {/* Transcript toggle */}
            <Button
              size="sm"
              variant={showTranscript ? "secondary" : "outline"}
              onClick={() => setShowTranscript((v) => !v)}
              className="gap-1.5"
            >
              {showTranscript ? (
                <MessageSquareOff className="h-4 w-4" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
              {showTranscript ? "Hide Transcript" : "Live Transcript"}
            </Button>

            <Button onClick={onLeave} size="sm" variant="destructive">
              Leave
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 gap-2 min-h-0">
          <div className="flex-1 min-h-0">
            <RoomControlUI />
          </div>

          {showTranscript && !isEnded && (
            <aside className="w-[380px] min-h-0 overflow-auto">
              <TranscriptPanel
                roomId={roomId}
                transcripts={transcripts}
                setTranscripts={captureTranscript}
              />
            </aside>
          )}
        </div>
      </div>
    </LiveKitRoom>
  );
}
