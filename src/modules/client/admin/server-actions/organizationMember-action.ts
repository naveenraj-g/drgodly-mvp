"use server";

import {
  addMemberToOrganizationController,
  getOrganizationMembersController,
  removeMemberFromOrganizationController,
} from "@/modules/server/admin/interface-adapters/controllers/organizationMember";
import {
  TOrganizationMemberAndUser,
  TOrganizationMembersAndUsers,
} from "@/modules/shared/entities/models/admin/organizationMember";
import {
  AddMemberToOrganizationValidationSchema,
  GetOrganizationMembersValidationSchema,
  RemoveMemberFromOrganizationValidationSchema,
} from "@/modules/shared/schemas/admin/organizationMemberValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getOrganizationMembersData = createServerAction()
  .input(GetOrganizationMembersValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TOrganizationMembersAndUsers>(
      "getOrganizationMembersData",
      () => getOrganizationMembersController(input),
      {
        operationErrorMessage: "Failed to get org members.",
      }
    );
  });

export const addMemberToOrganization = createServerAction()
  .input(AddMemberToOrganizationValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TOrganizationMemberAndUser>(
      "addMemberToOrganization",
      () => addMemberToOrganizationController(input),
      {
        url: "/bezs/admin/manage-organizations",
        revalidatePath: true,
        operationErrorMessage: "Failed to add org member.",
      }
    );
  });

export const removeMemberFromOrganization = createServerAction()
  .input(RemoveMemberFromOrganizationValidationSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TOrganizationMemberAndUser>(
      "removeMemberFromOrganization",
      () => removeMemberFromOrganizationController(input),
      {
        url: "/bezs/admin/manage-organizations",
        revalidatePath: true,
        operationErrorMessage: "Failed to remove org member.",
      }
    );
  });
