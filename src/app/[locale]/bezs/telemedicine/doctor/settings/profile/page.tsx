import DoctorProfileAndRegister from "@/modules/client/telemedicine/components/step-form/doctor/step-form";
import { getDoctorDataByUserId } from "@/modules/client/telemedicine/server-actions/doctorProfile-actions";
import { getServerSession } from "@/modules/server/auth/get-session";

async function DoctorProfilePage() {
  const session = await getServerSession();

  if (!session || !session.session.activeOrganizationId) {
    throw new Error("UNAUTHORIZED");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    currentOrgId: session.session.activeOrganizationId,
  };

  const [data, error] = await getDoctorDataByUserId({
    userId: session.user.id,
    orgId: session.session.activeOrganizationId,
  });

  console.log(data, error);

  if (!data) {
    throw new Error("UNAUTHORIZED");
  }

  return (
    <div>
      <DoctorProfileAndRegister
        doctorData={data}
        id={data.id}
        user={user}
        isUpdate
      />
    </div>
  );
}

export default DoctorProfilePage;

/* 
id: string;
    name: string;
    username?: string | null;
    currentOrgId?: string | null;
*/
