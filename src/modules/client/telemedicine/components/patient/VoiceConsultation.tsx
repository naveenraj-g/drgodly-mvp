"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, Sparkles } from "lucide-react";

function VoiceConsultation() {
  return (
    <div className="flex flex-col gap-3 w-full overflow-hidden h-[calc(100dvh-152px)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border bg-card shadow-sm">
        <div className="bg-primary/10 rounded-full p-2 shrink-0">
          <Mic className="size-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-none">Bezs AI</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Voice Consultation Agent
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="text-xs text-muted-foreground">Unavailable</span>
        </div>
      </div>

      {/* Chat area — coming soon placeholder */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 rounded-2xl border bg-card">
        <div className="relative flex items-center justify-center">
          {/* Ripple rings */}
          <span className="absolute size-28 rounded-full bg-primary/10 animate-ping [animation-duration:2s]" />
          <span className="absolute size-20 rounded-full bg-primary/15 animate-ping [animation-duration:2s] [animation-delay:0.4s]" />
          <div className="relative z-10 flex items-center justify-center size-16 rounded-full bg-primary/10 border border-primary/20">
            <Mic className="size-7 text-primary/60" />
          </div>
        </div>

        <div className="text-center space-y-1.5 px-6 max-w-xs">
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="size-4 text-primary" />
            <p className="text-base font-semibold">Voice Consultation</p>
            <Sparkles className="size-4 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Real-time voice consultations with our AI are on the way. Stay
            tuned — this feature is coming soon.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          Coming Soon
        </div>
      </div>

      {/* Disabled input bar */}
      <div className="flex gap-2 items-center">
        <Input
          value=""
          readOnly
          placeholder="Voice input unavailable..."
          disabled
          className="flex-1"
        />
        <Button size="icon" disabled>
          <Send className="size-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled
          className="px-4 rounded-2xl h-7"
        >
          End Consultation
        </Button>
      </div>
    </div>
  );
}

export default VoiceConsultation;
