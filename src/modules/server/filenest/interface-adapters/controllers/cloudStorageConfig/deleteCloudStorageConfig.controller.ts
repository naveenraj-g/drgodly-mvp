import { TCloudStorageConfigSchema } from "../../../../../shared/entities/models/filenest/cloudStorage";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { DeleteCloudStorageValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { deleteCloudStorageConfigUseCase } from "../../../application/useCases/cloudStorageConfig/deleteCloudStorageConfig.useCase";

function presenter(data: TCloudStorageConfigSchema) {
  return data;
}

export type TDeleteCloudStorageConfigControllerOutput = ReturnType<
  typeof presenter
>;

export async function deleteCloudStorageConfigController(
  input: any
): Promise<TDeleteCloudStorageConfigControllerOutput> {
  const { data, error: inputParseError } =
    await DeleteCloudStorageValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const cloudStorageConfig = await deleteCloudStorageConfigUseCase(data);

  return presenter(cloudStorageConfig);
}
