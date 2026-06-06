import { getPatientAppointmentView } from "@/modules/client/telemedicine/server-actions/appointment-action";
import { PatientAppointmentView } from "@/modules/client/telemedicine/components/patient/appointment-view/PatientAppointmentView";

interface Props {
  params: Promise<{ appointmentId: string }>;
}

export default async function AppointmentIdPage({ params }: Props) {
  const { appointmentId } = await params;
  const data = await getPatientAppointmentView(appointmentId).catch(() => null);

  return <PatientAppointmentView data={data} />;
}
