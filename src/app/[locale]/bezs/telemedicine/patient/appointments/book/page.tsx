import { redirect } from "@/i18n/navigation";
import { BookAppointment } from "@/modules/client/telemedicine/components/patient/appointments/bookAppointment/book-appointment";
import { getDoctorsByOrg } from "@/modules/client/telemedicine/server-actions/doctor-action";
import { getServerSession } from "@/modules/server/auth/get-session";
import { prismaTelemedicine } from "@/modules/server/prisma/prisma";
import { getLocale } from "next-intl/server";

async function BookAppointmentPage() {
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

  const [data, error] = await getDoctorsByOrg({ orgId: user.orgId });

  return (
    <>
      <BookAppointment doctorsData={data} error={error} user={user} />
    </>
  );
}

export default BookAppointmentPage;
