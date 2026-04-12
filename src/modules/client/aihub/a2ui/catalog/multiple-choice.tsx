"use client";

import { useState, useMemo } from "react";
import { useDynamicComponent } from "../hooks/use-dynamic-component";
import type { MultipleChoiceNode } from "../types";
import type { IMessageProcessor } from "../rendering/processor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MultipleChoiceProps {
  processor: IMessageProcessor;
  surfaceId: string;
  component: MultipleChoiceNode;
  weight?: string | number;
}

export function MultipleChoice({
  processor,
  surfaceId,
  component,
  weight = "initial",
}: MultipleChoiceProps) {
  const { resolvePrimitive } = useDynamicComponent(
    processor,
    surfaceId,
    component,
    weight,
  );

  const options =
    component.properties.options || component.properties.items || [];
  const initialValue = useMemo(
    () =>
      resolvePrimitive(component.properties.value) ||
      resolvePrimitive(component.properties.selections) ||
      "",
    [
      resolvePrimitive,
      component.properties.value,
      component.properties.selections,
    ],
  );
  const [selectedValue, setSelectedValue] = useState(initialValue);

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <div style={{ flex: weight }}>
      <Select value={selectedValue} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => {
            const label = resolvePrimitive(option.label);
            const value = option.value;
            return (
              <SelectItem key={index} value={value}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
