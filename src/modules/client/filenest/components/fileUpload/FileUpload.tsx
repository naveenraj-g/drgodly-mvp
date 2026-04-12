"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { SelectItem } from "@/components/ui/select";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import {
  getFileUploadRequiredDataWithAppSlug,
  uploadLocalUserFile,
} from "@/modules/client/shared/server-actions/file-upload-action";
import { FormSelect } from "@/modules/shared/custom-form-fields";
import { formatStorage } from "@/modules/shared/helper";
import ActionTooltipProvider from "@/modules/shared/providers/action-tooltip-provider";
import { TSharedUser } from "@/modules/shared/types";
import { handleInputParseError } from "@/modules/shared/utils/handleInputParseError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, File, Loader2, Upload, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useServerAction } from "zsa-react";
import { FileUploadSkeleton } from "./FileUploadSkeleton";
import UploadTips from "./UploadTips";

interface IFileUploadProps {
  user: TSharedUser;
}

const uploadSchema = z.object({
  fileEntityId: z.bigint(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  key?: string;
  isDeleting: boolean;
  status: "uploading" | "complete" | "error";
  objectUrl?: string;
}

function FileUpload({ user }: IFileUploadProps) {
  const session = useSession();
  const searchParams = useSearchParams();
  const appSlug = searchParams?.get("app") as string;

  const {
    data: fileUploadData,
    error: fileUploadDataError,
    isPending: fileUploadDataIsPending,
    isFetching: fileUploadDataIsFetching,
  } = useQuery({
    queryKey: ["fileUploadEntitiesData", user.orgId, appSlug],
    enabled: !!appSlug, // 👈 wait until param exists
    queryFn: async () =>
      await getFileUploadRequiredDataWithAppSlug({
        orgId: user.orgId,
        userId: user.id,
        appSlug: appSlug,
      }),
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const fileEntitiesSelect = fileUploadData?.[0]?.fileEntities?.map(
    (entity) => ({
      label: entity.label,
      value: entity.id,
    })
  );

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      fileEntityId: undefined,
    },
  });

  const { execute: localFileUpload, isPending: isLocalFileUploadPending } =
    useServerAction(uploadLocalUserFile, {
      onSuccess({ data }) {
        if (data?.success) {
          toast.success("File uploaded successfully.");
          return;
        }
        toast.error("An unexpected error occurred.", {
          description: "Failed to upload file.",
        });
      },
      onError({ err }) {
        const handled = handleInputParseError({
          err,
          form,
          toastMessage: "Form validation failed",
          toastDescription: "Please correct the highlighted fields below.",
        });

        if (handled) return;

        toast.error("An unexpected error occurred.", {
          description: err.message ?? "Please try again later.",
        });
      },
    });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        progress: 0,
        status: "uploading",
        isDeleting: false,
        objectUrl: file.type.includes("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        simulateUpload(file.id);
      });
    }
  }, []);

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const tooManyFiles = fileRejections.find(
          (rejection) => rejection.errors[0].code === "too-many-files"
        );

        const fileTooLarge = fileRejections.find(
          (rejection) => rejection.errors[0].code === "file-too-large"
        );

        if (tooManyFiles) {
          toast.error("You can only upload up to 5 files at a time");
        }

        if (fileTooLarge) {
          toast.error(
            `File size must be less than ${
              fileUploadData?.[0]?.maxFileSize ?? "100"
            }MB`
          );
        }
      }
    },
    [fileUploadData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles: 5,
    maxSize: 1024 * 1024 * (fileUploadData?.[0]?.maxFileSize ?? 100),
  });

  const simulateUpload = (id: string) => {
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 30;

      setUploadedFiles((prev) =>
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
  };

  const removeFile = (file: UploadedFile) => {
    if (file.objectUrl) {
      URL.revokeObjectURL(file.objectUrl);
    }

    setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id));
  };

  const handleSubmit = async (data: UploadFormData) => {
    if (!session || !session.data?.user || !session.data.user?.currentOrgId) {
      return;
    }

    const uploadData = {
      userId: session.data.user.id,
      orgId: session.data.user.currentOrgId,
      appSlug,
      fileEntityId: data.fileEntityId,
      files: uploadedFiles
        .filter((fileData) => fileData.status === "complete")
        .map((fileData) => ({ file: fileData.file })),
    };

    if (
      uploadData.files.length === 0 ||
      !uploadData?.files.length ||
      !uploadData.fileEntityId
    ) {
      toast.error("No files to upload");
      return;
    }

    await localFileUpload(uploadData);
  };

  if (fileUploadDataIsPending || fileUploadDataIsFetching || session.isPending)
    return <FileUploadSkeleton />;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {"Upload Files"}
          </CardTitle>
          <CardDescription>
            {"Drag and drop files here, or browse your device to upload." +
              ` Max file size ${formatStorage(
                fileUploadData?.[0]?.maxFileSize || 0
              )}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {fileUploadDataError ? (
            <div>
              <p className="text-red-600">
                Error:{" "}
                {fileUploadDataError?.message ||
                  "Something went wrong! Please try again later"}
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div
                  className={`
                    relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200
                    ${
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }
                  `}
                  {...getRootProps()}
                >
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx,.dcm,.jpg,.jpeg,.png"
                    {...getInputProps()}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      {isDragActive ? (
                        <>
                          <p className="font-medium text-primary">
                            Drop files here to upload
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Release to start uploading
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-foreground">
                            Drag and drop files here
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            or click to browse from your device
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">
                      Uploaded Files
                    </p>
                    <div className="space-y-2 max-h-48 overflow-auto">
                      {uploadedFiles.map((uploadedFile, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg animate-scale-in"
                        >
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                            {uploadedFile.status === "complete" ? (
                              uploadedFile?.objectUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={uploadedFile.objectUrl}
                                  alt={uploadedFile.id}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <CheckCircle2 className="w-5 h-5 text-success" />
                              )
                            ) : (
                              <File className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm break-all font-medium text-foreground whitespace-normal">
                              {uploadedFile.file.name}
                            </p>
                            {uploadedFile.status === "uploading" && (
                              <Progress
                                value={uploadedFile.progress}
                                className="h-1.5 mt-1.5"
                              />
                            )}
                          </div>
                          <div className="flex items-center">
                            <ActionTooltipProvider label="Remove">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(uploadedFile)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </ActionTooltipProvider>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <FormSelect
                  control={form.control}
                  name="fileEntityId"
                  label="File Category"
                  placeholder={
                    !fileEntitiesSelect || fileEntitiesSelect.length === 0
                      ? "No category to select"
                      : "Select a category"
                  }
                  customValue={
                    form.watch().fileEntityId?.toString() || undefined
                  }
                  onCustomChange={(value) => {
                    form.setValue("fileEntityId", BigInt(value));
                  }}
                >
                  {fileEntitiesSelect?.map((entitySelect) => (
                    <SelectItem
                      key={entitySelect.value}
                      value={entitySelect.value.toString()}
                    >
                      {entitySelect.label}
                    </SelectItem>
                  ))}
                </FormSelect>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="submit"
                    disabled={
                      uploadedFiles.length === 0 ||
                      uploadedFiles.some((f) => f.status === "uploading") ||
                      isLocalFileUploadPending
                    }
                  >
                    {isLocalFileUploadPending ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Files
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      <UploadTips />
    </div>
  );
}

export default FileUpload;
