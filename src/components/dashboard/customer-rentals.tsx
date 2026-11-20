"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarCheck, Loader2, MapPin, Package, Receipt } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/dashboard/status-pill";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ButtonLink } from "@/components/layout/button-link";
import { authApi } from "@/lib/api";
import { formatCents, formatDateRange } from "@/lib/format";
import type { Booking } from "@/types";

const TABS = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function CustomerRentals({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [tab, setTab] = useState("all");
  const [cancelling, setCancelling] = useState<string | null>(null);

  const filtered = useMemo(
    () => (tab === "all" ? bookings : bookings.filter((item) => item.bookingStatus === tab)),
    [bookings, tab],
  );

  async function cancelBooking(id: string) {
    setCancelling(id);

    try {
      await authApi(`/api/bookings/${id}/cancel`, { method: "PATCH" });
      toast.success("Rental cancelled", {
        description: "The owner has been notified and the payment is marked refunded.",
      });
      router.refresh();
    } catch (error) {
      toast.error("Could not cancel this rental", {
        description: error instanceof Error ? error.message : "Try again.",
      });
    } finally {
      setCancelling(null);
    }
  }

  if (!bookings.length) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="No rentals yet"
        description="When you book equipment, the rental and its payment status will appear here."
        action={<ButtonLink href="/equipment">Browse equipment</ButtonLink>}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 border-b border-border pb-3">
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

      {filtered.length ? (
        <ul className="mt-5 space-y-4">
          {filtered.map((booking) => {
            const canCancel =
              booking.bookingStatus === "confirmed" &&
              new Date(booking.rentalStartDate) > new Date();

            return (
              <li
                key={booking.id}
                className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[132px_1fr]"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted sm:aspect-square">
                  {booking.equipmentImage ? (
                    <Image
                      src={booking.equipmentImage}
                      alt={booking.equipmentName}
                      fill
                      sizes="132px"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/equipment/${booking.equipmentId}`}
                        className="font-heading text-lg hover:text-primary"
                      >
                        {booking.equipmentName}
                      </Link>
                      <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <CalendarCheck className="size-3.5" />
                          {formatDateRange(
                            booking.rentalStartDate,
                            booking.rentalEndDate,
                          )}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Package className="size-3.5" />
                          {booking.quantity} unit{booking.quantity === 1 ? "" : "s"}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <StatusPill status={booking.bookingStatus} />
                      <StatusPill status={booking.paymentStatus} />
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 rounded-xl bg-background p-3 text-xs text-muted-foreground sm:grid-cols-2">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" />
                      {booking.deliveryAddress}
                    </p>
                    <p className="flex items-start gap-1.5">
                      <Receipt className="mt-0.5 size-3.5 shrink-0" />
                      {formatCents(booking.totalAmountCents)} · Booking{" "}
                      <span className="font-mono">{booking.id.slice(-6)}</span>
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Owner: <span className="text-foreground">{booking.ownerName}</span>
                    </p>
                    <div className="flex gap-2">
                      <ButtonLink
                        href={`/equipment/${booking.equipmentId}`}
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        View listing
                      </ButtonLink>
                      {canCancel ? (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-8"
                          onClick={() => cancelBooking(booking.id)}
                          disabled={cancelling === booking.id}
                        >
                          {cancelling === booking.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : null}
                          Cancel
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-5">
          <EmptyState
            icon={CalendarCheck}
            title={`No ${tab} rentals`}
            description="Nothing in this status yet. Switch tabs to see your other bookings."
          />
        </div>
      )}
    </div>
  );
}
