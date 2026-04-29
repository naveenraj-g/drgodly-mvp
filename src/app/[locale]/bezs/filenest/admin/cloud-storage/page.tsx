import { redirect } from "@/i18n/navigation";
import CloudStorageTable from "@/modules/client/filenest/components/admin/cloud-storage/CloudStorageTable";
import { getCloudStorageConfigs } from "@/modules/client/filenest/server-actions/cloud-storage-action";
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

  const [cloudStorageConfigs, error] = await getCloudStorageConfigs({
    orgId: user.orgId,
    userId: user.id,
  });

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Cloud Storage</h1>
        <p className="text-sm">Manage cloud storage configurations</p>
      </div>
      <CloudStorageTable
        cloudStorageConfigs={cloudStorageConfigs}
        error={error}
      />
    </div>
  );
}

export default CloudStoragePage;
