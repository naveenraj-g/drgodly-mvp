"use server";

import {
  mapRbacUserOrganizationRoleController,
  getRbacDatasController,
} from "@/modules/server/admin/interface-adapters/controllers/rbac";
import { unmapRbacUserOrganizationRoleController } from "@/modules/server/admin/interface-adapters/controllers/rbac/unmapRbacUserOrganizationRole.controller";
import { TRbac, TRbacDatas } from "@/modules/shared/entities/models/admin/rbac";
import { MapOrUnMapRbacUserOrgRoleValidationSchema } from "@/modules/shared/schemas/admin/rbacValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getRbacDatas = createServerAction().handler(async () => {
  return await withMonitoring<TRbacDatas>(
    "getRbacDatas",
    getRbacDatasController,
    {
      operationErrorMessage: "Failed to map role to the user.",
    }
  );
});

export const mapRbacUserOrganizationRole = createServerAction()
  .input(MapOrUnMapRbacUserOrgRoleValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TRbac>(
      "mapRbacUserOrganizationRole",
      () => mapRbacUserOrganizationRoleController(input),
      {
        url: "/bezs/admin/rbac",
        revalidatePath: true,
        operationErrorMessage: "Failed to map organization and role to user.",
      }
    );
  });

export const unmapRbacUserOrganizationRole = createServerAction()
  .input(MapOrUnMapRbacUserOrgRoleValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TRbac>(
      "unmapRbacUserOrganizationRole",
      () => unmapRbacUserOrganizationRoleController(input),
      {
        url: "/bezs/admin/rbac",
        revalidatePath: true,
        operationErrorMessage: "Failed to unmap organization and role to user.",
      }
    );
  });
