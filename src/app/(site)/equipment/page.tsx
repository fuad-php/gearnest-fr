import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { Container } from "@/components/layout/container";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import { EquipmentFilters } from "@/components/equipment/equipment-filters";
import { Pagination } from "@/components/layout/pagination";
import { Reveal } from "@/components/motion/reveal";
import { publicApi } from "@/lib/api";
import { FALLBACK_CATEGORIES } from "@/lib/categories";
import type { Category, Equipment, ListResponse } from "@/types";

export const metadata: Metadata = {
  title: "All Equipment",
  description:
    "Browse construction, photography, vehicle, agriculture, electronics and event equipment available for rent.",
};

export const dynamic = "force-dynamic";

const QUERY_KEYS = [
  "search",
  "category",
  "rentalType",
  "minPrice",
  "maxPrice",
  "availability",
  "sort",
  "page",
] as const;

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

type SearchParams = Record<string, string | string[] | undefined>;

async function loadEquipment(params: SearchParams) {
  const query = new URLSearchParams();

  for (const key of QUERY_KEYS) {
    const value = firstValue(params[key]);
    if (value) query.set(key, value);
  }

  query.set("limit", "9");

  try {
    const [list, categories] = await Promise.all([
      publicApi<ListResponse<Equipment>>(`/api/equipment?${query.toString()}`),
      publicApi<{ data: Category[] }>("/api/equipment/categories"),
    ]);

    return {
      list,
      categories: categories.data.length ? categories.data : FALLBACK_CATEGORIES,
      failed: false,
    };
  } catch {
    return {
      list: { data: [], page: 1, limit: 9, total: 0, pages: 1 } as ListResponse<Equipment>,
      categories: FALLBACK_CATEGORIES,
      failed: true,
    };
  }
}

export default async function EquipmentPage({
  searchParams,
}: PageProps<"/equipment">) {
  const params = await searchParams;
  const { list, categories, failed } = await loadEquipment(params);

  return (
    <>
      <section className="border-b border-border bg-muted/50">
        <Container className="py-12 lg:py-16">
          <p className="label-mono flex items-center gap-3 text-muted-foreground">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            The catalogue
          </p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl leading-[1.02] sm:text-5xl">
                Every tool the job needs.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Search by name or location, filter by category, rental type,
                price and availability. Rates are set by verified owners and
                shown up front.
              </p>
            </div>
            <p className="font-mono text-sm text-muted-foreground">
              {list.total} {list.total === 1 ? "listing" : "listings"} available
            </p>
          </div>
        </Container>
      </section>

      <section className="py-10 lg:py-14">
        <Container>
          <EquipmentFilters categories={categories} />

          {failed ? (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="font-heading text-lg">The catalogue could not load</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                The rental API is not responding. Refresh the page or check back
                in a moment.
              </p>
            </div>
          ) : list.data.length ? (
            <>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {list.data.map((item, index) => (
                  <Reveal key={item.id} delay={Math.min(index, 5) * 0.04} className="h-full">
                    <EquipmentCard equipment={item} />
                  </Reveal>
                ))}
              </div>
              <Pagination
                page={list.page}
                pages={list.pages}
                total={list.total}
                limit={list.limit}
              />
            </>
          ) : (
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
                <PackageSearch className="size-6" />
              </span>
              <p className="mt-5 font-heading text-xl">No equipment matches those filters</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Try a broader search, a different category or clear the price
                range. New listings are approved every day.
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
