"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  paramName?: string;
  placeholder?: string;
  className?: string;
};

export function SearchBar({
  paramName = "q",
  placeholder = "Search",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramName) ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  function handleChange(next: string) {
    setValue(next);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) {
        params.set(paramName, next);
      } else {
        params.delete(paramName);
      }
      params.delete("page");
      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    }, 350);
  }

  return (
    <div className={cn("relative", className)}>
      <Search className="text-body-gray pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
      <input
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="border-border h-11 w-full rounded-full border bg-white py-2 pr-4 pl-11 text-sm placeholder:text-body-gray/70 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 focus:outline-none"
      />
    </div>
  );
}
