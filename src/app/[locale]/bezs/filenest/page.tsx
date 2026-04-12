import { redirect } from "@/i18n/navigation";
import AppSelect from "@/modules/client/filenest/components/AppSelect";
import FilenestDashboard from "@/modules/client/filenest/components/dashboard/FilenestDashboard";
import FileUpload from "@/modules/client/shared/components/FileUpload";
import { getAppsByOrgId } from "@/modules/client/shared/server-actions/app-actions";
import { getFileUploadRequiredData } from "@/modules/client/shared/server-actions/file-upload-action";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";

async function FilenestPage() {
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

  const [fileUploadData, fileUploadDataError] = await getFileUploadRequiredData(
    {
      orgId: user.orgId,
      userId: user.id,
    },
  );

  const [apps, appsError] = await getAppsByOrgId({
    orgId: user.orgId,
  });

  return (
    <div className="space-y-8 w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm">Manage your health records securely</p>
        </div>
        <AppSelect apps={apps} defaultValue="filenest" error={appsError} />
      </div>
      <FileUpload
        fileUploadData={fileUploadData}
        user={user}
        modalError={fileUploadDataError}
      />
      <FilenestDashboard user={user} />
    </div>
  );
}

export default FilenestPage;
