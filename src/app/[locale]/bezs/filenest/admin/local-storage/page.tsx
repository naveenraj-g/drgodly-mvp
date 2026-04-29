import { redirect } from "@/i18n/navigation";
import LocalStorageTable from "@/modules/client/filenest/components/admin/local-storage/LocalStorageTable";
import { getLocalStorageConfigs } from "@/modules/client/filenest/server-actions/local-storage-action";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";

async function CloudStoragePage() {
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

  const [localStorageConfigs, error] = await getLocalStorageConfigs({
    orgId: user.orgId,
    userId: user.id,
  });

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Local Storage</h1>
        <p className="text-sm">Manage local storage configurations</p>
      </div>
      <LocalStorageTable
        localStorageConfigs={localStorageConfigs}
        error={error}
      />
    </div>
  );
}

export default CloudStoragePage;
