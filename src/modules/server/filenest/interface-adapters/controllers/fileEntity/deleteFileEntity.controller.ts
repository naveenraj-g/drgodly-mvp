import { TFileEntitySchema } from "../../../../../shared/entities/models/filenest/fileEntity";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { DeleteFileEntityValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { deleteFileEntityUseCase } from "../../../application/useCases/fileEntity/deleteFileEntity.useCase";

function presenter(data: TFileEntitySchema) {
  return data;
}
export type TDeleteFileEntityControllerOutput = ReturnType<typeof presenter>;

export async function deleteFileEntityController(input: any) {
  const { data, error: inputParseError } =
    await DeleteFileEntityValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const entity = await deleteFileEntityUseCase(data);
  return presenter(entity);
}
