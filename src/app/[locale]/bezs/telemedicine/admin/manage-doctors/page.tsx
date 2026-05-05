import { redirect } from "@/i18n/navigation";
import { DoctorsProfileListTable } from "@/modules/client/telemedicine/components/tables/application-admin/doctors-profile-list-table";
import { getAllDoctorsData } from "@/modules/client/telemedicine/server-actions/doctorProfile-actions";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";

async function TelemedicineAdminManageDoctorsPage() {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session) {
    redirect({ href: "/login", locale });
    return;
  }

  const [data, error] = await getAllDoctorsData({
    orgId: session.session.activeOrganizationId!,
  });

  const user = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    email: session.user.email,
    currentOrgId: session.session.activeOrganizationId,
  };

  return (
    <div>
      <DoctorsProfileListTable doctorDatas={data} error={error} user={user} />
    </div>
  );
}

export default TelemedicineAdminManageDoctorsPage;
