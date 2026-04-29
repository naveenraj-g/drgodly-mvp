"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarDays,
  Clock,
  User,
  Stethoscope,
  CreditCard,
  MapPin,
  Brain,
  ArrowRight,
  LinkIcon,
  ClipboardList,
  AlertCircle,
  ListChecks,
  TriangleAlert,
  FileText,
  Activity,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { useAppointmentModalStore } from "../../stores/appointment-modal-store";
import { AppointmentStatusIndicator } from "../../components/AppointmentStatusIndicator";
import { cn } from "@/lib/utils";

// ── helpers ──────────────────────────────────────────────────────────────────

type MessageItem = {
  key?: string;
  from: "user" | "assistant";
  content?: string;
  versions?: { id: string; content: string }[];
};

function getAppointmentKind(mode: string, doctorUserId: string | null | undefined) {
  if (mode === "INTAKE") return "intake";
  if (doctorUserId === "AIDOCTOR") return "ai-consultation";
  return "doctor";
}

function AppointmentKindBadge({ mode, doctorUserId }: { mode: string; doctorUserId?: string | null }) {
  const kind = getAppointmentKind(mode, doctorUserId);
  if (kind === "intake") {
    return <Badge variant="secondary" className="gap-1"><Brain className="size-3" />AI Intake</Badge>;
  }
  if (kind === "ai-consultation") {
    return <Badge variant="secondary" className="gap-1 bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"><Brain className="size-3" />AI Consultation</Badge>;
  }
  return <Badge variant="outline">Doctor Appointment</Badge>;
}

function ConversationViewer({ messages, title }: { messages: MessageItem[]; title: string }) {
  if (!messages || messages.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">{title}</p>
      <ScrollArea className="h-64 rounded-xl border p-3">
        <div className="space-y-3">
          {messages.map((msg, i) => {
            const text = msg.content ?? msg.versions?.[0]?.content ?? "";
            if (!text) return null;
            return (
              <div
                key={msg.key ?? i}
                className={cn(
                  "flex gap-2",
                  msg.from === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.from === "assistant" && (
                  <div className="mt-1 shrink-0 rounded-full bg-secondary p-1.5">
                    <Brain className="size-3.5" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                    msg.from === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {text}
                </div>
                {msg.from === "user" && (
                  <div className="mt-1 shrink-0 rounded-full bg-primary p-1.5">
                    <User className="size-3.5 text-primary-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function safeParseMessages(raw: unknown): MessageItem[] {
  if (!raw) return [];
  try {
    const arr = Array.isArray(raw) ? raw : JSON.parse(raw as string);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
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

function safeParseReport(raw: unknown): IntakeReport | null {
  if (raw == null) return null;
  try {
    const obj: unknown = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (typeof obj !== "object" || Array.isArray(obj) || obj === null) return null;
    const envelope = obj as Record<string, unknown>;
    if (envelope.data && typeof envelope.data === "object" && !Array.isArray(envelope.data)) {
      return envelope.data as IntakeReport;
    }
    return obj as IntakeReport;
  } catch { return null; }
}

// ── Full report (AI Consultation) ─────────────────────────────────────────────

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
}

function safeParseFullReport(raw: unknown): FullReportData | null {
  if (raw == null) return null;
  try {
    const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (typeof obj !== "object" || Array.isArray(obj) || obj === null) return null;

    // Unwrap { status, data } envelope if present
    const envelope = obj as Record<string, unknown>;
    const inner = (envelope.data != null ? envelope.data : obj) as Record<string, unknown>;

    if (typeof inner !== "object" || Array.isArray(inner) || inner === null) return null;

    // Already in FullReportData shape
    if (inner.soap_report || inner.assessment_plan) return inner as FullReportData;

    // Direct SOAP structure (doctor-report-agent format)
    if (inner.subjective || inner.objective || inner.assessment || inner.plan || inner.summary) {
      return { soap_report: inner as SoapReport };
    }

    return null;
  } catch { return null; }
}

function toStrArr(val: unknown): string[] {
  if (!Array.isArray(val)) return [];
  return val.map((v) => (typeof v === "string" ? v : JSON.stringify(v)));
}

function riskClass(level?: string) {
  switch (level?.toUpperCase()) {
    case "HIGH": return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100";
    case "MODERATE": return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100";
    case "LOW": return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
    default: return "";
  }
}

function SoapSection({ soap }: { soap: SoapReport }) {
  return (
    <div className="space-y-4">
      {soap.summary && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">Summary</p>
          <p className="text-sm leading-relaxed">{soap.summary}</p>
        </div>
      )}
      {(["subjective", "objective", "assessment", "plan"] as const).map((key) => {
        const section = soap[key];
        if (!section || Object.keys(section).length === 0) return null;
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center gap-1.5">
              {key === "subjective" && <ClipboardList className="size-3.5 text-primary" />}
              {key === "objective" && <Stethoscope className="size-3.5 text-primary" />}
              {key === "assessment" && <AlertCircle className="size-3.5 text-primary" />}
              {key === "plan" && <ListChecks className="size-3.5 text-primary" />}
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground capitalize">{key}</p>
            </div>
            {Object.entries(section).map(([k, v]) => {
              if (v == null) return null;
              const label = k.replaceAll("_", " ");
              if (Array.isArray(v)) {
                const items = toStrArr(v);
                if (!items.length) return null;
                return (
                  <div key={k}>
                    <p className="text-xs text-muted-foreground mb-1 capitalize">{label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-normal">{s}</Badge>
                      ))}
                    </div>
                  </div>
                );
              }
              if (typeof v === "object") return null;
              return (
                <div key={k}>
                  <p className="text-xs text-muted-foreground mb-0.5 capitalize">{label}</p>
                  <p className="text-sm leading-relaxed">{String(v)}</p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function AssessmentPlanSection({ plan }: { plan: AssessmentPlan }) {
  const redFlags = toStrArr(plan.red_flags);

  const diffDxItems = Array.isArray(plan.differential_diagnosis)
    ? (plan.differential_diagnosis as DifferentialItem[])
    : [];

  const treatmentItems = Array.isArray(plan.treatment_plan)
    ? (plan.treatment_plan as TreatmentItem[])
    : [];

  return (
    <div className="space-y-4">
      {plan.risk_level && (
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">Risk Level</p>
          <Badge className={cn("text-xs font-semibold", riskClass(plan.risk_level))}>{plan.risk_level}</Badge>
        </div>
      )}

      {plan.clinical_overview && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">Clinical Overview</p>
          <p className="text-sm leading-relaxed">{plan.clinical_overview}</p>
        </div>
      )}

      {diffDxItems.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Activity className="size-3.5 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Differential Diagnosis</p>
          </div>
          <div className="space-y-2">
            {diffDxItems.map((d, i) => (
              <div key={i} className="rounded-md border bg-muted/30 px-3 py-2 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{d.condition}</p>
                  {d.likelihood && (
                    <Badge variant="outline" className="text-xs font-normal shrink-0">{d.likelihood}</Badge>
                  )}
                </div>
                {d.rationale && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{d.rationale}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {plan.diagnostic_plan && Object.entries(plan.diagnostic_plan).map(([k, v]) => {
        if (v == null) return null;
        const items = Array.isArray(v) ? toStrArr(v) : null;
        if (items && items.length > 0) {
          return (
            <div key={k}>
              <p className="text-xs text-muted-foreground mb-1 capitalize">{k.replaceAll("_", " ")}</p>
              <ul className="space-y-1">
                {items.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2"><span className="text-muted-foreground mt-0.5">•</span>{s}</li>
                ))}
              </ul>
            </div>
          );
        }
        if (typeof v !== "object") {
          return (
            <div key={k}>
              <p className="text-xs text-muted-foreground mb-0.5 capitalize">{k.replaceAll("_", " ")}</p>
              <p className="text-sm">{String(v)}</p>
            </div>
          );
        }
        return null;
      })}

      {treatmentItems.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <ListChecks className="size-3.5 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Treatment Plan</p>
          </div>
          <div className="space-y-2">
            {treatmentItems.map((t, i) => (
              <div key={i} className="rounded-md border bg-muted/30 px-3 py-2 space-y-1">
                {t.condition && <p className="text-xs text-muted-foreground">{t.condition}</p>}
                {t.recommendation && <p className="text-sm">{t.recommendation}</p>}
                {t.rationale && !t.recommendation && <p className="text-sm">{t.rationale}</p>}
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {t.route && <span>Route: {t.route}</span>}
                  {t.duration && <span>· {t.duration}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {plan.procedures && plan.procedures !== "Not reported" && (
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Stethoscope className="size-3.5 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Procedures</p>
          </div>
          <p className="text-sm leading-relaxed">{plan.procedures}</p>
        </div>
      )}

      {redFlags.length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 space-y-2">
          <div className="flex items-center gap-1.5">
            <TriangleAlert className="size-3.5 text-red-600" />
            <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Red Flags</p>
          </div>
          <ul className="space-y-1">
            {redFlags.map((f, i) => (
              <li key={i} className="text-xs text-red-700 flex gap-2"><span className="mt-0.5">•</span>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function IntakeReportView({ report }: { report: IntakeReport }) {
  const diagItems = [
    ...(report.diagnostic_plan?.laboratory_tests ?? []),
    ...(report.diagnostic_plan?.imaging ?? []),
    ...(report.diagnostic_plan?.other ?? []),
  ];
  const redFlags = (report.red_flags ?? []).filter((f) => f && f !== "Not reported");

  return (
    <div className="space-y-4">
      {report.risk_level && (
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">Risk Level</p>
          <Badge className={cn("text-xs font-semibold", riskClass(report.risk_level))}>
            {report.risk_level}
          </Badge>
        </div>
      )}

      {report.clinical_overview && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">Clinical Overview</p>
          <p className="text-sm text-foreground leading-relaxed">{report.clinical_overview}</p>
        </div>
      )}

      {report.differential_diagnosis && report.differential_diagnosis.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="size-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Differential Diagnosis</p>
            </div>
            <div className="space-y-2">
              {report.differential_diagnosis.map((d, i) => (
                <div key={i} className="rounded-md border bg-muted/30 px-3 py-2 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{d.condition}</p>
                    {d.likelihood && (
                      <Badge variant="outline" className="text-xs font-normal shrink-0">{d.likelihood}</Badge>
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

      {diagItems.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <ClipboardList className="size-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Diagnostic Plan</p>
            </div>
            <ul className="space-y-1.5">
              {diagItems.map((item, i) => (
                <li key={i} className="text-sm text-foreground space-y-0.5">
                  <p className="font-medium">{item.test ?? item.study}</p>
                  {item.purpose && <p className="text-xs text-muted-foreground">{item.purpose}</p>}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {report.treatment_plan && report.treatment_plan.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <ListChecks className="size-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Treatment Plan</p>
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

      {report.procedures && report.procedures !== "Not reported" && (
        <>
          <Separator />
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Stethoscope className="size-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Procedures</p>
            </div>
            <p className="text-sm text-foreground">{report.procedures}</p>
          </div>
        </>
      )}

      {redFlags.length > 0 && (
        <>
          <Separator />
          <div className="rounded-md border border-red-200 bg-red-50 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <TriangleAlert className="size-3.5 text-red-600" />
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Red Flags</p>
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
  );
}

// ── modal ────────────────────────────────────────────────────────────────────

export function AppointmentViewModal() {
  const session = useSession();
  const closeModal = useAppointmentModalStore((state) => state.onClose);
  const modalType = useAppointmentModalStore((state) => state.type);
  const isOpen = useAppointmentModalStore((state) => state.isOpen);
  const appointment = useAppointmentModalStore((state) => state.appointmentData);
  const patientOrDoctor = useAppointmentModalStore((state) => state.patientOrDoctor);

  const isModalOpen = isOpen && modalType === "viewAppointment";

  if (!session || !isModalOpen) return null;

  if (!appointment) {
    return (
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="!max-w-lg">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>Appointment not found</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const cancelledBy =
    appointment.cancelledBy === patientOrDoctor
      ? "You"
      : appointment.cancelledBy ?? "UNKNOWN";

  const kind = getAppointmentKind(appointment.appointmentMode, appointment.doctor.userId);
  const actual = appointment.appointmentActual;

  const intakeMessages = safeParseMessages(actual?.intakeConversation);
  const consultationMessages = safeParseMessages(actual?.virtualConversation);
  const intakeReport = safeParseReport(actual?.intakeReport);
  // AI consultation uses fullReport (soap_report + assessment_plan structure)
  // Doctor virtual consultation uses doctorReport (direct SOAP structure from doctor-report-agent)
  const fullReportData = safeParseFullReport(
    kind === "doctor" ? actual?.doctorReport : actual?.fullReport,
  );

  const hasConversation = intakeMessages.length > 0 || consultationMessages.length > 0;
  const hasAiData = hasConversation || intakeReport != null || fullReportData != null;
  const isFollowUp = !!appointment.followUpMapping;
  const hasFollowUp = !!appointment.intakeMapping;

  const doctorLabel =
    kind === "ai-consultation" || kind === "intake"
      ? "AI Assistant"
      : `Dr. ${appointment.doctor.personal?.fullName ?? "—"}`;

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Appointment Overview
            </DialogTitle>
            <AppointmentKindBadge mode={appointment.appointmentMode} doctorUserId={appointment.doctor.userId} />
          </div>
          <DialogDescription className="text-sm font-medium">
            Detailed information about this appointment
          </DialogDescription>
        </DialogHeader>

        {/* Header row */}
        <div className="mt-2 flex items-center justify-between">
          <h3 className="text-xl font-semibold">{appointment.type}</h3>
          <AppointmentStatusIndicator status={appointment.status} />
        </div>

        {appointment.status === "CANCELLED" && (
          <div className="text-muted-foreground text-sm">
            <p>Cancelled by {cancelledBy}</p>
            <p>Reason: {appointment.cancelReason ?? "Not Specified"}</p>
          </div>
        )}

        {/* Follow-up / intake link banners with linked appointment details */}
        {isFollowUp && (() => {
          const linked = appointment.followUpMapping?.intakeAppointment;
          return (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <LinkIcon className="size-4 shrink-0" />
                <span>Follow-up for an AI Intake Assessment</span>
              </div>
              {linked && (
                <div className="ml-6 rounded-md border border-blue-200 bg-white/60 dark:bg-blue-900/30 px-3 py-2 space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-3.5" />
                    <span className="font-medium">{format(new Date(linked.appointmentDate), "PPP")}</span>
                    <Clock className="size-3.5 ml-2" />
                    <span>{linked.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="size-3.5" />
                    <span>{linked.type}</span>
                    <AppointmentStatusIndicator status={linked.status} />
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {hasFollowUp && (() => {
          const linked = appointment.intakeMapping?.followUpAppointment;
          const linkedDoctorName = linked?.doctor?.personal?.fullName;
          return (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300 space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <ArrowRight className="size-4 shrink-0" />
                <span>A follow-up doctor appointment was booked from this intake</span>
              </div>
              {linked && (
                <div className="ml-6 rounded-md border border-green-200 bg-white/60 dark:bg-green-900/30 px-3 py-2 space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-3.5" />
                    <span className="font-medium">{format(new Date(linked.appointmentDate), "PPP")}</span>
                    <Clock className="size-3.5 ml-2" />
                    <span>{linked.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="size-3.5" />
                    <span>{linkedDoctorName ? `Dr. ${linkedDoctorName}` : "Doctor"}</span>
                    <span className="mx-1">·</span>
                    <span className="capitalize">{linked.appointmentMode.toLowerCase()}</span>
                    <AppointmentStatusIndicator status={linked.status} />
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        <Separator className="my-2" />

        {/* Schedule + People */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-wide">SCHEDULE</p>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="font-medium">{format(new Date(appointment.appointmentDate), "PPP")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{appointment.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="font-medium capitalize">{appointment.appointmentMode.toLowerCase()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-wide">PEOPLE</p>
            <div className="flex items-center gap-2">
              {kind === "doctor" ? (
                <Stethoscope className="h-4 w-4" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              <span className="font-medium">{doctorLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">{appointment.patient.personal?.name}</span>
            </div>
          </div>
        </div>

        {/* Payment — only for real doctor appointments */}
        {kind === "doctor" && (appointment.price != null) && (
          <>
            <Separator className="my-2" />
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4" />
              <span className="text-lg font-semibold">
                {appointment.priceCurrency} {appointment.price}
              </span>
            </div>
          </>
        )}

        {/* Notes */}
        {appointment.note && (
          <div className="bg-muted/40 rounded-xl border p-4 text-sm">
            <p>{appointment.note}</p>
          </div>
        )}

        {/* AI Data */}
        {hasAiData && (
          <>
            <Separator className="my-2" />

            {/* AI Consultation — full report with tabs */}
            {fullReportData ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {kind === "doctor" ? (
                    <Stethoscope className="size-4 text-primary" />
                  ) : (
                    <Brain className="size-4 text-primary" />
                  )}
                  <p className="text-sm font-semibold">
                    {kind === "doctor" ? "Doctor's Report" : "Consultation Report"}
                  </p>
                  {fullReportData.generated_at && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(fullReportData.generated_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <Tabs
                  defaultValue={fullReportData.soap_report ? "soap" : "assessment"}
                  className="w-full"
                >
                  <TabsList className={fullReportData.soap_report && fullReportData.assessment_plan ? "grid w-full grid-cols-2" : "grid w-full grid-cols-1"}>
                    {fullReportData.soap_report && (
                      <TabsTrigger value="soap" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        SOAP Report
                      </TabsTrigger>
                    )}
                    {fullReportData.assessment_plan && (
                      <TabsTrigger value="assessment" className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Assessment & Plan
                      </TabsTrigger>
                    )}
                  </TabsList>
                  {fullReportData.soap_report && (
                    <TabsContent value="soap">
                      <div className="rounded-xl border bg-muted/30 p-4 mt-2">
                        <SoapSection soap={fullReportData.soap_report} />
                      </div>
                    </TabsContent>
                  )}
                  {fullReportData.assessment_plan && (
                    <TabsContent value="assessment">
                      <div className="rounded-xl border bg-muted/30 p-4 mt-2">
                        <AssessmentPlanSection plan={fullReportData.assessment_plan} />
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
                <ConversationViewer messages={consultationMessages} title="Consultation Conversation" />
              </div>
            ) : (
              /* Regular intake / doctor appointment data */
              <div className="space-y-4">
                {intakeReport && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-primary" />
                      <p className="text-sm font-semibold">Intake Report</p>
                    </div>
                    <div className="rounded-xl border bg-muted/30 p-4">
                      <IntakeReportView report={intakeReport} />
                    </div>
                  </div>
                )}
                <ConversationViewer messages={intakeMessages} title="Intake Conversation" />
                <ConversationViewer messages={consultationMessages} title="Consultation Conversation" />
              </div>
            )}
          </>
        )}

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
