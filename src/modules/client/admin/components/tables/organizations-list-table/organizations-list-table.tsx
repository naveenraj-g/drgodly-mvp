"use client";

import DataTable from "@/modules/shared/components/table/data-table";
import { useAdminModalStore } from "@/modules/client/admin/stores/admin-modal-store";
import type { ZSAError } from "zsa";
import { organizationsListTableColumn } from "./organizations-list-table-column";
import { TOrganizationsData } from "@/modules/shared/entities/models/admin/organization";
import { useTranslations } from "next-intl";

type IOrganizationsListTable = {
  organizationsDatas: TOrganizationsData | null;
  error: ZSAError | null;
};

export const OrganizationsListTable = ({
  organizationsDatas,
  error,
}: IOrganizationsListTable) => {
  const t = useTranslations("admin.organizations");
  const openModal = useAdminModalStore((state) => state.onOpen);

  return (
    <>
      <div className="space-y-8 w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm">{t("subtitle")}</p>
        </div>
        <DataTable
          columns={organizationsListTableColumn(t)}
          data={organizationsDatas?.organizationsData ?? []}
          dataSize={organizationsDatas?.total}
          label={t("table.label")}
          addLabelName={t("table.addOrganization")}
          searchField="name"
          error={(!organizationsDatas && error?.message) || null}
          fallbackText={
            (error && error.message) ||
            (organizationsDatas?.organizationsData?.length === 0 &&
              t("table.noOrganizations")) ||
            undefined
          }
          openModal={() =>
            openModal({
              type: "addOrganization",
            })
          }
        />
      </div>
    </>
  );
};
