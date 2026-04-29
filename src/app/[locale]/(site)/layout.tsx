import LandingPageFooter from "@/modules/client/home/components/footer";
import RootNavBarPage from "@/modules/client/home/components/root-navbar";
import { getServerSession } from "@/modules/server/auth/get-session";

export const dynamic = "force-dynamic";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();

  return (
    <>
      <main className="w-full min-h-screen bg-background">
        <RootNavBarPage session={session} />
        <main className="max-w-[110rem] mx-auto">{children}</main>
        <LandingPageFooter />
      </main>
    </>
  );
};

export default HomeLayout;
