import { FilenestAdminModalProvider } from "@/modules/client/filenest/providers/FilenestAdminModalProvider";

function FilenestAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FilenestAdminModalProvider />
      {children}
    </>
  );
}

export default FilenestAdminLayout;
