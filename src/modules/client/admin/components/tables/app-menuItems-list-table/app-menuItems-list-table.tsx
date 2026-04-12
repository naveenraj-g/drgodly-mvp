"use client";

import { useAdminModalStore } from "../../../stores/admin-modal-store";
import DataTable from "@/modules/shared/components/table/data-table";
import { appMenuItemsListColumn } from "./app-menuItems-list-column";
import { TAppMenuItemsData } from "@/modules/shared/entities/models/admin/appMenuItem";
import type { ZSAError } from "zsa";
import { useTranslations } from "next-intl";

interface IAppMenuItemListTable {
  appMenuItemDatas: TAppMenuItemsData | null;
  appId: string;
  error: ZSAError | null;
}

export const AppMenuItemsListTable = ({
  appMenuItemDatas,
  appId,
  error,
}: IAppMenuItemListTable) => {
  const t = useTranslations("admin.appMenuItems");
  const openModal = useAdminModalStore((state) => state.onOpen);

  return (
    <>
      <div className="space-y-8 w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm">{t("subtitle")}</p>
        </div>
        <DataTable
          columns={appMenuItemsListColumn(t)}
          data={appMenuItemDatas?.appMenuItemsData ?? []}
          dataSize={appMenuItemDatas?.total}
          label={t("table.label")}
          addLabelName={t("table.addMenuItem")}
          searchField="name"
          error={(!appMenuItemDatas && error?.message) || null}
          fallbackText={
            (error && error.message) ||
            (appMenuItemDatas?.appMenuItemsData?.length === 0 &&
              t("table.noMenuItems")) ||
            undefined
          }
          openModal={() => openModal({ type: "addAppMenuItem", appId })}
        />
      </div>
    </>
  );
};
