"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { EditableList } from "../shared/EditableList";
import type { SoapNote } from "../types";

interface ObjectiveSectionProps {
  data: SoapNote["objective"];
  onChange: (data: SoapNote["objective"]) => void;
}

export function ObjectiveSection({ data, onChange }: ObjectiveSectionProps) {
  return (
    <AccordionItem value="objective" className="border rounded-lg px-4">
      <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
        Objective
      </AccordionTrigger>
      <AccordionContent className="space-y-2 pb-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Findings & Vitals
        </Label>
        <EditableList
          items={data.observations}
          onChange={(items) => onChange({ observations: items })}
          placeholder="e.g. Temperature: 101.2 F"
          addLabel="Add finding"
        />
      </AccordionContent>
    </AccordionItem>
  );
}
