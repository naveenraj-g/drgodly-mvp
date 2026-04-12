import { getServerSession } from "@/modules/server/auth/get-session";
import { getDoctorAppointments } from "@/modules/client/telemedicine/server-actions/appointment-action";
import AppointmentsTable from "@/modules/client/telemedicine/components/doctor/appointments/listAppointments/AppointmentsTable";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

async function AppointmentsPage() {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session || !session.session.activeOrganizationId) {
    redirect({ href: "/signin", locale });
    return;
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    email: session.user.email,
    orgId: session.session.activeOrganizationId,
  };

  const [appointments, error] = await getDoctorAppointments({
    userId: user.id,
    orgId: user.orgId,
  });

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <p className="text-sm">Manage Appointments.</p>
      </div>
      <AppointmentsTable appointments={appointments ?? []} error={error} />
    </div>
  );
}

export default AppointmentsPage;
