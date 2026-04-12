"use client";

import { EmptyState } from "@/modules/shared/components/EmptyState";
import { AlertTriangle, Cloudy, Plus } from "lucide-react";
import { useFilenestAdminStoreModal } from "../../../stores/admin-store-modal";
import { ICloudStorageProps } from "../../../types/cloudStorage";
import DataTable from "@/modules/shared/components/table/data-table";
import { CloudStorageVendor } from "@/modules/shared/entities/enums/filenest/storage";
import { cloudStorageTableColumn } from "./cloudStorageTableColumn";

function CloudStorageTable({ cloudStorageConfigs, error }: ICloudStorageProps) {
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

  if (!cloudStorageConfigs || cloudStorageConfigs?.length === 0) {
    return (
      <EmptyState
        icon={<Cloudy />}
        title="No Cloud Storage Configured"
        description="Connect your cloud storage providers like AWS S3, Azure Blob, or Google Cloud Storage to manage your files."
        buttonLabel="Add Cloud Storage"
        buttonIcon={<Plus />}
        buttonOnClick={() => {
          openModal({ type: "createCloudStorage" });
        }}
      />
    );
  }

  return (
    <DataTable
      columns={cloudStorageTableColumn}
      data={cloudStorageConfigs ?? []}
      dataSize={cloudStorageConfigs?.length ?? 0}
      label="Cloud Storage Config"
      addLabelName="Add Cloud Storage"
      searchField="name"
      filterField="vendor"
      filterValues={CloudStorageVendor as any}
      fallbackText="No Cloud Storage Config Found"
      openModal={() => {
        openModal({
          type: "createCloudStorage",
        });
      }}
    />
  );
}

export default CloudStorageTable;
