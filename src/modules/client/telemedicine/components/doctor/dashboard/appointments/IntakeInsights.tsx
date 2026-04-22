"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  MessageSquare,
  FileSearch,
  AlertCircle,
  ClipboardList,
  Stethoscope,
  ListChecks,
  TriangleAlert,
} from "lucide-react";
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

interface IntakeReport {
  summary?: string;
  subjective?: {
    chief_complaint?: string;
    history_of_present_illness?: string;
    associated_symptoms?: string[];
  };
  objective?: {
    observations?: string[];
  };
  assessment?: {
    possible_conditions?: string[];
    clinical_reasoning?: string;
  };
  plan?: {
    next_steps?: string[];
    when_to_seek_care?: string;
  };
}

function safeParseMessages(raw: unknown): ConversationMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (m): m is ConversationMessage =>
      m != null && typeof m === "object" && "from" in m,
  );
}

function safeParseReport(raw: unknown): IntakeReport | null {
  if (raw == null) return null;
  if (typeof raw === "object" && !Array.isArray(raw))
    return raw as IntakeReport;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as IntakeReport;
    } catch {
      return null;
    }
  }
  return null;
}

function getMessageContent(msg: ConversationMessage): string {
  if (msg.content) return msg.content;
  if (msg.versions && msg.versions.length > 0)
    return msg.versions[0].content ?? "";
  return "";
}

function ReportView({ report }: { report: IntakeReport }) {
  return (
    <ScrollArea className="h-full pr-2">
      <div className="space-y-4">
        {report.summary && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
              Overview
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {report.summary}
            </p>
          </div>
        )}

        {report.subjective && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <ClipboardList className="size-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Subjective
              </p>
            </div>
            {report.subjective.chief_complaint && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Chief Complaint
                </p>
                <p className="text-sm text-foreground">
                  {report.subjective.chief_complaint}
                </p>
              </div>
            )}
            {report.subjective.history_of_present_illness && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  History of Present Illness
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {report.subjective.history_of_present_illness}
                </p>
              </div>
            )}
            {report.subjective.associated_symptoms &&
              report.subjective.associated_symptoms.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Associated Symptoms
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {report.subjective.associated_symptoms.map((s, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {report.objective?.observations &&
          report.objective.observations.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Stethoscope className="size-3.5 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Objective
                  </p>
                </div>
                <ul className="space-y-1">
                  {report.objective.observations.map((obs, i) => (
                    <li key={i} className="text-sm text-foreground flex gap-2">
                      <span className="text-muted-foreground mt-0.5">•</span>
                      {obs}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

        {report.assessment && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="size-3.5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Assessment
                </p>
              </div>
              {report.assessment.possible_conditions &&
                report.assessment.possible_conditions.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Possible Conditions
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {report.assessment.possible_conditions.map((c, i) => (
                        <Badge
                          key={i}
                          className="text-xs font-normal bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100"
                        >
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              {report.assessment.clinical_reasoning && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Clinical Reasoning
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {report.assessment.clinical_reasoning}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {report.plan && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <ListChecks className="size-3.5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Plan
                </p>
              </div>
              {report.plan.next_steps && report.plan.next_steps.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Next Steps
                  </p>
                  <ol className="space-y-1 list-decimal list-inside">
                    {report.plan.next_steps.map((step, i) => (
                      <li
                        key={i}
                        className="text-sm text-foreground leading-relaxed"
                      >
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {report.plan.when_to_seek_care && (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 flex gap-2">
                  <TriangleAlert className="size-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-amber-800 mb-0.5">
                      When to Seek Care
                    </p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      {report.plan.when_to_seek_care}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}

export const IntakeInsights = ({ appointment }: IntakeInsightsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actualData =
    appointment.followUpMapping?.intakeAppointment?.appointmentActual ?? null;

  const intakeConversationRaw = actualData?.intakeConversation ?? null;
  const intakeReportRaw = actualData?.intakeReport ?? null;

  const messages = safeParseMessages(intakeConversationRaw);
  const report = safeParseReport(intakeReportRaw);
  const hasIntakeData = messages.length > 0 || report != null;

  return (
    <Card
      className={cn(
        "h-full flex flex-col",
        isExpanded ? "col-span-2" : "col-auto",
      )}
    >
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

      <CardContent className="flex-1 overflow-hidden">
        {!hasIntakeData ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground">
            <FileSearch className="size-10 opacity-40" />
            <p className="text-sm">No intake data for this appointment.</p>
          </div>
        ) : (
          <Tabs defaultValue="summary" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 shrink-0">
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

            <TabsContent value="summary" className="flex-1 overflow-hidden mt-4">
              {report ? (
                <ReportView report={report} />
              ) : (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No report available.
                </p>
              )}
            </TabsContent>

            <TabsContent value="conversation" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full pr-3">
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
