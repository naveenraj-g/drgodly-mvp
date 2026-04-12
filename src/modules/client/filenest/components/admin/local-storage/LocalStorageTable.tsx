"use client";

import { EmptyState } from "@/modules/shared/components/EmptyState";
import { AlertTriangle, Cloudy, Plus } from "lucide-react";
import { useFilenestAdminStoreModal } from "../../../stores/admin-store-modal";
import { ILocalStorageProps } from "../../../types/localStorage";
import DataTable from "@/modules/shared/components/table/data-table";
import { localStorageTableColumn } from "./localStorageTableColumn";

function LocalStorageTable({ localStorageConfigs, error }: ILocalStorageProps) {
  const openModal = useFilenestAdminStoreModal((state) => state.onOpen);

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

  if (!localStorageConfigs || localStorageConfigs?.length === 0) {
    return (
      <EmptyState
        icon={<Cloudy />}
        title="No Local Storage Configured"
        description="Connect your local storage providers like AWS S3, Azure Blob, or Google Local Storage to manage your files."
        buttonLabel="Add Local Storage"
        buttonIcon={<Plus />}
        buttonOnClick={() => {
          openModal({ type: "createLocalStorage" });
        }}
      />
    );
  }

  return (
    <DataTable
      columns={localStorageTableColumn}
      data={localStorageConfigs ?? []}
      dataSize={localStorageConfigs?.length ?? 0}
      label="Local Storage Config"
      addLabelName="Add Local Storage"
      searchField="name"
      fallbackText="No Local Storage Config Found"
      openModal={() => {
        openModal({
          type: "createLocalStorage",
        });
      }}
    />
  );
}

export default LocalStorageTable;
