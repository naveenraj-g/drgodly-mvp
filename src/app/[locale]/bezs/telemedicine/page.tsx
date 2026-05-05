import { redirect } from "@/i18n/navigation";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";

async function TelemedicinePage() {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session) {
    redirect({ href: "/login", locale });
  }

  const url = session?.session?.activeRoleRedirectUrl ?? "/bezs";

  redirect({ href: url, locale });

  return <div>TelemedicinePage</div>;
}

export default TelemedicinePage;
