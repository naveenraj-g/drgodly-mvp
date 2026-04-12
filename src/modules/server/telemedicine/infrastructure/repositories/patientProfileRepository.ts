import { injectable } from "inversify";
import { IPatientProfileRepository } from "../../application/repositories/patientProfileRepository.interface";
import { prismaTelemedicine } from "../../../prisma/prisma";
import {
  PatientInitialProfileSchema,
  PatientPersonalDetailsSchema,
  PatientWithPersonalProfileSchema,
  TPatientCreateOrUpdatePatientProfile,
  TPatientInitialProfile,
  TPatientPersonalDetails,
  TPatientWithPersonalProfile,
} from "../../../../shared/entities/models/telemedicine/patientProfile";
import { OperationError } from "../../../../shared/entities/errors/commonError";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";

@injectable()
export class PatientProfileRepository implements IPatientProfileRepository {
  constructor() {}

  async createPatientInitialProfile(
    orgId: string,
    userId: string,
    createdBy: string,
    isABHAPatientProfile: boolean
  ): Promise<TPatientInitialProfile> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "createPatientInitialProfileRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    if (!orgId || !userId) {
      throw new Error(
        "Missing organization or user ID while creating profile."
      );
    }

    try {
      const initialPatientProfile = await prismaTelemedicine.patient.create({
        data: {
          orgId,
          userId,
          isABHAPatientProfile,
          createdBy,
          updatedBy: createdBy,
        },
      });

      const data = await PatientInitialProfileSchema.parseAsync(
        initialPatientProfile
      );

      // Success log
      logOperation("success", {
        name: "createPatientInitialProfileRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "createPatientInitialProfileRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async getPatientWithPersonalProfile(
    orgId: string,
    userId: string
  ): Promise<TPatientWithPersonalProfile | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getPatientWithPersonalProfileRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const patientWithPersonalProfile =
        await prismaTelemedicine.patient.findUnique({
          where: {
            orgId_userId: {
              orgId,
              userId,
            },
          },
          include: {
            personal: true,
          },
        });

      if (!patientWithPersonalProfile) {
        return null;
      }

      const data = await PatientWithPersonalProfileSchema.parseAsync(
        patientWithPersonalProfile
      );

      // Success log
      logOperation("success", {
        name: "getPatientWithPersonalProfileRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getPatientWithPersonalProfileRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async createPatientPersonalDetails(
    createData: TPatientCreateOrUpdatePatientProfile
  ): Promise<TPatientPersonalDetails> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "createPatientPersonalDetailsRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { id, operationBy, ...rest } = createData;

    if (id) {
      throw new Error("Failed to create patient profile.");
    }

    if (!rest.orgId || !rest.patientId) {
      throw new Error(
        "Missing organization or patient ID while creating profile."
      );
    }

    try {
      const patientPersonalDetails =
        await prismaTelemedicine.patientPersonalDetail.create({
          data: {
            ...rest,
            createdBy: operationBy,
            updatedBy: operationBy,
          },
        });

      const data = await PatientPersonalDetailsSchema.parseAsync(
        patientPersonalDetails
      );

      // Success log
      logOperation("success", {
        name: "createPatientPersonalDetailsRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "createPatientPersonalDetailsRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async updatePatientPersonalDetails(
    updateData: TPatientCreateOrUpdatePatientProfile
  ): Promise<TPatientPersonalDetails> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "updatePatientPersonalDetailsRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { id, orgId, patientId, operationBy, ...rest } = updateData;

    if (!id || !orgId || !patientId) {
      throw new Error("Failed to update patient profile.");
    }

    try {
      const patientPersonalDetails =
        await prismaTelemedicine.patientPersonalDetail.update({
          where: {
            id: id,
            orgId,
            patientId,
          },
          data: {
            ...rest,
            updatedBy: operationBy,
          },
        });

      const data = await PatientPersonalDetailsSchema.parseAsync(
        patientPersonalDetails
      );

      // Success log
      logOperation("success", {
        name: "updatePatientPersonalDetailsRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "updatePatientPersonalDetailsRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }
}
