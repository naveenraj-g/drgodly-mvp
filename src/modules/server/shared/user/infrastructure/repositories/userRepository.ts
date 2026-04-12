import { prismaMain } from "@/modules/server/prisma/prisma";
import { OperationError } from "@/modules/shared/entities/errors/commonError";
import { IUserRepository } from "../../application/repositories/userRepository.interface";
import { injectable } from "inversify";
import {
  TUser,
  TUserUniqueFields,
  TUserUserNameOrEmailAndOrgId,
  UserSchema,
} from "../../entities/models/user";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../../shared/utils/server-logger/log-operation";

@injectable()
export class UserRepository implements IUserRepository {
  constructor() {}

  async getUserById(id: string): Promise<TUser | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getUserByIdRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const user = await prismaMain.user.findUnique({
        where: { id },
      });

      if (!user) {
        // Success log
        logOperation("success", {
          name: "getUserByIdRepository",
          startTimeMs,
          context: {
            operationId,
          },
        });
        return null;
      }

      const data = await UserSchema.parseAsync(user);

      // Success log
      logOperation("success", {
        name: "getUserByIdRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getUserByIdRepository",
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

  async getUserByUniqueFields(
    fields: TUserUniqueFields
  ): Promise<TUser | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getUserByUniqueFieldsRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { email, username } = fields;

    try {
      const user = await prismaMain.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (!user) {
        // Success log
        logOperation("success", {
          name: "getUserByUniqueFieldsRepository",
          startTimeMs,
          context: {
            operationId,
          },
        });
        return null;
      }

      const data = await UserSchema.parseAsync(user);

      // Success log
      logOperation("success", {
        name: "getUserByUniqueFieldsRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getUserByUniqueFieldsRepository",
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

  async isUserInOrg(userId: string, orgId: string): Promise<boolean> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "checkUserInOrgRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const isMember = await prismaMain.member.findFirst({
        where: {
          userId,
          organizationId: orgId,
        },
        select: { id: true },
      });

      if (!isMember) {
        // Success log
        logOperation("success", {
          name: "checkUserInOrgRepository",
          startTimeMs,
          context: {
            operationId,
          },
        });

        return false;
      }

      // Success log
      logOperation("success", {
        name: "checkUserInOrgRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });
      return true;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "checkUserInOrgRepository",
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

  async getUsersByIdAndOrgId(
    userId: string,
    orgId: string
  ): Promise<TUser | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getUsersByIdAndOrgIdRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const user = await prismaMain.user.findUnique({
        where: {
          id: userId,
          members: {
            some: {
              organizationId: orgId,
            },
          },
        },
      });

      if (!user) {
        // Success log
        logOperation("success", {
          name: "getUsersByIdAndOrgIdRepository",
          startTimeMs,
          context: {
            operationId,
          },
        });
        return null;
      }

      const data = await UserSchema.parseAsync(user);

      // Success log
      logOperation("success", {
        name: "getUsersByIdAndOrgIdRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getUsersByIdAndOrgIdRepository",
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

  async getUserByUserNameOrEmailAndOrgId(
    payload: TUserUserNameOrEmailAndOrgId
  ): Promise<TUser | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getUserByUserNameOrEmailAndOrgIdRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { email, username, orgId } = payload;

    try {
      const user = await prismaMain.user.findFirst({
        where: {
          OR: [{ email }, { username }],
          members: {
            some: {
              organizationId: orgId,
            },
          },
        },
      });

      if (!user) {
        // Success log
        logOperation("success", {
          name: "getUserByUserNameOrEmailAndOrgIdRepository",
          startTimeMs,
          context: {
            operationId,
          },
        });
        return null;
      }

      const data = await UserSchema.parseAsync(user);

      // Success log
      logOperation("success", {
        name: "getUserByUserNameOrEmailAndOrgIdRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getUserByUserNameOrEmailAndOrgIdRepository",
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
