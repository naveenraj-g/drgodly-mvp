import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Clock, Mars, Venus } from "lucide-react";
import { Appointment } from "@/modules/client/telemedicine/datas/doctor-dashboard";
import { cn } from "@/lib/utils";
import { StatusIndicator } from "@/modules/shared/utils/status-indicator";

interface AppointmentListProps {
  appointments: Appointment[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isSticky: boolean;
}

const statusConfig = {
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-500 text-white",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-orange-500 text-white",
  },
  completed: {
    label: "Completed",
    className: "bg-green-500 text-white",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-muted text-white",
  },
};

export const AppointmentList = ({
  appointments,
  selectedId,
  onSelect,
  isSticky,
}: AppointmentListProps) => {
  const selectedAppointment = appointments.find(
    (appointment) => appointment.id === selectedId
  );

  return (
    <Card
      className={cn(
        "h-full flex flex-col transition-all",
        isSticky && "rounded-t-none py-4"
      )}
    >
      {/* {!isSticky && (
        <CardHeader>
          <CardTitle>Today&apos;s Appointments</CardTitle>
          <CardDescription>
            {appointments.length} appointments scheduled
          </CardDescription>
        </CardHeader>
      )} */}

      <CardContent
        className={cn(
          "flex-1 flex gap-3 w-full overflow-auto",
          isSticky && "px-4"
        )}
      >
        {appointments.map((appointment) => {
          const status = statusConfig[appointment.status];
          const isSelected = selectedId === appointment.id;

          return (
            <Card
              key={appointment.id}
              className={cn(
                "w-fit shrink-0 p-4 cursor-pointer transition-all hover:shadow-md",
                !isSticky && "mb-2",
                isSelected
                  ? "border-primary shadow-md bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onSelect(appointment.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {appointment.time}
                    </span>
                    <StatusIndicator
                      status={status.label.replaceAll(" ", "").toUpperCase()}
                      className="h-6"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    {appointment.patient.gender.toLocaleLowerCase() ===
                      "male" && (
                      <Mars className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    {appointment.patient.gender.toLocaleLowerCase() ===
                      "female" && (
                      <Venus className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <h3 className="font-semibold text-foreground truncate">
                      {appointment.patientName}
                    </h3>
                  </div>

                  <p
                    className={cn(
                      "text-xs text-muted-foreground line-clamp-2",
                      isSticky && "hidden"
                    )}
                  >
                    {appointment.reason}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </CardContent>
      <CardFooter className={cn("-mt-2", isSticky && "hidden")}>
        {selectedAppointment ? (
          <div className="flex items-center gap-6 w-full">
            <div className="flex items-start gap-2">
              {/* <Activity className="h-4 w-4 text-primary mt-0.5 shrink-0" /> */}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium text-foreground">
                  {selectedAppointment.patient.age} years
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Activity className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Primary Complaint
                </p>
                <p className="font-medium text-foreground">
                  {selectedAppointment.patient.primaryComplaint}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
};
