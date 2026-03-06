"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MATERIALS = [
  "Sterling Silver",
  "Gold-Plated Brass",
  "Gold Vermeil",
  "Cashmere",
  "Leather",
  "Silk",
  "Enamel on Brass",
] as const;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "top-rated", label: "Top Rated" },
] as const;

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  searchParams: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    material?: string;
    inStock?: string;
    sort?: string;
  };
}

function FilterContent({ categories, searchParams }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();

  const selectedCategories = searchParams.category?.split(",") ?? [];
  const selectedMaterials = searchParams.material?.split(",") ?? [];

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(currentSearchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      // Reset to page 1 on filter change
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [currentSearchParams, pathname, router]
  );

  const toggleInList = useCallback(
    (key: string, item: string, currentList: string[]) => {
      const next = currentList.includes(item)
        ? currentList.filter((i) => i !== item)
        : [...currentList, item];
      updateParams(key, next.length > 0 ? next.join(",") : null);
    },
    [updateParams]
  );

  const clearAll = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  const hasActiveFilters =
    searchParams.category ||
    searchParams.minPrice ||
    searchParams.maxPrice ||
    searchParams.material ||
    searchParams.inStock ||
    searchParams.sort;

  return (
    <div className="flex flex-col gap-6">
      {/* Sort */}
      <div>
        <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-espresso/70">
          Sort By
        </Label>
        <Select
          value={searchParams.sort ?? ""}
          onValueChange={(value) => updateParams("sort", value || null)}
        >
          <SelectTrigger className="w-full border-blush bg-ivory text-espresso">
            <SelectValue placeholder="Select order" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div>
        <Label className="mb-3 text-xs font-semibold uppercase tracking-wider text-espresso/70">
          Category
        </Label>
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() =>
                  toggleInList("category", cat.slug, selectedCategories)
                }
                className="data-[state=checked]:border-champagne-gold data-[state=checked]:bg-champagne-gold"
              />
              <span className="text-sm text-espresso">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="mb-3 text-xs font-semibold uppercase tracking-wider text-espresso/70">
          Price Range
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            min={0}
            value={searchParams.minPrice ?? ""}
            onChange={(e) => updateParams("minPrice", e.target.value || null)}
            className="h-9 border-blush bg-ivory text-sm text-espresso placeholder:text-espresso/40"
          />
          <span className="text-sm text-espresso/50">&ndash;</span>
          <Input
            type="number"
            placeholder="Max"
            min={0}
            value={searchParams.maxPrice ?? ""}
            onChange={(e) => updateParams("maxPrice", e.target.value || null)}
            className="h-9 border-blush bg-ivory text-sm text-espresso placeholder:text-espresso/40"
          />
        </div>
      </div>

      {/* Material */}
      <div>
        <Label className="mb-3 text-xs font-semibold uppercase tracking-wider text-espresso/70">
          Material
        </Label>
        <div className="flex flex-col gap-2.5">
          {MATERIALS.map((material) => (
            <label
              key={material}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={selectedMaterials.includes(material)}
                onCheckedChange={() =>
                  toggleInList("material", material, selectedMaterials)
                }
                className="data-[state=checked]:border-champagne-gold data-[state=checked]:bg-champagne-gold"
              />
              <span className="text-sm text-espresso">{material}</span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex cursor-pointer items-center gap-2.5">
          <Checkbox
            checked={searchParams.inStock === "true"}
            onCheckedChange={(checked) =>
              updateParams("inStock", checked ? "true" : null)
            }
            className="data-[state=checked]:border-champagne-gold data-[state=checked]:bg-champagne-gold"
          />
          <span className="text-sm font-medium text-espresso">
            In Stock Only
          </span>
        </label>
      </div>

      {/* Clear All */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearAll}
          className="mt-1 w-full border-espresso/20 text-espresso hover:bg-blush"
        >
          <X className="size-3.5" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
}

export function ProductFilters({
  categories,
  searchParams,
}: ProductFiltersProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <h2 className="mb-5 font-serif text-lg text-espresso">Filters</h2>
        <FilterContent categories={categories} searchParams={searchParams} />
      </aside>

      {/* Mobile sheet trigger + sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-espresso/20 text-espresso hover:bg-blush"
            >
              <SlidersHorizontal className="size-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto bg-warm-sand">
            <SheetHeader>
              <SheetTitle className="font-serif text-lg text-espresso">
                Filters
              </SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <FilterContent
                categories={categories}
                searchParams={searchParams}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
