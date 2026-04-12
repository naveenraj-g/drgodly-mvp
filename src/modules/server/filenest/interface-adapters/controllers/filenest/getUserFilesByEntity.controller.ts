import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { GetUserFilesByEntityPayloadSchema } from "../../../../../shared/schemas/filenest/filenestSchema";
import { TUserFiles } from "../../../../../shared/entities/models/filenest/filenest";
import { getUserFilesByEntityUseCase } from "../../../application/useCases/filenest/getUserFilesByEntity.useCase";

function presenter(data: TUserFiles) {
  return data;
}
export type TGetUserFilesByEntityControllerOutput = ReturnType<
  typeof presenter
>;

export async function getUserFilesByEntityController(
  input: any
): Promise<TGetUserFilesByEntityControllerOutput> {
  const { data, error: inputParseError } =
    await GetUserFilesByEntityPayloadSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const filesData = await getUserFilesByEntityUseCase(data);
  return presenter(filesData);
}
