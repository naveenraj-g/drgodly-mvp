import {
  TUpdateUserPreference,
  TUserPreference,
} from "@/modules/shared/entities/models/userPreferences/userPreferences";
import { getSharedInjection } from "../../../di/container";

export async function updateUserPreferencesUseCase(
  data: TUpdateUserPreference
): Promise<TUserPreference> {
  const userPreferencesRepository = getSharedInjection(
    "IUserPreferencesRepository"
  );
  const userPreferences = await userPreferencesRepository.updateUserPreferences(
    data
  );

  return userPreferences;
}
