import { create } from "zustand";

export type ModalType = "deleteDoctorProfile" | "addDoctorByHPR" | "mapDoctor";

interface AdminStore {
  type: ModalType | null;
  isOpen: boolean;
  doctorProfileId?: string;
  doctorMappedUserId?: string | null;
  orgId?: string | null;
  trigger: number;
  triggerInModal: number;
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    doctorProfileId?: string;
    orgId?: string | null;
    doctorMappedUserId?: string;
  }) => void;
  onClose: () => void;
}

const _useAdminModalStore = create<AdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  onOpen: ({
    type,
    doctorProfileId = undefined,
    orgId = null,
    doctorMappedUserId = null,
  }) =>
    set({
      isOpen: true,
      type,
      doctorProfileId,
      orgId,
      doctorMappedUserId,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      trigger: 0,
      triggerInModal: 0,
      doctorProfileId: undefined,
      doctorMappedUserId: null,
      orgId: null,
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
}));

export const useAdminModalStore = _useAdminModalStore;
export const adminModalStore = _useAdminModalStore;
