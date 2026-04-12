import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { adminModalStore } from "@/modules/client/admin/stores/admin-modal-store";
import { TanstackTableColumnSorting } from "@/modules/shared/components/table/tanstack-table-column-sorting";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Ellipsis,
  Eye,
  Lock,
  PencilLine,
  SquareMenu,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { TPreferenceTemplate } from "@/modules/shared/entities/models/admin/preferenceTemplete";

export const preferenceTemplateListTableColumn = (
  t: (key: string) => string
): ColumnDef<TPreferenceTemplate>[] => [
  {
    header: t("table.columns.scope"),
    accessorKey: "scope",
  },
  {
    header: t("table.columns.country"),
    accessorKey: "country",
    cell: ({ row }) => {
      const country: string = row.getValue("country");
      return <p className="text-center">{country || "-"}</p>;
    },
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label={t("table.columns.timezone")}
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "timezone",
  },
  {
    header: t("table.columns.dateFormat"),
    accessorKey: "dateFormat",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label={t("table.columns.currency")}
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "currency",
  },
  {
    header: t("table.columns.numberFormat"),
    accessorKey: "numberFormat",
  },
  {
    header: t("table.columns.weekStart"),
    accessorKey: "weekStart",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label={t("table.columns.createdAt")}
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const openModal = adminModalStore((state) => state.onOpen);
      const joinedDate: Date = row.getValue("createdAt");

      return (
        <div className="flex items-center justify-between gap-4">
          {format(joinedDate, "do 'of' MMM, yyyy")}
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <Ellipsis className="font-medium" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="left">
              {/* <DropdownMenuItem className="cursor-pointer">
                <Eye />
                View
              </DropdownMenuItem> */}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => openModal({ type: "editPreferenceTemplate" })}
              >
                <PencilLine />
                {t("table.actions.edit")}
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                onClick={() => openModal({ type: "deletePreferenceTemplate" })}
              >
                <div className="flex items-center gap-2">
                  <Trash2 />
                  {t("table.actions.delete")}
                </div>
                <TriangleAlert className="text-rose-600" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
