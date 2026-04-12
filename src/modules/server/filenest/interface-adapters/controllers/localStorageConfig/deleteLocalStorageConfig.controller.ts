import { TLocalStorageConfigSchema } from "../../../../../shared/entities/models/filenest/localStorage";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { DeleteLocalStorageValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { deleteLocalStorageConfigUseCase } from "../../../application/useCases/localStorageConfig/deleteLocalStorageConfig.useCase";

function presenter(data: TLocalStorageConfigSchema) {
  return data;
}
export type TDeleteLocalStorageConfigControllerOutput = ReturnType<
  typeof presenter
>;

export async function deleteLocalStorageConfigController(input: any) {
  const { data, error: inputParseError } =
    await DeleteLocalStorageValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const localStorageConfig = await deleteLocalStorageConfigUseCase(data);
  return presenter(localStorageConfig);
}
