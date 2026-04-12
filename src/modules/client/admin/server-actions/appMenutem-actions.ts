"use server";

import {
  createAppMenuItemController,
  getAppMenuItemsController,
} from "@/modules/server/admin/interface-adapters/controllers/appMenuItem";
import { deleteAppMenuItemController } from "@/modules/server/admin/interface-adapters/controllers/appMenuItem/deleteAppMenuItem.controller";
import { updateAppMenuItemController } from "@/modules/server/admin/interface-adapters/controllers/appMenuItem/updateAppMenuItem.controller";
import {
  AppIdSchema,
  TAppMenuItem,
  TAppMenuItemsData,
} from "@/modules/shared/entities/models/admin/appMenuItem";
import {
  CreateAppMenuItemValidationSchema,
  DeleteAppMenuItemValidationSchema,
  UpdateAppMenuItemValidationSchema,
} from "@/modules/shared/schemas/admin/appMenuItemValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getAppMenuItems = createServerAction()
  .input(AppIdSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TAppMenuItemsData>(
      "getAppMenuItems",
      () => getAppMenuItemsController(input),
      {
        operationErrorMessage: "Failed to get app menu items.",
      }
    );
  });

export const createAppMenuItem = createServerAction()
  .input(CreateAppMenuItemValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TAppMenuItem>(
      "createAppMenuItem",
      () => createAppMenuItemController(input),
      {
        url: "/bezs/admin/manage-apps/manage-menus",
        revalidatePath: true,
        operationErrorMessage: "Failed to create app menu item.",
      }
    );
  });

export const editAppMenuItem = createServerAction()
  .input(UpdateAppMenuItemValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TAppMenuItem>(
      "editAppMenuItem",
      () => updateAppMenuItemController(input),
      {
        url: "/bezs/admin/manage-apps/manage-menus",
        revalidatePath: true,
        operationErrorMessage: "Failed to edit app menu item.",
      }
    );
  });

export const deleteAppMenuItem = createServerAction()
  .input(DeleteAppMenuItemValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TAppMenuItem>(
      "deleteAppMenuItem",
      () => deleteAppMenuItemController(input),
      {
        url: "/bezs/admin/manage-apps/manage-menus",
        revalidatePath: true,
        operationErrorMessage: "Failed to delete app menu item.",
      }
    );
  });
