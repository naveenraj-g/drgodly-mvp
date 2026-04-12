import { prismaMain } from "@/modules/server/prisma/prisma";
import { OperationError } from "@/modules/shared/entities/errors/commonError";
import { IUserPreferencesRepository } from "../../application/repositories/userPreferencesRepository.interface";
import { injectable } from "inversify";
import {
  TUpdateUserPreference,
  TUserPreference,
  UserPreferenceSchema,
} from "@/modules/shared/entities/models/userPreferences/userPreferences";

@injectable()
export class UserPreferencesRepository implements IUserPreferencesRepository {
  async getUserPreferences(userId: string): Promise<TUserPreference | null> {
    try {
      const userPreferences = await prismaMain.userPreference.findUnique({
        where: { userId },
      });

      if (!userPreferences) {
        return null;
      }

      return await UserPreferenceSchema.parseAsync(userPreferences);
    } catch (error) {
      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async updateUserPreferences(
    fields: TUpdateUserPreference
  ): Promise<TUserPreference> {
    const { id, userId, ...datas } = fields;

    try {
      const userPreferences = await prismaMain.userPreference.update({
        where: { userId, id },
        data: datas,
      });

      return await UserPreferenceSchema.parseAsync(userPreferences);
    } catch (error) {
      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }
}
