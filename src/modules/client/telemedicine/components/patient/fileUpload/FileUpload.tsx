"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TSharedUser } from "@/modules/shared/types";
import { useState } from "react";
import PatientProfile from "./tabs/profile/Profile";
import PatientMedicalRecords from "./tabs/medicalRecords/MedicalRecords";
import { TGetFileUploadRequiredDataControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/localFileOperation";
import { ZSAError } from "zsa";

interface IPatientFileUploadProps {
  user: TSharedUser;
  fileEntities?: TGetFileUploadRequiredDataControllerOutput | null;
  fileEntitiesError: ZSAError | null;
}

function PatientFileUpload({
  fileEntities,
  user,
  fileEntitiesError,
}: IPatientFileUploadProps) {
  const [currentTab, setCurrentTab] = useState("profile");

  return (
    <div>
      <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value)}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <PatientProfile fileEntities={fileEntities} user={user} />
        </TabsContent>
        <TabsContent value="medical-records">
          <PatientMedicalRecords
            fileEntities={fileEntities}
            fileEntitiesError={fileEntitiesError}
            user={user}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PatientFileUpload;
