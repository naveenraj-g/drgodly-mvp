import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, AlertTriangle } from "lucide-react";
import { IntakeData } from "@/modules/client/telemedicine/datas/doctor-dashboard";
import { Button } from "@/components/ui/button";
import { RiExpandHorizontalLine } from "react-icons/ri";
import { CgCompress } from "react-icons/cg";
import ActionTooltipProvider from "@/modules/shared/providers/action-tooltip-provider";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface IntakeInsightsProps {
  intake: IntakeData;
}

export const IntakeInsights = ({ intake }: IntakeInsightsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={cn(isExpanded ? "col-span-2" : "col-auto")}>
      <CardHeader className="flex items-center gap-2 justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Pre-Visit Intake Insights
        </CardTitle>
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            Symptoms
          </h4>
          <div className="flex flex-wrap gap-2">
            {intake.symptoms.map((symptom, idx) => (
              <Badge key={idx} variant="outline" className="bg-muted">
                {symptom}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium text-foreground mb-2">Medical History</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {intake.medicalHistory.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium text-foreground mb-2">
            Current Medications
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {intake.currentMedications.map((med, idx) => (
              <li key={idx}>{med}</li>
            ))}
          </ul>
        </div>

        {intake.redFlags.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium text-destructive mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Red Flags
              </h4>
              <div className="flex flex-wrap gap-2">
                {intake.redFlags.map((flag, idx) => (
                  <Badge
                    key={idx}
                    className="bg-destructive text-destructive-foreground"
                  >
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        <div>
          <h4 className="font-medium text-foreground mb-2">Patient Concerns</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {intake.concerns.map((concern, idx) => (
              <li key={idx}>{concern}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
