import { DoctorModalProvider } from "@/modules/client/telemedicine/providers/DoctorModalProvider";

function TelemedicineDoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DoctorModalProvider />
      {children}
    </>
  );
}

export default TelemedicineDoctorLayout;
