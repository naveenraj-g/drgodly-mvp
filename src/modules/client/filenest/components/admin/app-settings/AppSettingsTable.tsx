"use client";

import { EmptyState } from "@/modules/shared/components/EmptyState";
import { AlertTriangle, Layers, Plus } from "lucide-react";
import { useFilenestAdminStoreModal } from "../../../stores/admin-store-modal";
import { IAppSettingsProps } from "../../../types/appSettings";
import DataTable from "@/modules/shared/components/table/data-table";
import { appSettingsTableColumn } from "./AppSettingsTableColumn";

function AppSettingsTable({
  appSettings,
  appDatas,
  cloudStorageConfigs,
  localStorageConfigs,
  error,
}: IAppSettingsProps) {
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

  if (!appSettings || appSettings?.length === 0) {
    return (
      <EmptyState
        icon={<Layers />}
        title="No App Setting Configured"
        description="Configure app settings."
        buttonLabel="Add Local Storage"
        buttonIcon={<Plus />}
        buttonOnClick={() => {
          openModal({
            type: "createAppSetting",
            appSettingsRequiredDatas: {
              appDatas,
              cloudStorageConfigs,
              localStorageConfigs,
            },
          });
        }}
      />
    );
  }

  return (
    <DataTable
      columns={appSettingsTableColumn({
        appDatas,
        cloudStorageConfigs,
        localStorageConfigs,
      })}
      data={appSettings ?? []}
      dataSize={appSettings?.length ?? 0}
      label="Local Storage Config"
      addLabelName="Add Local Storage"
      searchField="name"
      fallbackText="No Local Storage Config Found"
      openModal={() => {
        openModal({
          type: "createAppSetting",
          appSettingsRequiredDatas: {
            appDatas,
            cloudStorageConfigs,
            localStorageConfigs,
          },
        });
      }}
    />
  );
}

export default AppSettingsTable;
