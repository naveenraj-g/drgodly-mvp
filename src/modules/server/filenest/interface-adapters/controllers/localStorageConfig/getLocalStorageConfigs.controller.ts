import { TLocalStorageConfigsSchema } from "../../../../../shared/entities/models/filenest/localStorage";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { GetLocalStorageConfigsValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { getLocalStorageConfigsUseCase } from "../../../application/useCases/localStorageConfig/getLocalStorageConfigs.useCase";

function presenter(data: TLocalStorageConfigsSchema) {
  return data;
}
export type TGetLocalStorageConfigsControllerOutput = ReturnType<
  typeof presenter
>;

export async function getLocalStorageConfigsController(input: any) {
  const { data, error: inputParseError } =
    await GetLocalStorageConfigsValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const localStorageConfigs = await getLocalStorageConfigsUseCase(data);
  return presenter(localStorageConfigs);
}
