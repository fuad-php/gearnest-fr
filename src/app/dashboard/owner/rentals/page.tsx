import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { OwnerBookings } from "@/components/dashboard/owner-bookings";
import { requireRole } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";
import type { Booking } from "@/types";

export const metadata: Metadata = { title: "My Equipment Rental" };

export default async function OwnerRentalsPage() {
  await requireRole(["owner"], "/dashboard/owner/rentals");

  let bookings: Booking[] = [];
  let failed = false;

  try {
    const result = await serverApi<{ data: Booking[] }>("/api/owner/bookings");
    bookings = result.data;
  } catch {
    failed = true;
  }

  return (
    <>
      <PageHeader
        eyebrow="Owner"
        title="My equipment rental"
        description="Requests for your gear. Mark rentals active when they are handed over and completed when they return."
      />

      {failed ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-heading text-lg">Rentals could not load</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The API did not respond. Refresh the page to try again.
          </p>
        </div>
      ) : (
        <OwnerBookings bookings={bookings} />
      )}
    </>
  );
}
