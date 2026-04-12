import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TAppointmentStatue } from "./patient/appointments/listAppointments/types";

const status_color = {
  PENDING: "bg-yellow-600/15 text-yellow-600",
  SCHEDULED: "bg-emerald-600/15 text-emerald-600",
  RESCHEDULED: "bg-amber-600/15 text-amber-600",
  CANCELLED: "bg-red-600/15 text-red-600",
  COMPLETED: "bg-blue-600/15 text-blue-600",
};

export function AppointmentStatusIndicator({
  status,
}: {
  status: TAppointmentStatue;
}) {
  return (
    <Badge
      className={cn(
        "rounded-full px-2 py-1 text-xs capitalize lg:text-sm",
        status_color[status?.toUpperCase() as keyof typeof status_color]
      )}
    >
      {status?.toUpperCase()}
    </Badge>
  );
}
