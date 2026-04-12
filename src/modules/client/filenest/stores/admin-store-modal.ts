import { create } from "zustand";
import { TCloudStorageConfig } from "../types/cloudStorage";
import { TLocalStorageConfig } from "../types/localStorage";
import { TFileEntity } from "../types/fileEntities";
import { TAppSetting, TAppSettingsColumnProps } from "../types/appSettings";

export type ModalType =
  | "createCloudStorage"
  | "editCloudStorage"
  | "deleteCloudStorage"
  | "createLocalStorage"
  | "editLocalStorage"
  | "deleteLocalStorage"
  | "createAppSetting"
  | "editAppSetting"
  | "deleteAppSetting"
  | "createFileEntity"
  | "editFileEntity"
  | "deleteFileEntity";

interface AdminStoreModal {
  type: ModalType | null;
  isOpen: boolean;
  trigger: number;
  triggerInModal: number;
  cloudStorageConfigData?: TCloudStorageConfig | null;
  localStorageConfigData?: TLocalStorageConfig | null;
  appSettingData?: TAppSetting | null;
  fileEntityData?: TFileEntity | null;
  cloudStorageconfigId?: bigint | null;
  localStorageConfigId?: bigint | null;
  fileEntityDataId?: bigint | null;
  appSettingDataId?: bigint | null;
  //
  appSettingsRequiredDatas?: TAppSettingsColumnProps | null;
  //
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    cloudStorageConfigData?: TCloudStorageConfig | null;
    localStorageConfigData?: TLocalStorageConfig | null;
    fileEntityData?: TFileEntity | null;
    appSettingData?: TAppSetting | null;
    cloudStorageconfigId?: bigint | null;
    localStorageConfigId?: bigint | null;
    fileEntityDataId?: bigint | null;
    appSettingDataId?: bigint | null;
    appSettingsRequiredDatas?: TAppSettingsColumnProps | null;
  }) => void;
  onClose: () => void;
}

const _useFilenestAdminStoreModal = create<AdminStoreModal>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  onOpen: ({
    type,
    cloudStorageConfigData = null,
    localStorageConfigData = null,
    fileEntityData = null,
    appSettingData = null,
    cloudStorageconfigId = null,
    localStorageConfigId = null,
    fileEntityDataId = null,
    appSettingDataId = null,
    appSettingsRequiredDatas = null,
  }) =>
    set({
      isOpen: true,
      type,
      cloudStorageConfigData,
      localStorageConfigData,
      fileEntityData,
      appSettingData,
      cloudStorageconfigId,
      localStorageConfigId,
      fileEntityDataId,
      appSettingDataId,
      appSettingsRequiredDatas,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      cloudStorageConfigData: null,
      localStorageConfigData: null,
      fileEntityData: null,
      appSettingData: null,
      appSettingsRequiredDatas: null,
      cloudStorageconfigId: null,
      localStorageConfigId: null,
      fileEntityDataId: null,
      appSettingDataId: null,
      trigger: 0,
      triggerInModal: 0,
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
}));

export const useFilenestAdminStoreModal = _useFilenestAdminStoreModal;
export const filenestAdminStoreModal = _useFilenestAdminStoreModal;
