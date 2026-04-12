import { buttonVariants } from "@/components/ui/button";
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
import { TAppsListTableColumn } from "@/modules/shared/entities/models/admin/app";

export const appsListTableColumn = (
  t: (key: string) => string
): ColumnDef<TAppsListTableColumn>[] => [
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
    header: t("table.columns.description"),
    accessorKey: "description",
    cell: ({ row }) => {
      const desc: string = row.getValue("description");
      return (
        <p className="truncate max-w-[250px] xl:max-w-[450px]" title={desc}>
          {desc}
        </p>
      );
    },
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
    header: t("table.columns.type"),
    accessorKey: "type",
  },
  {
    header: t("table.columns.menuItems"),
    cell: ({ row }) => {
      const count = row.original._count;
      const appId = row.original.id;

      return (
        <div>
          <Link
            href={`/bezs/admin/manage-apps/manage-menus?appId=${appId}`}
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "flex items-center cursor-pointer w-fit"
            )}
          >
            <SquareMenu /> ({count.appMenuItems})
          </Link>
        </div>
      );
    },
  },
  // {
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     type CountType = {
  //       appMenuItems: number;
  //       appActions: number;
  //     };

  //     const count: CountType = row.original._count;
  //     const appId = row.original.id;

  //     return (
  //       <div>
  //         <Link
  //           href={`/bezs/admin/manage-apps/manage-actions?appId=${appId}`}
  //           className={cn(
  //             buttonVariants({ size: "sm", variant: "outline" }),
  //             "flex items-center cursor-pointer w-fit"
  //           )}
  //         >
  //           <Lock /> ({count.appActions})
  //         </Link>
  //       </div>
  //     );
  //   },
  // },
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

      const appId: string | undefined = row.original.id;
      const appData = row.original;
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
                onClick={() => openModal({ type: "editApp", appData })}
              >
                <PencilLine />
                {t("table.actions.edit")}
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                onClick={() => openModal({ type: "deleteApp", appId })}
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
