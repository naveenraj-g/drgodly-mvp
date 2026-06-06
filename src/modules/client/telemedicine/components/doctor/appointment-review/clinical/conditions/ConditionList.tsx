"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ConditionItem } from "./ConditionItem";
import type { ConditionFormItem } from "../../types";

interface ConditionListProps {
  items: ConditionFormItem[];
  onChange: (items: ConditionFormItem[]) => void;
}

function emptyCondition(): ConditionFormItem {
  return {
    id: crypto.randomUUID(),
    display: "",
    terminologySystem: "SNOMED",
  };
}

export function ConditionList({ items, onChange }: ConditionListProps) {
  const update = (index: number, item: ConditionFormItem) => {
    const next = [...items];
    next[index] = item;
    onChange(next);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  const add = () => onChange([...items, emptyCondition()]);

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          No conditions — add one below.
        </p>
      )}
      {items.map((item, i) => (
        <ConditionItem
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
        Add Condition
      </Button>
    </div>
  );
}
