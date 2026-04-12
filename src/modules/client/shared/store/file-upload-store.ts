import { TGetFileUploadRequiredDataControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/localFileOperation";
import { ZSAError } from "zsa";
import { create } from "zustand";

export type ModalType = "fileUpload";

interface FileUploadStoreModal {
  type: ModalType | null;
  isOpen: boolean;
  trigger: number;
  triggerInModal: number;
  title?: string | null;
  description?: string | null;
  error?: ZSAError | null;
  revalidatePath?: string | null;
  queryKey?: (string | number | null | undefined)[] | null;
  fileUploadData?: TGetFileUploadRequiredDataControllerOutput | null;
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    title?: string;
    description?: string;
    error?: ZSAError | null;
    revalidatePath?: string | null;
    fileUploadData?: TGetFileUploadRequiredDataControllerOutput | null;
    queryKey?: (string | number | null | undefined)[] | null;
  }) => void;
  onClose: () => void;
}

const _useFileUploadStore = create<FileUploadStoreModal>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  onOpen: ({
    type,
    title = null,
    description = null,
    error = null,
    fileUploadData = null,
    revalidatePath = null,
    queryKey = null,
  }) =>
    set({
      isOpen: true,
      type,
      title,
      description,
      error,
      fileUploadData,
      revalidatePath,
      queryKey,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      title: null,
      description: null,
      error: null,
      fileUploadData: null,
      revalidatePath: null,
      queryKey: null,
      trigger: 0,
      triggerInModal: 0,
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
}));

export const useFileUploadStore = _useFileUploadStore;
export const fileUploadStore = _useFileUploadStore;
