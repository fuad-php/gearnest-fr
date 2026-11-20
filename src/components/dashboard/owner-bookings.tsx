"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  PlayCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/layout/button-link";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusPill } from "@/components/dashboard/status-pill";
import { authApi } from "@/lib/api";
import { formatCents, formatDateRange } from "@/lib/format";
import type { Booking, BookingStatus } from "@/types";

const TABS = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function OwnerBookings({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [tab, setTab] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = useMemo(
    () => (tab === "all" ? bookings : bookings.filter((item) => item.bookingStatus === tab)),
    [bookings, tab],
  );

  async function updateStatus(id: string, status: BookingStatus) {
    setUpdating(id);

    try {
      await authApi(`/api/owner/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(
        status === "active"
          ? "Rental marked active"
          : status === "completed"
            ? "Rental completed"
            : "Rental cancelled",
      );
      router.refresh();
    } catch (error) {
      toast.error("Could not update this rental", {
        description: error instanceof Error ? error.message : "Try again.",
      });
    } finally {
      setUpdating(null);
    }
  }

  if (!bookings.length) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="No rental requests yet"
        description="When a customer books your equipment, their details and dates will appear here."
        action={<ButtonLink href="/dashboard/owner/add-equipment">Add more equipment</ButtonLink>}
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
          {filtered.map((booking) => (
            <li
              key={booking.id}
              className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[120px_1fr]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted sm:aspect-square">
                {booking.equipmentImage ? (
                  <Image
                    src={booking.equipmentImage}
                    alt={booking.equipmentName}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="label-mono text-muted-foreground">
                      {booking.quantity} × {booking.equipmentName}
                    </p>
                    <p className="mt-1 font-heading text-lg">{booking.customerName}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarCheck className="size-3.5" />
                        {formatDateRange(booking.rentalStartDate, booking.rentalEndDate)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Mail className="size-3.5" />
                        {booking.customerEmail}
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
                    <Phone className="mt-0.5 size-3.5 shrink-0" />
                    {booking.contactNumber}
                  </p>
                  <p className="flex items-start gap-1.5">
                    <MapPin className="mt-0.5 size-3.5 shrink-0" />
                    {booking.deliveryAddress}
                  </p>
                  {booking.notes ? (
                    <p className="sm:col-span-2">“{booking.notes}”</p>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-sm font-semibold">
                    {formatCents(booking.totalAmountCents)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <ButtonLink
                      href={`/equipment/${booking.equipmentId}`}
                      variant="outline"
                      size="sm"
                      className="h-8"
                    >
                      View listing
                    </ButtonLink>
                    {booking.bookingStatus === "confirmed" ? (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          className="h-8"
                          onClick={() => updateStatus(booking.id, "active")}
                          disabled={updating === booking.id}
                        >
                          {updating === booking.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <PlayCircle className="size-3.5" />
                          )}
                          Mark active
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-8"
                          onClick={() => updateStatus(booking.id, "cancelled")}
                          disabled={updating === booking.id}
                        >
                          <XCircle className="size-3.5" />
                          Cancel
                        </Button>
                      </>
                    ) : null}
                    {booking.bookingStatus === "active" ? (
                      <Button
                        type="button"
                        size="sm"
                        className="h-8"
                        onClick={() => updateStatus(booking.id, "completed")}
                        disabled={updating === booking.id}
                      >
                        {updating === booking.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="size-3.5" />
                        )}
                        Mark completed
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          ))}
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
