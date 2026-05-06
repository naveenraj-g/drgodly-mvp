import { redirect } from "@/i18n/navigation";
import PatientDashboard from "@/modules/client/telemedicine/components/patient/dashboard/PatientDashboard";
import { getDashboardAppointmentsDataAction } from "@/modules/client/telemedicine/server-actions/dashboard-actions";
import { getServerSession } from "@/modules/server/auth/get-session";
import { prismaTelemedicine } from "@/modules/server/prisma/prisma";
import { getLocale } from "next-intl/server";
import { getMyVitals, transformVitalsToLifestyle } from "@/modules/server/fhir/vitals";
import type { LifestyleData } from "@/modules/client/telemedicine/datas/doctor-dashboard";

export const dynamic = "force-dynamic";

async function PatientDashboardPage() {
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

  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  weekAgo.setHours(0, 0, 0, 0);

  const [dashboardResult, vitalsResult] = await Promise.allSettled([
    getDashboardAppointmentsDataAction({ orgId: user.orgId, userId: user.id }),
    getMyVitals({
      recorded_at_from: weekAgo.toISOString(),
      recorded_at_to: now.toISOString(),
      limit: 200,
    }),
  ]);

  const [data, error] =
    dashboardResult.status === "fulfilled" ? dashboardResult.value : [null, null];

  const lifestyle: LifestyleData | null =
    vitalsResult.status === "fulfilled"
      ? transformVitalsToLifestyle(vitalsResult.value.data)
      : null;

  return (
    <div>
      <PatientDashboard dashboardData={data} error={error} user={user} lifestyle={lifestyle} />
    </div>
  );
}

export default PatientDashboardPage;
