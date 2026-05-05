import AiIntake from "@/modules/client/telemedicine/components/patient/AiIntake";
import { getServerSession } from "@/modules/server/auth/get-session";
import { preIntakeAppointmentPrompt } from "../../../data/prompt";
import { prismaTelemedicine } from "@/modules/server/prisma/prisma";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

async function PatintAskAIPage() {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session || !session.session.activeOrganizationId) {
    redirect({ href: "/login", locale });
    return;
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
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

  const appointmentData = {
    assistant: {
      voiceId: "will",
      agentPrompt: preIntakeAppointmentPrompt,
    },
    patient: {
      name: session.user.name,
      age: "23",
    },
  };

  return (
    <>
      <AiIntake user={user} appointmentData={appointmentData} />
    </>
  );
}

export default PatintAskAIPage;
