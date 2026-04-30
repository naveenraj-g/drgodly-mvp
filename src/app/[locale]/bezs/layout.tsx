import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FilenestUserModalProvider } from "@/modules/client/filenest/providers/FilenestUserModalProvider";
import { FileUploadModalProvider } from "@/modules/client/shared/provider/FileUploadModalProvider";
import { getServerSession } from "@/modules/server/auth/get-session";
import BreadCrumb from "@/modules/shared/components/breadcrumb";
import AppNavbar from "@/modules/shared/components/navbar/app-navbar";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { MenuBar } from "@/modules/shared/components/menubar/MenuBar";

export const dynamic = "force-dynamic";

const AppListingLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session) {
    redirect({ href: "/login", locale });
    return;
  }

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    username: session.user.username,
    activeOrganizationId: session.session.activeOrganizationId,
  };

  return (
    <SidebarProvider>
      <MenuBar {...user} />
      <SidebarInset className="min-w-0">
        <AppNavbar user={user} />
        <main className="mx-auto px-4 py-4 pb-6 max-w-[110rem] space-y-6 w-full">
          <BreadCrumb />
          <div className="w-full">
            <FileUploadModalProvider />
            <FilenestUserModalProvider />
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppListingLayout;
