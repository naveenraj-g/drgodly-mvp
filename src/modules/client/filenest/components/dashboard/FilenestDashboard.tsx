"use client";

import { TSharedUser } from "@/modules/shared/types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getUserFiles } from "../../server-actions/filenest-actions";

interface IFilenestDashboardProps {
  user: TSharedUser;
}

function FilenestDashboard({ user }: IFilenestDashboardProps) {
  const searchParams = useSearchParams();
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

  console.log(filesData, filesDataError);

  return (
    <div>
      <h1>FileNest Dashboard</h1>
    </div>
  );
}

export default FilenestDashboard;
