import { TFileEntitySchema } from "../../../../../shared/entities/models/filenest/fileEntity";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { UpdateFileEntityValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { updateFileEntityUseCase } from "../../../application/useCases/fileEntity/updateFileEntity.useCase";

function presenter(data: TFileEntitySchema) {
  return data;
}
export type TUpdateFileEntityControllerOutput = ReturnType<typeof presenter>;

export async function updateFileEntityController(input: any) {
  const { data, error: inputParseError } =
    await UpdateFileEntityValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const entity = await updateFileEntityUseCase(data);
  return presenter(entity);
}
