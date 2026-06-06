"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConditionList } from "./conditions/ConditionList";
import { ObservationList } from "./observations/ObservationList";
import { MedicationList } from "./medications/MedicationList";
import { ServiceRequestList } from "./service-requests/ServiceRequestList";
import type {
  ConditionFormItem,
  ObservationFormItem,
  MedicationFormItem,
  ServiceRequestFormItem,
} from "../types";

interface ClinicalExtractionPanelProps {
  conditions: ConditionFormItem[];
  observations: ObservationFormItem[];
  medications: MedicationFormItem[];
  serviceRequests: ServiceRequestFormItem[];
  onConditionsChange: (items: ConditionFormItem[]) => void;
  onObservationsChange: (items: ObservationFormItem[]) => void;
  onMedicationsChange: (items: MedicationFormItem[]) => void;
  onServiceRequestsChange: (items: ServiceRequestFormItem[]) => void;
}

export function ClinicalExtractionPanel({
  conditions,
  observations,
  medications,
  serviceRequests,
  onConditionsChange,
  onObservationsChange,
  onMedicationsChange,
  onServiceRequestsChange,
}: ClinicalExtractionPanelProps) {
  return (
    <Tabs defaultValue="conditions" className="flex flex-col h-full">
      <TabsList className="shrink-0 w-full grid grid-cols-4">
        <TabsTrigger value="conditions" className="text-xs">
          Conditions
          {conditions.length > 0 && (
            <span className="ml-1.5 text-[10px] bg-primary/10 text-primary rounded-full px-1.5 py-0.5 leading-none">
              {conditions.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="observations" className="text-xs">
          Observations
          {observations.length > 0 && (
            <span className="ml-1.5 text-[10px] bg-primary/10 text-primary rounded-full px-1.5 py-0.5 leading-none">
              {observations.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="medications" className="text-xs">
          Medications
          {medications.length > 0 && (
            <span className="ml-1.5 text-[10px] bg-primary/10 text-primary rounded-full px-1.5 py-0.5 leading-none">
              {medications.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="orders" className="text-xs">
          Orders
          {serviceRequests.length > 0 && (
            <span className="ml-1.5 text-[10px] bg-primary/10 text-primary rounded-full px-1.5 py-0.5 leading-none">
              {serviceRequests.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 min-h-0 mt-3">
        <TabsContent value="conditions" className="h-full m-0">
          <ScrollArea className="h-full pr-1">
            <ConditionList items={conditions} onChange={onConditionsChange} />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="observations" className="h-full m-0">
          <ScrollArea className="h-full pr-1">
            <ObservationList items={observations} onChange={onObservationsChange} />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="medications" className="h-full m-0">
          <ScrollArea className="h-full pr-1">
            <MedicationList items={medications} onChange={onMedicationsChange} />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="orders" className="h-full m-0">
          <ScrollArea className="h-full pr-1">
            <ServiceRequestList
              items={serviceRequests}
              onChange={onServiceRequestsChange}
            />
          </ScrollArea>
        </TabsContent>
      </div>
    </Tabs>
  );
}
