"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ActionTooltipProvider from "@/modules/shared/providers/action-tooltip-provider";
import { CgCompress } from "react-icons/cg";
import { RiExpandHorizontalLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TAppointment } from "@/modules/shared/entities/models/telemedicine/appointment";
import { getPreviousConsultationReport } from "@/modules/client/telemedicine/server-actions/appointment-action";

interface ClinicalSummaryProps {
  patientName: string;
  appointment: TAppointment;
}

// ── SOAP parsing ──────────────────────────────────────────────────────────────

interface SoapData {
  summary?: string;
  subjective?: Record<string, unknown>;
  objective?: Record<string, unknown>;
  assessment?: Record<string, unknown>;
  plan?: Record<string, unknown>;
}

function parseDoctorReport(raw: unknown): SoapData | null {
  if (raw == null) return null;
  try {
    const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (typeof obj !== "object" || Array.isArray(obj) || obj === null) return null;
    const envelope = obj as Record<string, unknown>;
    const inner = (envelope.data != null ? envelope.data : obj) as Record<string, unknown>;
    if (inner.subjective || inner.objective || inner.assessment || inner.plan || inner.summary) {
      return inner as SoapData;
    }
    return null;
  } catch {
    return null;
  }
}

function arrToLines(val: unknown): string {
  if (!Array.isArray(val)) return String(val ?? "");
  return val
    .map((v) => `  • ${typeof v === "string" ? v : JSON.stringify(v)}`)
    .join("\n");
}

function sectionToText(section: Record<string, unknown>): string {
  return Object.entries(section)
    .filter(([, v]) => v != null)
    .map(([k, v]) => {
      const label = k.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
      if (Array.isArray(v)) return `${label}:\n${arrToLines(v)}`;
      if (typeof v === "object") return null;
      return `${label}: ${v}`;
    })
    .filter(Boolean)
    .join("\n");
}

function soapToText(soap: SoapData, patientName: string): string {
  const sections: string[] = [`SOAP Note — ${patientName}`, ""];

  if (soap.summary) {
    sections.push("Summary:", soap.summary, "");
  }

  const keys = ["subjective", "objective", "assessment", "plan"] as const;
  for (const key of keys) {
    const section = soap[key];
    if (!section || Object.keys(section).length === 0) continue;
    sections.push(`${key.charAt(0).toUpperCase() + key.slice(1)}:`);
    sections.push(sectionToText(section));
    sections.push("");
  }

  return sections.join("\n").trim();
}

// ── component ─────────────────────────────────────────────────────────────────

export const ClinicalSummary = ({ patientName, appointment }: ClinicalSummaryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    setSummary(null);
    getPreviousConsultationReport({
      patientUserId: appointment.patient.userId,
      orgId: appointment.orgId,
      excludeAppointmentId: appointment.id,
    })
      .then(([data]) => {
        const soap = parseDoctorReport(data);
        setSummary(soap ? soapToText(soap, patientName) : "");
      })
      .catch(() => setSummary(""));
  }, [appointment.id, appointment.orgId, appointment.patient.userId, patientName]);

  return (
    <Card className={cn("h-full flex flex-col", isExpanded ? "col-span-2" : "col-auto")}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Previous Appointment Clinical Summary
          </div>
        </CardTitle>
        <ActionTooltipProvider label={isExpanded ? "Shrink" : "Expand"}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? (
              <CgCompress className="size-6 text-muted-foreground" />
            ) : (
              <RiExpandHorizontalLine className="size-6 text-muted-foreground" />
            )}
          </Button>
        </ActionTooltipProvider>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {summary === null ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-4 w-1/4 mt-4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-4 w-1/3 mt-4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ) : summary === "" ? (
            <p className="text-sm text-muted-foreground p-4">
              No previous consultation report available.
            </p>
          ) : (
            <div className="whitespace-pre-wrap text-sm text-foreground bg-muted p-4 rounded-md font-mono">
              {summary}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
