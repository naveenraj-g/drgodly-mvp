import { injectable } from "inversify";
import { IOrgAccessCheckRepository } from "../../application/repositories/orgAccessCheckRepository.interface";
import { OperationError } from "../../../../shared/entities/errors/commonError";
import { prismaTelemedicine } from "../../../prisma/prisma";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";

injectable();
export class OrgAccessCheckRepository implements IOrgAccessCheckRepository {
  constructor() {}

  async isDoctorInOrg(doctorId: string, orgId: string): Promise<boolean> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "isDoctorInOrgRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      if (!doctorId || !orgId) {
        logOperation("success", {
          name: "isDoctorInOrgRepository",
          startTimeMs,
          context: { operationId, reason: "empty-ids" },
        });
        return false;
      }

      const doctor = await prismaTelemedicine.doctor.findUnique({
        where: {
          id: doctorId,
        },
        select: {
          orgId: true,
        },
      });

      // Success log
      logOperation("success", {
        name: "isDoctorInOrgRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return !!doctor && doctor.orgId === orgId;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "isDoctorInOrgRepository",
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
