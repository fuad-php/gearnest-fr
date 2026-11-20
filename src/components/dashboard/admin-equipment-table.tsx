"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2, Search, Wrench, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusPill } from "@/components/dashboard/status-pill";
import { authApi } from "@/lib/api";
import { formatCurrency, RENTAL_SUFFIX } from "@/lib/format";
import type { Equipment } from "@/types";

const TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function AdminEquipmentTable({ items }: { items: Equipment[] }) {
  const router = useRouter();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesStatus = tab === "all" || item.status === tab;
      const matchesTerm =
        !term ||
        item.name.toLowerCase().includes(term) ||
        (item.ownerName ?? "").toLowerCase().includes(term) ||
        (item.ownerEmail ?? "").toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  }, [items, tab, search]);

  async function setStatus(item: Equipment, status: "approved" | "rejected") {
    setUpdating(item.id);

    try {
      await authApi(`/api/admin/equipment/${item.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(
        status === "approved"
          ? `${item.name} is live in the catalogue`
          : `${item.name} was rejected`,
      );
      router.refresh();
    } catch (error) {
      toast.error("Could not update this listing", {
        description: error instanceof Error ? error.message : "Try again.",
      });
    } finally {
      setUpdating(null);
    }
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={Wrench}
        title="No equipment listed"
        description="Owner listings will appear here for review."
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((item) => {
            const count =
              item.value === "all"
                ? items.length
                : items.filter((equipment) => equipment.status === item.value).length;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setTab(item.value)}
                aria-pressed={tab === item.value}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
                  tab === item.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
                <span className="font-mono text-[11px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search listing or owner"
            className="h-10 pl-9"
            aria-label="Search equipment"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="max-h-[620px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead className="hidden md:table-cell">Owner</TableHead>
                <TableHead className="hidden sm:table-cell">Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Moderation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/equipment/${item.id}`}
                          className="block truncate text-sm font-medium hover:text-primary"
                        >
                          {item.name}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.category} · {item.location}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-sm">{item.ownerName || "—"}</p>
                    <p className="text-xs text-muted-foreground">{item.ownerEmail || ""}</p>
                  </TableCell>
                  <TableCell className="hidden font-mono text-sm sm:table-cell">
                    {formatCurrency(item.price)}
                    <span className="text-xs text-muted-foreground">
                      {RENTAL_SUFFIX[item.rentalType]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusPill status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {updating === item.id ? (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      ) : null}
                      {item.status !== "approved" ? (
                        <Button
                          type="button"
                          size="sm"
                          className="h-8"
                          onClick={() => setStatus(item, "approved")}
                          disabled={updating === item.id}
                        >
                          <Check className="size-3.5" />
                          Approve
                        </Button>
                      ) : null}
                      {item.status !== "rejected" ? (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-8"
                          onClick={() => setStatus(item, "rejected")}
                          disabled={updating === item.id}
                        >
                          <X className="size-3.5" />
                          Reject
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {!filtered.length ? (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No listings match those filters.
        </p>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {filtered.length} of {items.length} listings.
        </p>
      )}
    </div>
  );
}
