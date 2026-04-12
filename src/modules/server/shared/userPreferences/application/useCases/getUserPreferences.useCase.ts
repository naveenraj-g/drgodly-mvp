import { TUserPreference } from "@/modules/shared/entities/models/userPreferences/userPreferences";
import { getSharedInjection } from "../../../di/container";

export async function getUserPreferencesUseCase(
  userId: string
): Promise<TUserPreference | null> {
  const userPreferencesRepository = getSharedInjection(
    "IUserPreferencesRepository"
  );
  const userPreferences = await userPreferencesRepository.getUserPreferences(
    userId
  );

  return userPreferences;
}
