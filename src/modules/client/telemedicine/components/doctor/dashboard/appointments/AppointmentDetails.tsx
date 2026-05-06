import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { TAppointment } from "@/modules/shared/entities/models/telemedicine/appointment";
import type { LifestyleData } from "@/modules/client/telemedicine/datas/doctor-dashboard";
import { IntakeInsights } from "./IntakeInsights";
import { ConsultationInsights } from "./ConsultationInsights";
import { TreatmentEngine } from "./TreatmentEngine";
import { ClinicalSummary } from "./ClinicalSummary";
import { LifestyleCharts } from "../charts/LifestyleCharts";
import { HealthRecords } from "./HealthRecords";

interface AppointmentDetailsProps {
  appointment: TAppointment;
  lifestyle: LifestyleData | null;
  vitalsLoading: boolean;
}

export const AppointmentDetails = ({
  appointment,
  lifestyle,
  vitalsLoading,
}: AppointmentDetailsProps) => {
  const patientName = appointment.patient.personal?.name ?? "Unknown Patient";

  return (
    <Card className="h-full flex flex-col border-none shadow-none p-2">
      <CardHeader className="px-0">
        <CardTitle className="text-xl">Appointment Details</CardTitle>
        <div className="flex gap-2 items-center flex-wrap">
          <CardDescription>{patientName}</CardDescription>
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <Badge variant="secondary" className="text-xs capitalize">
              {appointment.appointmentMode.toLowerCase()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {appointment.type}
            </Badge>
            {appointment.followUpMapping && (
              <Badge className="text-xs bg-blue-500/10 text-blue-600 border border-blue-200 hover:bg-blue-500/20">
                <ArrowRight className="size-3 rotate-180 mr-1" />
                Follow-up
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-0">
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3 grid-flow-dense auto-rows-[480px]">
          {appointment.type === "AI Consultation" ? (
            <ConsultationInsights appointment={appointment} />
          ) : (
            <IntakeInsights appointment={appointment} />
          )}
          <ClinicalSummary
            patientName={patientName}
            appointment={appointment}
          />
          <TreatmentEngine />
          <LifestyleCharts
            lifestyle={lifestyle ?? undefined}
            isLoading={vitalsLoading}
          />
          <HealthRecords />
        </div>
      </CardContent>
    </Card>
  );
};
