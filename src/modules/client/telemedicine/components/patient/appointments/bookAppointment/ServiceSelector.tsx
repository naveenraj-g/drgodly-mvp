import React from "react";
import { SelectedService, Service } from "./types";
import { MapPin, Video, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";

interface ServiceSelectorProps {
  services: Service[];
  selectedServiceId: string | null;
  onSelect: (server: SelectedService) => void;
  formatCurrency: (amount: number, country: string, currency: string) => string;
}

export const ServiceSelector = ({
  services,
  selectedServiceId,
  onSelect,
  formatCurrency,
}: ServiceSelectorProps) => {
  const [bookingMode, setBookingMode] = React.useState<"VIRTUAL" | "INPERSON">(
    "INPERSON"
  );

  // Filter services based on the selected mode
  const filteredServices = services.filter((service) =>
    service.supportedModes.includes(bookingMode)
  );

  return (
    <div className="lg:col-span-1 space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground">
        Appointment Type
      </h3>
      <div>
        <Tabs
          defaultValue="INPERSON"
          onValueChange={(value) =>
            setBookingMode(value as "VIRTUAL" | "INPERSON")
          }
        >
          <TabsList className="w-full">
            <TabsTrigger value="INPERSON">
              <MapPin className="h-4 w-4" />
              In Person
            </TabsTrigger>
            <TabsTrigger value="VIRTUAL">
              <Video className="h-4 w-4" />
              Virtual
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="space-y-3">
        {filteredServices.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-muted rounded-lg border border-dashed border-border">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>
              No services available for{" "}
              {bookingMode === "VIRTUAL" ? "Online" : "In-person"} visits.
            </p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <Card
              key={service.id}
              onClick={() =>
                onSelect({
                  id: service.id,
                  name: service.name,
                  duration: service.duration,
                  priceAmount: service.priceAmount,
                  priceCurrency: service.priceCurrency,
                  selectedMode: bookingMode,
                })
              }
              className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all flex flex-row justify-between items-center ${
                selectedServiceId === service.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "hover:border-primary/50 border-border"
              }`}
            >
              <div>
                <div className="font-medium text-sm">{service.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {service.duration} min
                  {service.supportedModes.length === 1 && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground uppercase tracking-wide">
                      {service.supportedModes[0]} only
                    </span>
                  )}
                </div>
              </div>
              {service.priceAmount && service.priceCurrency && (
                <div className="text-primary font-mono font-semibold">
                  {formatCurrency(
                    service.priceAmount,
                    "en-US",
                    service.priceCurrency
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
