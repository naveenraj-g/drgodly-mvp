import { redirect } from "@/i18n/navigation";
import AppSettingsTable from "@/modules/client/filenest/components/admin/app-settings/AppSettingsTable";
import { getAppStorageSettings } from "@/modules/client/filenest/server-actions/app-storage-setting-action";
import { getCloudStorageConfigs } from "@/modules/client/filenest/server-actions/cloud-storage-action";
import { getLocalStorageConfigs } from "@/modules/client/filenest/server-actions/local-storage-action";
import { getAppsByOrgId } from "@/modules/client/shared/server-actions/app-actions";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";

async function CloudStoragePage() {
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

  const [appStorageSettings, appStorageSettingsError] =
    await getAppStorageSettings({
      orgId: user.orgId,
      userId: user.id,
    });

  const [cloudStorageConfigs, cloudStorageConfigsError] =
    await getCloudStorageConfigs({
      orgId: user.orgId,
      userId: user.id,
    });

  const [localStorageConfigs, localStorageConfigsError] =
    await getLocalStorageConfigs({
      orgId: user.orgId,
      userId: user.id,
    });

  const [appDatas, appDatasError] = await getAppsByOrgId({ orgId: user.orgId });

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">App Storage Settings</h1>
        <p className="text-sm">
          Configure storage routing for your applications
        </p>
      </div>
      <AppSettingsTable
        appDatas={appDatas}
        appSettings={appStorageSettings}
        cloudStorageConfigs={cloudStorageConfigs}
        localStorageConfigs={localStorageConfigs}
        error={
          appStorageSettingsError ||
          cloudStorageConfigsError ||
          localStorageConfigsError ||
          appDatasError
        }
      />
    </div>
  );
}

export default CloudStoragePage;
