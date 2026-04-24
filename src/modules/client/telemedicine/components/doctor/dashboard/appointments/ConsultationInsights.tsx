"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  MessageSquare,
  ClipboardList,
  Stethoscope,
  ListChecks,
  TriangleAlert,
  Brain,
  Activity,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiExpandHorizontalLine } from "react-icons/ri";
import { CgCompress } from "react-icons/cg";
import ActionTooltipProvider from "@/modules/shared/providers/action-tooltip-provider";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TAppointment } from "@/modules/shared/entities/models/telemedicine/appointment";

interface Props {
  appointment: TAppointment;
}

interface SoapReport {
  summary?: string;
  subjective?: Record<string, unknown>;
  objective?: Record<string, unknown>;
  assessment?: Record<string, unknown>;
  plan?: Record<string, unknown>;
}

interface AssessmentPlan {
  clinical_overview?: string;
  differential_diagnosis?: unknown[];
  diagnostic_plan?: Record<string, unknown>;
  treatment_plan?: unknown[];
  procedures?: string;
  risk_level?: string;
  red_flags?: unknown[];
}

interface FullReportData {
  soap_report?: SoapReport;
  assessment_plan?: AssessmentPlan;
  generated_at?: string;
  conversation_length?: number;
}

interface FullReportEnvelope {
  status?: string;
  data?: FullReportData;
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

function safeParseFullReport(raw: unknown): FullReportData | null {
  if (raw == null) return null;
  try {
    const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (typeof obj !== "object" || Array.isArray(obj)) return null;
    const envelope = obj as FullReportEnvelope;
    if (envelope.data) return envelope.data;
    // maybe stored without envelope
    if (envelope.soap_report || envelope.assessment_plan)
      return obj as FullReportData;
    return null;
  } catch {
    return null;
  }
}

function getMessageContent(msg: ConversationMessage): string {
  if (msg.content) return msg.content;
  if (msg.versions?.length) return msg.versions[0].content ?? "";
  return "";
}

function toStringArray(val: unknown): string[] {
  if (!Array.isArray(val)) return [];
  return val.map((v) => (typeof v === "string" ? v : JSON.stringify(v)));
}

function riskBadgeClass(level?: string) {
  switch (level?.toUpperCase()) {
    case "HIGH":
      return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100";
    case "MODERATE":
      return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100";
    case "LOW":
      return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
    default:
      return "";
  }
}

function SoapView({ soap }: { soap: SoapReport }) {
  return (
    <ScrollArea className="h-full pr-2">
      <div className="space-y-4">
        {soap.summary && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
              Summary
            </p>
            <p className="text-sm text-foreground leading-relaxed">{soap.summary}</p>
          </div>
        )}

        {soap.subjective && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <ClipboardList className="size-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Subjective
              </p>
            </div>
            {Object.entries(soap.subjective).map(([k, v]) => {
              if (v == null) return null;
              const label = k.replaceAll("_", " ");
              if (Array.isArray(v)) {
                const items = toStringArray(v);
                if (!items.length) return null;
                return (
                  <div key={k}>
                    <p className="text-xs text-muted-foreground mb-1 capitalize">{label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-normal">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <div key={k}>
                  <p className="text-xs text-muted-foreground mb-0.5 capitalize">{label}</p>
                  <p className="text-sm text-foreground leading-relaxed">{String(v)}</p>
                </div>
              );
            })}
          </div>
        )}

        {soap.objective && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Stethoscope className="size-3.5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Objective
                </p>
              </div>
              {Object.entries(soap.objective).map(([k, v]) => {
                if (v == null) return null;
                const label = k.replaceAll("_", " ");
                if (Array.isArray(v)) {
                  const items = toStringArray(v);
                  if (!items.length) return null;
                  return (
                    <div key={k}>
                      <p className="text-xs text-muted-foreground mb-1 capitalize">{label}</p>
                      <ul className="space-y-1">
                        {items.map((s, i) => (
                          <li key={i} className="text-sm text-foreground flex gap-2">
                            <span className="text-muted-foreground mt-0.5">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                if (typeof v === "object") return null;
                return (
                  <div key={k}>
                    <p className="text-xs text-muted-foreground mb-0.5 capitalize">{label}</p>
                    <p className="text-sm text-foreground">{String(v)}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {soap.assessment && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="size-3.5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Assessment
                </p>
              </div>
              {Object.entries(soap.assessment).map(([k, v]) => {
                if (v == null) return null;
                const label = k.replaceAll("_", " ");
                if (Array.isArray(v)) {
                  const items = toStringArray(v);
                  if (!items.length) return null;
                  return (
                    <div key={k}>
                      <p className="text-xs text-muted-foreground mb-1 capitalize">{label}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((s, i) => (
                          <Badge
                            key={i}
                            className="text-xs font-normal bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (typeof v === "object") return null;
                return (
                  <div key={k}>
                    <p className="text-xs text-muted-foreground mb-0.5 capitalize">{label}</p>
                    <p className="text-sm text-foreground leading-relaxed">{String(v)}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {soap.plan && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <ListChecks className="size-3.5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Plan
                </p>
              </div>
              {Object.entries(soap.plan).map(([k, v]) => {
                if (v == null) return null;
                const label = k.replaceAll("_", " ");
                if (Array.isArray(v)) {
                  const items = toStringArray(v);
                  if (!items.length) return null;
                  return (
                    <div key={k}>
                      <p className="text-xs text-muted-foreground mb-1 capitalize">{label}</p>
                      <ol className="space-y-1 list-decimal list-inside">
                        {items.map((s, i) => (
                          <li key={i} className="text-sm text-foreground leading-relaxed">{s}</li>
                        ))}
                      </ol>
                    </div>
                  );
                }
                if (typeof v === "object") return null;
                return (
                  <div key={k}>
                    <p className="text-xs text-muted-foreground mb-0.5 capitalize">{label}</p>
                    <p className="text-sm text-foreground leading-relaxed">{String(v)}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}

function AssessmentPlanView({ plan }: { plan: AssessmentPlan }) {
  const diffDx = toStringArray(plan.differential_diagnosis);
  const redFlags = toStringArray(plan.red_flags);
  const treatmentItems = toStringArray(plan.treatment_plan);

  return (
    <ScrollArea className="h-full pr-2">
      <div className="space-y-4">
        {plan.risk_level && (
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Risk Level</p>
            <Badge className={cn("text-xs font-semibold", riskBadgeClass(plan.risk_level))}>
              {plan.risk_level}
            </Badge>
          </div>
        )}

        {plan.clinical_overview && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
              Clinical Overview
            </p>
            <p className="text-sm text-foreground leading-relaxed">{plan.clinical_overview}</p>
          </div>
        )}

        {diffDx.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Activity className="size-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Differential Diagnosis
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {diffDx.map((d, i) => (
                <Badge key={i} variant="outline" className="text-xs font-normal">
                  {d}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {plan.diagnostic_plan && Object.keys(plan.diagnostic_plan).length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <ClipboardList className="size-3.5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Diagnostic Plan
                </p>
              </div>
              {Object.entries(plan.diagnostic_plan).map(([k, v]) => {
                if (v == null) return null;
                const label = k.replaceAll("_", " ");
                const items = Array.isArray(v) ? toStringArray(v) : null;
                if (items) {
                  if (!items.length) return null;
                  return (
                    <div key={k}>
                      <p className="text-xs text-muted-foreground mb-1 capitalize">{label}</p>
                      <ul className="space-y-1">
                        {items.map((s, i) => (
                          <li key={i} className="text-sm text-foreground flex gap-2">
                            <span className="text-muted-foreground mt-0.5">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                if (typeof v === "object") return null;
                return (
                  <div key={k}>
                    <p className="text-xs text-muted-foreground mb-0.5 capitalize">{label}</p>
                    <p className="text-sm text-foreground">{String(v)}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {treatmentItems.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <ListChecks className="size-3.5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Treatment Plan
                </p>
              </div>
              <ol className="space-y-1 list-decimal list-inside">
                {treatmentItems.map((t, i) => (
                  <li key={i} className="text-sm text-foreground leading-relaxed">{t}</li>
                ))}
              </ol>
            </div>
          </>
        )}

        {plan.procedures && (
          <>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Procedures</p>
              <p className="text-sm text-foreground leading-relaxed">{plan.procedures}</p>
            </div>
          </>
        )}

        {redFlags.length > 0 && (
          <>
            <Separator />
            <div className="rounded-md border border-red-200 bg-red-50 p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <TriangleAlert className="size-3.5 text-red-600" />
                <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                  Red Flags
                </p>
              </div>
              <ul className="space-y-1">
                {redFlags.map((f, i) => (
                  <li key={i} className="text-xs text-red-700 flex gap-2">
                    <span className="mt-0.5">•</span>
                    {f}
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

export const ConsultationInsights = ({ appointment }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actual = appointment.appointmentActual;
  const messages = safeParseMessages(actual?.virtualConversation);
  const reportData = safeParseFullReport(actual?.fullReport ?? actual?.doctorReport);

  const soap = reportData?.soap_report ?? null;
  const assessmentPlan = reportData?.assessment_plan ?? null;
  const hasData = messages.length > 0 || soap != null || assessmentPlan != null;

  if (!hasData) return null;

  const tabs = [
    ...(soap ? [{ id: "soap", label: "SOAP Report", icon: FileText }] : []),
    ...(assessmentPlan ? [{ id: "assessment", label: "Assessment & Plan", icon: Brain }] : []),
    ...(messages.length > 0 ? [{ id: "conversation", label: "Conversation", icon: MessageSquare }] : []),
  ];

  return (
    <Card
      className={cn(
        "h-full flex flex-col",
        isExpanded ? "col-span-2" : "col-auto",
      )}
    >
      <CardHeader className="flex items-center gap-2 justify-between">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Consultation Insights
          {reportData?.generated_at && (
            <span className="text-xs font-normal text-muted-foreground ml-1">
              {new Date(reportData.generated_at).toLocaleDateString()}
            </span>
          )}
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
        <Tabs defaultValue={tabs[0]?.id} className="flex flex-col h-full">
          <TabsList className={cn("grid w-full shrink-0", `grid-cols-${tabs.length}`)}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <TabsTrigger key={id} value={id} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {soap && (
            <TabsContent value="soap" className="flex-1 overflow-hidden mt-4">
              <SoapView soap={soap} />
            </TabsContent>
          )}

          {assessmentPlan && (
            <TabsContent value="assessment" className="flex-1 overflow-hidden mt-4">
              <AssessmentPlanView plan={assessmentPlan} />
            </TabsContent>
          )}

          {messages.length > 0 && (
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
                        className={cn("flex", isUser ? "justify-end" : "justify-start")}
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
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};
