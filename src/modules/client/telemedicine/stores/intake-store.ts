import { create } from "zustand";

interface IntakeStore {
  conversation: any | null;
  report: any | null;
  setConversation: (conversation: any) => void;
  setReport: (report: any) => void;
}

const _useIntakeStore = create<IntakeStore>((set) => ({
  conversation: null,
  report: null,
  setConversation: (conversation: any) => set({ conversation }),
  setReport: (report: any) => set({ report }),
}));

export const useIntakeStore = _useIntakeStore;
export const intakeStore = _useIntakeStore;
