import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { GetFileEntitiesByAppIdValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { getFileUploadRequiredDataUseCase } from "../../../application/useCases/localFileOperation/getFileUploadRequiredData.useCase";
import { TFileUploadRequiredDataSchema } from "@/modules/shared/entities/models/filenest/fileUpload";

function presenter(data: TFileUploadRequiredDataSchema) {
  return data;
}
export type TGetFileUploadRequiredDataControllerOutput = ReturnType<
  typeof presenter
>;

export async function getFileUploadRequiredDataController(input: any) {
  const { data, error: inputParseError } =
    await GetFileEntitiesByAppIdValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const entities = await getFileUploadRequiredDataUseCase(data);
  return presenter(entities);
}
