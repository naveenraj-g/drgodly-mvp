import { redirect } from "@/i18n/navigation";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";
import SessionsSettings from "@/modules/client/bezs/components/settings/SessionsSettings";

export default async function SessionsSettingsPage() {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session) {
    redirect({ href: "/login", locale });
    return;
  }

  return <SessionsSettings currentToken={session.session.token} />;
}
