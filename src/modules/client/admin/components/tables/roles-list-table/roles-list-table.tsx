"use client";

import DataTable from "@/modules/shared/components/table/data-table";
import { useAdminModalStore } from "@/modules/client/admin/stores/admin-modal-store";
import type { ZSAError } from "zsa";
import { rolesListTableColumn } from "./roles-list-table-column";
import { TRolesData } from "@/modules/shared/entities/models/admin/role";
import { useTranslations } from "next-intl";

type IRolesListTable = {
  rolesData: TRolesData | null;
  error: ZSAError | null;
};

export const RolesListTable = ({ rolesData, error }: IRolesListTable) => {
  const t = useTranslations("admin.manageRoles");
  const openModal = useAdminModalStore((state) => state.onOpen);

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm">{t("subtitle")}</p>
      </div>
      <DataTable
        columns={rolesListTableColumn(t)}
        data={rolesData?.roleDatas ?? []}
        dataSize={rolesData?.total}
        label={t("table.label")}
        addLabelName={t("table.addRole")}
        searchField="name"
        error={(!rolesData?.roleDatas && error?.message) || null}
        fallbackText={
          (error && error.message) ||
          (rolesData?.roleDatas?.length === 0 && t("table.noRoles")) ||
          undefined
        }
        openModal={() =>
          openModal({
            type: "addRole",
          })
        }
      />
    </div>
  );
};
