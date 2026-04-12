"use client";

import DataTable from "@/modules/shared/components/table/data-table";
import { appsListTableColumn } from "./apps-list-table-column";
import { useAdminModalStore } from "@/modules/client/admin/stores/admin-modal-store";
import type { ZSAError } from "zsa";
import { TAppDatas } from "@/modules/shared/entities/models/admin/app";
// import { clientLogger } from "@/modules/shared/utils/client-logger";
// import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type TUser = {
  id: string;
  name: string;
  username?: string | null;
  email: string;
};

type IAppsListTable = {
  appDatas: TAppDatas | null;
  error: ZSAError | null;
  user: TUser;
};

export const AppsListTable = ({ appDatas, error, user }: IAppsListTable) => {
  const t = useTranslations("admin.manageApps");
  // const pathname = usePathname();
  const openModal = useAdminModalStore((state) => state.onOpen);

  const typeFilteredData = ["platform", "custom"];

  return (
    <>
      <div className="space-y-8 w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm">{t("subtitle")}</p>
        </div>
        <DataTable
          columns={appsListTableColumn(t)}
          data={appDatas?.appDatas ?? []}
          dataSize={appDatas?.total}
          label={t("table.label")}
          addLabelName={t("table.addApp")}
          searchField="name"
          error={(!appDatas && error?.message) || null}
          fallbackText={
            (error && error.message) ||
            (appDatas?.appDatas?.length === 0 && t("table.noApps")) ||
            undefined
          }
          filterField="type"
          filterValues={typeFilteredData}
          openModal={() => {
            openModal({
              type: "addApp",
            });

            // clientLogger.info(
            //   clientLogger.fmt`${user.id}(${
            //     user.username ?? "No username"
            //   }) clicked the Add App button`,
            //   {
            //     extra: {
            //       action: "add_app_button_click",
            //       path: pathname,
            //     },
            //   }
            // );
          }}
        />
      </div>
    </>
  );
};
