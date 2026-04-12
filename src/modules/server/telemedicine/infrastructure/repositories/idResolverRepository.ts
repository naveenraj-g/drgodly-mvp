import { injectable } from "inversify";
import { IIdResolverRepository } from "../../application/repositories/idResolverRepository.interface";
import { OperationError } from "../../../../shared/entities/errors/commonError";
import { prismaTelemedicine } from "../../../prisma/prisma";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";

injectable();
export class IdResolverRepository implements IIdResolverRepository {
  constructor() {}

  async resolveDoctorIdByUserIdAndOrgId(
    userId: string,
    orgId: string
  ): Promise<string | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "resolveDoctorIdByUserIdAndOrgIdRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      // guard: both must be present and non-empty
      if (!userId || !orgId) {
        logOperation("success", {
          name: "resolveDoctorIdByUserIdAndOrgIdRepository",
          startTimeMs,
          context: { operationId, reason: "empty-ids", found: false },
        });
        return null;
      }

      const doctorId = await prismaTelemedicine.doctor.findUnique({
        where: {
          orgId_userId: {
            orgId,
            userId,
          },
        },
        select: {
          id: true,
        },
      });

      if (!doctorId) {
        logOperation("success", {
          name: "resolveDoctorIdByUserIdAndOrgIdRepository",
          startTimeMs,
          context: { operationId, reason: "not-found", found: false },
        });
        return null;
      }

      // Success log
      logOperation("success", {
        name: "resolveDoctorIdByUserIdAndOrgIdRepository",
        startTimeMs,
        context: {
          operationId,
          found: true,
        },
      });

      return doctorId.id;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "resolveDoctorIdByUserIdAndOrgIdRepository",
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

  async resolvePatientIdByUserIdAndOrgId(
    userId: string,
    orgId: string
  ): Promise<string | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "resolvePatientIdByUserIdAndOrgIdRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      // guard: both must be present and non-empty
      if (!userId || !orgId) {
        logOperation("success", {
          name: "resolvePatientIdByUserIdAndOrgIdRepository",
          startTimeMs,
          context: { operationId, reason: "empty-ids", found: false },
        });
        return null;
      }

      const patientId = await prismaTelemedicine.patient.findUnique({
        where: {
          orgId_userId: {
            orgId,
            userId,
          },
        },
        select: {
          id: true,
        },
      });

      if (!patientId) {
        logOperation("success", {
          name: "resolvePatientIdByUserIdAndOrgIdRepository",
          startTimeMs,
          context: { operationId, reason: "not-found", found: false },
        });
        return null;
      }

      // Success log
      logOperation("success", {
        name: "resolvePatientIdByUserIdAndOrgIdRepository",
        startTimeMs,
        context: {
          operationId,
          found: true,
        },
      });

      return patientId.id;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "resolveDoctorIdByUserIdAndOrgIdRepository",
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
