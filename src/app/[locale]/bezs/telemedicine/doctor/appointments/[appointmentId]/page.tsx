import { getServerSession } from "@/modules/server/auth/get-session";
import { getAppointmentReview } from "@/modules/client/telemedicine/server-actions/appointment-action";
import { AppointmentReview } from "@/modules/client/telemedicine/components/doctor/appointment-review/AppointmentReview";

interface Props {
  params: Promise<{ appointmentId: string }>;
}

export default async function AppointmentIdPage({ params }: Props) {
  const { appointmentId } = await params;
  const [session, data] = await Promise.all([
    getServerSession(),
    getAppointmentReview(appointmentId).catch(() => null),
  ]);

  const userId = session?.user.id ?? "";

  return <AppointmentReview appointmentId={appointmentId} userId={userId} data={data} />;
}
