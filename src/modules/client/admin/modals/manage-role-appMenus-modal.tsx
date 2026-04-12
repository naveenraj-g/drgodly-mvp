"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useSession } from "../../auth/betterauth/auth-client";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, TriangleAlert } from "lucide-react";
import { useAdminModalStore } from "../stores/admin-modal-store";
import { useServerAction } from "zsa-react";
import { getAllAppsData } from "../server-actions/app-actions";
import { TAppDatas } from "@/modules/shared/entities/models/admin/app";
import { getAppMenuItems } from "../server-actions/appMenutem-actions";
import { TAppMenuItemsData } from "@/modules/shared/entities/models/admin/appMenuItem";
import {
  AddRoleAppMenuItemValidationFormSchema,
  TAddRoleAppMenuItemValidationForm,
} from "@/modules/shared/schemas/admin/roleAppMenuItemValidatorSchema";
import {
  getRoleAppMenuItems,
  mapAppMenuItemsToRole,
  unmapAppMenuItemsToRole,
} from "../server-actions/roleAppMenuItem-actions";
import { TRoleAppMenuItemsData } from "@/modules/shared/entities/models/admin/roleAppMenuItem";

export const ManageRoleAppMenusModal = () => {
  const session = useSession();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);
  const roleData = useAdminModalStore((state) => state.roleData);
  const triggerRefetch = useAdminModalStore((state) => state.triggerInModal);
  const incrementTriggerRefetch = useAdminModalStore(
    (state) => state.incrementInModalTrigger
  );

  const [allApps, setAllApps] = useState<TAppDatas | null>(null);
  const [appMenuItems, setAppMenuItems] = useState<TAppMenuItemsData | null>(
    null
  );
  const [roleAppMenuItems, setRoleAppMenuItems] =
    useState<TRoleAppMenuItemsData | null>(null);

  const isModalOpen = isOpen && modalType === "manageRoleAppMenus";

  const form = useForm<TAddRoleAppMenuItemValidationForm>({
    resolver: zodResolver(AddRoleAppMenuItemValidationFormSchema),
    defaultValues: {
      appId: "",
    },
  });

  const selectedAppId = form.watch("appId");

  const { execute: getApps, isPending: isGetAppsPending } = useServerAction(
    getAllAppsData,
    {
      onError({ err }) {
        toast.error("An Error Occurred!", {
          description: err.message,
        });
      },
    }
  );

  const {
    execute: getMenuItems,
    isPending: isGetMenuItemsPending,
    error,
  } = useServerAction(getAppMenuItems, {
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });
  const { execute: getRoleAppMenu, isPending: isGetRoleAppMenuPending } =
    useServerAction(getRoleAppMenuItems, {
      onError({ err }) {
        toast.error("An Error Occurred!", {
          description: err.message,
        });
      },
    });

  const { execute: mapMenuItem, isPending: isMapMenuItemPending } =
    useServerAction(mapAppMenuItemsToRole, {
      onError({ err }) {
        toast.error("An Error Occurred!", {
          description: err.message,
        });
      },
    });

  const { execute: unmapMenuItem, isPending: isUnMapMenuItemPending } =
    useServerAction(unmapAppMenuItemsToRole, {
      onError({ err }) {
        toast.error("An Error Occurred!", {
          description: err.message,
        });
      },
    });

  useEffect(() => {
    (async () => {
      if (isModalOpen && roleData) {
        const [data] = await getApps();

        setAllApps(data);
      }
    })();
  }, [getApps, isModalOpen, roleData]);

  useEffect(() => {
    if (!selectedAppId || !isModalOpen || !roleData) return;

    (async () => {
      const [data] = await getMenuItems({ appId: selectedAppId });
      const [roleAppMenudata] = await getRoleAppMenu({
        appId: selectedAppId,
        roleId: roleData?.id,
      });
      setAppMenuItems(data);
      setRoleAppMenuItems(roleAppMenudata);
    })();
  }, [
    triggerRefetch,
    selectedAppId,
    isModalOpen,
    roleData,
    getMenuItems,
    getRoleAppMenu,
  ]);

  async function handleMapAppMenuItem(
    isAlreadyMapped: boolean,
    appMenuItemId: string
  ) {
    if (!session) {
      return;
    }

    if (!roleData || !isModalOpen) {
      return;
    }

    if (isAlreadyMapped) {
      await unmapMenuItem({
        appId: selectedAppId,
        appMenuItemId,
        roleId: roleData.id,
      });
      toast("MenuItem removed successfully.");
    } else {
      await mapMenuItem({
        appId: selectedAppId,
        appMenuItemId,
        roleId: roleData.id,
      });
      toast("MenuItem added successfully.");
    }
    incrementTriggerRefetch();
  }

  function handleCloseModal() {
    form.reset();
    setAppMenuItems(null);
    setRoleAppMenuItems(null);
    setAllApps(null);
    closeModal();
  }

  const isLoading =
    isGetRoleAppMenuPending ||
    isGetMenuItemsPending ||
    isGetAppsPending ||
    isMapMenuItemPending ||
    isUnMapMenuItemPending;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[550px] w-[550px]">
        <DialogHeader>
          <DialogTitle>
            <p className="mb-2">Manage Role App MenuItems</p>
            <span>Role: {roleData?.name}</span>
          </DialogTitle>
          <DialogDescription>
            Description: {roleData?.description}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className="flex flex-col gap-6 mb-4 mt-2">
              <FormField
                control={form.control}
                name="appId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apps</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val)}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select app" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {allApps?.appDatas.map((app) => (
                            <SelectItem key={app.id} value={app.id}>
                              {app.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <div className="space-y-4 overflow-x-auto">
          <div className="flex gap-4 items-center">
            <h3 className="font-semibold">
              App MenuItems ({appMenuItems?.total ?? 0})
            </h3>
            {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
            {error && <p className="text-rose-600">Failed to get data</p>}
          </div>
          <div className="rounded-md border max-h-[280px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Name</TableHead>
                  <TableHead className="text-left">Description</TableHead>
                  <TableHead className="text-left">Slug</TableHead>
                  <TableHead className="text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appMenuItems?.appMenuItemsData.map((menuItem) => {
                  const isAlreadyMapped = roleAppMenuItems?.find(
                    (item) => item.appMenuItemId === menuItem.id
                  );

                  return (
                    <TableRow key={menuItem.id}>
                      <TableCell>{menuItem.name}</TableCell>
                      <TableCell>{menuItem.description}</TableCell>
                      <TableCell>{menuItem.slug}</TableCell>
                      <TableCell>
                        <Button
                          variant={isAlreadyMapped ? "destructive" : "default"}
                          size="sm"
                          className="cursor-pointer"
                          disabled={isLoading}
                          onClick={() =>
                            handleMapAppMenuItem(
                              Boolean(isAlreadyMapped),
                              menuItem.id
                            )
                          }
                        >
                          {isAlreadyMapped ? "UnMap" : "Map"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!appMenuItems?.appMenuItemsData.length && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <TriangleAlert className="h-4 w-4" /> No App Selected
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
