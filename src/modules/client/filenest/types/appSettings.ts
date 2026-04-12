import { TGetAppStorageSettingsControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/appStorageSetting";
import { TGetCloudStorageConfigsControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/cloudStorageConfig";
import { TGetLocalStorageConfigsControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/localStorageConfig";
import { TGetAppsByOrgIdControllerOutput } from "@/modules/server/shared/app/interface-adapters/controllers";
import { ZSAError } from "zsa";

export interface IAppSettingsProps {
  appSettings: TGetAppStorageSettingsControllerOutput | null;
  appDatas: TGetAppsByOrgIdControllerOutput | null;
  cloudStorageConfigs: TGetCloudStorageConfigsControllerOutput | null;
  localStorageConfigs: TGetLocalStorageConfigsControllerOutput | null;
  error: ZSAError | null;
}

export type TAppSetting = TGetAppStorageSettingsControllerOutput[number];
export type TAppData = TGetAppsByOrgIdControllerOutput[number];

export type TAppSettingsColumnProps = {
  appDatas: TGetAppsByOrgIdControllerOutput | null;
  cloudStorageConfigs: TGetCloudStorageConfigsControllerOutput | null;
  localStorageConfigs: TGetLocalStorageConfigsControllerOutput | null;
};
