import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminModalStore } from "@/modules/client/admin/stores/admin-modal-store";
import { TanstackTableColumnSorting } from "@/modules/shared/components/table/tanstack-table-column-sorting";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Ellipsis,
  LayoutGrid,
  PencilLine,
  Trash2,
  TriangleAlert,
  User,
} from "lucide-react";
import { TOrganizationsTableColumns } from "@/modules/shared/entities/models/admin/organization";

export const organizationsListTableColumn = (
  t: (key: string) => string
): ColumnDef<TOrganizationsTableColumns>[] => [
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label={t("table.columns.name")}
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "name",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label={t("table.columns.slug")}
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "slug",
  },
  {
    header: t("table.columns.members"),
    cell: ({ row }) => {
      const openModal = adminModalStore((state) => state.onOpen);
      const membersCount = row.original._count.members;
      const organizationData = row.original;

      return (
        <Button
          className="flex items-center cursor-pointer"
          size="sm"
          variant="outline"
          onClick={() =>
            openModal({
              type: "manageOrgMembers",
              organizationData,
            })
          }
        >
          <User /> ({membersCount})
        </Button>
      );
    },
  },
  {
    header: t("table.columns.apps"),
    cell: ({ row }) => {
      const openModal = adminModalStore((state) => state.onOpen);

      const appsCount = row.original._count.appOrganization;
      const organizationData = row.original;

      return (
        <Button
          className="flex items-center cursor-pointer"
          size="sm"
          variant="outline"
          onClick={() => openModal({ type: "manageOrgApps", organizationData })}
        >
          <LayoutGrid /> ({appsCount})
        </Button>
      );
    },
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
      const orgData = row.original;
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
                onClick={() =>
                  openModal({
                    type: "editOrganization",
                    organizationData: { ...orgData },
                  })
                }
              >
                <PencilLine />
                {t("table.actions.edit")}
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                onClick={() =>
                  openModal({
                    type: "deleteOrganization",
                    organizationId: orgData.id,
                  })
                }
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
