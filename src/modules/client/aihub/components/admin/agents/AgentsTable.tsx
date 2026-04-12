"use client";

import { EmptyState } from "@/modules/shared/components/EmptyState";
import { AlertTriangle, Bot, Plus } from "lucide-react";
import DataTable from "@/modules/shared/components/table/data-table";
import { IAgentsProps } from "../../../types/admin";
import { useAiHubAdminStore } from "../../../stores/admin-store";
import { agentsTableColumn } from "./agentsTableColumn";

function AgentsTable({ agents, error }: IAgentsProps) {
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

  if (!agents || agents?.length === 0) {
    return (
      <EmptyState
        icon={<Bot />}
        title="No Agents"
        description="Build your first AI assistant to start automating tasks. Give it a persona, connect it to your data, and deploy it to your users."
        buttonLabel="Create Agent"
        buttonIcon={<Plus />}
        buttonOnClick={() => {
          openModal({ type: "createAgent" });
        }}
      />
    );
  }

  return (
    <DataTable
      columns={agentsTableColumn}
      data={agents ?? []}
      dataSize={agents?.length ?? 0}
      label="Agents"
      addLabelName="Create Agent"
      searchField="name"
      fallbackText="No Agents Found"
      openModal={() => {
        openModal({
          type: "createAgent",
        });
      }}
    />
  );
}

export default AgentsTable;
