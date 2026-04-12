"use client";

import { useEffect, useState } from "react";
import {
  AppointmentViewModal,
  AppointmentRescheduleModal,
  CancelAppointmentModal,
  DeleteAppointmentModal,
  ConfirmAppointmentModal,
} from "../modals/appointment";

export const AppointmentModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AppointmentRescheduleModal />
      <AppointmentViewModal />
      <CancelAppointmentModal />
      <DeleteAppointmentModal />
      <ConfirmAppointmentModal />
    </>
  );
};
