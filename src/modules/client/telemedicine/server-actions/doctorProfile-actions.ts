"use server";

import {
  createDoctorInitialProfileController,
  getAllDoctorsDataController,
  getDoctorDataByIdController,
  deleteDoctorProfileController,
  createorUpdateDoctorPersonalDetailsController,
  createorUpdateDoctorQualificationDetailsController,
  createorUpdateDoctorWorkDetailsController,
  createorUpdateDoctorConcentController,
  submitDoctorFullProfileController,
  getDoctorProfileByHPRIdController,
} from "@/modules/server/telemedicine/interface-adapters/controllers/doctorProfile";
import { getDoctorDataByUserIdController } from "@/modules/server/telemedicine/interface-adapters/controllers/doctorProfile/getDoctorDataByUserId.controller";
import {
  TDoctor,
  TDoctorDatas,
  TDoctorInitialProfile,
  TDoctorPersonalDetails,
  TDoctorQualifications,
  TDoctorWorkDetails,
  TDoctorConcent,
} from "@/modules/shared/entities/models/telemedicine/doctorProfile";
import {
  getAllDoctorSchema,
  CreateDoctorInitialProfileSchema,
  DeleteDoctorProfileSchema,
  DoctorProfileCreateOrUpdateValidationSchema,
  DoctorQualificationCreateOrUpdateValidation,
  DoctorWorkDetailCreateOrUpdateValidation,
  DoctorConcentCreateOrUpdateValidation,
  SubmitDoctorFullProfileValidationSchema,
  GetDoctorByUserIdSchema,
  CreateDoctorByHPRidSchema,
} from "@/modules/shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getAllDoctorsData = createServerAction()
  .input(getAllDoctorSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctorDatas>(
      "getAllDoctorsData",
      () => getAllDoctorsDataController(input),
      {
        operationErrorMessage: "Failed to get doctor datas.",
      }
    );
  });

export const createDoctorInitialProfile = createServerAction()
  .input(CreateDoctorInitialProfileSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctorInitialProfile>(
      "createDoctorInitialProfile",
      () => createDoctorInitialProfileController(input),
      {
        url: "/bezs/telemedicine/admin/manage-doctors",
        revalidatePath: true,
        operationErrorMessage: "Failed to create initial doctor profile.",
      }
    );
  });

export const deleteDoctorProfile = createServerAction()
  .input(DeleteDoctorProfileSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctorInitialProfile>(
      "deleteDoctorProfile",
      () => deleteDoctorProfileController(input),
      {
        url: "/bezs/telemedicine/admin/manage-doctors",
        revalidatePath: true,
        operationErrorMessage: "Failed to delete doctor profile.",
      }
    );
  });

export const getDoctorDataById = createServerAction()
  .input(DeleteDoctorProfileSchema, { skipInputParsing: false })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctor | null>(
      "getDoctorDataById",
      () => getDoctorDataByIdController(input),
      {
        operationErrorMessage: "Failed to get doctor profile.",
      }
    );
  });

export const getDoctorDataByUserId = createServerAction()
  .input(GetDoctorByUserIdSchema, { skipInputParsing: false })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctor | null>(
      "getDoctorDataById",
      () => getDoctorDataByUserIdController(input),
      {
        operationErrorMessage: "Failed to get doctor profile.",
      }
    );
  });

export const createOrUpdateDoctorPersonalDetails = createServerAction()
  .input(DoctorProfileCreateOrUpdateValidationSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctorPersonalDetails>(
      "createOrUpdateDoctorPersonalDetails",
      () => createorUpdateDoctorPersonalDetailsController(input),
      {
        url: `/bezs/telemedicine/admin/manage-doctors`,
        revalidateType: "layout",
        revalidatePath: true,
        operationErrorMessage: `Failed to ${
          input.id ? "update" : "create"
        } doctor personal profile.`,
      }
    );
  });

export const createOrUpdateDoctorQualificationDetails = createServerAction()
  .input(DoctorQualificationCreateOrUpdateValidation, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctorQualifications>(
      "createOrUpdateDoctorPersonalDetails",
      () => createorUpdateDoctorQualificationDetailsController(input),
      {
        url: `/bezs/telemedicine/admin/manage-doctors`,
        revalidatePath: true,
        revalidateType: "layout",
        operationErrorMessage: `Failed to ${
          input.id ? "update" : "create"
        } doctor profile.`,
      }
    );
  });

export const createOrUpdateDoctorWorkDetails = createServerAction()
  .input(DoctorWorkDetailCreateOrUpdateValidation, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctorWorkDetails>(
      "createOrUpdateDoctorWorkDetails",
      () => createorUpdateDoctorWorkDetailsController(input),
      {
        url: `/bezs/telemedicine/admin/manage-doctors`,
        revalidateType: "layout",
        revalidatePath: true,
        operationErrorMessage: `Failed to ${
          input.id ? "update" : "create"
        } doctor work details.`,
      }
    );
  });

export const createOrUpdateDoctorConcent = createServerAction()
  .input(DoctorConcentCreateOrUpdateValidation, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctorConcent>(
      "createOrUpdateDoctorConcent",
      () => createorUpdateDoctorConcentController(input),
      {
        url: `/bezs/telemedicine/admin/manage-doctors`,
        revalidateType: "layout",
        revalidatePath: true,
        operationErrorMessage: `Failed to ${
          input.id ? "update" : "create"
        } doctor concent.`,
      }
    );
  });

export const submitDoctorFullProfile = createServerAction()
  .input(SubmitDoctorFullProfileValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctor>(
      "submitDoctorFullProfile",
      () => submitDoctorFullProfileController(input),
      {
        url: `/bezs/telemedicine/admin/manage-doctors`,
        revalidateType: "layout",
        revalidatePath: true,
        operationErrorMessage: `Failed to ${
          input.personal.id ||
          input.qualification.id ||
          input.work.id ||
          input.concent.id
            ? "update"
            : "create"
        } doctor profile.`,
      }
    );
  });

export const getDoctorProfileByHPRId = createServerAction()
  .input(CreateDoctorByHPRidSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<any>(
      "getDoctorProfileByHPRId",
      () => getDoctorProfileByHPRIdController(input),
      {
        // url: `/bezs/telemedicine/admin/manage-doctors`,
        // revalidateType: "layout",
        // revalidatePath: true,
        operationErrorMessage: `Failed to get doctor profile.`,
      }
    );
  });
