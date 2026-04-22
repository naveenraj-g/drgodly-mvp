import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TAppointment } from "@/modules/shared/entities/models/telemedicine/appointment";
import { IntakeInsights } from "./IntakeInsights";
import { TreatmentEngine } from "./TreatmentEngine";
import { ClinicalSummary } from "./ClinicalSummary";
import { LifestyleCharts } from "../charts/LifestyleCharts";
import { HealthRecords } from "./HealthRecords";

interface AppointmentDetailsProps {
  appointment: TAppointment;
}

export const AppointmentDetails = ({
  appointment,
}: AppointmentDetailsProps) => {
  const patientName = appointment.patient.personal?.name ?? "Unknown Patient";

  return (
    <Card className="h-full flex flex-col border-none shadow-none p-0">
      <CardHeader className="px-0">
        <CardTitle className="text-xl">Appointment Details</CardTitle>
        <CardDescription>{patientName}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 px-0">
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3 grid-flow-dense">
          <IntakeInsights appointment={appointment} />
          <ClinicalSummary patientName={patientName} />
          <TreatmentEngine />
          <LifestyleCharts />
          <HealthRecords />
        </div>
      </CardContent>
    </Card>
  );
};
