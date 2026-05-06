import { Card, CardContent } from "@/components/ui/card";
import { Clock, Mars, Venus, ArrowRight } from "lucide-react";
import {
  TAppointment,
  TAppointments,
} from "@/modules/shared/entities/models/telemedicine/appointment";
import { cn } from "@/lib/utils";
import { StatusIndicator } from "@/modules/shared/utils/status-indicator";

interface AppointmentListProps {
  appointments: TAppointments;
  selectedId: string | null;
  onSelect: (id: string) => void;
  isSticky: boolean;
}

const STATUS_MAP: Record<string, { label: string; indicatorKey: string }> = {
  SCHEDULED: { label: "Scheduled", indicatorKey: "SCHEDULED" },
  PENDING: { label: "Pending", indicatorKey: "PENDING" },
  RESCHEDULED: { label: "Rescheduled", indicatorKey: "RESCHEDULED" },
  COMPLETED: { label: "Completed", indicatorKey: "COMPLETED" },
  CANCELLED: { label: "Cancelled", indicatorKey: "CANCELLED" },
};

function patientName(apt: TAppointment): string {
  return apt.patient.personal?.name ?? "Unknown Patient";
}

function patientGender(apt: TAppointment): string {
  return (apt.patient.personal?.gender ?? "").toLowerCase();
}

function isFollowUp(apt: TAppointment): boolean {
  return !!apt.followUpMapping;
}

export const AppointmentList = ({
  appointments,
  selectedId,
  onSelect,
  isSticky,
}: AppointmentListProps) => {
  if (appointments.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center p-6">
        <p className="text-muted-foreground text-sm">
          No appointments for today.
        </p>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "h-full flex flex-col transition-all",
        isSticky && "rounded-t-none py-4",
      )}
    >
      <CardContent
        className={cn(
          "flex-1 flex gap-3 w-full overflow-auto",
          isSticky && "px-4",
        )}
      >
        {appointments.map((apt) => {
          const status = STATUS_MAP[apt.status] ?? STATUS_MAP.SCHEDULED;
          const isSelected = selectedId === apt.id;
          const gender = patientGender(apt);
          const followUp = isFollowUp(apt);

          return (
            <div
              key={apt.id}
              className={cn(
                "w-32 shrink-0 rounded-lg border px-2.5 py-2 cursor-pointer transition-all hover:shadow-sm space-y-1",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40",
              )}
              onClick={() => onSelect(apt.id)}
            >
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-primary shrink-0" />
                <span className="text-xs font-medium">{apt.time}</span>
              </div>
              <StatusIndicator
                status={status.indicatorKey}
                className="text-[10px] px-1.5 py-1 h-4 w-fit"
              />
              <div className="flex items-center gap-1">
                {gender === "male" && (
                  <Mars className="h-3 w-3 text-muted-foreground shrink-0" />
                )}
                {gender === "female" && (
                  <Venus className="h-3 w-3 text-muted-foreground shrink-0" />
                )}
                <p className="text-xs font-semibold truncate">
                  {patientName(apt)}
                </p>
              </div>
              {/* <div className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                {followUp && (
                  <ArrowRight className="size-2.5 rotate-180 text-blue-500 shrink-0" />
                )}
                <span className="truncate">{apt.type}</span>
              </div> */}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
