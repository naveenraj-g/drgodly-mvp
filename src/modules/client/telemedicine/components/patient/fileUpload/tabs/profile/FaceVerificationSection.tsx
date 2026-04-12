"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Loader2,
  Shield,
  User,
} from "lucide-react";
import FacialAngleCard from "./FacialAngleCard";
import { useTelemedicineFaceVerificationUploads } from "@/modules/client/telemedicine/hooks/useTelemedicineFaceVerificationUploads";
import { Button } from "@/components/ui/button";
import { TSharedUser } from "@/modules/shared/types";
import { useServerAction } from "zsa-react";
import { uploadLocalUserFile } from "@/modules/client/shared/server-actions/file-upload-action";
import { toast } from "sonner";
import { getUserFilesByEntityIdAction } from "@/modules/client/filenest/server-actions/filenest-actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FacialAngleCardLoaderSkeleton from "./skeleton/FacialAngleCardSkeleton";

const facialAngles = [
  {
    angle: "front",
    label: "Front View",
    icon: <User className="w-4 h-4" />,
    instruction: "Look straight at the camera",
  },
  {
    angle: "left",
    label: "Left View",
    icon: <ArrowLeft className="w-4 h-4" />,
    instruction: "Turn your head to the left",
  },
  {
    angle: "right",
    label: "Right View",
    icon: <ArrowRight className="w-4 h-4" />,
    instruction: "Turn your head to the right",
  },
  {
    angle: "up",
    label: "Looking Up",
    icon: <ArrowUp className="w-4 h-4" />,
    instruction: "Tilt your head upward",
  },
  {
    angle: "down",
    label: "Looking Down",
    icon: <ArrowDown className="w-4 h-4" />,
    instruction: "Tilt your head downward",
  },
];

interface IFaceVerificationSectionProps {
  user: TSharedUser;
  entityId?: bigint;
}

function FaceVerificationSection({
  user,
  entityId,
}: IFaceVerificationSectionProps) {
  const queryClient = useQueryClient();
  const uploads = useTelemedicineFaceVerificationUploads();

  /** ---------------- Fetch Existing Profile Photo ---------------- */
  const {
    data: faceVerificationPhotoData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userFaceVerificationPhoto", entityId?.toString()],
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

  /** ---------------- Upload Action ---------------- */
  const {
    execute: uploadFaceVerificationPhoto,
    isPending: isPendingUploadFaceVerificationPhoto,
  } = useServerAction(uploadLocalUserFile, {
    onSuccess() {
      toast.success("Profile photo uploaded");
      uploads.down.clearFiles();
      uploads.front.clearFiles();
      uploads.left.clearFiles();
      uploads.right.clearFiles();
      uploads.up.clearFiles();
      queryClient.invalidateQueries({
        queryKey: ["userFaceVerificationPhoto", entityId?.toString()],
      });
    },
    onError() {
      toast.error("Upload failed", {
        description: "Please try again later",
      });
    },
  });

  const completedCount = Object.values(uploads).filter(
    (u) => u.completedFiles.length === 1
  ).length;

  const isComplete = completedCount === facialAngles.length;

  async function handleSubmitFile() {
    if (!entityId) {
      toast.error("Failed to upload files", {
        description: "Missing some datas",
      });
      return;
    }

    if (!isComplete && !faceVerificationPhotoData) {
      toast.error("Please upload all photos");
      return;
    }

    const files = facialAngles.map((angle) => ({
      referenceType: angle.angle,
      file: uploads[angle.angle as keyof typeof uploads].completedFiles[0]
        ?.file,
    }));

    if (files.length <= 0) {
      toast.error("Please upload photos");
      return;
    }

    const data = {
      userId: user.id,
      orgId: user.orgId,
      appSlug: "telemedicine",
      fileEntityId: entityId,
      files,
    };

    await uploadFaceVerificationPhoto(data);
  }

  const uploadedFaceAngleData = faceVerificationPhotoData?.[0]?.reduce(
    (acc: Record<string, string>, data) => {
      if (!data.referenceType) return acc;
      const url = `/api/file/view?id=${data.id}&fileName=${data.fileName}&filePath=${data.filePath}&fileType=${data.fileType}`;

      acc[data.referenceType] = url;
      return acc;
    },
    {}
  );

  return (
    <section className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Facial Verification
          </h2>
          <p className="text-sm text-muted-foreground">
            Upload photos from different angles
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          {faceVerificationPhotoData?.[0]?.length || completedCount} /{" "}
          {facialAngles.length} uploaded
        </div>
      </div>
      {!faceVerificationPhotoData && isLoading ? (
        <FacialAngleCardLoaderSkeleton count={5} />
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
        <>
          <FacialAngleCard
            facialAngles={facialAngles}
            uploads={uploads}
            uploadedFaceAngleData={uploadedFaceAngleData}
          />

          <Button
            className="mt-6 w-fit self-end"
            disabled={
              (!faceVerificationPhotoData && !isComplete) ||
              isPendingUploadFaceVerificationPhoto ||
              isLoading
            }
            onClick={handleSubmitFile}
          >
            {isPendingUploadFaceVerificationPhoto ? (
              <>
                <Loader2 className="animate-spin" /> Submit for Verification
              </>
            ) : (
              "Submit for Verification"
            )}
          </Button>
        </>
      )}
    </section>
  );
}

export default FaceVerificationSection;
