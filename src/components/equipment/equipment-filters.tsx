"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RENTAL_TYPES } from "@/lib/categories";

const SORTS = [
  { value: "recent", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name_asc", label: "Name: A to Z" },
];

const AVAILABILITY = [
  { value: "all", label: "Any availability" },
  { value: "available", label: "Available now" },
];

const selectClass =
  "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30";

export function EquipmentFilters({
  categories,
}: {
  categories: { label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const category = searchParams.get("category") ?? "all";
  const rentalType = searchParams.get("rentalType") ?? "all";
  const availability = searchParams.get("availability") ?? "all";
  const sort = searchParams.get("sort") ?? "recent";

  const activeCount = ["category", "rentalType", "availability", "minPrice", "maxPrice", "search"].filter(
    (key) => {
      const value = searchParams.get(key);
      return value && value !== "all" && value !== "";
    },
  ).length;

  function pushParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(patch)) {
      if (!value || value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (search === current) return;

    const timer = setTimeout(() => pushParams({ search: search || null }), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function applyPrice() {
    pushParams({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
    });
  }

  function clearAll() {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => router.push(pathname, { scroll: false }));
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="equipment-search" className="label-mono text-muted-foreground">
            Search
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="equipment-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, brand or location"
              className="h-11 pl-9"
            />
            {isPending ? (
              <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            ) : null}
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="filter-category" className="label-mono text-muted-foreground">
              Category
            </Label>
            <select
              id="filter-category"
              value={category}
              onChange={(event) => pushParams({ category: event.target.value })}
              className={selectClass}
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item.label} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-type" className="label-mono text-muted-foreground">
              Rental type
            </Label>
            <select
              id="filter-type"
              value={rentalType}
              onChange={(event) => pushParams({ rentalType: event.target.value })}
              className={selectClass}
            >
              <option value="all">Any type</option>
              {RENTAL_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-availability" className="label-mono text-muted-foreground">
              Availability
            </Label>
            <select
              id="filter-availability"
              value={availability}
              onChange={(event) => pushParams({ availability: event.target.value })}
              className={selectClass}
            >
              {AVAILABILITY.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-min" className="label-mono text-muted-foreground">
              Min price
            </Label>
            <Input
              id="filter-min"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="$0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              onBlur={applyPrice}
              onKeyDown={(event) => {
                if (event.key === "Enter") applyPrice();
              }}
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-max" className="label-mono text-muted-foreground">
              Max price
            </Label>
            <Input
              id="filter-max"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="$1000"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              onBlur={applyPrice}
              onKeyDown={(event) => {
                if (event.key === "Enter") applyPrice();
              }}
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-sort" className="label-mono text-muted-foreground">
              Sort by
            </Label>
            <select
              id="filter-sort"
              value={sort}
              onChange={(event) => pushParams({ sort: event.target.value })}
              className={selectClass}
            >
              {SORTS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <SlidersHorizontal className="size-3.5" />
          {activeCount ? `${activeCount} filter${activeCount > 1 ? "s" : ""} active` : "No filters applied"}
        </p>
        {activeCount ? (
          <Button type="button" variant="ghost" size="sm" onClick={clearAll}>
            <X className="size-3.5" />
            Clear filters
          </Button>
        ) : null}
      </div>
    </div>
  );
}
