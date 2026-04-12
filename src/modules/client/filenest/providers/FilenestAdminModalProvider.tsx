"use client";

import { useEffect, useState } from "react";
import {
  CreateAppSettingModal,
  CreateCloudStorageModal,
  CreateFileEntityModal,
  CreateLocalStorageModal,
  DeleteAppSettingModal,
  DeleteCloudStorageModal,
  DeleteFileEntityModal,
  DeleteLocalStorageModal,
  EditAppSettingModal,
  EditCloudStorageModal,
  EditFileEntityModal,
  EditLocalStorageModal,
} from "../modals/admin";

export const FilenestAdminModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateCloudStorageModal />
      <EditCloudStorageModal />
      <DeleteCloudStorageModal />
      <CreateLocalStorageModal />
      <EditLocalStorageModal />
      <DeleteLocalStorageModal />
      <CreateFileEntityModal />
      <EditFileEntityModal />
      <DeleteFileEntityModal />
      <CreateAppSettingModal />
      <EditAppSettingModal />
      <DeleteAppSettingModal />
    </>
  );
};
