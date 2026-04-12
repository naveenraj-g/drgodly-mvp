"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { toast } from "sonner";
import { RoomControlUI } from "../../online-consultation/RoomControl";
import { TranscriptPanel } from "../../online-consultation/TranscriptionPanel";
import { Button } from "@/components/ui/button";
import Suggestion from "./Suggestion";
import ConsultationNotes from "./ConsultationNotes";
import { Loader2 } from "lucide-react";
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

        if (!res.ok) {
          throw new Error("Failed to fetch runtime config");
        }

        const data = await res.json();
        setLivekitUrl(data.livekitUrl);
      } catch (err) {
        toast.error("Failed to load LiveKit config");
      }
    })();
  }, []);

  if (!token || !livekitUrl) {
    return (
      <div className="flex items-center justify-center mt-20">
        <p className="inline-flex items-center gap-2">
          <Loader2 className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }

  const onLeave = () => {
    setIsEnded(true);
    setTranscripts([]);
    toast.success("Consultation ended");
    router.push("/bezs/telemedicine/doctor");
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
      className="!bg-transparent !shadow-none !h-[calc(100vh-162px)]"
    >
      <>
        <div className="flex flex-col h-full w-full">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Doctor: {details.doctor.name} ({details.doctor.speciality})
              </div>
              <div className="text-sm text-muted-foreground">|</div>
              <div className="text-sm text-muted-foreground">
                Patient: {details.patient.name}
              </div>
            </div>
            <Button
              onClick={() => {
                onLeave();
              }}
              size="sm"
              variant="destructive"
            >
              Leave
            </Button>
          </div>
          <div className="grid grid-cols-[1fr_400px] h-full gap-2 min-h-0">
            {/* Left: room UI */}
            <div className="flex flex-col h-full min-h-0 overflow-hidden">
              <RoomControlUI />
              <ConsultationNotes roomId={roomId} />
            </div>
            <aside className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
              {/* Suggestion (compact, scroll if it grows) */}
              <div className="shrink-0">
                <Suggestion transcripts={transcripts} />
              </div>

              {/* Transcript panel (fills remaining space, scrolls) */}
              <div className="flex-1 min-h-0 overflow-auto">
                <TranscriptPanel
                  roomId={roomId}
                  transcripts={transcripts}
                  setTranscripts={captureTranscript}
                />
              </div>
            </aside>
          </div>
        </div>
      </>
    </LiveKitRoom>
  );
}
