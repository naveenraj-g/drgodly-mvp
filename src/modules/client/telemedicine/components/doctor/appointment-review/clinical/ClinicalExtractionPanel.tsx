"use client";

import { useTransition } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConditionList } from "./conditions/ConditionList";
import { ObservationList } from "./observations/ObservationList";
import { MedicationList } from "./medications/MedicationList";
import { ServiceRequestList } from "./service-requests/ServiceRequestList";
import type {
  SoapNote,
  ConditionFormItem,
  ObservationFormItem,
  MedicationFormItem,
  ServiceRequestFormItem,
} from "../types";

export interface ClinicalExtractionResult {
  conditions: Array<{ display: string; terminologySystem: string }>;
  observations: Array<{
    display: string;
    terminologySystem: string;
    value?: string | null;
    unit?: string | null;
  }>;
  medicationRequests: Array<{
    display: string;
    terminologySystem: string;
    dose?: string | null;
    frequency?: string | null;
    duration?: string | null;
    route?: string | null;
  }>;
  serviceRequests: Array<{ display: string; terminologySystem: string }>;
}

async function fetchClinicalExtraction(
  soap: Record<string, unknown>,
  assessment?: unknown,
): Promise<ClinicalExtractionResult> {
  console.log({ soap, assessment: assessment ?? null });
  const res = await fetch("/api/clinical-extraction-agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ soap, assessment: assessment ?? null }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Clinical extraction failed (${res.status}): ${text}`);
  }
  return res.json();
}

interface ClinicalExtractionPanelProps {
  soap: SoapNote;
  assessment?: unknown;
  conditions: ConditionFormItem[];
  observations: ObservationFormItem[];
  medications: MedicationFormItem[];
  serviceRequests: ServiceRequestFormItem[];
  onConditionsChange: (items: ConditionFormItem[]) => void;
  onObservationsChange: (items: ObservationFormItem[]) => void;
  onMedicationsChange: (items: MedicationFormItem[]) => void;
  onServiceRequestsChange: (items: ServiceRequestFormItem[]) => void;
  onReExtract: (result: ClinicalExtractionResult) => void;
}

export function ClinicalExtractionPanel({
  soap,
  assessment,
  conditions,
  observations,
  medications,
  serviceRequests,
  onConditionsChange,
  onObservationsChange,
  onMedicationsChange,
  onServiceRequestsChange,
  onReExtract,
}: ClinicalExtractionPanelProps) {
  const [isPending, startTransition] = useTransition();

  const handleReExtract = () => {
    startTransition(async () => {
      try {
        const result = await fetchClinicalExtraction(
          soap as unknown as Record<string, unknown>,
          assessment,
        );
        onReExtract(result);
        toast.success("Clinical data re-extracted from updated SOAP note.");
      } catch (err) {
        console.error(err);
        toast.error("Failed to re-extract clinical data. Please try again.");
      }
    });
  };

  return (
    <Tabs defaultValue="conditions" className="flex flex-col h-full">
      <div className="flex items-center gap-2 shrink-0">
        <TabsList className="flex-1 grid grid-cols-4">
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

        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5 text-xs h-8"
          onClick={handleReExtract}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {isPending ? "Extracting…" : "Re-extract"}
        </Button>
      </div>

      <div className="flex-1 min-h-0 mt-3">
        <TabsContent value="conditions" className="h-full m-0">
          <ScrollArea className="h-full pr-1">
            <ConditionList items={conditions} onChange={onConditionsChange} />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="observations" className="h-full m-0">
          <ScrollArea className="h-full pr-1">
            <ObservationList
              items={observations}
              onChange={onObservationsChange}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="medications" className="h-full m-0">
          <ScrollArea className="h-full pr-1">
            <MedicationList
              items={medications}
              onChange={onMedicationsChange}
            />
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
