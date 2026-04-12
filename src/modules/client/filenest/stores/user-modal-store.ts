import { create } from "zustand";
import { TFileEntity } from "../types/fileEntities";

export type ModalType = "shareFile";

type TFileData = {
  fileName: string;
  filePath: string;
  fileSize: bigint;
  fileType: string;
  id: bigint;
};

export type TUserStoreOpenModal = (props: {
  type: ModalType;
  userFileId?: bigint | null;
  fileData?: TFileData | null;
}) => void;

interface UserModalStore {
  type: ModalType | null;
  isOpen: boolean;
  trigger: number;
  triggerInModal: number;
  userFileId?: bigint | null;
  fileData?: TFileData | null;
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: TUserStoreOpenModal;
  onClose: () => void;
}

const _useFilenestUserModalStore = create<UserModalStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  onOpen: ({ type, userFileId = null, fileData = null }) =>
    set({
      isOpen: true,
      type,
      userFileId,
      fileData,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      userFileId: null,
      fileData: null,
      trigger: 0,
      triggerInModal: 0,
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
}));

export const useFilenestUserModalStore = _useFilenestUserModalStore;
export const filenestUserModalStore = _useFilenestUserModalStore;
