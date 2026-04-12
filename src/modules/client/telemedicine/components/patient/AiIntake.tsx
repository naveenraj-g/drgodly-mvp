"use client";

import { Button } from "@/components/ui/button";
import ConversationChat from "./chat/Conversation";
import { Brain, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCallback, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import { nanoid } from "nanoid";
// import { useIntakeStore } from "../../stores/intake-store";
import { useServerAction } from "zsa-react";
import { bookIntakeAppointment } from "../../server-actions/appointment-action";
import { TSharedUser } from "@/modules/shared/types";
import { usePatientModalStore } from "../../stores/patient-modal-store";

interface TProps {
  user: TSharedUser;
  appointmentData: {
    assistant: {
      voiceId: string;
      agentPrompt: string;
    };
    patient: {
      name: string;
      age: string;
    };
  };
}

type TMessageItem = {
  key: string;
  from: "user" | "assistant";
  versions?: { id: string; content: string }[];
  content?: string;
  attachments?: {
    type: "file";
    url: string;
    mediaType: string;
    filename?: string;
  }[];
};

function AiIntake({ user, appointmentData }: TProps) {
  const openModal = usePatientModalStore((state) => state.onOpen);

  const [callStarted, setCallStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);
  const [currentRole, setCurrentRole] = useState<"user" | "assistant" | null>(
    null
  );
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [messages, setMessages] = useState<TMessageItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handlersRef = useRef({
    onCallStart: (() => {}) as () => void,
    onCallEnd: (() => {}) as () => void,
    onMessage: (() => {}) as (message: any) => void,
    onSpeechStart: (() => {}) as () => void,
    onSpeechEnd: (() => {}) as () => void,
    onError: (() => {}) as (err: any) => void,
  });

  const addMessage = useCallback((m: TMessageItem) => {
    setMessages((prev) => [...prev, m]);
  }, []);

  const { execute, isPending } = useServerAction(bookIntakeAppointment, {
    onSuccess({ data }) {
      toast.success("Intake session is completed.", {
        description: "You want to book appointment with doctor!",
      });
      openModal({ type: "intakeComplete", intakeAppointmentId: data.id });
    },
    onError() {
      toast.error("Something went wrong!", {
        description: "Please try again later.",
      });
    },
  });

  const startCall = async () => {
    if (
      !appointmentData?.assistant.voiceId ||
      !appointmentData?.assistant.agentPrompt
    ) {
      toast.error("Missing assistant voice or prompt");
      return;
    }

    // reset
    setMessages([]);
    setLiveTranscript("");
    setCurrentRole(null);
    setIsConnecting(true);

    try {
      const res = await fetch("/api/runtime-config", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to start call");
      }

      const { vapiPublicKey, vapiAgentId } = await res.json();
      const vapi = new Vapi(vapiPublicKey);
      setVapiInstance(vapi);

      // start (ts-ignore for Vapi start types)
      vapi.start(vapiAgentId);

      // named handlers
      const onCallStart = () => {
        setCallStarted(true);
        setIsConnecting(false);
      };
      const onCallEnd = () => {
        setCallStarted(false);
        setIsConnecting(false);
        setLiveTranscript("");
        setCurrentRole(null);
      };
      const onMessage = (message: any) => {
        try {
          if (message.type === "transcript") {
            const { role, transcriptType, transcript } = message;
            const from = role === "assistant" ? "assistant" : "user";

            if (transcriptType === "partial") {
              setLiveTranscript(transcript);
              setCurrentRole(from);
            } else if (transcriptType === "final") {
              // push final transcript as message
              addMessage({
                key: nanoid(),
                from,
                content: transcript,
              });
              setLiveTranscript("");
              setCurrentRole(null);
            }
          }
        } catch (err) {
          console.error("onMessage handler error", err);
        }
      };
      const onSpeechStart = () => setCurrentRole("assistant");
      const onSpeechEnd = () => setCurrentRole("user");
      const onError = (error: any) => {
        console.error("Vapi error", error);
        toast.error("Voice assistant error", {
          description: "Failed to connect with assistant.",
          richColors: true,
        });
      };

      // store handlers for cleanup
      handlersRef.current = {
        onCallStart,
        onCallEnd,
        onMessage,
        onSpeechStart,
        onSpeechEnd,
        onError,
      };

      vapi.on("call-start", onCallStart);
      vapi.on("call-end", onCallEnd);
      vapi.on("message", onMessage);
      vapi.on("speech-start", onSpeechStart);
      vapi.on("speech-end", onSpeechEnd);
      vapi.on("error", onError);
    } catch (err) {
      console.error("startCall error", err);
      toast.error("Could not start call");
      setIsConnecting(false);
    }
  };

  const endCall = async () => {
    if (!vapiInstance) return;
    setLoading(true);

    try {
      // Remove listeners
      const vapi = vapiInstance;
      const h = handlersRef.current;
      vapi.off("call-start", h.onCallStart as any);
      vapi.off("call-end", h.onCallEnd as any);
      vapi.off("message", h.onMessage as any);
      vapi.off("speech-start", h.onSpeechStart as any);
      vapi.off("speech-end", h.onSpeechEnd as any);
      vapi.off("error", h.onError as any);

      // Stop the call
      vapi.stop();

      setCallStarted(false);
      setVapiInstance(null);
      setLiveTranscript("");
      setCurrentRole(null);

      // optionally: generate report or save messages here
      toast.success("Call ended");
      // setConversation(messages);

      // console.log({ messages });
      await execute({
        orgId: user.orgId,
        patientUserId: user.id,
        intakeConversation: messages,
      });
    } catch (err) {
      console.error("endCall error", err);
      toast.error("Error ending call");
    } finally {
      setLoading(false);
    }
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (vapiInstance) {
        try {
          const h = handlersRef.current;
          vapiInstance.off("call-start", h.onCallStart as any);
          vapiInstance.off("call-end", h.onCallEnd as any);
          vapiInstance.off("message", h.onMessage as any);
          vapiInstance.off("speech-start", h.onSpeechStart as any);
          vapiInstance.off("speech-end", h.onSpeechEnd as any);
          vapiInstance.off("error", h.onError as any);
          vapiInstance.stop();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          // ignore
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full overflow-hidden h-[calc(100dvh-144px)]">
      <h1 className="text-xl font-bold text-center mb-4">
        Talk to Your AI Intake Assistant
      </h1>
      <div className="flex gap-4 justify-around items-center">
        <div className="flex flex-col items-center">
          <div
            className={`bg-secondary w-fit rounded-full p-4 mb-1 ${
              callStarted ? "animate-pulse-scale" : ""
            }`}
          >
            <Brain className="size-10" />
          </div>
          <p className="font-bold">Bezs AI</p>
          <p className="text-xs text-muted-foreground">Intake Assistant</p>
          <Badge className="mt-4" variant="secondary">
            {callStarted
              ? "Connected"
              : isConnecting
              ? "Connecting..."
              : "Waiting..."}
          </Badge>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-secondary text-center w-fit rounded-full p-4 mb-1">
            <p className="text-4xl size-10">{user.name[0]}</p>
          </div>
          <p className="font-bold">You</p>
          <p className="text-xs text-muted-foreground">{user.name}</p>
          <Badge className="mt-4" variant="secondary">
            Ready
          </Badge>
        </div>
      </div>
      <ConversationChat
        messages={messages}
        liveTranscript={liveTranscript}
        liveRole={currentRole}
        user={user}
      />
      {isPending ? (
        <Button
          className="w-fit self-center px-6 h-7 rounded-2xl"
          size="sm"
          disabled
        >
          <Loader2 className="animate-spin" />
          Loading...
        </Button>
      ) : callStarted ? (
        <Button
          className="w-fit self-center px-6 h-7 rounded-2xl"
          size="sm"
          variant="destructive"
          onClick={endCall}
          disabled={loading}
        >
          End Call
        </Button>
      ) : (
        <Button
          className="w-fit self-center px-6 h-7 rounded-2xl"
          size="sm"
          onClick={startCall}
          disabled={isConnecting || loading}
        >
          Start Call
        </Button>
      )}
    </div>
  );
}

export default AiIntake;
