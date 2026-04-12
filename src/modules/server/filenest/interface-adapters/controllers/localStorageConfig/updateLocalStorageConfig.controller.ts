import { TLocalStorageConfigSchema } from "../../../../../shared/entities/models/filenest/localStorage";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { UpdateLocalStorageValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { updateLocalStorageConfigUseCase } from "../../../application/useCases/localStorageConfig/updateLocalStorageConfig.useCase";

function presenter(data: TLocalStorageConfigSchema) {
  return data;
}
export type TUpdateLocalStorageConfigControllerOutput = ReturnType<
  typeof presenter
>;

export async function updateLocalStorageConfigController(input: any) {
  const { data, error: inputParseError } =
    await UpdateLocalStorageValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const localStorageConfig = await updateLocalStorageConfigUseCase(data);
  return presenter(localStorageConfig);
}
