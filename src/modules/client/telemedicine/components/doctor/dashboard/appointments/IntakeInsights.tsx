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

interface DiagnosticItem {
  test?: string;
  study?: string;
  purpose?: string;
}

interface TreatmentItem {
  condition?: string;
  recommendation?: string;
  rationale?: string;
  route?: string;
  duration?: string;
}

interface DifferentialItem {
  condition?: string;
  rationale?: string;
  likelihood?: string;
}

interface IntakeReport {
  clinical_overview?: string;
  risk_level?: string;
  differential_diagnosis?: DifferentialItem[];
  diagnostic_plan?: {
    laboratory_tests?: DiagnosticItem[];
    imaging?: DiagnosticItem[];
    other?: DiagnosticItem[];
  };
  treatment_plan?: TreatmentItem[];
  procedures?: string;
  red_flags?: string[];
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
  try {
    const obj: unknown = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (typeof obj !== "object" || Array.isArray(obj) || obj === null) return null;
    const envelope = obj as Record<string, unknown>;
    // Unwrap { status, data: { ... } } envelope
    if (envelope.data && typeof envelope.data === "object" && !Array.isArray(envelope.data)) {
      return envelope.data as IntakeReport;
    }
    return obj as IntakeReport;
  } catch {
    return null;
  }
}

function getMessageContent(msg: ConversationMessage): string {
  if (msg.content) return msg.content;
  if (msg.versions && msg.versions.length > 0)
    return msg.versions[0].content ?? "";
  return "";
}

function riskBadgeClass(level?: string) {
  switch (level?.toUpperCase()) {
    case "HIGH": return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100";
    case "MODERATE": return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100";
    case "LOW": return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
    default: return "";
  }
}

function ReportView({ report }: { report: IntakeReport }) {
  const diagItems = [
    ...(report.diagnostic_plan?.laboratory_tests ?? []),
    ...(report.diagnostic_plan?.imaging ?? []),
    ...(report.diagnostic_plan?.other ?? []),
  ];
  const redFlags = (report.red_flags ?? []).filter((f) => f && f !== "Not reported");

  return (
    <ScrollArea className="h-full pr-2">
      <div className="space-y-4">

        {/* Risk level */}
        {report.risk_level && (
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Risk Level</p>
            <Badge className={cn("text-xs font-semibold", riskBadgeClass(report.risk_level))}>
              {report.risk_level}
            </Badge>
          </div>
        )}

        {/* Clinical overview */}
        {report.clinical_overview && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
              Clinical Overview
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {report.clinical_overview}
            </p>
          </div>
        )}

        {/* Differential diagnosis */}
        {report.differential_diagnosis && report.differential_diagnosis.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="size-3.5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Differential Diagnosis
                </p>
              </div>
              <div className="space-y-2">
                {report.differential_diagnosis.map((d, i) => (
                  <div key={i} className="rounded-md border bg-muted/30 px-3 py-2 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{d.condition}</p>
                      {d.likelihood && (
                        <Badge variant="outline" className="text-xs font-normal shrink-0">
                          {d.likelihood}
                        </Badge>
                      )}
                    </div>
                    {d.rationale && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{d.rationale}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Diagnostic plan */}
        {diagItems.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <ClipboardList className="size-3.5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Diagnostic Plan
                </p>
              </div>
              <ul className="space-y-1.5">
                {diagItems.map((item, i) => (
                  <li key={i} className="text-sm text-foreground space-y-0.5">
                    <p className="font-medium">{item.test ?? item.study}</p>
                    {item.purpose && (
                      <p className="text-xs text-muted-foreground">{item.purpose}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Treatment plan */}
        {report.treatment_plan && report.treatment_plan.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <ListChecks className="size-3.5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Treatment Plan
                </p>
              </div>
              <div className="space-y-2">
                {report.treatment_plan.map((t, i) => (
                  <div key={i} className="rounded-md border bg-muted/30 px-3 py-2 space-y-1">
                    {t.condition && <p className="text-xs text-muted-foreground">{t.condition}</p>}
                    {t.recommendation && <p className="text-sm text-foreground">{t.recommendation}</p>}
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {t.route && <span>Route: {t.route}</span>}
                      {t.duration && <span>· {t.duration}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Procedures */}
        {report.procedures && report.procedures !== "Not reported" && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Stethoscope className="size-3.5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Procedures
                </p>
              </div>
              <p className="text-sm text-foreground">{report.procedures}</p>
            </div>
          </>
        )}

        {/* Red flags */}
        {redFlags.length > 0 && (
          <>
            <Separator />
            <div className="rounded-md border border-red-200 bg-red-50 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <TriangleAlert className="size-3.5 text-red-600" />
                <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                  Red Flags
                </p>
              </div>
              <ul className="space-y-1">
                {redFlags.map((f, i) => (
                  <li key={i} className="text-xs text-red-700 flex gap-2">
                    <span className="mt-0.5">•</span>{f}
                  </li>
                ))}
              </ul>
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

            <TabsContent
              value="summary"
              className="flex-1 overflow-hidden mt-4"
            >
              {report ? (
                <ReportView report={report} />
              ) : (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No report available.
                </p>
              )}
            </TabsContent>

            <TabsContent
              value="conversation"
              className="flex-1 overflow-hidden mt-4"
            >
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
