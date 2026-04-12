import { TService } from "@/modules/shared/entities/models/telemedicine/service";
import { create } from "zustand";

export type ModalType = "addService" | "deleteService" | "editService";

interface DoctoeStore {
  type: ModalType | null;
  isOpen: boolean;
  userId?: string;
  orgId?: string;
  serviceId?: string;
  serviceData?: TService;
  doctorData?: any;
  appointmentData?: any;
  trigger: number;
  triggerInModal: number;
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    userId?: string;
    orgId?: string;
    serviceId?: string;
    serviceData?: TService;
    doctorData?: any;
    appointmentData?: any;
  }) => void;
  onClose: () => void;
}

const _useDoctorModalStore = create<DoctoeStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  onOpen: ({
    type,
    serviceId = undefined,
    orgId = undefined,
    userId = undefined,
    serviceData = undefined,
    doctorData = undefined,
    appointmentData = undefined,
  }) =>
    set({
      isOpen: true,
      type,
      userId,
      orgId,
      serviceId,
      serviceData,
      doctorData,
      appointmentData,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      trigger: 0,
      triggerInModal: 0,
      serviceId: undefined,
      userId: undefined,
      orgId: undefined,
      serviceData: undefined,
      doctorData: undefined,
      appointmentData: undefined,
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
}));

export const useDoctorModalStore = _useDoctorModalStore;
export const doctorModalStore = _useDoctorModalStore;
