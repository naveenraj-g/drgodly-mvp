import { redirect } from "@/i18n/navigation";
import FileEntitiesTable from "@/modules/client/filenest/components/admin/file-entities/FileEntitiesTable";
import { getFileEntities } from "@/modules/client/filenest/server-actions/file-entity-action";
import { getAppsByOrgId } from "@/modules/client/shared/server-actions/app-actions";
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

  const [fileEntities, error] = await getFileEntities({
    orgId: user.orgId,
    userId: user.id,
  });

  const [appDatas, appDatasError] = await getAppsByOrgId({ orgId: user.orgId });

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">File Categories</h1>
        <p className="text-sm">
          Define file categories for your storage system
        </p>
      </div>
      <FileEntitiesTable
        fileEntities={fileEntities}
        appDatas={appDatas}
        error={error || appDatasError}
      />
    </div>
  );
}

export default CloudStoragePage;
