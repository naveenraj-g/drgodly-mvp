"use client";

import { useEffect, useState } from "react";
import { DoctorReviewModal, BookAppointmentModal } from "../modals/patient";
import IntakeCompleteModal from "../modals/patient/IntakeCompleteModal";

export const PatientModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <DoctorReviewModal />
      <BookAppointmentModal />
      <IntakeCompleteModal />
    </>
  );
};
