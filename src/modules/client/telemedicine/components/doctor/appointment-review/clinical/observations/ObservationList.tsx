"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ObservationItem } from "./ObservationItem";
import type { ObservationFormItem } from "../../types";

interface ObservationListProps {
  items: ObservationFormItem[];
  onChange: (items: ObservationFormItem[]) => void;
}

function emptyObservation(): ObservationFormItem {
  return {
    id: crypto.randomUUID(),
    display: "",
    terminologySystem: "LOINC",
    value: null,
    unit: null,
  };
}

export function ObservationList({ items, onChange }: ObservationListProps) {
  const update = (index: number, item: ObservationFormItem) => {
    const next = [...items];
    next[index] = item;
    onChange(next);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  const add = () => onChange([...items, emptyObservation()]);

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          No observations — add one below.
        </p>
      )}
      {items.map((item, i) => (
        <ObservationItem
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
        Add Observation
      </Button>
    </div>
  );
}
