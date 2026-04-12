import { TAppointment } from "@/modules/shared/entities/models/telemedicine/appointment";
import { create } from "zustand";

export type ModalType =
  | "rescheduleAppointment"
  | "cancelAppointment"
  | "viewAppointment"
  | "deleteAppointment"
  | "confirmAppointment";

interface AppointmentStore {
  type: ModalType | null;
  isOpen: boolean;
  doctorData?: any;
  appointmentData?: TAppointment | null;
  patientOrDoctor?: "PATIENT" | "DOCTOR" | null;
  trigger: number;
  triggerInModal: number;
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    doctorData?: any;
    appointmentData?: TAppointment;
    patientOrDoctor?: "PATIENT" | "DOCTOR" | null;
  }) => void;
  onClose: () => void;
}

const _useAppointmentModalStore = create<AppointmentStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  onOpen: ({
    type,
    doctorData = null,
    appointmentData = null,
    patientOrDoctor = null,
  }) =>
    set({
      isOpen: true,
      type,
      doctorData,
      appointmentData,
      patientOrDoctor,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      trigger: 0,
      triggerInModal: 0,
      doctorData: null,
      appointmentData: null,
      patientOrDoctor: null,
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
}));

export const useAppointmentModalStore = _useAppointmentModalStore;
export const AppointmentModalStore = _useAppointmentModalStore;
