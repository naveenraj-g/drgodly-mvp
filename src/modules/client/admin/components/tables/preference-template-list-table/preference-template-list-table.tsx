"use client";

import DataTable from "@/modules/shared/components/table/data-table";
import { TPreferenceTemplates } from "@/modules/shared/entities/models/admin/preferenceTemplete";
import { ZSAError } from "zsa";
import { useAdminModalStore } from "../../../stores/admin-modal-store";
import { preferenceTemplateListTableColumn } from "./preference-template-list-table-column";
import { useTranslations } from "next-intl";

type IPreferenceTemplateListTable = {
  preferenceTemplateDatas: TPreferenceTemplates | null;
  error: ZSAError | null;
};

export const PreferenceTemplateListTable = ({
  preferenceTemplateDatas,
  error,
}: IPreferenceTemplateListTable) => {
  const t = useTranslations("admin.preferences");
  const openModal = useAdminModalStore((state) => state.onOpen);

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <DataTable
        columns={preferenceTemplateListTableColumn(t)}
        data={preferenceTemplateDatas?.preferenceTemplates ?? []}
        dataSize={preferenceTemplateDatas?.total}
        label={t("table.label")}
        addLabelName={t("table.addTemplate")}
        searchField="country"
        error={(!preferenceTemplateDatas && error?.message) || null}
        fallbackText={
          (error && error.message) ||
          (preferenceTemplateDatas?.preferenceTemplates?.length === 0 &&
            t("table.noTemplates")) ||
          undefined
        }
        //   filterField="type"
        //   filterValues={typeFilteredData}
        openModal={() =>
          openModal({
            type: "addPreferenceTemplate",
          })
        }
      />
    </div>
  );
};
