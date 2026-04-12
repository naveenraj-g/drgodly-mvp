import { create } from "zustand";

export type ModalType = "previewFile" | "deleteFile" | "shareFile";

type FileDataType = {
  id: bigint;
  fileName: string;
  fileSize: bigint;
  fileType: string;
  filePath: string;
};

export type TFileNestUserStoreOpenModal = (props: {
  type: ModalType;
  id?: number | string;
  fileData?: FileDataType | null;
}) => void;

interface FileNestUserStore {
  type: ModalType | null;
  isOpen: boolean;
  id?: number | string;
  fileData?: FileDataType | null;
  trigger: number;
  onOpen: TFileNestUserStoreOpenModal;
  incrementTrigger: () => void;
  onClose: () => void;
}

const _useFileNestUserStore = create<FileNestUserStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  onOpen: ({ type, id = "", fileData = null }) =>
    set({
      isOpen: true,
      type,
      id,
      fileData,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      id: "",
      fileData: null,
    }),
}));

export const useFileNestUserStore = _useFileNestUserStore;
export const fileNestUserStore = _useFileNestUserStore;
