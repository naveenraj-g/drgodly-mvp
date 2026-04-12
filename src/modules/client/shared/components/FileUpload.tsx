"use client";

import { Button } from "@/components/ui/button";
import { useFileUploadStore } from "@/modules/client/shared/store/file-upload-store";
import { Upload } from "lucide-react";
import { IFileUploadProps } from "../types/file-upload";

function FileUpload({
  fileUploadData,
  user,
  modalError,
  url,
  queryKey,
}: IFileUploadProps) {
  const openModal = useFileUploadStore((state) => state.onOpen);

  function handleOpenModal() {
    openModal({
      type: "fileUpload",
      error: modalError,
      fileUploadData,
      revalidatePath: url,
      queryKey,
    });
  }

  return (
    <Button onClick={handleOpenModal}>
      <Upload />
      Upload Files
    </Button>
  );
}

export default FileUpload;
