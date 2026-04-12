import { ColumnDef } from "@tanstack/react-table";
import { Edit, EllipsisVertical, Trash2 } from "lucide-react";
import { TanstackTableColumnSorting } from "@/modules/shared/components/table/tanstack-table-column-sorting";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { TFileEntity } from "../../../types/fileEntities";
import { Badge } from "@/components/ui/badge";
import { filenestAdminStoreModal } from "../../../stores/admin-store-modal";
import { formatSmartDate } from "@/modules/shared/helper";
import { TGetAppsByOrgIdControllerOutput } from "@/modules/server/shared/app/interface-adapters/controllers";

export const fileEntitiesTableColumn = (
  appDatas: TGetAppsByOrgIdControllerOutput | null
): ColumnDef<TFileEntity>[] => [
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Entity Name"
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
          label="Label"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "label",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Type"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "type",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Sub Folder"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "subFolder",
  },
  {
    header: "Status",
    accessorKey: "isActive",
    cell: ({ row }) => {
      const isActive: boolean = row.getValue("isActive");
      return (
        <Badge
          className={cn(
            buttonVariants({
              size: "sm",
              variant: isActive ? "default" : "secondary",
              className: "cursor-default h-6 rounded-xl",
            })
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      const formattedDate = formatSmartDate(updatedAt);
      return <span>{formattedDate}</span>;
    },
  },
  {
    header: "ACTIONS",
    id: "actions",
    cell: ({ row }) => {
      const fileEntityData = row.original;
      const openModal = filenestAdminStoreModal((state) => state.onOpen);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ size: "icon", variant: "ghost" }),
              "rounded-full"
            )}
          >
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="left">
            <DropdownMenuItem
              className="cursor-pointer space-x-2"
              onClick={() =>
                openModal({
                  type: "editFileEntity",
                  fileEntityData,
                  appSettingsRequiredDatas: {
                    cloudStorageConfigs: null,
                    localStorageConfigs: null,
                    appDatas,
                  },
                })
              }
            >
              <div className="flex items-center gap-2">
                <Edit />
                Edit
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer space-x-2 text-rose-600 hover:!text-rose-600 dark:text-rose-500 dark:hover:!text-rose-500"
              onClick={() =>
                openModal({
                  type: "deleteFileEntity",
                  fileEntityDataId: fileEntityData.id,
                })
              }
            >
              <div className="flex items-center gap-2">
                <Trash2 className="text-rose-600 dark:text-rose-500" />
                Delete
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
