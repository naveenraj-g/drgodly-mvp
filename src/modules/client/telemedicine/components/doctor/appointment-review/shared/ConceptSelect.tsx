"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Concept {
  code: string;
  display: string;
}

interface ConceptSelectProps {
  resource: string;
  field: string;
  value?: string;
  onChange: (code: string) => void;
  placeholder?: string;
  fallback?: Concept[];
  limit?: number;
  offset?: number;
}

export function ConceptSelect({
  resource,
  field,
  value,
  onChange,
  placeholder = "Select...",
  fallback = [],
  limit = 100,
  offset = 0,
}: ConceptSelectProps) {
  const [open, setOpen] = useState(false);
  const [concepts, setConcepts] = useState<Concept[]>(fallback);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams({
          resource,
          field,
          limit: String(limit),
          offset: String(offset),
        });
        const res = await fetch(`/api/terminology/concepts?${params}`);
        if (res.ok) {
          const json = await res.json();
          const list: Concept[] = json.data ?? json.concepts ?? json.results ?? [];
          setConcepts(list.length ? list : fallback);
        }
      } catch {
        // keep fallback
      }
    })();
  }, [resource, field]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    if (!search.trim()) return concepts;
    const q = search.toLowerCase();
    return concepts.filter(
      (c) =>
        c.display?.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q),
    );
  }, [concepts, search]);

  const selected = concepts.find((c) => c.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selected ? (
            <span className="text-sm capitalize">{selected.display}</span>
          ) : (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[220px]" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {filtered.map((concept) => (
                <CommandItem
                  key={concept.code}
                  value={concept.code}
                  onSelect={() => {
                    onChange(concept.code);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === concept.code ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="text-sm">{concept.display}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
