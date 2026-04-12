"use client";

import { useEffect, useState } from "react";
import { CreateEndpointModal } from "../modals/admin/CreateEndpointModal";
import { CreateKnowledgeBaseModal } from "../modals/admin/CreateKnowledgeBaseModal";

export const AiHubAdminModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateEndpointModal />
      <CreateKnowledgeBaseModal />
    </>
  );
};
