"use client";

import { EmptyState } from "@/modules/shared/components/EmptyState";
import { AlertTriangle, Link2, Plus } from "lucide-react";
import DataTable from "@/modules/shared/components/table/data-table";
import { endpointsTableColumn } from "./endpointsTableColumn";
import { IEndpointsProps } from "../../../types/admin";
import { useAiHubAdminStore } from "../../../stores/admin-store";

function EndpointsTable({ endpoints, error, user }: IEndpointsProps) {
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

  if (!endpoints || endpoints?.length === 0) {
    return (
      <EmptyState
        icon={<Link2 />}
        title="No endpoints"
        description="No API connections found. Register your LLM providers or custom agent endpoints to enable model communication."
        buttonLabel="Add Endpoint"
        buttonIcon={<Plus />}
        buttonOnClick={() => {
          openModal({ type: "createEndpoint", user });
        }}
      />
    );
  }

  return (
    <DataTable
      columns={endpointsTableColumn(user)}
      data={endpoints ?? []}
      dataSize={endpoints?.length ?? 0}
      label="Endpoints"
      addLabelName="Add Endpoints"
      searchField="name"
      fallbackText="No Endpoints Found"
      openModal={() => {
        openModal({
          type: "createEndpoint",
          user,
        });
      }}
    />
  );
}

export default EndpointsTable;
