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
import { useSession } from "../../auth/betterauth/auth-client";
import { TOrganizationApps } from "@/modules/shared/entities/models/admin/organizationApp";
import {
  addAppToOrganization,
  getOrganizationAppsData,
  removeAppFromOrganization,
} from "../server-actions/organizationApp-actions";
import { getAllAppsData } from "../server-actions/app-actions";
import { TAppDatas } from "@/modules/shared/entities/models/admin/app";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AddAppToOrganizationValidationFormSchema,
  TAddAppToOrganizationValidationForm,
} from "@/modules/shared/schemas/admin/organizationAppValidationSchema";

export const ManageOrgAppsModal = () => {
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

  const [appsData, setAppsData] = useState<TAppDatas | null>(null);
  const [organizationAppsData, setOrganizationAppsData] =
    useState<TOrganizationApps | null>(null);

  const isModalOpen = isOpen && modalType === "manageOrgApps";

  const {
    execute: getOrganizationApps,
    isPending,
    error,
  } = useServerAction(getOrganizationAppsData, {
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

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

  const { execute: addAppToOrg, isPending: isAddingAppToOrg } = useServerAction(
    addAppToOrganization,
    {
      onSuccess() {
        toast.success(`App added to organization`);
      },
      onError({ err }) {
        toast.error("An Error Occurred!", {
          description: err.message,
        });
      },
    }
  );

  const { execute: removeAppFromOrg, isPending: isRemovingAppFromOrg } =
    useServerAction(removeAppFromOrganization, {
      onSuccess() {
        toast.success(`User removed from organization`);
      },
      onError({ err }) {
        toast.error("An Error Occurred!", {
          description: err.message,
        });
      },
    });

  const form = useForm<TAddAppToOrganizationValidationForm>({
    resolver: zodResolver(AddAppToOrganizationValidationFormSchema),
    defaultValues: {
      appId: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    (async () => {
      if (isModalOpen && organizationData) {
        const [data] = await getApps();

        setAppsData(data);
      }
    })();
  }, [getApps, isModalOpen, organizationData]);

  useEffect(() => {
    (async () => {
      if (isModalOpen && organizationData && organizationData.id) {
        const [data] = await getOrganizationApps({
          organizationId: organizationData.id,
        });

        setOrganizationAppsData(data);
      }
    })();
  }, [triggerRefetch, isModalOpen, getOrganizationApps, organizationData]);

  async function onSubmitAddApp(values: TAddAppToOrganizationValidationForm) {
    if (!session) {
      return;
    }

    if (!organizationData || !organizationData.id) {
      toast.error("No organization data found");
      return;
    }

    await addAppToOrg({
      organizationId: organizationData.id,
      appId: values.appId,
    });
    form.reset();
    incrementTriggerRefetch();
  }

  async function handleRemoveApp(organizationId: string, appId: string) {
    if (!session) {
      return;
    }

    await removeAppFromOrg({ organizationId, appId });
    incrementTriggerRefetch();
  }

  function handleCloseModal() {
    form.reset();
    setAppsData(null);
    setOrganizationAppsData(null);
    closeModal();
  }

  const isLoading =
    isSubmitting ||
    isAddingAppToOrg ||
    isGetAppsPending ||
    isRemovingAppFromOrg ||
    isPending;

  const orgAppIds = new Set(
    organizationAppsData?.organizationApps.map((d) => d.appId)
  );
  const filteredApps = appsData?.appDatas.filter(
    (app) => !orgAppIds.has(app.id)
  );

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
            <form onSubmit={form.handleSubmit(onSubmitAddApp)} className="mb-6">
              <div className="flex flex-col xs:flex-row gap-4 items-center">
                <FormField
                  control={form.control}
                  name="appId"
                  render={({ field }) => (
                    <FormItem className="xs:flex-1 w-full">
                      {/* <FormLabel>Username</FormLabel> */}
                      <Select
                        onValueChange={field.onChange}
                        key={filteredApps?.length}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="No apps selected" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {filteredApps?.length == 0 && (
                              <SelectLabel>No apps</SelectLabel>
                            )}
                            {filteredApps?.map((app) => (
                              <SelectItem value={app.id} key={app.id}>
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
                <Button
                  type="submit"
                  className="cursor-pointer xs:self-start w-full xs:w-fit"
                  disabled={isSubmitting}
                >
                  Map App
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="space-y-4 overflow-x-auto">
          <div className="flex gap-4 items-center">
            <h3 className="font-semibold">
              Organization Apps ({organizationAppsData?.total ?? 0})
            </h3>
            {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
            {error && (
              <p className="text-rose-600">{error && "Failed to get data"}</p>
            )}
          </div>
          <div className="rounded-md border max-h-[280px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Name</TableHead>
                  <TableHead className="text-left">Slug</TableHead>
                  <TableHead className="text-left">Type</TableHead>
                  <TableHead className="text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizationAppsData?.organizationApps.map((data) => (
                  <TableRow key={data.appId}>
                    <TableCell>{data.app.name}</TableCell>
                    <TableCell>{data.app.slug}</TableCell>
                    <TableCell>{data.app.type}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 px-2"
                        disabled={isLoading}
                        onClick={() =>
                          handleRemoveApp(data.organizationId, data.appId)
                        }
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!organizationAppsData?.organizationApps.length && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <TriangleAlert className="h-4 w-4" /> No Apps
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
