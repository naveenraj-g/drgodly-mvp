import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { toast } from "sonner";

export type UploadStatus = "uploading" | "complete";

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  objectUrl?: string;
}

interface UseFileUploadCoreOptions {
  maxFiles?: number;
  maxSizeMb?: number;
  accept?: Record<string, string[]>;
  skipSimulate?: boolean;
  disableExceedLimit?: boolean;
  noClick?: boolean;
}

export function useFileUploadCore({
  maxFiles = 1,
  maxSizeMb = 100,
  accept,
  skipSimulate = false,
  disableExceedLimit = false,
  noClick = false,
}: UseFileUploadCoreOptions = {}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const simulateUpload = useCallback((id: string) => {
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 25;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                progress: Math.min(progress, 100),
                status: progress >= 100 ? "complete" : "uploading",
              }
            : f
        )
      );

      if (progress >= 100) clearInterval(interval);
    }, 200);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => {
        const isImage =
          file.type.startsWith("image/") ||
          /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(file.name);

        return {
          id: crypto.randomUUID(),
          file,
          progress: skipSimulate ? 100 : 0,
          status: skipSimulate ? "complete" : "uploading",
          objectUrl: isImage ? URL.createObjectURL(file) : undefined,
        };
      });

      setFiles((prev) => [...prev, ...newFiles]);

      if (skipSimulate) return;
      newFiles.forEach((f) => simulateUpload(f.id));
    },
    [simulateUpload, skipSimulate]
  );

  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    rejections.forEach((r) => r.errors.forEach((e) => toast.error(e.message)));
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles,
    maxSize: maxSizeMb * 1024 * 1024,
    accept,
    disabled: disableExceedLimit && files.length >= maxFiles,
    noClick,
  });

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.objectUrl) URL.revokeObjectURL(file.objectUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => f.objectUrl && URL.revokeObjectURL(f.objectUrl));
      return [];
    });
  }, []);

  const completedFiles = files.filter((f) => f.status === "complete");

  return {
    /* state */
    files,
    completedFiles,
    isUploading: files.some((f) => f.status === "uploading"),

    /* dropzone */
    getRootProps,
    getInputProps,
    isDragActive,
    open,

    /* actions */
    removeFile,
    clearFiles,
    setFiles,
  };
}
