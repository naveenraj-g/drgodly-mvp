import { AppointmentModalProvider } from "@/modules/client/telemedicine/providers/appointment-modal-provider";

function TelemedicineLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppointmentModalProvider />
      {children}
    </>
  );
}

export default TelemedicineLayout;
