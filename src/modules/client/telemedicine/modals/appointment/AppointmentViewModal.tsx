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
} from "lucide-react";
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
  const intakeReport = actual?.intakeReport;

  const hasConversation = intakeMessages.length > 0 || consultationMessages.length > 0;
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

        {/* Conversation / Intake Report */}
        {hasConversation && (
          <>
            <Separator className="my-2" />
            <div className="space-y-4">
              <ConversationViewer messages={intakeMessages} title="Intake Conversation" />
              <ConversationViewer messages={consultationMessages} title="Consultation Conversation" />
              {intakeReport && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Intake Report</p>
                  <div className="bg-muted/40 rounded-xl border p-4 text-sm whitespace-pre-wrap">
                    {typeof intakeReport === "string"
                      ? intakeReport
                      : JSON.stringify(intakeReport, null, 2)}
                  </div>
                </div>
              )}
            </div>
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
