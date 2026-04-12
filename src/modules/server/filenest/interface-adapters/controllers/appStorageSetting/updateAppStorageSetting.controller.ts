import { TAppStorageSettingSchema } from "../../../../../shared/entities/models/filenest/appStorageSettings";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { UpdateAppStorageSettingValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { updateAppStorageSettingUseCase } from "../../../application/useCases/appStorageSetting/updateAppStorageSetting.useCase";

function presenter(data: TAppStorageSettingSchema) {
  return data;
}
export type TUpdateAppStorageSettingControllerOutput = ReturnType<
  typeof presenter
>;

export async function updateAppStorageSettingController(input: any) {
  const { data, error: inputParseError } =
    await UpdateAppStorageSettingValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const setting = await updateAppStorageSettingUseCase(data);
  return presenter(setting);
}
