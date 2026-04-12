import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileCheck, Edit2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import ActionTooltipProvider from "@/modules/shared/providers/action-tooltip-provider";
import { CgCompress } from "react-icons/cg";
import { RiExpandHorizontalLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

interface ClinicalSummaryProps {
  patientName: string;
}

export const ClinicalSummary = ({ patientName }: ClinicalSummaryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState(
    `SOAP Note for ${patientName}

Subjective:
Patient presents with chief complaint as documented in intake form. Reports symptoms have been ongoing with varying severity. Patient appears comfortable and cooperative during examination.

Objective:
Vital signs within normal limits. Physical examination findings consistent with reported symptoms. Laboratory results pending/reviewed as documented.

Assessment:
Based on clinical presentation, history, and examination findings, working diagnosis includes conditions noted in AI recommendations. Differential diagnoses considered and documented.

Plan:
Treatment plan initiated as outlined in treatment pathway. Patient educated on diagnosis, treatment options, and follow-up care. Prescriptions provided as indicated. Follow-up appointment scheduled. Patient verbalized understanding and agreement with plan.`
  );

  const handleApprove = () => {
    toast.success("Clinical summary approved and saved to patient record");
    setIsEditing(false);
  };

  return (
    <Card className={cn(isExpanded ? "col-span-2" : "col-auto")}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            AI Clinical Summary
          </div>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <ActionTooltipProvider label={isExpanded ? "Shrink" : "Expand"}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsExpanded((prevState) => !prevState)}
            >
              {isExpanded ? (
                <CgCompress className="size-6 text-muted-foreground" />
              ) : (
                <RiExpandHorizontalLine className="size-6 text-muted-foreground" />
              )}
            </Button>
          </ActionTooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 h-full">
        {isEditing ? (
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="min-h-[400px] font-mono text-sm flex-1"
          />
        ) : (
          <div className="whitespace-pre-wrap text-sm text-foreground bg-muted p-4 rounded-md font-mono flex-1">
            {summary}
          </div>
        )}

        <Button
          onClick={handleApprove}
          className="w-full"
          disabled={!isEditing}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve & Save Summary
        </Button>
      </CardContent>
    </Card>
  );
};
