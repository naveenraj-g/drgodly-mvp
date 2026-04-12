"use client";

import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { useFilenestUserModalStore } from "../../stores/user-modal-store";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ShareFileForm } from "../../forms/modals/user/ShareFileForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useServerAction } from "zsa-react";
import { getUserByUserNameOrEmailAndOrgIdAction } from "@/modules/client/shared/server-actions/user.actions";
import { Loader2 } from "lucide-react";
import {
  ShareUserFileFormSchema,
  TShareUserFileFormSchema,
} from "@/modules/shared/schemas/filenest/userFilePermission/userFilePermissionFormSchema";
import { TCreateUserFilePermissionValidationSchema } from "@/modules/shared/schemas/filenest/userFilePermission/userFilePermissionValidationSchemas";
import { createUserFilePermissionByOwnerAction } from "../../server-actions/user-file-permission.actions";

export const ShareFileModal = () => {
  const session = useSession();
  const fileData = useFilenestUserModalStore((state) => state.fileData);
  const modalType = useFilenestUserModalStore((state) => state.type);
  const isOpen = useFilenestUserModalStore((state) => state.isOpen);
  const closeModal = useFilenestUserModalStore((state) => state.onClose);

  const [usernameOrEmail, setUsernameOrEmail] = useState<string | null>(null);

  const isModalOpen = isOpen && modalType === "shareFile";

  const form = useForm<TShareUserFileFormSchema>({
    resolver: zodResolver(ShareUserFileFormSchema),
    defaultValues: {
      canView: false,
      canDownload: false,
    },
  });

  const {
    execute: getUser,
    isPending: isGetUserPending,
    isError: isGetUserError,
    error: getUserError,
    data: getUserData,
    reset: resetGetUser,
  } = useServerAction(getUserByUserNameOrEmailAndOrgIdAction);

  const {
    execute: createUserFilePermission,
    isPending: isCreateUserFilePermissionPending,
  } = useServerAction(createUserFilePermissionByOwnerAction, {
    onSuccess() {
      toast.success("File shared successfully");
      handleCloseModal();
    },
    onError() {
      toast.error("Failed to share file", {
        description: "Please try again later",
      });
    },
  });

  async function searchUser() {
    if (!session || !session.data?.user || !session.data.user?.currentOrgId) {
      toast.error("Unauthorized");
      return;
    }

    if (!usernameOrEmail) {
      toast.error("Please enter a username or email");
      return;
    }

    if (
      usernameOrEmail === session.data.user.username ||
      usernameOrEmail === session.data.user.email
    ) {
      toast.error("You cannot share a file with yourself");
      return;
    }

    await getUser({
      shareWith: usernameOrEmail,
      orgId: session.data?.user?.currentOrgId,
    });
  }

  const onSubmit = async (values: TShareUserFileFormSchema) => {
    if (!session || !session.data?.user || !session.data.user?.currentOrgId) {
      toast.error("Unauthorized");
      return;
    }

    if (!getUserData) {
      toast.error("User not found");
      return;
    }

    if (!fileData) {
      toast.error("User file not found");
      return;
    }

    const data: TCreateUserFilePermissionValidationSchema = {
      ...values,
      orgId: session.data.user.currentOrgId,
      sharedUserId: getUserData?.id,
      userFileId: fileData.id,
      userId: session.data.user.id,
    };

    console.log(data);

    await createUserFilePermission(data);
  };

  function handleCloseModal() {
    form.reset();
    setUsernameOrEmail(null);
    resetGetUser();
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share File</DialogTitle>
          <DialogDescription>
            Fill in the user details to share the file with them.
          </DialogDescription>
        </DialogHeader>
        <Card className="gap-2">
          <CardHeader>
            <CardTitle>Share user</CardTitle>
            <CardDescription>
              After entered the value, must search the user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <InputGroup>
              <InputGroupInput
                placeholder="Add user with username or email"
                autoComplete="off"
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                id="usernameOrEmail"
                disabled={isGetUserPending || isCreateUserFilePermissionPending}
              />
              <InputGroupAddon align="inline-end">
                <Button
                  type="submit"
                  className="h-7 px-2"
                  onClick={searchUser}
                  disabled={
                    !usernameOrEmail ||
                    isGetUserPending ||
                    isCreateUserFilePermissionPending
                  }
                >
                  {isGetUserPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Search User
                    </>
                  ) : (
                    "Search User"
                  )}
                </Button>
              </InputGroupAddon>
            </InputGroup>
            {isGetUserError && getUserError && (
              <p className="text-sm text-red-500">
                {getUserError.message || "Failed to get user"}
              </p>
            )}
            {getUserData && (
              <div className="mt-3 rounded-md border bg-muted/30 p-3 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground w-24">Name</span>
                  <span className="font-medium text-foreground">
                    {getUserData.name ?? getUserData.username}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground w-24">Username</span>
                  <span className="text-foreground">
                    @{getUserData.username}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground w-24">Email</span>
                  <span className="text-foreground">{getUserData.email}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <FormProvider {...form}>
          <ShareFileForm
            onCancel={handleCloseModal}
            onSubmit={onSubmit}
            isDisable={
              isGetUserPending ||
              isGetUserError ||
              isCreateUserFilePermissionPending
            }
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
