"use client";

import { EmptyState } from "@/modules/shared/components/EmptyState";
import { AlertTriangle, Database, Plus } from "lucide-react";
import DataTable from "@/modules/shared/components/table/data-table";
import { IKnowledgeBaseProps } from "../../../types/admin";
import { useAiHubAdminStore } from "../../../stores/admin-store";
import { knowledgeBaseTableColumn } from "./knowledgeBaseTableColumn";

function KnowledgeBaseTable({
  knowledgeBase,
  error,
  user,
}: IKnowledgeBaseProps) {
  const openModal = useAiHubAdminStore((state) => state.onOpen);

  if (error) {
    return (
      <EmptyState
        icon={<AlertTriangle className="text-destructive" />}
        title="An Unexpected Error Occurred!"
        description={error.message || "Please try again later."}
        buttonLabel="Reload"
        error={error}
      />
    );
  }

  if (!knowledgeBase || knowledgeBase?.length === 0) {
    return (
      <EmptyState
        icon={<Database />}
        title="No Knowledge Base"
        description="Your agents need context to be effective. Connect data sources or upload documents to build a library for your agents to reference."
        buttonLabel="Create Knowledge Base"
        buttonIcon={<Plus />}
        buttonOnClick={() => {
          openModal({ type: "createKnowledgeBase", user });
        }}
      />
    );
  }

  return (
    <DataTable
      columns={knowledgeBaseTableColumn(user)}
      data={knowledgeBase ?? []}
      dataSize={knowledgeBase?.length ?? 0}
      label="Knowledge Base"
      addLabelName="Create Knowledge Base"
      searchField="name"
      fallbackText="No Knowledge Base Found"
      openModal={() => {
        openModal({
          type: "createKnowledgeBase",
          user,
        });
      }}
    />
  );
}

export default KnowledgeBaseTable;
