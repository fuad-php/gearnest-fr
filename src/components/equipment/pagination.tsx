"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";

export function Pagination({ page, pages }: { page: number; pages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pages <= 1) return null;

  function hrefFor(target: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (target <= 1) params.delete("page");
    else params.set("page", String(target));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  const windowStart = Math.max(1, Math.min(page - 2, pages - 4));
  const windowEnd = Math.min(pages, windowStart + 4);
  const numbers = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, index) => windowStart + index,
  );

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        tabIndex={page === 1 ? -1 : undefined}
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm transition-colors hover:bg-muted",
          page === 1 && "pointer-events-none opacity-40",
        )}
      >
        <ChevronLeft className="size-4" />
        Prev
      </Link>

      {windowStart > 1 ? (
        <>
          <Link
            href={hrefFor(1)}
            className="grid size-9 place-items-center rounded-lg border border-border text-sm hover:bg-muted"
          >
            1
          </Link>
          {windowStart > 2 ? (
            <span className="px-1 text-sm text-muted-foreground">…</span>
          ) : null}
        </>
      ) : null}

      {numbers.map((number) => (
        <Link
          key={number}
          href={hrefFor(number)}
          aria-current={number === page ? "page" : undefined}
          className={cn(
            "grid size-9 place-items-center rounded-lg border text-sm transition-colors",
            number === page
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:bg-muted",
          )}
        >
          {number}
        </Link>
      ))}

      {windowEnd < pages ? (
        <>
          {windowEnd < pages - 1 ? (
            <span className="px-1 text-sm text-muted-foreground">…</span>
          ) : null}
          <Link
            href={hrefFor(pages)}
            className="grid size-9 place-items-center rounded-lg border border-border text-sm hover:bg-muted"
          >
            {pages}
          </Link>
        </>
      ) : null}

      <Link
        href={hrefFor(Math.min(pages, page + 1))}
        aria-disabled={page === pages}
        tabIndex={page === pages ? -1 : undefined}
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm transition-colors hover:bg-muted",
          page === pages && "pointer-events-none opacity-40",
        )}
      >
        Next
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}
