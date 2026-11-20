import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { CustomerRentals } from "@/components/dashboard/customer-rentals";
import { getServerSession, serverApi } from "@/lib/server-api";
import type { AppUser, Booking } from "@/types";

export const metadata: Metadata = { title: "My Rentals" };

export default async function RentalsPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login?next=/dashboard/rentals");

  const user = session.user as unknown as AppUser;
  if (user.role === "owner") redirect("/dashboard/owner/rentals");
  if (user.role === "admin") redirect("/dashboard/admin/rentals");

  let bookings: Booking[] = [];
  let failed = false;

  try {
    const result = await serverApi<{ data: Booking[] }>("/api/bookings/my");
    bookings = result.data;
  } catch {
    failed = true;
  }

  return (
    <>
      <PageHeader
        eyebrow="Customer"
        title="My rentals"
        description="Every booking you have made, with dates, delivery details and payment status."
      />

      {failed ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-heading text-lg">Rentals could not load</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The API did not respond. Refresh the page to try again.
          </p>
        </div>
      ) : (
        <CustomerRentals bookings={bookings} />
      )}
    </>
  );
}
