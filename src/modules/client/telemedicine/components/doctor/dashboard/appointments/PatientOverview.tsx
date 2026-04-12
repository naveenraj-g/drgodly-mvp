import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, Activity } from "lucide-react";
import { Appointment } from "@/modules/client/telemedicine/datas/doctor-dashboard";
import { StatusIndicator } from "@/modules/shared/utils/status-indicator";

interface PatientOverviewProps {
  appointment: Appointment;
}

const statusConfig = {
  scheduled: { label: "Scheduled", className: "bg-info text-info-foreground" },
  "in-progress": {
    label: "In Progress",
    className: "bg-warning text-warning-foreground",
  },
  completed: {
    label: "Completed",
    className: "bg-success text-success-foreground",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground",
  },
};

export const PatientOverview = ({ appointment }: PatientOverviewProps) => {
  const { patient } = appointment;
  const status = statusConfig[appointment.status];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Patient Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Patient Name</p>
            <p className="font-semibold text-foreground">{patient.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Age</p>
            <p className="font-semibold text-foreground">{patient.age} years</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gender</p>
            <p className="font-semibold text-foreground">{patient.gender}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            {/* <Badge className={status.className}>{status.label}</Badge> */}
            <StatusIndicator
              status={status.label.replaceAll(" ", "").toUpperCase()}
              className="h-6 text-xs"
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Appointment Time</p>
              <p className="font-medium text-foreground">{appointment.time}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Activity className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Primary Complaint</p>
              <p className="font-medium text-foreground">
                {patient.primaryComplaint}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
