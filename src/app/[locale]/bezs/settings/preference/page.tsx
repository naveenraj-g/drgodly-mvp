import { redirect } from "@/i18n/navigation";
import { UserPreferences } from "@/modules/client/bezs/components/settings/userPreference";
import { getUserPreference } from "@/modules/client/bezs/server-actions/userPreference-actions";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";

export default async function BezsPreferencePage() {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session) {
    redirect({ href: "/login", locale });
    return;
  }

  const [data, error] = await getUserPreference({ userId: session.user.id });

  return (
    <>
      <UserPreferences preference={data} error={error} />
    </>
  );
}
