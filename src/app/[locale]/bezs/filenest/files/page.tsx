import { redirect } from "@/i18n/navigation";
import AppSelect from "@/modules/client/filenest/components/AppSelect";
import ListFiles from "@/modules/client/filenest/components/files/listFiles/ListFiles";
import { getAppsByOrgId } from "@/modules/client/shared/server-actions/app-actions";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";

async function FilesPage() {
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

  const [apps, appsError] = await getAppsByOrgId({
    orgId: user.orgId,
  });

  return (
    <div className="space-y-8 w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">My Files</h1>
          <p className="text-sm">Browse and manage your records</p>
        </div>
        <AppSelect apps={apps} defaultValue="filenest" error={appsError} />
      </div>
      <ListFiles user={user} />
    </div>
  );
}

export default FilesPage;
