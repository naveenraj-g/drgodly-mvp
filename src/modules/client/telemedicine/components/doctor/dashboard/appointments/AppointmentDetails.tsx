import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Appointment } from "@/modules/client/telemedicine/datas/doctor-dashboard";
import { PatientOverview } from "./PatientOverview";
import { IntakeInsights } from "./IntakeInsights";
import { TreatmentEngine } from "./TreatmentEngine";
import { ClinicalSummary } from "./ClinicalSummary";
import { LifestyleCharts } from "../charts/LifestyleCharts";
import { HealthRecords } from "./HealthRecords";

interface AppointmentDetailsProps {
  appointment: Appointment;
}

export const AppointmentDetails = ({
  appointment,
}: AppointmentDetailsProps) => {
  return (
    <Card className="h-full flex flex-col border-none shadow-none p-0">
      <CardHeader className="px-0">
        <CardTitle className="text-xl">Appointment Details</CardTitle>
        <CardDescription>{appointment.patientName}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 px-0">
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3 grid-flow-dense">
          {/* <PatientOverview appointment={appointment} /> */}
          <IntakeInsights intake={appointment.patient.intake} />
          <ClinicalSummary patientName={appointment.patientName} />
          <TreatmentEngine
            recommendations={appointment.patient.aiRecommendations}
          />
          <LifestyleCharts lifestyle={appointment.patient.lifestyle} />
          <HealthRecords records={appointment.patient.healthRecords} />
        </div>
      </CardContent>
    </Card>
  );
};
