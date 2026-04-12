import { TCloudStorageConfigsSchema } from "../../../../../shared/entities/models/filenest/cloudStorage";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { GetCloudStorageConfigsValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { getCloudStorageConfigsUseCase } from "../../../application/useCases/cloudStorageConfig/getCloudStorageConfigs.useCase";

function presenter(data: TCloudStorageConfigsSchema) {
  return data;
}

export type TGetCloudStorageConfigsControllerOutput = ReturnType<
  typeof presenter
>;

export async function getCloudStorageConfigsController(
  input: any
): Promise<TGetCloudStorageConfigsControllerOutput> {
  const { data, error: inputParseError } =
    await GetCloudStorageConfigsValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const cloudStorageConfigs = await getCloudStorageConfigsUseCase(data);

  return presenter(cloudStorageConfigs);
}
