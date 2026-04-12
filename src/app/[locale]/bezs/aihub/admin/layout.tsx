import { AiHubAdminModalProvider } from "@/modules/client/aihub/providers/AiHubAdminModalProvider";

function AIHubAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AiHubAdminModalProvider />
      {children}
    </>
  );
}

export default AIHubAdminLayout;
