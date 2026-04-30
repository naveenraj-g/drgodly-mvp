import { PatientModalProvider } from "@/modules/client/telemedicine/providers/patient-modal-provider";
import React from "react";

export const dynamic = "force-dynamic";

function PatientLayout(
  props: LayoutProps<"/[locale]/bezs/telemedicine/patient">,
) {
  return (
    <>
      <PatientModalProvider />
      {props.children}
    </>
  );
}

export default PatientLayout;
