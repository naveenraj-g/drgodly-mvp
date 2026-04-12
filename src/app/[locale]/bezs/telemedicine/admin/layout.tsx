import { AdminModalProvider } from "@/modules/client/telemedicine/providers/admin-modal-provider";
import React from "react";

function TelemedicineAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AdminModalProvider />
    </>
  );
}

export default TelemedicineAdminLayout;
