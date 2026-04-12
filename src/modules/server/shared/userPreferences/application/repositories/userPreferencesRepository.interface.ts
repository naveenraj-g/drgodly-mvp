import {
  TUpdateUserPreference,
  TUserPreference,
} from "@/modules/shared/entities/models/userPreferences/userPreferences";

export interface IUserPreferencesRepository {
  getUserPreferences(userId: string): Promise<TUserPreference | null>;
  updateUserPreferences(
    fields: TUpdateUserPreference
  ): Promise<TUserPreference>;
}
