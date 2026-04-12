import { redirect } from "@/i18n/navigation";
import { getFileUploadRequiredDataWithAppSlug } from "@/modules/client/shared/server-actions/file-upload-action";
import PatientFileUpload from "@/modules/client/telemedicine/components/patient/fileUpload/FileUpload";
import { getServerSession } from "@/modules/server/auth/get-session";
import { prismaTelemedicine } from "@/modules/server/prisma/prisma";
import { getLocale } from "next-intl/server";

async function PatientFileUploadPage() {
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

  const patient = await prismaTelemedicine.patient.findUnique({
    where: {
      orgId_userId: {
        orgId: user.orgId,
        userId: user.id,
      },
    },
    include: {
      personal: true,
    },
  });

  if (!patient || !patient.personal) {
    redirect({ href: "/bezs/telemedicine/patient/profile", locale });
    return;
  }

  const [fileUploadEntities, fileUploadEntitiesError] =
    await getFileUploadRequiredDataWithAppSlug({
      appSlug: "telemedicine",
      orgId: user.orgId,
      userId: user.id,
    });

  return (
    <div>
      <PatientFileUpload
        fileEntities={fileUploadEntities}
        fileEntitiesError={fileUploadEntitiesError}
        user={user}
      />
    </div>
  );
}

export default PatientFileUploadPage;
