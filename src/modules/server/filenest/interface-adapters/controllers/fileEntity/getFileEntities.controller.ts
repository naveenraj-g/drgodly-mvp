import { TFileEntitiesSchema } from "../../../../../shared/entities/models/filenest/fileEntity";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { GetFileEntitiesValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { getFileEntitiesUseCase } from "../../../application/useCases/fileEntity/getFileEntities.useCase";

function presenter(data: TFileEntitiesSchema) {
  return data;
}
export type TGetFileEntitiesControllerOutput = ReturnType<typeof presenter>;

export async function getFileEntitiesController(
  input: any
): Promise<TGetFileEntitiesControllerOutput> {
  const { data, error: inputParseError } =
    await GetFileEntitiesValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const entities = await getFileEntitiesUseCase(data);
  return presenter(entities);
}
