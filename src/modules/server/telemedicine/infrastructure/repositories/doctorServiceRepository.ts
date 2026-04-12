import { injectable } from "inversify";
import { IDoctorServiceRepository } from "../../application/repositories/doctorServiceRepository.interface";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import {
  TServiceCreate,
  TServiceUpdate,
  TService,
  TServices,
  ServiceSchema,
  ServicesSchema,
} from "../../../../shared/entities/models/telemedicine/service";
import { OperationError } from "../../../../shared/entities/errors/commonError";
import { prismaTelemedicine } from "../../../prisma/prisma";

injectable();
export class DoctorServiceRepository implements IDoctorServiceRepository {
  constructor() {}

  async createDoctorService(data: TServiceCreate): Promise<TService> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "createServiceRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { operationBy, ...rest } = data;

    try {
      const service = await prismaTelemedicine.service.create({
        data: {
          ...rest,
          createdBy: operationBy,
          updatedBy: operationBy,
        },
      });

      const data = await ServiceSchema.parseAsync(service);

      // Success log
      logOperation("success", {
        name: "createServiceRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "createServiceRepository",
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

  async getDoctorServices(doctorId: string, orgId: string): Promise<TServices> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getServicesRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const service = await prismaTelemedicine.service.findMany({
        where: {
          doctorId,
          orgId,
        },
      });

      const data = await ServicesSchema.parseAsync(service);

      // Success log
      logOperation("success", {
        name: "getServicesRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getServicesRepository",
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

  async getDoctorServiceByIds(
    serviceId: string,
    doctorId: string,
    orgId: string
  ): Promise<TService> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getServiceRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const service = await prismaTelemedicine.service.findUnique({
        where: {
          id: serviceId,
          doctorId,
          orgId,
        },
      });

      const data = await ServiceSchema.parseAsync(service);

      // Success log
      logOperation("success", {
        name: "getServiceRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getServiceRepository",
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

  async updateDoctorService(data: TServiceUpdate): Promise<TService> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "updateServiceRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { operationBy, id, ...rest } = data;

    try {
      const service = await prismaTelemedicine.service.update({
        where: {
          id,
          doctorId: rest.doctorId,
          orgId: rest.orgId,
        },
        data: {
          ...rest,
          updatedBy: operationBy,
        },
      });

      const data = await ServiceSchema.parseAsync(service);

      // Success log
      logOperation("success", {
        name: "updateServiceRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "updateServiceRepository",
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

  async deleteDoctorService(
    serviceId: string,
    doctorId: string,
    orgId: string
  ): Promise<TService> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "deleteServiceRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const service = await prismaTelemedicine.service.delete({
        where: {
          id: serviceId,
          doctorId,
          orgId,
        },
      });

      const data = await ServiceSchema.parseAsync(service);

      // Success log
      logOperation("success", {
        name: "deleteServiceRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "deleteServiceRepository",
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
