import Link from "next/link";
import { cn } from "@/lib/utils";

type CategoryTabsProps = {
  basePath: string;
  categories: { label: string; value: string }[];
  activeValue: string;
  preserveParams?: Record<string, string | undefined>;
  accentColor?: string;
  paramName?: string;
  className?: string;
};

export function CategoryTabs({
  basePath,
  categories,
  activeValue,
  preserveParams,
  accentColor = "var(--accent-orange)",
  paramName = "category",
  className,
}: CategoryTabsProps) {
  return (
    <nav
      aria-label="Filter by category"
      className={cn(
        "flex flex-wrap justify-center gap-2 overflow-x-auto",
        className,
      )}
    >
      {categories.map((category) => {
        const isActive = category.value === activeValue;
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(preserveParams ?? {})) {
          if (value) params.set(key, value);
        }
        if (category.value) params.set(paramName, category.value);
        const query = params.toString();

        return (
          <Link
            key={category.value || "all"}
            href={`${basePath}${query ? `?${query}` : ""}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "h-10 shrink-0 rounded-full border px-5 text-sm font-medium transition-colors",
              isActive
                ? "border-transparent text-white"
                : "border-border text-ink/70 bg-white hover:bg-black/[0.03]",
            )}
            style={isActive ? { backgroundColor: accentColor } : undefined}
          >
            {category.label}
          </Link>
        );
      })}
    </nav>
  );
}
