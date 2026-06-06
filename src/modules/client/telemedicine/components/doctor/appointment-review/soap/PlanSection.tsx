"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EditableList } from "../shared/EditableList";
import type { SoapNote } from "../types";

interface PlanSectionProps {
  data: SoapNote["plan"];
  summary: string;
  onPlanChange: (data: SoapNote["plan"]) => void;
  onSummaryChange: (val: string) => void;
}

export function PlanSection({
  data,
  summary,
  onPlanChange,
  onSummaryChange,
}: PlanSectionProps) {
  return (
    <AccordionItem value="plan" className="border rounded-lg px-4">
      <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
        Plan & Summary
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Next Steps
          </Label>
          <EditableList
            items={data.next_steps}
            onChange={(items) => onPlanChange({ ...data, next_steps: items })}
            placeholder="Step..."
            addLabel="Add step"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            When to Seek Care
          </Label>
          <Input
            value={data.when_to_seek_care}
            onChange={(e) =>
              onPlanChange({ ...data, when_to_seek_care: e.target.value })
            }
            className="text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Clinical Summary
          </Label>
          <Textarea
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            className="text-sm min-h-[100px] resize-none"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
