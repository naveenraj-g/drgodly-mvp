import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/i18n/navigation";
import { ListFilesSkeleton } from "@/modules/client/filenest/components/files/listFiles/ListFilesSkeleton";
import ListFileTable from "@/modules/client/filenest/components/files/listFiles/ListFileTable";
import { getUserFilesByEntityAction } from "@/modules/client/filenest/server-actions/filenest-actions";
import { TGetFileUploadRequiredDataControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/localFileOperation";
import { TSharedUser } from "@/modules/shared/types";
import { updateQueryParam } from "@/modules/shared/utils/updateQueryParam";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { ZSAError } from "zsa";

interface IPatientMedicalRecordsProps {
  user: TSharedUser;
  fileEntities?: TGetFileUploadRequiredDataControllerOutput | null;
  fileEntitiesError: ZSAError | null;
}

function PatientMedicalRecords({
  user,
  fileEntities,
  fileEntitiesError,
}: IPatientMedicalRecordsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    data: medicalRecords,
    error: medicalRecordsError,
    isPending: medicalRecordsIsPending,
    isFetching: medicalRecordsIsFetching,
  } = useQuery({
    queryKey: ["medicalRecords", user.orgId],
    queryFn: async () =>
      await getUserFilesByEntityAction({
        appSlug: "telemedicine",
        orgId: user.orgId,
        userId: user.id,
        type: "PATIENT_MEDICAL_RECORDS",
      }),
  });

  const patientMedicalRecordEntity = {
    fileEntities:
      fileEntities?.fileEntities.filter(
        (fileEntity) => fileEntity.type === "PATIENT_MEDICAL_RECORDS"
      ) ?? [],
    maxFileSize: fileEntities?.maxFileSize,
  };

  function handleTabContentChange(value: string) {
    updateQueryParam(
      "filterBy",
      value === "all-files" ? null : value,
      searchParams!,
      router
    );
  }

  if (medicalRecordsIsPending) return <ListFilesSkeleton />;

  if (medicalRecordsError || fileEntitiesError)
    return (
      <div className="flex items-center gap-2 justify-center mt-18 text-destructive">
        <AlertCircle className="size-5" /> Something went wrong
      </div>
    );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all-files" onValueChange={handleTabContentChange}>
        <TabsList>
          <TabsTrigger value="all-files">All Files</TabsTrigger>
          {patientMedicalRecordEntity?.fileEntities?.map((d) => (
            <TabsTrigger key={d.id} value={d.label}>
              {d.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <ListFileTable
        user={user}
        fileUploadData={patientMedicalRecordEntity}
        modalError={fileEntitiesError}
        filesData={medicalRecords?.[0]}
        error={medicalRecordsError}
        isLoading={medicalRecordsIsPending || medicalRecordsIsFetching}
        queryKey={["medicalRecords", user.orgId]}
      />
    </div>
  );
}

export default PatientMedicalRecords;
