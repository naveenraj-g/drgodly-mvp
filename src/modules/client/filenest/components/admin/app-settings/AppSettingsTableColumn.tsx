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
import {
  TAppSetting,
  TAppSettingsColumnProps,
} from "../../../types/appSettings";
import { Badge } from "@/components/ui/badge";
import { filenestAdminStoreModal } from "../../../stores/admin-store-modal";
import { formatSmartDate, formatStorage } from "@/modules/shared/helper";

export const appSettingsTableColumn = ({
  appDatas,
  cloudStorageConfigs,
  localStorageConfigs,
}: TAppSettingsColumnProps): ColumnDef<TAppSetting>[] => [
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
    id: "appData",
    accessorKey: "appData",
    cell({ row }) {
      const appData = appDatas?.find(
        (appData) => appData.id === row.original.appId
      );
      return <span className="truncate">{appData?.name}</span>;
    },
  },
  {
    header: "Type",
    accessorKey: "type",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Linked Config"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    id: "linkedConfig",
    cell({ row }) {
      const rowData = row.original;

      if (rowData.type === "CLOUD") {
        const cloudStorageConfig = cloudStorageConfigs?.find(
          (config) => config.id === rowData.cloudStorageConfigId
        );

        return <span className="truncate">{cloudStorageConfig?.name}</span>;
      }

      const localStorageConfig = localStorageConfigs?.find(
        (config) => config.id === rowData.localStorageConfigId
      );

      return <span className="truncate">{localStorageConfig?.name}</span>;
    },
  },
  {
    header: "Sub Folder",
    accessorKey: "subFolder",
    cell({ row }) {
      const subFolder = row.original.subFolder;
      return <span className="truncate">{subFolder}</span>;
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
      const appSettingData = row.original;
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
                  type: "editAppSetting",
                  appSettingData,
                  appSettingsRequiredDatas: {
                    appDatas,
                    cloudStorageConfigs,
                    localStorageConfigs,
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
                  type: "deleteAppSetting",
                  appSettingDataId: appSettingData.id,
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
