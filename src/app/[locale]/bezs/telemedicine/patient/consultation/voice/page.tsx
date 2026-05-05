import VoiceConsultation from "@/modules/client/telemedicine/components/patient/VoiceConsultation";
import { getServerSession } from "@/modules/server/auth/get-session";
import { prismaTelemedicine } from "@/modules/server/prisma/prisma";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

async function ConsultationPage() {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session || !session.session.activeOrganizationId) {
    throw new Error("UNAUTHORIZED");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
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
    include: { personal: true },
  });

  if (!patient || !patient.personal) {
    redirect({ href: "/bezs/telemedicine/patient/profile", locale });
    return;
  }

  return <VoiceConsultation />;
}

export default ConsultationPage;
