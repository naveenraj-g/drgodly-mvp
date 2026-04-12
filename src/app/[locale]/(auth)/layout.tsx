import RootNavBarPage from "@/modules/client/home/components/root-navbar";
import { getServerSession } from "@/modules/server/auth/get-session";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();

  return (
    <>
      <main className="w-full min-h-screen">
        <RootNavBarPage session={session} />
        <div className="flex items-center justify-center pt-32 mx-4">
          {children}
        </div>
      </main>
    </>
  );
};

export default AuthLayout;
