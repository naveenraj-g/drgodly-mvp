"use server";

import {
  getRoleAppMenuItemsController,
  mapAppMenuItemsToRoleController,
  unmapAppMenuItemsToRoleController,
} from "@/modules/server/admin/interface-adapters/controllers/roleAppMenuItem";
import {
  TRoleAppMenuItem,
  TRoleAppMenuItemsData,
} from "@/modules/shared/entities/models/admin/roleAppMenuItem";
import {
  MapOrUnmapAppMenuItemToRoleValidateSchema,
  getRoleAppMenuItemsValidateSchema,
} from "@/modules/shared/schemas/admin/roleAppMenuItemValidatorSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getRoleAppMenuItems = createServerAction()
  .input(getRoleAppMenuItemsValidateSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TRoleAppMenuItemsData>(
      "getRoleAppMenuItems",
      () => getRoleAppMenuItemsController(input),
      {
        operationErrorMessage: "Failed to get app menu items.",
      }
    );
  });

export const mapAppMenuItemsToRole = createServerAction()
  .input(MapOrUnmapAppMenuItemToRoleValidateSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TRoleAppMenuItem>(
      "mapAppMenuItemsToRole",
      () => mapAppMenuItemsToRoleController(input),
      {
        operationErrorMessage: "Failed to map app menu item.",
      }
    );
  });

export const unmapAppMenuItemsToRole = createServerAction()
  .input(MapOrUnmapAppMenuItemToRoleValidateSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TRoleAppMenuItem>(
      "unmapAppMenuItemsToRole",
      () => unmapAppMenuItemsToRoleController(input),
      {
        operationErrorMessage: "Failed to unmap app menu item.",
      }
    );
  });
