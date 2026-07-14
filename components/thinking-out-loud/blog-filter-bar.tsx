import { SearchBar } from "@/components/ui/search-bar";
import { CategoryTabs } from "@/components/ui/category-tabs";
import type { PostCategory } from "@/lib/wordpress/posts";

type BlogFilterBarProps = {
  categories: PostCategory[];
  activeCategory: string;
  activeSearch?: string;
};

export function BlogFilterBar({
  categories,
  activeCategory,
  activeSearch,
}: BlogFilterBarProps) {
  const categoryOptions = [
    { label: "All", value: "" },
    ...categories.map((category) => ({
      label: category.name,
      value: category.slug,
    })),
  ];

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-6 pb-10 md:flex-row md:items-center md:justify-between">
      <SearchBar
        placeholder="Search posts"
        className="w-full md:max-w-xs"
      />
      <CategoryTabs
        basePath="/thinking-out-loud"
        categories={categoryOptions}
        activeValue={activeCategory}
        preserveParams={{ q: activeSearch }}
        accentColor="var(--pastel-mustard)"
        className="md:justify-end"
      />
    </div>
  );
}
