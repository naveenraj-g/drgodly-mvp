"use server";

import {
  createOrganizationController,
  deleteOrganizationController,
  getOrganizationsController,
  updateOrganizationController,
} from "@/modules/server/admin/interface-adapters/controllers/organization";
import {
  TOrganization,
  TOrganizationsData,
} from "@/modules/shared/entities/models/admin/organization";
import {
  CreateOrganizationFormSchema,
  DeleteOrganizationFormSchema,
  UpdateOrganizationFormSchema,
} from "@/modules/shared/schemas/admin/organizationValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getAllOrganizationsData = createServerAction().handler(
  async () => {
    return await withMonitoring<TOrganizationsData>(
      "getAllOrganizationsData",
      getOrganizationsController,
      {
        operationErrorMessage: "Failed to get organizations.",
      }
    );
  }
);

export const createOrganization = createServerAction()
  .input(CreateOrganizationFormSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TOrganization>(
      "createOrganization",
      () => createOrganizationController(input),
      {
        url: "/bezs/admin/manage-organizations",
        revalidatePath: true,
        operationErrorMessage: "Failed to create organization.",
      }
    );
  });

export const editOrganization = createServerAction()
  .input(UpdateOrganizationFormSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TOrganization>(
      "editOrganization",
      () => updateOrganizationController(input),
      {
        url: "/bezs/admin/manage-organizations",
        revalidatePath: true,
        operationErrorMessage: "Failed to edit organization.",
      }
    );
  });

export const deleteOrganization = createServerAction()
  .input(DeleteOrganizationFormSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TOrganization>(
      "deleteOrganization",
      () => deleteOrganizationController(input),
      {
        url: "/bezs/admin/manage-organizations",
        revalidatePath: true,
        operationErrorMessage: "Failed to delete organization.",
      }
    );
  });
