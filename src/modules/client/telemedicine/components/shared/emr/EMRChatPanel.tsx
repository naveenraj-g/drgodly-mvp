"use client";

import dynamic from "next/dynamic";
import { Bot } from "lucide-react";

// A2UIChat is a heavy client component — lazy-load to keep the EMR page bundle small
const A2UIChatPage = dynamic(
  () => import("@/modules/client/ai-hub/components/A2UIChat"),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Loading AI Assistant…
      </div>
    ),
  },
);

interface EMRChatPanelProps {
  role: "doctor" | "patient";
}

export function EMRChatPanel({ role }: EMRChatPanelProps) {
  return (
    <div className="flex flex-col w-full h-[calc(100vh-156px)]">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-6 py-3 border-b bg-background shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
          <Bot className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">EMR Assistant</p>
          <p className="text-xs text-muted-foreground leading-tight">
            {role === "doctor"
              ? "Electronic Medical Records — guided clinical workflows"
              : "Your health records — ask anything about your care"}
          </p>
        </div>
      </div>

      {/* Chat body — full width, fills remaining height */}
      <div className="flex flex-1 min-h-0 w-full">
        <A2UIChatPage />
      </div>
    </div>
  );
}
