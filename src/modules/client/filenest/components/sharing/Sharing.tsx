"use client";

import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { TSharedUser } from "@/modules/shared/types";
import { useSearchParams } from "next/navigation";
import { getUserFilePermissionsByOwnerAction } from "../../server-actions/user-file-permission.actions";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleAlert, UserCheck } from "lucide-react";
import SharedWithUser from "./SharedWithUser";
import SharedWithUserSkeleton from "./SharedWithUserSkeleton";

interface ISharingProps {
  user: TSharedUser;
}

export function Sharing({ user }: ISharingProps) {
  const session = useSession();
  const searchParams = useSearchParams();
  const appSlug = searchParams?.get("app") as string;

  const {
    data: sharingFilesData,
    error: sharingFilesDataError,
    isPending: sharingFilesDataIsPending,
    isFetching: sharingFilesDataIsFetching,
  } = useQuery({
    queryKey: ["sharingFilesData", user.orgId, appSlug],
    enabled: !!appSlug, // 👈 wait until param exists
    queryFn: async () =>
      await getUserFilePermissionsByOwnerAction({
        orgId: user.orgId,
        userId: user.id,
        appSlug: appSlug,
      }),
  });

  // if (sharingFilesDataIsPending || sharingFilesDataIsFetching) {
  //   return <div>Loading...</div>;
  // }

  if (sharingFilesDataError) {
    return (
      <div className="text-red-400 flex items-center gap-2">
        <CircleAlert />
        <p>Error: {sharingFilesDataError.message}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-4 h-4" />
          <h3 className="font-semibold text-foreground">Shared with users</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sharingFilesDataIsPending || sharingFilesDataIsFetching ? (
          <SharedWithUserSkeleton />
        ) : !sharingFilesData ||
          !sharingFilesData?.[0] ||
          sharingFilesData?.[0].length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No records shared to users yet
          </p>
        ) : (
          <SharedWithUser data={sharingFilesData[0]} />
        )}
      </CardContent>
    </Card>
  );
}
