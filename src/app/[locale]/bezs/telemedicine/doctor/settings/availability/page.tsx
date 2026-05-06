import { redirect } from "@/i18n/navigation";
import DefaultWeeklyAvailability from "@/modules/client/telemedicine/components/doctor/availability/doctorWeeklyAvailability";
import { getDoctorWeeklyAvailability } from "@/modules/client/telemedicine/server-actions/doctorWeeklyAvailability-action";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";

async function DoctorAvailabilitySettings() {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session || !session.session.activeOrganizationId) {
    redirect({ href: "/login", locale });
    return;
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    email: session.user.email,
    orgId: session.session.activeOrganizationId,
  };

  const [data, error] = await getDoctorWeeklyAvailability({
    orgId: user.orgId,
    userId: user.id,
  });

  return (
    <div>
      <DefaultWeeklyAvailability data={data} user={user} error={error} />
    </div>
  );
}

export default DoctorAvailabilitySettings;
