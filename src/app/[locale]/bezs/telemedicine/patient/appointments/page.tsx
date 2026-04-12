import { getServerSession } from "@/modules/server/auth/get-session";
import { getPatientAppointments } from "@/modules/client/telemedicine/server-actions/appointment-action";
import AppointmentsTable from "@/modules/client/telemedicine/components/patient/appointments/listAppointments/AppointmentsTable";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { prismaTelemedicine } from "@/modules/server/prisma/prisma";

const statusPriority: Record<string, number> = {
  SCHEDULED: 1,
  RESCHEDULED: 1,
  PENDING: 3,
  COMPLETED: 4,
  CANCELLED: 5,
};

async function AppointmentsPage() {
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

  const [appointments, error] = await getPatientAppointments({
    userId: user.id,
    orgId: user.orgId,
  });

  appointments?.sort((a, b) => {
    return statusPriority[a.status] - statusPriority[b.status];
  });

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <p className="text-sm">Manage Appointments.</p>
      </div>
      <AppointmentsTable appointments={appointments ?? []} error={error} />
    </div>
  );
}

export default AppointmentsPage;
