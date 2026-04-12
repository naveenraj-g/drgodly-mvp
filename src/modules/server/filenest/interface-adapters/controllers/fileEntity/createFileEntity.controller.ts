import { TFileEntitySchema } from "../../../../../shared/entities/models/filenest/fileEntity";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { CreateFileEntityValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { createFileEntityUseCase } from "../../../application/useCases/fileEntity/createFileEntity.useCase";

function presenter(data: TFileEntitySchema) {
  return data;
}
export type TCreateFileEntityControllerOutput = ReturnType<typeof presenter>;

export async function createFileEntityController(input: any) {
  const { data, error: inputParseError } =
    await CreateFileEntityValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const entity = await createFileEntityUseCase(data);
  return presenter(entity);
}
