import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const status_color = {
  PENDING: "bg-yellow-500/15 text-yellow-600",
  SCHEDULED: "bg-emerald-500/15 text-emerald-600",
  CANCELLED: "bg-red-500/15 text-red-600",
  COMPLETED: "bg-blue-500/15 text-blue-600",
  INPROGRESS: "bg-orange-500/15 text-orange-600",
};

type AppointmentStatus =
  | "PENDING"
  | "SCHEDULED"
  | "CANCELLED"
  | "COMPLETED"
  | "INPROGRESS";

interface IStatusIndicatorProps {
  status: string;
  className?: string;
}

export function StatusIndicator({ status, className }: IStatusIndicatorProps) {
  return (
    <Badge
      className={cn(
        "capitalize text-xs lg:text-sm px-2 py-1 rounded-full",
        className,
        status_color[status?.toUpperCase() as keyof typeof status_color]
      )}
    >
      {status?.toUpperCase()}
    </Badge>
  );
}
