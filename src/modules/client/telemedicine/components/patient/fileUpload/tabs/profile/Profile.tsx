"use client";

import { TGetFileUploadRequiredDataControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/localFileOperation";
import FaceVerificationSession from "./FaceVerificationSection";
import ProfileImageUpload from "./ProfileImageUpload";
import { TSharedUser } from "@/modules/shared/types";

interface IPatientProfileProps {
  user: TSharedUser;
  fileEntities?: TGetFileUploadRequiredDataControllerOutput | null;
}

function PatientProfile({ fileEntities, user }: IPatientProfileProps) {
  const profilePhotoEntity = fileEntities?.fileEntities.find(
    (fileEntity) =>
      fileEntity.type === "PATIENT_PROFILE" &&
      fileEntity.name === "PATIENT_PROFILE_PHOTO"
  );

  const faceVerificationEntity = fileEntities?.fileEntities.find(
    (fileEntity) =>
      fileEntity.type === "PATIENT_PROFILE" &&
      fileEntity.name === "PATIENT_FACE_VERIFICATION"
  );

  return (
    <div className="space-y-6">
      <ProfileImageUpload entityId={profilePhotoEntity?.id} user={user} />
      <FaceVerificationSession
        entityId={faceVerificationEntity?.id}
        user={user}
      />
    </div>
  );
}

export default PatientProfile;
