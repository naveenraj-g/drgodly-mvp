import { PatientProfilePersonalDetails } from "@/modules/client/telemedicine/components/patient/patientProfilePersonalDetails";
import { getPatientWithPersonalProfile } from "@/modules/client/telemedicine/server-actions/patientProfile-actions";
import { getServerSession } from "@/modules/server/auth/get-session";
import { CircleAlert } from "lucide-react";

async function PatientProfilePage() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  const [patientWithPersonalProfileData, error] =
    await getPatientWithPersonalProfile({
      orgId: session.session.activeOrganizationId!,
      userId: session.user.id,
    });

  if (error) {
    throw new Error(error.message);
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    currentOrgId: session.session.activeOrganizationId,
  };

  return (
    <div>
      {(!patientWithPersonalProfileData ||
        !patientWithPersonalProfileData.personal) && (
        <div className="bg-warning/20 text-warning flex items-center gap-2 p-2 px-4 rounded-full mb-4">
          <CircleAlert className="size-5" />
          <p>Complete your profile first!</p>
        </div>
      )}
      <PatientProfilePersonalDetails
        user={user}
        data={patientWithPersonalProfileData}
      />
    </div>
  );
}

export default PatientProfilePage;
