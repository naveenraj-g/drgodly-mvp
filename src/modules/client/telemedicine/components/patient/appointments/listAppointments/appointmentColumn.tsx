import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ProfileAvatar } from "@/modules/shared/components/ProfileAvatar";
import { AppointmentStatusIndicator } from "../../../AppointmentStatusIndicator";
import { CalendarClock, EllipsisVertical, Trash2, X, Brain, ArrowRight } from "lucide-react";
import { TanstackTableColumnSorting } from "@/modules/shared/components/table/tanstack-table-column-sorting";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { TAppointment } from "@/modules/shared/entities/models/telemedicine/appointment";
import { AppointmentModalStore } from "@/modules/client/telemedicine/stores/appointment-modal-store";

function getKind(mode: string, doctorUserId: string | null | undefined) {
  if (mode === "INTAKE") return "intake";
  if (doctorUserId === "AIDOCTOR") return "ai-consultation";
  return "doctor";
}

function KindBadge({ mode, doctorUserId, isFollowUp, hasFollowUp }: {
  mode: string;
  doctorUserId?: string | null;
  isFollowUp: boolean;
  hasFollowUp: boolean;
}) {
  const kind = getKind(mode, doctorUserId);
  return (
    <div className="flex flex-col gap-1">
      {kind === "intake" && (
        <Badge variant="secondary" className="w-fit gap-1 text-xs">
          <Brain className="size-3" /> AI Intake
        </Badge>
      )}
      {kind === "ai-consultation" && (
        <Badge className="w-fit gap-1 text-xs bg-violet-100 text-violet-700 hover:bg-violet-100 dark:bg-violet-900 dark:text-violet-300">
          <Brain className="size-3" /> AI Consultation
        </Badge>
      )}
      {kind === "doctor" && (
        <Badge variant="outline" className="w-fit text-xs">
          {mode === "VIRTUAL" ? "Virtual" : "In-Person"}
        </Badge>
      )}
      {isFollowUp && (
        <Badge variant="outline" className="w-fit gap-1 text-xs text-blue-600 border-blue-300">
          <ArrowRight className="size-3 rotate-180" /> Follow-up
        </Badge>
      )}
      {hasFollowUp && (
        <Badge variant="outline" className="w-fit gap-1 text-xs text-green-600 border-green-300">
          <ArrowRight className="size-3" /> Has Follow-up
        </Badge>
      )}
    </div>
  );
}

export const appointmentColumn: ColumnDef<TAppointment>[] = [
  {
    header: "INFO",
    accessorKey: "patient",
    cell: ({ row }) => {
      const patientData = row.original.patient;
      return (
        <div className="flex items-center gap-2 py-2 2xl:gap-3">
          <ProfileAvatar imgUrl={null} name={patientData.personal?.name} />
          <div className="font-semibold">
            <h3>{patientData.personal?.name}</h3>
            <span className="text-xs font-light capitalize md:text-sm">
              {patientData.personal?.gender?.toLowerCase()}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: "TYPE",
    id: "type",
    cell: ({ row }) => {
      const { appointmentMode, doctor, followUpMapping, intakeMapping } = row.original;
      return (
        <KindBadge
          mode={appointmentMode}
          doctorUserId={doctor.userId}
          isFollowUp={!!followUpMapping}
          hasFollowUp={!!intakeMapping}
        />
      );
    },
  },
  {
    header: ({ column }) => (
      <TanstackTableColumnSorting label="DATE" column={column} isSorted={column.getIsSorted()} />
    ),
    accessorKey: "appointmentDate",
    cell: ({ row }) => {
      const date: string = row.getValue("appointmentDate");
      return <div>{format(date, "MMM dd, yyy")}</div>;
    },
  },
  {
    header: ({ column }) => (
      <TanstackTableColumnSorting label="TIME" column={column} isSorted={column.getIsSorted()} />
    ),
    accessorKey: "time",
  },
  {
    header: ({ column }) => (
      <TanstackTableColumnSorting label="DOCTOR" column={column} isSorted={column.getIsSorted()} />
    ),
    accessorKey: "doctor",
    filterFn: (row, _columnId, filterValue) => {
      const doctor = row.original.doctor;
      const name = doctor.personal?.fullName ?? "";
      return name.toLowerCase().includes((filterValue as string).toLowerCase());
    },
    cell: ({ row }) => {
      const doctorData = row.original.doctor;
      const kind = getKind(row.original.appointmentMode, doctorData.userId);
      const isAi = kind !== "doctor";

      if (isAi) {
        return (
          <div className="flex items-center gap-2 py-2 2xl:gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <Brain className="size-4" />
            </div>
            <span className="font-semibold">AI Assistant</span>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2 py-2 2xl:gap-3">
          <ProfileAvatar imgUrl={null} name={doctorData.personal?.fullName} />
          <div className="font-semibold">
            <h3 className="capitalize">{doctorData.personal?.fullName}</h3>
            <span className="text-xs font-light capitalize md:text-sm">
              {doctorData.personal?.gender}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: ({ column }) => (
      <TanstackTableColumnSorting label="STATUS" column={column} isSorted={column.getIsSorted()} />
    ),
    accessorKey: "status",
    cell: ({ row }) => <AppointmentStatusIndicator status={row.original.status} />,
  },
  {
    header: "ACTIONS",
    id: "actions",
    cell: ({ row }) => {
      const appointmentData = row.original;
      const { status, appointmentMode, doctor } = appointmentData;
      const kind = getKind(appointmentMode, doctor.userId);
      const isAi = kind !== "doctor";

      const openModal = AppointmentModalStore((state) => state.onOpen);

      return (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            className="rounded-full"
            onClick={() =>
              openModal({ type: "viewAppointment", appointmentData, patientOrDoctor: "PATIENT" })
            }
          >
            View
          </Button>

          {!isAi && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(buttonVariants({ size: "icon", variant: "ghost" }), "rounded-full")}
              >
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="left">
                {(status === "PENDING" || status === "RESCHEDULED" || status === "SCHEDULED") && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => openModal({ type: "rescheduleAppointment", appointmentData })}
                  >
                    <CalendarClock />
                    Reschedule
                  </DropdownMenuItem>
                )}
                {status === "COMPLETED" || status === "CANCELLED" ? (
                  <DropdownMenuItem
                    className="cursor-pointer space-x-2 text-rose-600 hover:!text-rose-600 dark:text-rose-500 dark:hover:!text-rose-500"
                    onClick={() => openModal({ type: "deleteAppointment", appointmentData })}
                  >
                    <div className="flex items-center gap-2">
                      <Trash2 className="text-rose-600 dark:text-rose-500" />
                      Delete
                    </div>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="cursor-pointer space-x-2 text-rose-600 hover:!text-rose-600 dark:text-rose-500 dark:hover:!text-rose-500"
                    onClick={() => openModal({ type: "cancelAppointment", appointmentData })}
                  >
                    <div className="flex items-center gap-2">
                      <X className="text-rose-600 dark:text-rose-500" />
                      Cancel
                    </div>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {appointmentMode === "VIRTUAL" &&
            (status === "SCHEDULED" || status === "RESCHEDULED") &&
            kind === "doctor" && (
              <Link
                className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
                href={`/bezs/telemedicine/patient/appointments/online-consultation?appointmentId=${appointmentData.id}`}
              >
                Consult Online
              </Link>
            )}
        </div>
      );
    },
  },
];
