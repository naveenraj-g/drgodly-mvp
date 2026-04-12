"use client";

import { useEffect, useState } from "react";
import { UploadModal } from "../modal/fileUpload";

export const FileUploadModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <UploadModal />
    </>
  );
};
