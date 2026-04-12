"use client";

import React, { useEffect, useState } from "react";
import { PrevireUserFileModal } from "../modal/filenestUser";

function FilenestUserFileModalProvider() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <PrevireUserFileModal />
    </>
  );
}

export default FilenestUserFileModalProvider;
