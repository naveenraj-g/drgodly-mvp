import { getServerSession } from "@/modules/server/auth/get-session";
import { getDoctorDashboardAppointments } from "@/modules/client/telemedicine/server-actions/appointment-action";
import DoctorDashboard from "@/modules/client/telemedicine/components/doctor/dashboard/Dashboard";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

async function DoctorPage() {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session || !session.session.activeOrganizationId) {
    redirect({ href: "/signin", locale });
    return;
  }

  const [appointments] = await getDoctorDashboardAppointments({
    userId: session.user.id,
    orgId: session.session.activeOrganizationId,
  });

  return (
    <div>
      <DoctorDashboard appointments={appointments ?? []} />
    </div>
  );
}

export default DoctorPage;
