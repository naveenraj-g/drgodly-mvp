import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Activity, Pill, FlaskConical, HeartPulse } from "lucide-react";
// ── Type helpers ──────────────────────────────────────────────────────────────

type Condition = {
  id: string;
  codeDisplay: string | null;
  codeCode: string | null;
  codeSystem: string | null;
  clinicalStatusCode: string | null;
  verificationStatusCode: string | null;
};

type Observation = {
  id: string;
  codeDisplay: string | null;
  codeCode: string | null;
  status: string;
  valueString: string | null;
  // Prisma Decimal serialises to string over the wire; accept both
  valueQuantityValue: { toString(): string } | string | number | null;
  valueQuantityUnit: string | null;
  valueBoolean: boolean | null;
  valueInteger: number | null;
};

type MedicationRequest = {
  id: string;
  medicationCodeDisplay: string | null;
  medicationCodeCode: string | null;
  status: string;
  intent: string;
  dosageInstructions: { text: string | null; routeDisplay: string | null; routeText: string | null }[];
};

type ServiceRequest = {
  id: string;
  codeDisplay: string | null;
  codeCode: string | null;
  status: string;
  intent: string;
  priority: string | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusVariant(
  code: string,
): "default" | "secondary" | "outline" | "destructive" {
  const c = code.toLowerCase();
  if (["active", "final", "completed", "order"].includes(c)) return "default";
  if (["preliminary", "registered"].includes(c)) return "secondary";
  if (["cancelled", "entered-in-error", "revoked", "stopped"].includes(c))
    return "destructive";
  return "outline";
}

function formatStatus(code: string) {
  return code
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function observationValue(obs: Observation): string | null {
  if (obs.valueString) return obs.valueString;
  if (obs.valueQuantityValue != null) {
    const val = obs.valueQuantityValue.toString();
    return obs.valueQuantityUnit ? `${val} ${obs.valueQuantityUnit}` : val;
  }
  if (obs.valueBoolean != null) return obs.valueBoolean ? "Yes" : "No";
  if (obs.valueInteger != null) return String(obs.valueInteger);
  return null;
}

// ── Sub-sections ──────────────────────────────────────────────────────────────

function ConditionsSection({ items }: { items: Condition[] }) {
  if (!items.length) return null;
  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          Conditions Diagnosed
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 divide-y">
        {items.map((c, i) => (
          <div key={c.id} className={`py-3 ${i === 0 ? "pt-0" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {c.codeDisplay ?? "Unknown condition"}
                </p>
                {c.codeCode && (
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {c.codeCode}
                  </p>
                )}
              </div>
              <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                {c.clinicalStatusCode && (
                  <Badge
                    variant={statusVariant(c.clinicalStatusCode)}
                    className="text-xs capitalize"
                  >
                    {formatStatus(c.clinicalStatusCode)}
                  </Badge>
                )}
                {c.verificationStatusCode && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {formatStatus(c.verificationStatusCode)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ObservationsSection({ items }: { items: Observation[] }) {
  if (!items.length) return null;
  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-muted-foreground" />
          Measurements & Vitals
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((o) => {
            const val = observationValue(o);
            return (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2.5 gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {o.codeDisplay ?? "Observation"}
                  </p>
                  {val && (
                    <p className="text-base font-semibold leading-tight mt-0.5">
                      {val}
                    </p>
                  )}
                </div>
                <Badge variant={statusVariant(o.status)} className="text-xs shrink-0">
                  {formatStatus(o.status)}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function MedicationsSection({ items }: { items: MedicationRequest[] }) {
  if (!items.length) return null;
  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Pill className="h-4 w-4 text-muted-foreground" />
          Medications Prescribed
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 divide-y">
        {items.map((m, i) => {
          const dosage = m.dosageInstructions[0];
          const route = dosage?.routeDisplay ?? dosage?.routeText;
          return (
            <div key={m.id} className={`py-3 ${i === 0 ? "pt-0" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {m.medicationCodeDisplay ?? "Unknown medication"}
                  </p>
                  {m.medicationCodeCode && (
                    <p className="text-xs text-muted-foreground font-mono">
                      {m.medicationCodeCode}
                    </p>
                  )}
                  {dosage?.text && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {dosage.text}
                      {route ? ` · ${route}` : ""}
                    </p>
                  )}
                </div>
                <Badge variant={statusVariant(m.status)} className="text-xs shrink-0">
                  {formatStatus(m.status)}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ServiceRequestsSection({ items }: { items: ServiceRequest[] }) {
  if (!items.length) return null;
  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-muted-foreground" />
          Tests &amp; Procedures Ordered
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 divide-y">
        {items.map((s, i) => (
          <div key={s.id} className={`py-3 ${i === 0 ? "pt-0" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {s.codeDisplay ?? "Unknown test"}
                </p>
                {s.codeCode && (
                  <p className="text-xs text-muted-foreground font-mono">
                    {s.codeCode}
                  </p>
                )}
              </div>
              <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                <Badge variant={statusVariant(s.status)} className="text-xs">
                  {formatStatus(s.status)}
                </Badge>
                {s.priority && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {formatStatus(s.priority)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface ClinicalRecordsSectionProps {
  conditions: Condition[];
  observations: Observation[];
  medicationRequests: MedicationRequest[];
  serviceRequests: ServiceRequest[];
}

export function ClinicalRecordsSection({
  conditions,
  observations,
  medicationRequests,
  serviceRequests,
}: ClinicalRecordsSectionProps) {
  const hasAny =
    conditions.length > 0 ||
    observations.length > 0 ||
    medicationRequests.length > 0 ||
    serviceRequests.length > 0;

  if (!hasAny) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest shrink-0">
          Medical Records
        </span>
        <Separator className="flex-1" />
      </div>
      <ConditionsSection items={conditions} />
      <ObservationsSection items={observations} />
      <MedicationsSection items={medicationRequests} />
      <ServiceRequestsSection items={serviceRequests} />
    </div>
  );
}
