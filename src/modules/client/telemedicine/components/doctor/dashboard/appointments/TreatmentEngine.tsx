import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, AlertCircle, Beaker, Route, Shield } from "lucide-react";
import { AIRecommendations } from "@/modules/client/telemedicine/datas/doctor-dashboard";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ActionTooltipProvider from "@/modules/shared/providers/action-tooltip-provider";
import { Button } from "@/components/ui/button";
import { CgCompress } from "react-icons/cg";
import { RiExpandHorizontalLine } from "@remixicon/react";

interface TreatmentEngineProps {
  recommendations: AIRecommendations;
}

export const TreatmentEngine = ({ recommendations }: TreatmentEngineProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={cn(isExpanded ? "col-span-2" : "col-auto")}>
      <CardHeader className="flex items-center gap-2 justify-between">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Treatment & Recommendation Engine
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
            <AlertCircle className="h-4 w-4 text-warning" />
            Likely Conditions
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendations.likelyConditions.map((condition, idx) => (
              <Badge
                key={idx}
                className="bg-secondary text-secondary-foreground"
              >
                {condition}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium text-foreground mb-2">
            Differential Diagnosis
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {recommendations.differentialDiagnosis.map((diagnosis, idx) => (
              <li key={idx}>{diagnosis}</li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Beaker className="h-4 w-4 text-info" />
            Recommended Tests
          </h4>
          <div className="space-y-2">
            {recommendations.recommendedTests.map((test, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 bg-muted rounded-md"
              >
                <div className="w-2 h-2 rounded-full bg-info shrink-0" />
                <span className="text-sm text-foreground">{test}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Route className="h-4 w-4 text-primary" />
            Treatment Pathway
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            {recommendations.treatmentPathway.map((step, idx) => (
              <li key={idx} className="pl-2">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {recommendations.precautions.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium text-warning mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Precaution Alerts
              </h4>
              <div className="space-y-2">
                {recommendations.precautions.map((precaution, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-md"
                  >
                    <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      {precaution}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
