import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, ClipboardList, Stethoscope, CheckSquare } from "lucide-react";

interface SoapNote {
  subjective?: {
    chief_complaint?: string;
    history_of_present_illness?: string;
    associated_symptoms?: string[];
  };
  objective?: { observations?: string[] };
  assessment?: { possible_conditions?: string[]; clinical_reasoning?: string };
  plan?: { next_steps?: string[]; when_to_seek_care?: string };
  summary?: string;
}

function normalizeSoap(raw: unknown): SoapNote | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  // handle old format where doctorReport is { soap: {...}, assessment: {...} }
  if (r.soap && typeof r.soap === "object") return r.soap as SoapNote;
  // new format: doctorReport IS the soap
  if (r.subjective || r.plan || r.summary) return r as SoapNote;
  return null;
}

interface SoapViewProps {
  doctorReport: unknown;
}

export function SoapView({ doctorReport }: SoapViewProps) {
  const soap = normalizeSoap(doctorReport);

  if (!soap) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Clinical notes not yet available.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary — most prominent for patients */}
      {soap.summary && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Clinical Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm leading-relaxed">{soap.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Subjective */}
      {soap.subjective && (
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              Visit Reason
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 space-y-3">
            {soap.subjective.chief_complaint && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Chief Complaint</p>
                <p className="text-sm">{soap.subjective.chief_complaint}</p>
              </div>
            )}
            {soap.subjective.history_of_present_illness && (
              <>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">History</p>
                  <p className="text-sm leading-relaxed">
                    {soap.subjective.history_of_present_illness}
                  </p>
                </div>
              </>
            )}
            {soap.subjective.associated_symptoms &&
              soap.subjective.associated_symptoms.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Reported Symptoms</p>
                    <div className="flex flex-wrap gap-1.5">
                      {soap.subjective.associated_symptoms.map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-normal">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
          </CardContent>
        </Card>
      )}

      {/* Plan */}
      {soap.plan && (
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              Your Care Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 space-y-3">
            {soap.plan.next_steps && soap.plan.next_steps.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Next Steps</p>
                <ul className="space-y-1.5">
                  {soap.plan.next_steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {soap.plan.when_to_seek_care && (
              <>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">When to Seek Care</p>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    {soap.plan.when_to_seek_care}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Objective findings — optional detail */}
      {soap.objective?.observations && soap.objective.observations.length > 0 && (
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Examination Findings
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <ul className="space-y-1">
              {soap.objective.observations.map((obs, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">·</span>
                  {obs}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
