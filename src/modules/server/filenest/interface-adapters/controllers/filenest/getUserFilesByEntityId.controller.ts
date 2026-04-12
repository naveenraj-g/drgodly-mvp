import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { GetUserFilesByEntityIdPayloadSchema } from "../../../../../shared/schemas/filenest/filenestSchema";
import { TUserFiles } from "../../../../../shared/entities/models/filenest/filenest";
import { getUserFilesByEntityIdUseCase } from "../../../application/useCases/filenest/getUserFilesByEntityId.useCase";

function presenter(data: TUserFiles) {
  return data;
}
export type TGetUserFilesByEntityIdControllerOutput = ReturnType<
  typeof presenter
>;

export async function getUserFilesByEntityIdController(
  input: any
): Promise<TGetUserFilesByEntityIdControllerOutput> {
  const { data, error: inputParseError } =
    await GetUserFilesByEntityIdPayloadSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const filesData = await getUserFilesByEntityIdUseCase(data);
  return presenter(filesData);
}
