"use client";

import { EmptyState } from "@/modules/shared/components/EmptyState";
import { AlertTriangle, FolderCog, Plus } from "lucide-react";
import { useFilenestAdminStoreModal } from "../../../stores/admin-store-modal";
import { IFileEntitiesProps } from "../../../types/fileEntities";
import DataTable from "@/modules/shared/components/table/data-table";
import { fileEntitiesTableColumn } from "./fileEntitiesTableColumn";

function FileEntitiesTable({
  appDatas,
  fileEntities,
  error,
}: IFileEntitiesProps) {
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

  if (!fileEntities || fileEntities?.length === 0) {
    return (
      <EmptyState
        icon={<FolderCog />}
        title="No File Entitie Configured"
        description="Configure file entities."
        buttonLabel="Add File Entity"
        buttonIcon={<Plus />}
        buttonOnClick={() => {
          openModal({
            type: "createFileEntity",
            appSettingsRequiredDatas: {
              cloudStorageConfigs: null,
              localStorageConfigs: null,
              appDatas,
            },
          });
        }}
      />
    );
  }

  return (
    <DataTable
      columns={fileEntitiesTableColumn(appDatas)}
      data={fileEntities ?? []}
      dataSize={fileEntities?.length ?? 0}
      label="File categories Config"
      addLabelName="Add File Category"
      searchField="name"
      fallbackText="No File Category Config Found"
      openModal={() => {
        openModal({
          type: "createFileEntity",
          appSettingsRequiredDatas: {
            cloudStorageConfigs: null,
            localStorageConfigs: null,
            appDatas,
          },
        });
      }}
    />
  );
}

export default FileEntitiesTable;
