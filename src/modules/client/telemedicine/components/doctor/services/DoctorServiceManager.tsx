import { EmptyService } from "./subComponents/EmptyService";
import ServiceTableAndCard from "./subComponents/ServiceTableAndCard";
import { IServiceProps } from "./types";

export const DoctorServiceManagement = ({
  services,
  error,
  user,
}: IServiceProps) => {
  return (
    <>
      <div className="space-y-8 w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">My Services</h1>
          <p className="text-sm">
            Manage your appointment types and consultation services.
          </p>
        </div>
        {services?.length === 0 ? (
          <EmptyService user={user} />
        ) : (
          <ServiceTableAndCard services={services} error={error} user={user} />
        )}
      </div>
    </>
  );
};
