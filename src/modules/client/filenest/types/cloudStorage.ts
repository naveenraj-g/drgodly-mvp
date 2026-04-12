import { TGetCloudStorageConfigsControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/cloudStorageConfig";
import { ZSAError } from "zsa";

export interface ICloudStorageProps {
  cloudStorageConfigs: TGetCloudStorageConfigsControllerOutput | null;
  error: ZSAError | null;
}

export type TCloudStorageConfig =
  TGetCloudStorageConfigsControllerOutput[number];
