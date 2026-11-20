import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { AdminBookingsTable } from "@/components/dashboard/admin-bookings-table";
import { requireRole } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";
import type { Booking, ListResponse } from "@/types";

export const metadata: Metadata = { title: "All Rentals" };

export default async function AdminRentalsPage() {
  await requireRole(["admin"], "/dashboard/admin/rentals");

  let bookings: Booking[] = [];
  let failed = false;

  try {
    const result = await serverApi<ListResponse<Booking>>(
      "/api/admin/bookings?limit=50",
    );
    bookings = result.data;
  } catch {
    failed = true;
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="All rentals"
        description="Every confirmed rental across the marketplace, with customer, owner, dates, payment and booking status."
      />

      {failed ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-heading text-lg">Rentals could not load</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The API did not respond. Refresh the page to try again.
          </p>
        </div>
      ) : (
        <AdminBookingsTable bookings={bookings} />
      )}
    </>
  );
}
