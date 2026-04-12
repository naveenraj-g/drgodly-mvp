import { getServerSession } from "@/modules/server/auth/get-session";
// import { MediaRoom } from "@/modules/telemedicine/ui/video/media-room";
import { redirect } from "@/i18n/navigation";
import { getAppointmentForOnlineConsultation } from "@/modules/client/telemedicine/server-actions/appointment-action";
import { getLocale } from "next-intl/server";
import Consult from "@/modules/client/telemedicine/components/patient/online-consultation/Consult";
import { prismaTelemedicine } from "@/modules/server/prisma/prisma";

const PatientOnlineConsultationPage = async (
  props: PageProps<"/[locale]/bezs/telemedicine/patient/appointments/online-consultation">,
) => {
  const session = await getServerSession();
  const locale = await getLocale();
  const params = await props.searchParams;

  const appointmentId = params.appointmentId as string;

  if (!session || !session.session.activeOrganizationId) {
    redirect({ href: "/", locale });
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

  const [data, error] = await getAppointmentForOnlineConsultation({
    appointmentId,
    orgId: session?.session.activeOrganizationId,
    userId: session?.user.id,
  });

  if (!data && error) {
    return (
      <div>
        <h1>Appointment not found</h1>
      </div>
    );
  }

  const participant = {
    name: `${data?.patient.personal?.name} (Patient)` || "Patient",
  };

  const details = {
    doctor: {
      name: data.doctor.personal?.fullName,
      speciality: "unknown",
    },
    patient: {
      name: data.patient.personal?.name,
    },
  };

  return (
    <>
      <div>
        <Consult
          participant={participant}
          roomId={data.virtualRoomId!}
          details={details}
        />
      </div>
    </>
  );
};

export default PatientOnlineConsultationPage;
