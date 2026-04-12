"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TOrganization } from "@/modules/shared/entities/models/admin/organization";
import { TRole } from "@/modules/shared/entities/models/admin/role";
import { useServerAction } from "zsa-react";
import { getOrganizationMembersData } from "../../server-actions/organizationMember-action";
import { TOrganizationMemberAndUser } from "@/modules/shared/entities/models/admin/organizationMember";
import { mapRbacUserOrganizationRole } from "../../server-actions/rbac-actions";
import { useTranslations } from "next-intl";
import { FormInput } from "@/modules/shared/custom-form-fields";

const formSchema = z.object({
  orgId: z.string().min(1, "Organization is required"),
  userId: z.string().min(1, "User is required"),
  roleId: z.string().min(1, "Role is required"),
  defaultRedirectUrl: z.string().min(1, "Default redirect URL is required"),
});

type FormDataType = z.infer<typeof formSchema>;

type Props = {
  allOrgs?: TOrganization[];
  allRoles?: TRole[];
};

export function RBACOrgUserRoleMap({ allOrgs = [], allRoles = [] }: Props) {
  const t = useTranslations("admin.rbac.map");
  const [selectedOrgUsers, setSelectedOrgUsers] = useState<
    TOrganizationMemberAndUser[] | undefined
  >([]);

  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgId: "",
      userId: "",
      roleId: "",
      defaultRedirectUrl: "/bezs",
    },
  });

  const selectedOrgId = form.watch("orgId");

  const { execute, isPending } = useServerAction(getOrganizationMembersData, {
    onError({ err }) {
      toast.error("An error occurred!", {
        description: err.message,
      });
    },
  });

  const { execute: mapRbac, isPending: isMapRbacPending } = useServerAction(
    mapRbacUserOrganizationRole,
    {
      onSuccess({ data }) {
        toast.success(`${data.role.name} role mapped.`);
        form.reset();
        setSelectedOrgUsers([]);
      },
      onError({ err }) {
        toast.error("An error occurred!", {
          description: err.message,
        });
      },
    }
  );

  useEffect(() => {
    if (!selectedOrgId || selectedOrgId === "") return;

    (async () => {
      const [orgMembers] = await execute({ organizationId: selectedOrgId });
      setSelectedOrgUsers(orgMembers?.organizationMembersAndUsers);
    })();
  }, [execute, selectedOrgId]);

  const onSubmit = async (values: FormDataType) => {
    await mapRbac({
      organizationId: values.orgId,
      roleId: values.roleId,
      userId: values.userId,
      defaultRedirectUrl: values.defaultRedirectUrl,
    });
  };

  const isLoading = isPending || isMapRbacPending;

  return (
    <Card className="p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="orgId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.organization.label")}</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(val)}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        placeholder={t("fields.organization.placeholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {allOrgs.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-12">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.user.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedOrgUsers?.length || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          placeholder={t("fields.user.placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {selectedOrgUsers?.map(({ user }) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} (@{user.username})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.role.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          placeholder={t("fields.role.placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {allRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormInput
              control={form.control}
              name="defaultRedirectUrl"
              label="Default Login Redirect URL"
              placeholder="e.g - /bezs/telemedicine/patient"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? (
              <>
                {t("buttons.mapping")}{" "}
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              </>
            ) : (
              t("buttons.map")
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
