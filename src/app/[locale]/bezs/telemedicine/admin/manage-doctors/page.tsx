import { DoctorsProfileListTable } from "@/modules/client/telemedicine/components/tables/application-admin/doctors-profile-list-table";
import { getAllDoctorsData } from "@/modules/client/telemedicine/server-actions/doctorProfile-actions";
import { getServerSession } from "@/modules/server/auth/get-session";

async function TelemedicineAdminManageDoctorsPage() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
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
