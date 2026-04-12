import { create } from "zustand";
import { TEndpoint } from "../types/admin";
import { TSharedUser } from "@/modules/shared/types";

export type ModalType =
  | "createEndpoint"
  | "editEndpoint"
  | "deleteEndpoint"
  | "createKnowledgeBase"
  | "editKnowledgeBase"
  | "deleteKnowledgeBase"
  | "createAgent"
  | "editAgent"
  | "deleteAgent";

interface AdminStoreModal {
  type: ModalType | null;
  isOpen: boolean;
  trigger: number;
  triggerInModal: number;
  endpointData?: TEndpoint;
  user: TSharedUser | null;
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    endpointData?: TEndpoint;
    user: TSharedUser;
  }) => void;
  onClose: () => void;
}

const _useAiHubAdminStore = create<AdminStoreModal>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  user: null,
  onOpen: ({ type, user, endpointData = undefined }) =>
    set({
      isOpen: true,
      type,
      user,
      endpointData,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      trigger: 0,
      triggerInModal: 0,
      user: null,
      endpointData: undefined,
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
}));

export const useAiHubAdminStore = _useAiHubAdminStore;
export const aiHubAdminStore = _useAiHubAdminStore;
