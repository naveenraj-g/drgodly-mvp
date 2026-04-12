"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminModalStore } from "../stores/admin-modal-store";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, TriangleAlert } from "lucide-react";
import { useServerAction } from "zsa-react";
import {
  addMemberToOrganization,
  getOrganizationMembersData,
  removeMemberFromOrganization,
} from "../server-actions/organizationMember-action";
import { TOrganizationMembersAndUsers } from "@/modules/shared/entities/models/admin/organizationMember";
import {
  AddMemberToOrganizationValidationFormSchema,
  TAddMemberToOrganizationValidationFormSchema,
} from "@/modules/shared/schemas/admin/organizationMemberValidationSchema";
import { useSession } from "../../auth/betterauth/auth-client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export const ManageOrgMembersModal = () => {
  const session = useSession();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);
  const organizationData = useAdminModalStore(
    (state) => state.organizationData
  );
  const triggerRefetch = useAdminModalStore((state) => state.triggerInModal);
  const incrementTriggerRefetch = useAdminModalStore(
    (state) => state.incrementInModalTrigger
  );

  const [organizationMenbersData, setOrganizationMembersData] =
    useState<TOrganizationMembersAndUsers | null>(null);

  const isModalOpen = isOpen && modalType === "manageOrgMembers";

  const {
    execute: getOrganizationMembers,
    isPending,
    error,
  } = useServerAction(getOrganizationMembersData, {
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

  const { execute: addMemberToOrg, isPending: isAddingMemberToOrg } =
    useServerAction(addMemberToOrganization, {
      onSuccess() {
        toast.success(`User added to organization`);
      },
      onError({ err }) {
        toast.error("An Error Occurred!", {
          description: err.message,
        });
      },
    });

  const { execute: removeMemberFromOrg, isPending: isRemovingMemberFromOrg } =
    useServerAction(removeMemberFromOrganization, {
      onSuccess() {
        toast.success(`User removed from organization`);
      },
      onError({ err }) {
        toast.error("An Error Occurred!", {
          description: err.message,
        });
      },
    });

  const form = useForm<TAddMemberToOrganizationValidationFormSchema>({
    resolver: zodResolver(AddMemberToOrganizationValidationFormSchema),
    defaultValues: {
      emailOrUsername: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    (async () => {
      if (isModalOpen && organizationData && organizationData.id) {
        const [data] = await getOrganizationMembers({
          organizationId: organizationData.id,
        });

        setOrganizationMembersData(data);
      }
    })();
  }, [triggerRefetch, organizationData, getOrganizationMembers, isModalOpen]);

  async function onSubmitAddUser(
    values: TAddMemberToOrganizationValidationFormSchema
  ) {
    if (!session) {
      return;
    }

    if (!organizationData || !organizationData.id) {
      toast.error("No organization data found");
      return;
    }

    await addMemberToOrg({
      emailOrUsername: values.emailOrUsername,
      organizationId: organizationData.id,
    });
    form.reset();
    incrementTriggerRefetch();
  }

  async function handleRemoveUser(
    id: string,
    organizationId: string,
    userId: string
  ) {
    if (!session) {
      return;
    }

    if (!id || !organizationId || !userId) {
      toast.error("No organization data found");
      return;
    }

    await removeMemberFromOrg({
      id,
      organizationId,
      userId,
    });
    incrementTriggerRefetch();
  }

  function handleCloseModal() {
    form.reset();
    setOrganizationMembersData(null);
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[550px] w-[550px]">
        <DialogHeader className="text-center">
          <DialogTitle>Organization: {organizationData?.name}</DialogTitle>
          <DialogDescription>
            Slug: {organizationData?.slug && `(${organizationData?.slug})`}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitAddUser)}
              className="mb-6"
            >
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="emailOrUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputGroup>
                          <InputGroupInput
                            placeholder="email or username (e.g. example123@gmail.com)"
                            {...field}
                            autoComplete="off"
                          />
                          <InputGroupAddon align="inline-end">
                            <Button
                              type="submit"
                              className="h-7 px-2"
                              disabled={
                                isRemovingMemberFromOrg ||
                                isAddingMemberToOrg ||
                                isPending ||
                                isSubmitting
                              }
                            >
                              Map User
                            </Button>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
        <div className="space-y-4 overflow-x-auto">
          <div className="flex gap-4 items-center">
            <h3 className="font-semibold">
              Organization Members ({organizationMenbersData?.total ?? 0})
            </h3>
            {(isPending || isAddingMemberToOrg || isRemovingMemberFromOrg) && (
              <Loader2 className="animate-spin w-5 h-5" />
            )}
            {error && (
              <p className="text-rose-600">{error && "Failed to get data"}</p>
            )}
          </div>
          <div className="rounded-md border max-h-[280px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Name</TableHead>
                  <TableHead className="text-left">Email</TableHead>
                  <TableHead className="text-left">Role</TableHead>
                  <TableHead className="text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizationMenbersData?.organizationMembersAndUsers.map(
                  (member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.user.name}</TableCell>
                      <TableCell>{member.user.email}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-7 px-2"
                          disabled={
                            member.role === "owner" ||
                            isRemovingMemberFromOrg ||
                            isAddingMemberToOrg ||
                            isPending
                          }
                          onClick={() =>
                            handleRemoveUser(
                              member.id,
                              member.organizationId,
                              member.userId
                            )
                          }
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
                {!organizationMenbersData?.organizationMembersAndUsers
                  .length && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <TriangleAlert className="h-4 w-4" /> No Members
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter className="space-x-2"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
