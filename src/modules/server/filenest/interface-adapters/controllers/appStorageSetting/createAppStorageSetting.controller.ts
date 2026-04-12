import { TAppStorageSettingSchema } from "../../../../../shared/entities/models/filenest/appStorageSettings";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { CreateAppStorageSettingValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { createAppStorageSettingUseCase } from "../../../application/useCases/appStorageSetting/createAppStorageSetting.useCase";

function presenter(data: TAppStorageSettingSchema) {
  return data;
}
export type TCreateAppStorageSettingControllerOutput = ReturnType<
  typeof presenter
>;

export async function createAppStorageSettingController(input: any) {
  const { data, error: inputParseError } =
    await CreateAppStorageSettingValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const setting = await createAppStorageSettingUseCase(data);
  return presenter(setting);
}
