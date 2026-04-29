"use client";

import { useEffect, useRef, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { toast } from "sonner";
import { RoomControlUI } from "../../online-consultation/RoomControl";
import { TranscriptPanel } from "../../online-consultation/TranscriptionPanel";
import { Button } from "@/components/ui/button";
import Suggestion from "./Suggestion";
import ConsultationNotes from "./ConsultationNotes";
import { Clock, Loader2, MessageSquare, MessageSquareOff } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { completeConsultation } from "@/modules/client/telemedicine/server-actions/appointment-action";

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
  appointmentId,
  orgId,
  userId,
}: {
  roomId: string;
  participant: { name?: string };
  details: Details;
  appointmentId: string;
  orgId: string;
  userId: string;
}) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isEnded, setIsEnded] = useState(false);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [livekitUrl, setLivekitUrl] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const transcriptsRef = useRef<Transcript[]>([]);
  const notesRef = useRef("");
  notesRef.current = notes; // keep ref current without a separate useEffect

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
        toast.error("Failed to load LiveKit config");
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

  const onLeave = async () => {
    if (isCompleting) return;
    setIsCompleting(true);
    setIsEnded(true);

    const currentTranscripts = transcriptsRef.current;
    const currentNotes = notesRef.current;

    const conversation = currentTranscripts
      .filter((t) => t.text?.trim())
      .map((t) => {
        const role = t.name.toLowerCase().includes("doctor")
          ? "DOCTOR"
          : "PATIENT";
        return `${role}: ${t.text.trim()}`;
      });
    if (currentNotes.trim()) {
      conversation.push(`DOCTOR NOTES: ${currentNotes.trim()}`);
    }

    let doctorReport: any = null;
    try {
      const res = await fetch("/api/doctor-report-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation }),
      });
      if (res.ok) {
        doctorReport = await res.json();
      }
      console.log(doctorReport);
    } catch {
      // report generation failed — still complete the appointment
    }

    try {
      await completeConsultation({
        appointmentId,
        orgId,
        userId,
        doctorReport,
      });
    } catch {
      // status update failed — still navigate
    }

    setTranscripts([]);
    toast.success("Consultation ended");
    setIsCompleting(false);
    router.push("/bezs/telemedicine/doctor");
  };

  function captureTranscript(transcript: Transcript) {
    setTranscripts((prev) => {
      const next = [...prev, transcript];
      transcriptsRef.current = next;
      return next;
    });
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={livekitUrl}
      data-lk-theme="default"
      onDisconnected={onLeave}
      className="!bg-transparent !shadow-none !h-[calc(100vh-162px)]"
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
              variant="secondary"
              onClick={() => setShowTranscript((v) => !v)}
              className="gap-1.5"
            >
              {showTranscript ? (
                <MessageSquareOff className="h-4 w-4" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
              {showTranscript ? "Hide Transcript" : "Show Transcript"}
            </Button>

            <Button
              onClick={onLeave}
              size="sm"
              variant="destructive"
              disabled={isCompleting}
            >
              {isCompleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Finishing…
                </>
              ) : (
                "End Consultation"
              )}
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 gap-2 min-h-0">
          {/* Left: video + notes */}
          <div className="flex flex-col flex-1 min-h-0 gap-2 overflow-hidden">
            <RoomControlUI />
            <ConsultationNotes
              roomId={roomId}
              notes={notes}
              onNotesChange={setNotes}
            />
          </div>

          {/* Right sidebar: AI suggestion + optional transcript */}
          <aside className="w-[400px] flex flex-col gap-2 min-h-0 overflow-hidden">
            <div className="shrink-0">
              <Suggestion transcripts={transcripts} notes={notes} />
            </div>
            {showTranscript && (
              <div className="flex-1 min-h-0 overflow-auto">
                <TranscriptPanel
                  roomId={roomId}
                  transcripts={transcripts}
                  setTranscripts={captureTranscript}
                />
              </div>
            )}
          </aside>
        </div>
      </div>
    </LiveKitRoom>
  );
}
