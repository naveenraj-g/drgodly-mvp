/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getUserFilesByEntityIdAction } from "@/modules/client/filenest/server-actions/filenest-actions";
import { useFileUploadCore } from "@/modules/client/shared/hooks/useFileUploadCore";
import { uploadLocalUserFile } from "@/modules/client/shared/server-actions/file-upload-action";
import { TSharedUser } from "@/modules/shared/types";
import { useQuery } from "@tanstack/react-query";
import { Camera, Loader2, Upload, User, X } from "lucide-react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import ProfileImageUploadSkeleton from "./skeleton/ProfileImageUploadSkeleton";
import { useQueryClient } from "@tanstack/react-query";

interface IProfileImageUploadProps {
  user: TSharedUser;
  entityId?: bigint;
}

function ProfileImageUpload({ entityId, user }: IProfileImageUploadProps) {
  const queryClient = useQueryClient();
  /** ---------------- File Upload Hook ---------------- */
  const upload = useFileUploadCore({
    maxSizeMb: 5,
    maxFiles: 1,
    accept: { "image/*": [] },
    skipSimulate: true,
    disableExceedLimit: true,
  });

  const selectedImage = upload.completedFiles[0];

  /** ---------------- Fetch Existing Profile Photo ---------------- */
  const {
    data: profilePhotoData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfilePhoto", entityId?.toString()],
    enabled: !!entityId,
    queryFn: async () => {
      return getUserFilesByEntityIdAction({
        orgId: user.orgId,
        userId: user.id,
        appSlug: "telemedicine",
        id: entityId!,
      });
    },
  });

  const existingFile = profilePhotoData?.[0]?.[0];

  /** ---------------- Upload Action ---------------- */
  const { execute: uploadProfilePhoto, isPending } = useServerAction(
    uploadLocalUserFile,
    {
      onSuccess() {
        toast.success("Profile photo uploaded");
        upload.clearFiles();

        queryClient.invalidateQueries({
          queryKey: ["userProfilePhoto", entityId?.toString()],
        });
      },
      onError({ err }) {
        toast.error("Upload failed", {
          description: err.message ?? "Please try again later",
        });
      },
    }
  );

  async function handleUpload() {
    if (!selectedImage || !entityId) {
      toast.error("No image selected");
      return;
    }

    await uploadProfilePhoto({
      userId: user.id,
      orgId: user.orgId,
      appSlug: "telemedicine",
      fileEntityId: entityId,
      files: [{ file: selectedImage.file }],
    });
  }

  /** ---------------- Image Source Resolution ---------------- */
  const displaySrc = selectedImage
    ? selectedImage.objectUrl
    : existingFile
    ? `/api/file/view?id=${existingFile.id}&fileName=${existingFile.fileName}&filePath=${existingFile.filePath}&fileType=${existingFile.fileType}`
    : "";

  /** ---------------- Render ---------------- */
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <User className="h-5 w-5 text-primary" />
          Profile Photo
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!profilePhotoData && isLoading ? (
          <ProfileImageUploadSkeleton />
        ) : !entityId ? (
          <p className="text-center text-muted-foreground">
            Something went wrong. Please{" "}
            <span className="font-bold cursor-pointer">Try Again!</span> later
          </p>
        ) : isError ? (
          <p className="text-center text-muted-foreground">
            Failed to load profile photo
          </p>
        ) : (
          <div className="flex flex-col items-center gap-4 relative w-fit mx-auto">
            {/* Avatar */}
            <div
              {...upload.getRootProps()}
              className={cn(
                "w-36 h-36 rounded-full overflow-hidden",
                "border-4 border-card shadow-card-hover",
                upload.isDragActive && "border-primary shadow-glow scale-105",
                !displaySrc && "bg-secondary"
              )}
            >
              {displaySrc ? (
                <>
                  <img
                    src={displaySrc}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                  {selectedImage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        upload.removeFile(selectedImage.id);
                      }}
                      className="absolute top-2 right-2 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-md cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-16 w-16 text-muted-foreground/50" />
                </div>
              )}
            </div>

            <input {...upload.getInputProps()} />

            {/* Action Button */}
            <Button
              size="sm"
              className="gap-2"
              disabled={isPending || isLoading}
              onClick={() => (selectedImage ? handleUpload() : upload.open())}
            >
              {selectedImage ? (
                isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </>
                )
              ) : (
                <>
                  <Camera />
                  {existingFile ? "Change photo" : "Click or drag photo"}
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ProfileImageUpload;
