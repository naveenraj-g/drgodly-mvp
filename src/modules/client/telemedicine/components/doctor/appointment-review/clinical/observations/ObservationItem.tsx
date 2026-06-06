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
  OBSERVATION_STATUS,
  type ObservationFormItem,
} from "../../types";

interface ObservationItemProps {
  item: ObservationFormItem;
  onChange: (item: ObservationFormItem) => void;
  onRemove: () => void;
}

export function ObservationItem({ item, onChange, onRemove }: ObservationItemProps) {
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

        {/* Value + Unit */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Value</Label>
            <Input
              value={item.editedValue ?? item.value ?? ""}
              onChange={(e) => onChange({ ...item, editedValue: e.target.value })}
              placeholder="e.g. 101.2"
              className="text-sm h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Unit</Label>
            <Input
              value={item.editedUnit ?? item.unit ?? ""}
              onChange={(e) => onChange({ ...item, editedUnit: e.target.value })}
              placeholder="e.g. F"
              className="text-sm h-9"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <ConceptSelect
            resource="Observation"
            field="status"
            value={item.status}
            onChange={(code) => onChange({ ...item, status: code })}
            placeholder="Select status"
            fallback={OBSERVATION_STATUS}
          />
        </div>
      </CardContent>
    </Card>
  );
}
