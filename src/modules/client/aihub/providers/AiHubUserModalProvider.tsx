"use client";

import { useEffect, useState } from "react";

export const AiHubUserModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <></>;
};
