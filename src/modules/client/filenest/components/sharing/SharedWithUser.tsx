"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TGetUserFilePermissionsByOwnerController } from "@/modules/server/filenest/interface-adapters/controllers/userFilePermission";
import { Download, Ellipsis, Eye, FileText } from "lucide-react";

interface ISharedWithUserProps {
  data: TGetUserFilePermissionsByOwnerController;
}

function SharedWithUser({ data }: ISharedWithUserProps) {
  const userShares = Object.groupBy(data, ({ sharedUserId }) => sharedUserId);

  return (
    <div className="space-y-4">
      {Object.entries(userShares).map(([userId, userFiles]) => (
        <div
          key={userId}
          className="flex flex-col items-start gap-4 p-4 bg-muted/60 rounded-lg animate-fade-in"
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">User</h3>
            <Badge>{userFiles?.length || 0} Files</Badge>
          </div>
          <div className="space-y-2 w-full">
            {userFiles?.map((filePermission) => {
              return (
                <div
                  key={filePermission.id}
                  className={`flex items-center gap-2 p-2 rounded-lg bg-background/80 transition-colors group hover:bg-background/50 cursor-pointer`}
                >
                  <FileText className="w-4 h-4 text-primary" />
                  <span
                    className="flex-1 text-sm font-medium max-w-[250px] truncate"
                    title={filePermission.userFile?.fileName}
                  >
                    {filePermission.userFile?.fileName || "Unknown file"}
                  </span>
                  {filePermission.canView && (
                    <Badge variant="outline">
                      <Eye /> Can View
                    </Badge>
                  )}
                  {filePermission.canDownload && (
                    <Badge variant="outline">
                      <Download /> Can Download
                    </Badge>
                  )}
                  <Button size="icon-sm" variant="ghost" className="ml-auto">
                    <Ellipsis />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SharedWithUser;
