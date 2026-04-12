"use client";

import DataTable from "@/modules/shared/components/table/data-table";
import { EmptyState } from "@/modules/shared/components/EmptyState";
import { AlertCircle, FolderOpen, Upload } from "lucide-react";
import FileUpload from "@/modules/client/shared/components/FileUpload";
import { IFileUploadProps } from "@/modules/client/shared/types/file-upload";
import { ZSAError } from "zsa";
import { useFileUploadStore } from "@/modules/client/shared/store/file-upload-store";
import { TGetUserFilesControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/filenest";
import { listFileTableColumn } from "./listFileTableColumn";
import { useSearchParams } from "next/navigation";
import ListFileCard from "./ListFileCard";
import { MEDICAL_MIME_FILTER_TYPES } from "../../../types/mimeTypes";
import { fileNestUserStore } from "@/modules/client/shared/store/filenest-user-store";
import { useFilenestUserModalStore } from "../../../stores/user-modal-store";

interface IListFileTableProps {
  filesData?: TGetUserFilesControllerOutput | null;
  error?: ZSAError | null;
  isLoading: boolean;
  queryKey?: string[];
  revalidatePath?: string;
}

function ListFileTable({
  user,
  fileUploadData,
  modalError,
  filesData,
  error,
  isLoading,
  queryKey,
  revalidatePath,
}: IListFileTableProps & IFileUploadProps) {
  const searchParams = useSearchParams();
  const appSlug = searchParams?.get("app") as string;
  const openModal = useFileUploadStore((state) => state.onOpen);
  const openFilenestUserModal = fileNestUserStore((state) => state.onOpen);
  const openUserModal = useFilenestUserModalStore((state) => state.onOpen);
  const filterBy = searchParams?.get("filterBy");

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle />}
        title="Error"
        description="Something went wrong. Please try again later."
        buttonLabel="Reload"
        error={error}
      />
    );
  }

  if (!filesData || filesData?.length === 0) {
    return (
      <EmptyState
        icon={<FolderOpen />}
        title="No files yet"
        description="You haven’t uploaded any files for this app. Upload files to get started."
        buttonLabel="Upload files"
        buttonIcon={<Upload />}
        ButtonEle={() => (
          <FileUpload
            fileUploadData={fileUploadData}
            user={user}
            modalError={modalError}
            queryKey={["filesData", user.orgId, appSlug]}
          />
        )}
      />
    );
  }

  return (
    <DataTable
      isLoading={isLoading}
      columns={listFileTableColumn()}
      cardRender={(row) => (
        <ListFileCard
          row={row}
          openModal={openFilenestUserModal}
          openUserModal={openUserModal}
        />
      )}
      cardColsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      defaultView="card"
      data={filesData ?? []}
      dataSize={filesData?.length ?? 0}
      label={"Your Files"}
      searchField="fileName"
      AddButtonIcon={<Upload />}
      addLabelName="Upload Files"
      filterField="fileType"
      filterFieldLabel="File Type"
      customFilterField="fileEntityLabel"
      customFilterValue={!!filterBy ? filterBy : null}
      filterValues={MEDICAL_MIME_FILTER_TYPES}
      fallbackText={(filesData?.length === 0 && "No Files Found") || "No Files"}
      openModal={() => {
        openModal({
          type: "fileUpload",
          error: modalError,
          fileUploadData,
          queryKey,
          revalidatePath,
        });
      }}
    />
  );
}

export default ListFileTable;
