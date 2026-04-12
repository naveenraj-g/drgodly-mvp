import { ColumnDef } from "@tanstack/react-table";
import { Download, EllipsisVertical, Eye, Share2, Trash2 } from "lucide-react";
import { TanstackTableColumnSorting } from "@/modules/shared/components/table/tanstack-table-column-sorting";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { bytesToSize, formatSmartDate } from "@/modules/shared/helper";
import { TGetUserFilesControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/filenest";
import { fileNestUserStore } from "@/modules/client/shared/store/filenest-user-store";
import { filenestUserModalStore } from "../../../stores/user-modal-store";

export const listFileTableColumn = (): ColumnDef<
  TGetUserFilesControllerOutput[number]
>[] => [
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="File Name"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "fileName",
    cell({ row }) {
      const fileName = row.original.fileName;
      return (
        <p className="truncate max-w-[250px] xl:max-w-[450px]" title={fileName}>
          {fileName}
        </p>
      );
    },
  },
  {
    header: "File Size",
    accessorKey: "fileSize",
    cell({ row }) {
      const size = row.original.fileSize;
      return bytesToSize(size);
    },
  },
  {
    header: "File Type",
    accessorKey: "fileType",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="File category"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorFn: (row) => row.fileEntity.label,
    id: "fileEntityLabel",
    cell: ({ getValue }) => {
      return <span>{getValue<string>()}</span>;
    },
    filterFn: "equals",
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
      const userFileData = row.original;
      const fileData = {
        fileName: userFileData.fileName,
        filePath: userFileData.filePath,
        fileSize: userFileData.fileSize,
        fileType: userFileData.fileType,
        id: userFileData.id,
      };
      const openModal = fileNestUserStore((state) => state.onOpen);
      const openUserModal = filenestUserModalStore((state) => state.onOpen);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="text-foreground"
                onClick={() => {
                  openModal({ type: "previewFile", fileData });
                }}
              >
                <Eye className="h-4 w-4 text-inherit" /> View
              </DropdownMenuItem>
              <DropdownMenuItem className="text-foreground" asChild>
                <a
                  href={
                    fileData?.id && fileData?.fileName
                      ? `/api/file/view?id=${fileData.id}&fileName=${fileData.fileName}&filePath=${fileData.filePath}&fileType=${fileData.fileType}&id=${fileData.id}`
                      : ""
                  }
                  download
                  target="_blank"
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4 text-inherit" />
                  Download
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-foreground"
                onClick={() => {
                  openUserModal({ type: "shareFile", fileData });
                }}
              >
                <Share2 className="h-4 w-4 text-inherit" /> Share
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-rose-600 hover:!text-rose-600">
                <Trash2 className="h-4 w-4 text-inherit" /> Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
