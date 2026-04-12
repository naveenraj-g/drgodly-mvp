import { InputParseError } from "@/modules/shared/entities/errors/commonError";
import { getUserPreferencesValidateSchema } from "@/modules/shared/schemas/userPreferences/userPreferencesValidationSchema";
import { getUserPreferencesUseCase } from "../../application/useCases/getUserPreferences.useCase";
import { TUserPreference } from "@/modules/shared/entities/models/userPreferences/userPreferences";

function presenter(userPreferences: TUserPreference) {
  return userPreferences;
}

export type TGetUserPreferencesControllerOutput = ReturnType<typeof presenter>;

export async function getUserPreferencesController(
  input: any
): Promise<TGetUserPreferencesControllerOutput | null> {
  const { data, error: inputParseError } =
    await getUserPreferencesValidateSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.message, {
      cause: inputParseError,
    });
  }

  const userPreferences = await getUserPreferencesUseCase(data.userId);

  if (!userPreferences) {
    return null;
  }

  return presenter(userPreferences);
}
