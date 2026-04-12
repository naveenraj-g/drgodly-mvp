import { InputParseError } from "@/modules/shared/entities/errors/commonError";
import {
  TUserPreference,
  updateUserPreferenceSchema,
} from "@/modules/shared/entities/models/userPreferences/userPreferences";
import { updateUserPreferencesUseCase } from "../../application/useCases/updateUserPreferences.useCase";

function presenter(userPreferences: TUserPreference) {
  return userPreferences;
}

export type TGetUserPreferencesControllerOutput = ReturnType<typeof presenter>;

export async function updateUserPreferencesController(
  input: any
): Promise<TGetUserPreferencesControllerOutput> {
  const { data, error: inputParseError } =
    await updateUserPreferenceSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.message, {
      cause: inputParseError,
    });
  }

  const userPreferences = await updateUserPreferencesUseCase(data);

  return presenter(userPreferences);
}
