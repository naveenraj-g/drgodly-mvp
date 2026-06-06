"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { ChevronsUpDown, Check, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResolvedConcept } from "../types";

interface Concept {
  id?: number;
  code: string;
  display: string;
  definition?: string;
  system?: string;
  system_name?: string;
  active?: boolean;
}

interface TerminologyComboboxProps {
  system: string;
  initialQuery?: string;
  value?: ResolvedConcept | null;
  onChange: (concept: ResolvedConcept | null) => void;
  placeholder?: string;
  minChars?: number;
  debounceMs?: number;
  limit?: number;
}

export function TerminologyCombobox({
  system,
  initialQuery,
  value,
  onChange,
  placeholder = "Search terminology...",
  minChars = 2,
  debounceMs = 200,
  limit = 20,
}: TerminologyComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Concept[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hasFetchedInitial = useRef(false);
  const currentQuery = useRef("");

  const fetchConcepts = useCallback(
    async (query: string, fetchOffset = 0, append = false) => {
      if (query.trim().length < minChars) {
        setResults([]);
        setTotal(0);
        setOffset(0);
        return;
      }

      append ? setIsLoadingMore(true) : setIsLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          system,
          limit: String(limit),
          offset: String(fetchOffset),
        });
        const res = await fetch(`/api/terminology/search?${params}`);
        if (res.ok) {
          const json = await res.json();
          const data: Concept[] = json.data ?? json.concepts ?? json.results ?? [];
          setTotal(json.total ?? data.length);
          setOffset(fetchOffset + data.length);
          setResults((prev) => (append ? [...prev, ...data] : data));
        }
      } catch {
        if (!append) setResults([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [system, minChars, limit],
  );

  // Auto-search with AI suggestion on mount (only if no value already set)
  useEffect(() => {
    if (initialQuery && !value && !hasFetchedInitial.current) {
      hasFetchedInitial.current = true;
      currentQuery.current = initialQuery;
      fetchConcepts(initialQuery);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchChange = useCallback(
    (val: string) => {
      setSearch(val);
      currentQuery.current = val;
      setResults([]);
      setTotal(0);
      setOffset(0);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchConcepts(val, 0, false), debounceMs);
    },
    [fetchConcepts, debounceMs],
  );

  const handleLoadMore = useCallback(() => {
    fetchConcepts(currentQuery.current, offset, true);
  }, [fetchConcepts, offset]);

  const handleSelect = useCallback(
    (concept: Concept) => {
      onChange({
        code: concept.code,
        display: concept.display,
        system: concept.system ?? system,
        text: concept.display,
      });
      setOpen(false);
      setSearch("");
    },
    [onChange, system],
  );

  const hasMore = total > results.length;
  const triggerWidth = triggerRef.current?.offsetWidth;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal h-auto min-h-9 py-1.5"
        >
          {value ? (
            <span className="flex flex-col items-start text-left gap-0.5">
              <span className="text-sm leading-tight">{value.display}</span>
              <span className="text-xs text-muted-foreground font-mono leading-tight">
                {value.code}
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: triggerWidth ? `${triggerWidth}px` : "360px" }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={handleSearchChange}
          />
          <CommandList className="max-h-[320px]">
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Searching…</span>
                </div>
              ) : search.length > 0 && search.length < minChars ? (
                <p className="text-sm text-muted-foreground py-3 text-center">
                  Type {minChars}+ characters to search
                </p>
              ) : results.length === 0 && !isLoading ? (
                <p className="text-sm text-muted-foreground py-3 text-center">
                  {search.length >= minChars ? "No results found." : "Start typing to search"}
                </p>
              ) : null}
            </CommandEmpty>

            {results.length > 0 && (
              <CommandGroup>
                {results.map((concept, i) => (
                  <CommandItem
                    key={concept.id != null ? `id-${concept.id}` : `${i}-${concept.code}`}
                    value={concept.code}
                    onSelect={() => handleSelect(concept)}
                    className="flex items-start gap-2 py-2.5 px-3"
                  >
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        value?.code === concept.code ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      {/* Display name */}
                      <p className="text-sm font-medium leading-tight">
                        {concept.display}
                      </p>
                      {/* Definition if present */}
                      {concept.definition && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {concept.definition}
                        </p>
                      )}
                      {/* Code + System row */}
                      <div className="flex items-center gap-2 flex-wrap pt-0.5">
                        <span className="font-mono text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {concept.code}
                        </span>
                        {concept.system_name && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                            {concept.system_name}
                          </Badge>
                        )}
                        {concept.system && (
                          <span
                            className="text-[10px] text-muted-foreground/60 truncate max-w-[180px]"
                            title={concept.system}
                          >
                            {concept.system}
                          </span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}

                {/* Load more */}
                {hasMore && (
                  <div className="px-3 py-2 border-t">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full gap-2 text-xs text-muted-foreground h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadMore();
                      }}
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                      {isLoadingMore
                        ? "Loading…"
                        : `Load more (${total - results.length} remaining)`}
                    </Button>
                  </div>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
