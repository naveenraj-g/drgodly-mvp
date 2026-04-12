"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TSharedUser } from "@/modules/shared/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ListFileTable from "./ListFileTable";
import { getFileUploadRequiredDataWithAppSlug } from "@/modules/client/shared/server-actions/file-upload-action";
import { getUserFiles } from "../../../server-actions/filenest-actions";
import { updateQueryParam } from "@/modules/shared/utils/updateQueryParam";
import { useRouter } from "@/i18n/navigation";
import { ListFilesSkeleton } from "./ListFilesSkeleton";

interface IListFilesProps {
  user: TSharedUser;
}

function ListFiles({ user }: IListFilesProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appSlug = searchParams?.get("app") as string;

  const {
    data: filesData,
    error: filesDataError,
    isPending: filesDataIsPending,
    isFetching: filesDataIsFetching,
  } = useQuery({
    queryKey: ["filesData", user.orgId, appSlug],
    enabled: !!appSlug, // 👈 wait until param exists
    queryFn: async () =>
      await getUserFiles({
        orgId: user.orgId,
        userId: user.id,
        appSlug: appSlug,
      }),
  });

  const {
    data: fileUploadData,
    error: fileUploadDataError,
    isPending: fileUploadDataIsPending,
    isFetching: fileUploadDataIsFetching,
  } = useQuery({
    queryKey: ["fileUploadData", user.orgId, appSlug],
    enabled: !!appSlug, // 👈 wait until param exists
    queryFn: async () =>
      await getFileUploadRequiredDataWithAppSlug({
        orgId: user.orgId,
        userId: user.id,
        appSlug: appSlug,
      }),
  });

  if (fileUploadDataIsPending || fileUploadDataIsFetching)
    return <ListFilesSkeleton />;

  if (filesDataError || fileUploadDataError)
    return (
      <div className="flex items-center gap-2 justify-center mt-18 text-destructive">
        <AlertCircle className="size-5" /> Something went wrong
      </div>
    );

  function handleTabContentChange(value: string) {
    updateQueryParam(
      "filterBy",
      value === "all-files" ? null : value,
      searchParams!,
      router
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all-files" onValueChange={handleTabContentChange}>
        <TabsList>
          <TabsTrigger value="all-files">All Files</TabsTrigger>
          {fileUploadData?.[0]?.fileEntities?.map((d) => (
            <TabsTrigger key={d.id} value={d.label}>
              {d.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <ListFileTable
        user={user}
        fileUploadData={fileUploadData[0]}
        modalError={fileUploadDataError}
        filesData={filesData?.[0]}
        isLoading={filesDataIsPending || filesDataIsFetching}
        error={filesDataError}
        queryKey={["filesData", user.orgId, appSlug]}
      />
    </div>
  );
}

export default ListFiles;
