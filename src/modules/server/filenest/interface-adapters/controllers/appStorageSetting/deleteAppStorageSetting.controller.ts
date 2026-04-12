import { TAppStorageSettingSchema } from "../../../../../shared/entities/models/filenest/appStorageSettings";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { DeleteAppStorageSettingValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { deleteAppStorageSettingUseCase } from "../../../application/useCases/appStorageSetting/deleteAppStorageSetting.useCase";

function presenter(data: TAppStorageSettingSchema) {
  return data;
}
export type TDeleteAppStorageSettingControllerOutput = ReturnType<
  typeof presenter
>;

export async function deleteAppStorageSettingController(input: any) {
  const { data, error: inputParseError } =
    await DeleteAppStorageSettingValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const setting = await deleteAppStorageSettingUseCase(data);
  return presenter(setting);
}
