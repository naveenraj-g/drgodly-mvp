"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { unmapRbacUserOrganizationRole } from "../../server-actions/rbac-actions";
import { useTranslations } from "next-intl";

export function RbacUnmap({
  orgId,
  roleId,
  userId,
}: {
  orgId: string;
  roleId: string;
  userId: string;
}) {
  const t = useTranslations("admin.rbac.unmap");

  const { execute, isPending } = useServerAction(
    unmapRbacUserOrganizationRole,
    {
      onSuccess({ data }) {
        toast.success(`${data.role.name} role unmapped.`);
      },
      onError({ err }) {
        toast.error("An error occurred!", {
          description: err.message,
        });
      },
    }
  );

  async function unMapUser({
    orgId,
    roleId,
    userId,
  }: {
    orgId: string;
    roleId: string;
    userId: string;
  }) {
    await execute({ organizationId: orgId, roleId, userId });
  }

  return (
    <Button
      className="cursor-pointer"
      size="sm"
      variant="destructive"
      onClick={() =>
        unMapUser({
          orgId,
          roleId,
          userId,
        })
      }
      disabled={isPending}
    >
      {t("button")}
    </Button>
  );
}
