import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, User, Stethoscope } from "lucide-react";
import { SoapView } from "./SoapView";
import { ClinicalRecordsSection } from "./ClinicalRecordsSection";

// Explicit inline type — avoids depending on Prisma client generation state.
// Matches the select shape in getPatientAppointmentView.
interface AppointmentData {
  id: string;
  appointmentDate: Date;
  patient: { personal: { name: string | null } | null } | null;
  doctor: { personal: { fullName: string | null } | null } | null;
  appointmentActual: { doctorReport: unknown } | null;
  conditions: {
    id: string;
    codeDisplay: string | null;
    codeCode: string | null;
    codeSystem: string | null;
    clinicalStatusCode: string | null;
    verificationStatusCode: string | null;
  }[];
  observations: {
    id: string;
    codeDisplay: string | null;
    codeCode: string | null;
    status: string;
    valueString: string | null;
    valueQuantityValue: { toString(): string } | string | number | null;
    valueQuantityUnit: string | null;
    valueBoolean: boolean | null;
    valueInteger: number | null;
  }[];
  medicationRequests: {
    id: string;
    medicationCodeDisplay: string | null;
    medicationCodeCode: string | null;
    status: string;
    intent: string;
    dosageInstructions: {
      text: string | null;
      routeDisplay: string | null;
      routeText: string | null;
    }[];
  }[];
  serviceRequests: {
    id: string;
    codeDisplay: string | null;
    codeCode: string | null;
    status: string;
    intent: string;
    priority: string | null;
  }[];
}

interface PatientAppointmentViewProps {
  data: AppointmentData | null;
}

export function PatientAppointmentView({ data }: PatientAppointmentViewProps) {
  if (!data) {
    return (
      <Card className="m-6">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Appointment not found.
        </CardContent>
      </Card>
    );
  }

  const patientName = data.patient?.personal?.name ?? "Patient";
  const doctorName = data.doctor?.personal?.fullName;
  const appointmentDate = data.appointmentDate
    ? new Date(data.appointmentDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const hasClinicalRecords =
    data.conditions.length > 0 ||
    data.observations.length > 0 ||
    data.medicationRequests.length > 0 ||
    data.serviceRequests.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Appointment Summary</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {patientName}
          </span>
          {appointmentDate && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {appointmentDate}
            </span>
          )}
          {doctorName && (
            <span className="flex items-center gap-1.5">
              <Stethoscope className="h-3.5 w-3.5" />
              Dr. {doctorName}
            </span>
          )}
        </div>
      </div>

      <Separator />

      {/* SOAP note */}
      {data.appointmentActual?.doctorReport ? (
        <SoapView doctorReport={data.appointmentActual.doctorReport} />
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Clinical notes not yet available for this appointment.
          </CardContent>
        </Card>
      )}

      {/* Clinical records (only isDoctorAccepted items) */}
      {hasClinicalRecords && (
        <ClinicalRecordsSection
          conditions={data.conditions}
          observations={data.observations}
          medicationRequests={data.medicationRequests}
          serviceRequests={data.serviceRequests}
        />
      )}

      {!data.appointmentActual?.doctorReport && !hasClinicalRecords && (
        <div className="text-center py-4">
          <Badge variant="secondary">Pending doctor review</Badge>
        </div>
      )}
    </div>
  );
}
