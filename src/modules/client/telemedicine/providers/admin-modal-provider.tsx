"use client";

import { useEffect, useState } from "react";
import {
  CreateDoctorByHPRIdModal,
  DeleteDoctorProfileModal,
  MapDoctorProfileModal,
} from "../modals/admin";

export const AdminModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <DeleteDoctorProfileModal />
      <CreateDoctorByHPRIdModal />
      <MapDoctorProfileModal />
    </>
  );
};
