"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, MessageSquare, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiExpandHorizontalLine } from "react-icons/ri";
import { CgCompress } from "react-icons/cg";
import ActionTooltipProvider from "@/modules/shared/providers/action-tooltip-provider";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TAppointment } from "@/modules/shared/entities/models/telemedicine/appointment";

interface IntakeInsightsProps {
  appointment: TAppointment;
}

interface ConversationMessage {
  key: string;
  from: "user" | "assistant";
  content?: string;
  versions?: { id: string; content: string }[];
}

function safeParseMessages(raw: unknown): ConversationMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (m): m is ConversationMessage =>
      m != null && typeof m === "object" && "from" in m,
  );
}

function getMessageContent(msg: ConversationMessage): string {
  if (msg.content) return msg.content;
  if (msg.versions && msg.versions.length > 0)
    return msg.versions[0].content ?? "";
  return "";
}

export const IntakeInsights = ({ appointment }: IntakeInsightsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const intakeConversationRaw =
    appointment.followUpMapping?.intakeAppointment?.appointmentActual
      ?.intakeConversation ?? null;

  const messages = safeParseMessages(intakeConversationRaw);
  const hasIntakeData = messages.length > 0;

  const lastAssistantMsg = [...messages]
    .reverse()
    .find((m) => m.from === "assistant");
  const summaryText = lastAssistantMsg
    ? getMessageContent(lastAssistantMsg)
    : null;

  return (
    <Card className={cn(isExpanded ? "col-span-2" : "col-auto")}>
      <CardHeader className="flex items-center gap-2 justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Pre-Visit Intake Insights
        </CardTitle>
        <ActionTooltipProvider label={isExpanded ? "Shrink" : "Expand"}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? (
              <CgCompress className="size-6 text-muted-foreground" />
            ) : (
              <RiExpandHorizontalLine className="size-6 text-muted-foreground" />
            )}
          </Button>
        </ActionTooltipProvider>
      </CardHeader>

      <CardContent>
        {!hasIntakeData ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground">
            <FileSearch className="size-10 opacity-40" />
            <p className="text-sm">No intake data for this appointment.</p>
          </div>
        ) : (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary" className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="conversation"
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-3 w-3" />
                Conversation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              {summaryText ? (
                <div className="rounded-md bg-muted p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {summaryText}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No summary available.
                </p>
              )}
            </TabsContent>

            <TabsContent value="conversation" className="mt-4">
              <ScrollArea className="h-96 pr-3">
                <div className="flex flex-col gap-3">
                  {messages.map((msg) => {
                    const text = getMessageContent(msg);
                    if (!text) return null;
                    const isUser = msg.from === "user";
                    return (
                      <div
                        key={msg.key}
                        className={cn(
                          "flex",
                          isUser ? "justify-end" : "justify-start",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                            isUser
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-muted text-foreground rounded-tl-sm",
                          )}
                        >
                          {text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
