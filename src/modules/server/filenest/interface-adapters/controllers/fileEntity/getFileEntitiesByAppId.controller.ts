import { TFileEntitiesSchema } from "../../../../../shared/entities/models/filenest/fileEntity";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { GetFileEntitiesByAppIdValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { getFileEntitiesByAppIdUseCase } from "../../../application/useCases/fileEntity/getFileEntitiesByAppId.useCase";

function presenter(data: TFileEntitiesSchema) {
  return data;
}
export type TGetFileEntitiesByAppIdControllerOutput = ReturnType<
  typeof presenter
>;

export async function getFileEntitiesByAppIdController(input: any) {
  const { data, error: inputParseError } =
    await GetFileEntitiesByAppIdValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const entities = await getFileEntitiesByAppIdUseCase(data);
  return presenter(entities);
}
