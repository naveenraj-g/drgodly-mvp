"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Sparkles } from "lucide-react";
import { TerminologyCombobox } from "../../shared/TerminologyCombobox";
import { ConceptSelect } from "../../shared/ConceptSelect";
import {
  TERMINOLOGY_SYSTEM_URL,
  MEDICATION_REQUEST_STATUS,
  MEDICATION_REQUEST_INTENT,
  type MedicationFormItem,
} from "../../types";

interface MedicationItemProps {
  item: MedicationFormItem;
  onChange: (item: MedicationFormItem) => void;
  onRemove: () => void;
}

export function MedicationItem({ item, onChange, onRemove }: MedicationItemProps) {
  const system =
    TERMINOLOGY_SYSTEM_URL[item.terminologySystem] ?? item.terminologySystem;

  return (
    <Card>
      <CardContent className="pt-4 pb-4 space-y-3">
        {/* AI badge header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Badge variant="secondary" className="gap-1 shrink-0 text-xs">
              <Sparkles className="h-3 w-3" />
              AI
            </Badge>
            <span className="text-sm text-muted-foreground truncate">{item.display}</span>
            <Badge variant="outline" className="text-xs shrink-0 font-mono">
              {item.terminologySystem}
            </Badge>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Terminology search */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            Terminology Code ({item.terminologySystem})
          </Label>
          <TerminologyCombobox
            system={system}
            initialQuery={item.display}
            value={item.resolved ?? null}
            onChange={(concept) =>
              onChange({ ...item, resolved: concept ?? undefined })
            }
            placeholder={`Search ${item.terminologySystem}...`}
          />
        </div>

        {/* Dosage grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Dose</Label>
            <Input
              value={item.editedDose ?? item.dose ?? ""}
              onChange={(e) => onChange({ ...item, editedDose: e.target.value })}
              placeholder="e.g. 500 mg"
              className="text-sm h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Route</Label>
            <Input
              value={item.editedRoute ?? item.route ?? ""}
              onChange={(e) => onChange({ ...item, editedRoute: e.target.value })}
              placeholder="e.g. Oral"
              className="text-sm h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Frequency</Label>
            <Input
              value={item.editedFrequency ?? item.frequency ?? ""}
              onChange={(e) => onChange({ ...item, editedFrequency: e.target.value })}
              placeholder="e.g. Three times daily"
              className="text-sm h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Duration</Label>
            <Input
              value={item.editedDuration ?? item.duration ?? ""}
              onChange={(e) => onChange({ ...item, editedDuration: e.target.value })}
              placeholder="e.g. 7 days"
              className="text-sm h-9"
            />
          </div>
        </div>

        {/* Status + Intent */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <ConceptSelect
              resource="MedicationRequest"
              field="status"
              value={item.status}
              onChange={(code) => onChange({ ...item, status: code })}
              placeholder="Select status"
              fallback={MEDICATION_REQUEST_STATUS}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Intent</Label>
            <ConceptSelect
              resource="MedicationRequest"
              field="intent"
              value={item.intent}
              onChange={(code) => onChange({ ...item, intent: code })}
              placeholder="Select intent"
              fallback={MEDICATION_REQUEST_INTENT}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
