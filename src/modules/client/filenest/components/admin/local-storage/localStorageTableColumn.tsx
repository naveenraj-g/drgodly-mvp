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
import { TLocalStorageConfig } from "../../../types/localStorage";
import { Badge } from "@/components/ui/badge";
import { filenestAdminStoreModal } from "../../../stores/admin-store-modal";
import { formatSmartDate, formatStorage } from "@/modules/shared/helper";

export const localStorageTableColumn: ColumnDef<TLocalStorageConfig>[] = [
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Name"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "name",
  },
  {
    header: "Base Path",
    accessorKey: "basePath",
    cell({ row }) {
      const basePath = row.original.basePath;
      return <span className="truncate">{basePath}</span>;
    },
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Max Size"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "maxFileSize",
    cell({ row }) {
      const size = row.original.maxFileSize;
      return formatStorage(size);
    },
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
      const localStorageConfigData = row.original;
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
                  type: "editLocalStorage",
                  localStorageConfigData,
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
                  type: "deleteLocalStorage",
                  localStorageConfigId: localStorageConfigData.id,
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
