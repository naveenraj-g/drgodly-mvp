import { TLocalStorageConfigSchema } from "../../../../../shared/entities/models/filenest/localStorage";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { CreateLocalStorageValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { createLocalStorageConfigUseCase } from "../../../application/useCases/localStorageConfig/createLocalStorageConfig.useCase";

function presenter(data: TLocalStorageConfigSchema) {
  return data;
}
export type TCreateLocalStorageConfigControllerOutput = ReturnType<
  typeof presenter
>;

export async function createLocalStorageConfigController(input: any) {
  const { data, error: inputParseError } =
    await CreateLocalStorageValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const localStorageConfig = await createLocalStorageConfigUseCase(data);
  return presenter(localStorageConfig);
}
