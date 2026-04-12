"use server";

import {
  getRolesController,
  createRoleController,
  updateRoleController,
  deleteRoleController,
} from "@/modules/server/admin/interface-adapters/controllers/role";
import { TRole, TRolesData } from "@/modules/shared/entities/models/admin/role";
import {
  CreateRoleValidationSchema,
  DeleteRoleValidationSchema,
  UpdateRoleValidationSchema,
} from "@/modules/shared/schemas/admin/roleValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getAllRolesData = createServerAction().handler(async () => {
  return await withMonitoring<TRolesData>(
    "getAllRolesData",
    getRolesController,
    {
      operationErrorMessage: "Failed to get roles.",
    }
  );
});

export const createRole = createServerAction()
  .input(CreateRoleValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TRole>(
      "createRole",
      () => createRoleController(input),
      {
        url: "/bezs/admin/manage-roles",
        revalidatePath: true,
        operationErrorMessage: "Failed to create role.",
      }
    );
  });

export const editRole = createServerAction()
  .input(UpdateRoleValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TRole>(
      "editRole",
      () => updateRoleController(input),
      {
        url: "/bezs/admin/manage-roles",
        revalidatePath: true,
        operationErrorMessage: "Failed to edit role.",
      }
    );
  });

export const deleteRole = createServerAction()
  .input(DeleteRoleValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TRole>(
      "deleteRole",
      () => deleteRoleController(input),
      {
        url: "/bezs/admin/manage-roles",
        revalidatePath: true,
        operationErrorMessage: "Failed to delete role.",
      }
    );
  });
