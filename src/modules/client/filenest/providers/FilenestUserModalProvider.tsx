"use client";

import { useEffect, useState } from "react";
import { ShareFileModal } from "../modals/user";

export const FilenestUserModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <ShareFileModal />
    </>
  );
};
