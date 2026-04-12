import { TAppStorageSettingsSchema } from "../../../../../shared/entities/models/filenest/appStorageSettings";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { GetAppStorageSettingsValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { getAppStorageSettingsUseCase } from "../../../application/useCases/appStorageSetting/getAppStorageSettings.useCase";

function presenter(data: TAppStorageSettingsSchema) {
  return data;
}
export type TGetAppStorageSettingsControllerOutput = ReturnType<
  typeof presenter
>;

export async function getAppStorageSettingsController(input: any) {
  const { data, error: inputParseError } =
    await GetAppStorageSettingsValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const settings = await getAppStorageSettingsUseCase(data);
  return presenter(settings);
}
