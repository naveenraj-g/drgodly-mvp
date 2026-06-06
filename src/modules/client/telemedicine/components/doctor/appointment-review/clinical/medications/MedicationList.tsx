"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MedicationItem } from "./MedicationItem";
import type { MedicationFormItem } from "../../types";

interface MedicationListProps {
  items: MedicationFormItem[];
  onChange: (items: MedicationFormItem[]) => void;
}

function emptyMedication(): MedicationFormItem {
  return {
    id: crypto.randomUUID(),
    display: "",
    terminologySystem: "RXNORM",
    dose: null,
    frequency: null,
    duration: null,
    route: null,
  };
}

export function MedicationList({ items, onChange }: MedicationListProps) {
  const update = (index: number, item: MedicationFormItem) => {
    const next = [...items];
    next[index] = item;
    onChange(next);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  const add = () => onChange([...items, emptyMedication()]);

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          No medications — add one below.
        </p>
      )}
      {items.map((item, i) => (
        <MedicationItem
          key={item.id}
          item={item}
          onChange={(updated) => update(i, updated)}
          onRemove={() => remove(i)}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 w-full"
        onClick={add}
      >
        <Plus className="h-4 w-4" />
        Add Medication
      </Button>
    </div>
  );
}
