import { redirect } from "@/i18n/navigation";
import { DoctorServiceManagement } from "@/modules/client/telemedicine/components/doctor/services/DoctorServiceManager";
import { getDoctorServices } from "@/modules/client/telemedicine/server-actions/doctorService-action";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";
import React from "react";

async function ServicesPage() {
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

  const [data, error] = await getDoctorServices({
    userId: user.id,
    orgId: user.orgId,
  });

  return (
    <main>
      <DoctorServiceManagement services={data} error={error} user={user} />
    </main>
  );
}

export default ServicesPage;
