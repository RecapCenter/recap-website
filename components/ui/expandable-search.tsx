"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchSuggestion = { id: string | number; label: string };

type ExpandableSearchProps = {
  value: string;
  onValueChange: (value: string) => void;
  suggestions?: SearchSuggestion[];
  onSelectSuggestion?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  accentColor?: string;
  className?: string;
};

export function ExpandableSearch({
  value,
  onValueChange,
  suggestions = [],
  onSelectSuggestion,
  placeholder = "Search",
  accentColor = "var(--accent-orange)",
  className,
}: ExpandableSearchProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node) && !value) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  function toggle() {
    if (open && !value) {
      setOpen(false);
      return;
    }
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const showSuggestions = open && value.trim().length > 0 && suggestions.length > 0;

  return (
    <div ref={containerRef} className={cn("relative flex justify-end", className)}>
      <div
        className={cn(
          "border-border flex h-11 shrink-0 items-center overflow-hidden rounded-full border bg-white transition-[width] duration-300 ease-out",
          open ? "w-full max-w-xs" : "w-11",
        )}
        style={open ? { boxShadow: `0 0 0 2px ${accentColor}33` } : undefined}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label="Search"
          aria-expanded={open}
          className="flex h-11 w-11 shrink-0 items-center justify-center"
        >
          <Search className="text-body-gray size-4" />
        </button>
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && toggle()}
          placeholder={placeholder}
          aria-label={placeholder}
          tabIndex={open ? 0 : -1}
          className={cn(
            "text-ink h-full w-full min-w-0 bg-transparent pr-2 text-sm placeholder:text-body-gray/70 focus:outline-none",
            !open && "pointer-events-none opacity-0",
          )}
        />
        {open && value && (
          <button
            type="button"
            onClick={() => {
              onValueChange("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="mr-3 flex size-5 shrink-0 items-center justify-center rounded-full text-body-gray/70 hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {showSuggestions && (
        <ul
          role="listbox"
          className="border-border absolute top-[calc(100%+8px)] right-0 z-20 max-h-72 w-full max-w-xs overflow-y-auto rounded-2xl border bg-white p-2 shadow-lg"
        >
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <button
                type="button"
                onClick={() => {
                  onSelectSuggestion?.(suggestion);
                  setOpen(false);
                }}
                className="text-ink block w-full truncate rounded-xl px-3 py-2 text-left text-sm hover:bg-black/[0.04]"
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
