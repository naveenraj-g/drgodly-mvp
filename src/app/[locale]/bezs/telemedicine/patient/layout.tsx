import { PatientModalProvider } from "@/modules/client/telemedicine/providers/patient-modal-provider";
import React from "react";

function PatientLayout(
  props: LayoutProps<"/[locale]/bezs/telemedicine/patient">
) {
  return (
    <>
      <PatientModalProvider />
      {props.children}
    </>
  );
}

export default PatientLayout;
