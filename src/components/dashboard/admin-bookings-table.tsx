"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, Search } from "lucide-react";
import { cn } from "cn";
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
import { formatCents, formatDateRange } from "@/lib/format";
import type { Booking } from "@/types";

const TABS = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function AdminBookingsTable({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus = tab === "all" || booking.bookingStatus === tab;
      const matchesTerm =
        !term ||
        booking.equipmentName.toLowerCase().includes(term) ||
        booking.customerName.toLowerCase().includes(term) ||
        booking.customerEmail.toLowerCase().includes(term) ||
        booking.ownerName.toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  }, [bookings, tab, search]);

  if (!bookings.length) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="No rentals yet"
        description="Confirmed bookings from across the marketplace will appear here."
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
                ? bookings.length
                : bookings.filter((booking) => booking.bookingStatus === item.value).length;

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
            placeholder="Search rental or person"
            className="h-10 pl-9"
            aria-label="Search rentals"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="max-h-[620px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                <TableHead>Rental</TableHead>
                <TableHead className="hidden md:table-cell">Customer</TableHead>
                <TableHead className="hidden lg:table-cell">Owner</TableHead>
                <TableHead className="hidden sm:table-cell">Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <p className="text-sm font-medium">{booking.equipmentName}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {booking.quantity} unit{booking.quantity === 1 ? "" : "s"} ·{" "}
                      {booking.id.slice(-6)}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-sm">{booking.customerName}</p>
                    <p className="text-xs text-muted-foreground">{booking.customerEmail}</p>
                  </TableCell>
                  <TableCell className="hidden text-sm lg:table-cell">
                    {booking.ownerName}
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-sm text-muted-foreground sm:table-cell">
                    {formatDateRange(booking.rentalStartDate, booking.rentalEndDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <StatusPill status={booking.bookingStatus} />
                      <StatusPill status={booking.paymentStatus} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">
                    {formatCents(booking.totalAmountCents)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {!filtered.length ? (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No rentals match those filters.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-3 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Showing {filtered.length} of {bookings.length} rentals · Refresh
        </button>
      )}
    </div>
  );
}
