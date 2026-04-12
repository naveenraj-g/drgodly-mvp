import { Button } from "@/components/ui/button";
import {
  Download,
  Eye,
  Trash2,
  FileText,
  Share2,
  EllipsisVertical,
} from "lucide-react";
import { Row } from "@tanstack/react-table";
import { bytesToSize, formatSmartDate } from "@/modules/shared/helper";
import { TGetUserFilesControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/filenest";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TFileNestUserStoreOpenModal } from "@/modules/client/shared/store/filenest-user-store";
import { TUserStoreOpenModal } from "../../../stores/user-modal-store";

interface ListFileCardProps {
  row: Row<TGetUserFilesControllerOutput[number]>;
  openModal: TFileNestUserStoreOpenModal;
  openUserModal: TUserStoreOpenModal;
}

function ListFileCard({ row, openModal, openUserModal }: ListFileCardProps) {
  const userFileData = row.original;
  const dateFormated = formatSmartDate(userFileData.updatedAt);

  const fileData = {
    fileName: userFileData.fileName,
    filePath: userFileData.filePath,
    fileSize: userFileData.fileSize,
    fileType: userFileData.fileType,
    id: userFileData.id,
  };

  return (
    <div className="bg-card text-card-foreground flex gap-4 rounded-xl border p-4 shadow-sm">
      {/* Header */}
      <div className="shrink-0">
        <FileText className="text-muted-foreground size-full" />
      </div>

      {/* Content */}
      <div className="text-sm flex flex-col gap-2 min-w-0">
        <div className="flex-1 min-w-0" title={userFileData.fileName}>
          <h1 className="truncate text-sm font-semibold">
            {userFileData.fileName}
          </h1>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-muted-foreground shrink-0">
            {bytesToSize(userFileData.fileSize)}
          </p>
          <span className="p-[1.5px] bg-accent-foreground rounded-full"></span>
          <p className="text-muted-foreground truncate" title={dateFormated}>
            {dateFormated}
          </p>
        </div>
      </div>

      <div className="ml-auto">
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
      </div>
    </div>
  );
}

export default ListFileCard;
