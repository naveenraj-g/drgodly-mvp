import DoctorProfileAndRegister from "@/modules/client/telemedicine/components/step-form/doctor/step-form";
import { getDoctorDataById } from "@/modules/client/telemedicine/server-actions/doctorProfile-actions";
import { getServerSession } from "@/modules/server/auth/get-session";
import { notFound } from "next/navigation";

async function TelemedicineAdminCreateDoctorPage(
  props: PageProps<"/[locale]/bezs/telemedicine/admin/manage-doctors/[type]">,
) {
  const session = await getServerSession();

  const { type } = await props.params;
  const searchParams = await props.searchParams;

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  const id = searchParams?.id as string;
  const allowedTypes = ["create", "edit"];

  if (!allowedTypes.includes(type)) {
    notFound();
  }

  if (!id) {
    return (
      <div className="text-center">
        <h1>Doctor profile Id is missing.</h1>
      </div>
    );
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    currentOrgId: session.session.activeOrganizationId,
  };

  const [data, error] = await getDoctorDataById({ id });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div>
      <DoctorProfileAndRegister
        doctorData={data}
        id={id}
        user={user}
        isUpdate={type === "edit"}
      />
    </div>
  );
}

export default TelemedicineAdminCreateDoctorPage;
