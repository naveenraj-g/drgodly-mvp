import { redirect } from "@/i18n/navigation";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";
import SecuritySettings from "@/modules/client/bezs/components/settings/SecuritySettings";

export default async function SecuritySettingsPage() {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session) {
    redirect({ href: "/login", locale });
    return;
  }

  return <SecuritySettings user={session.user} />;
}
