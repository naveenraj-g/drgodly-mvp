import TokenButton from "@/components/TokenButton";
import { redirect } from "@/i18n/navigation";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

const BezsPage = async () => {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session) {
    redirect({ href: "/login", locale });
  }

  const url = session?.session?.activeRoleRedirectUrl ?? "/bezs";

  redirect({ href: url, locale });

  return (
    <div className="h-full p-4">
      <h1>Bezs</h1>
      <TokenButton />
    </div>
  );
};

export default BezsPage;
