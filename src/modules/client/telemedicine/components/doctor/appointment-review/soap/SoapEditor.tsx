"use client";

import { Accordion } from "@/components/ui/accordion";
import { SubjectiveSection } from "./SubjectiveSection";
import { ObjectiveSection } from "./ObjectiveSection";
import { AssessmentSection } from "./AssessmentSection";
import { PlanSection } from "./PlanSection";
import type { SoapNote } from "../types";

interface SoapEditorProps {
  soap: SoapNote;
  onChange: (soap: SoapNote) => void;
}

export function SoapEditor({ soap, onChange }: SoapEditorProps) {
  return (
    <Accordion
      type="multiple"
      defaultValue={["subjective", "objective", "assessment", "plan"]}
      className="space-y-2"
    >
      <SubjectiveSection
        data={soap.subjective}
        onChange={(val) => onChange({ ...soap, subjective: val })}
      />
      <ObjectiveSection
        data={soap.objective}
        onChange={(val) => onChange({ ...soap, objective: val })}
      />
      <AssessmentSection
        data={soap.assessment}
        onChange={(val) => onChange({ ...soap, assessment: val })}
      />
      <PlanSection
        data={soap.plan}
        summary={soap.summary}
        onPlanChange={(val) => onChange({ ...soap, plan: val })}
        onSummaryChange={(val) => onChange({ ...soap, summary: val })}
      />
    </Accordion>
  );
}
