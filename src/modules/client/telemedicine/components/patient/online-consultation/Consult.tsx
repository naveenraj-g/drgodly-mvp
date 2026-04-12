"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { toast } from "sonner";
import { RoomControlUI } from "../../online-consultation/RoomControl";
import { TranscriptPanel } from "../../online-consultation/TranscriptionPanel";
import { Button } from "@/components/ui/button";
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
        toast.error("Failed to connect", {
          description: "Please try again later.",
        });
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
    router.push("/bezs/telemedicine/patient/appointments/intake");
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
          <div className="grid grid-cols-[1fr_400px] h-full">
            <RoomControlUI />
            {!isEnded && (
              <TranscriptPanel
                roomId={roomId}
                transcripts={transcripts}
                setTranscripts={captureTranscript}
              />
            )}
          </div>
        </div>
      </>
    </LiveKitRoom>
  );
}
