"use client";

import { RbacListColumn } from "./rbac-list-column";
import DataTable from "@/modules/shared/components/table/data-table";
import { TRbacDatas } from "@/modules/shared/entities/models/admin/rbac";
import { ZSAError } from "zsa";
import { TRole } from "@/modules/shared/entities/models/admin/role";
import { useTranslations } from "next-intl";

type IRBACListTable = {
  rbacDatas: TRbacDatas | null;
  roleDatas?: TRole[] | null;
  error: ZSAError | null;
};

export const RBACListTable = ({
  rbacDatas,
  roleDatas,
  error,
}: IRBACListTable) => {
  const t = useTranslations("admin.rbac.table");
  const roleFilterData = roleDatas?.map((data) => data.name);

  return (
    <>
      <div className="mx-auto w-full">
        <DataTable
          columns={RbacListColumn(t)}
          data={rbacDatas?.rbacDatas ?? []}
          dataSize={rbacDatas?.total}
          label={t("label")}
          isAddButton={false}
          searchField="user"
          filterField="role"
          filterValues={roleFilterData}
          error={(!rbacDatas && error?.message) || null}
          fallbackText={
            (error && error.message) ||
            (rbacDatas?.rbacDatas?.length === 0 && t("noData")) ||
            undefined
          }
        />
      </div>
    </>
  );
};
