import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Activity, Clock, Mars, Venus, Brain, ArrowRight } from "lucide-react";
import { TAppointment, TAppointments } from "@/modules/shared/entities/models/telemedicine/appointment";
import { cn } from "@/lib/utils";
import { StatusIndicator } from "@/modules/shared/utils/status-indicator";

interface AppointmentListProps {
  appointments: TAppointments;
  selectedId: string | null;
  onSelect: (id: string) => void;
  isSticky: boolean;
}

const STATUS_MAP: Record<string, { label: string; indicatorKey: string }> = {
  SCHEDULED:   { label: "Scheduled",   indicatorKey: "SCHEDULED" },
  PENDING:     { label: "Pending",     indicatorKey: "PENDING" },
  RESCHEDULED: { label: "Rescheduled", indicatorKey: "RESCHEDULED" },
  COMPLETED:   { label: "Completed",   indicatorKey: "COMPLETED" },
  CANCELLED:   { label: "Cancelled",   indicatorKey: "CANCELLED" },
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
  const selected = appointments.find((a) => a.id === selectedId);

  if (appointments.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center p-6">
        <p className="text-muted-foreground text-sm">No appointments for today.</p>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "h-full flex flex-col transition-all",
        isSticky && "rounded-t-none py-4"
      )}
    >
      <CardContent
        className={cn(
          "flex-1 flex gap-3 w-full overflow-auto",
          isSticky && "px-4"
        )}
      >
        {appointments.map((apt) => {
          const status = STATUS_MAP[apt.status] ?? STATUS_MAP.SCHEDULED;
          const isSelected = selectedId === apt.id;
          const gender = patientGender(apt);
          const followUp = isFollowUp(apt);

          return (
            <Card
              key={apt.id}
              className={cn(
                "w-fit shrink-0 p-4 cursor-pointer transition-all hover:shadow-md",
                !isSticky && "mb-2",
                isSelected
                  ? "border-primary shadow-md bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onSelect(apt.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {apt.time}
                    </span>
                    <StatusIndicator
                      status={status.indicatorKey}
                      className="h-6"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    {gender === "male" && (
                      <Mars className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    {gender === "female" && (
                      <Venus className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <h3 className="font-semibold text-foreground truncate">
                      {patientName(apt)}
                    </h3>
                  </div>

                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs text-muted-foreground",
                      isSticky && "hidden"
                    )}
                  >
                    {followUp && (
                      <ArrowRight className="size-3 rotate-180 text-blue-500" />
                    )}
                    <span className="line-clamp-1">{apt.type}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </CardContent>

      <CardFooter className={cn("-mt-2", isSticky && "hidden")}>
        {selected && (
          <div className="flex items-center gap-6 w-full">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Mode</p>
                <p className="font-medium text-foreground capitalize">
                  {selected.appointmentMode.toLowerCase()}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Activity className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium text-foreground">{selected.type}</p>
              </div>
            </div>
            {isFollowUp(selected) && (
              <div className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Intake</p>
                  <p className="font-medium text-foreground text-xs">
                    Follow-up from AI intake
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
