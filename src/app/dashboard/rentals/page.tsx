import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { CustomerRentals } from "@/components/dashboard/customer-rentals";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ButtonLink } from "@/components/layout/button-link";
import { getServerSession, serverApi } from "@/lib/server-api";
import type { AppUser, Booking, BookingCounts, ListResponse } from "@/types";

export const metadata: Metadata = { title: "My Rentals" };

const STATUSES = ["all", "confirmed", "active", "completed", "cancelled"] as const;

type RentalStatus = (typeof STATUSES)[number];

const PAGE_SIZE = 6;

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function RentalsPage({
  searchParams,
}: PageProps<"/dashboard/rentals">) {
  const session = await getServerSession();
  if (!session?.user) redirect("/login?next=/dashboard/rentals");

  const user = session.user as unknown as AppUser;
  if (user.role === "owner") redirect("/dashboard/owner/rentals");
  if (user.role === "admin") redirect("/dashboard/admin/rentals");

  const params = await searchParams;
  const requestedStatus = firstValue(params.status) as RentalStatus | undefined;
  const status: RentalStatus = STATUSES.includes(requestedStatus as RentalStatus)
    ? (requestedStatus as RentalStatus)
    : "all";

  const requestedPage = Number(firstValue(params.page));
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1;

  let bookings: Booking[] = [];
  let counts: BookingCounts = {
    all: 0,
    confirmed: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
  };
  let pages = 1;
  let total = 0;
  let failed = false;

  try {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
      status,
    });

    const result = await serverApi<
      ListResponse<Booking> & { counts?: BookingCounts }
    >(`/api/bookings/my?${query.toString()}`);

    bookings = result.data;
    counts = result.counts ?? counts;
    pages = result.pages;
    total = result.total;
  } catch {
    failed = true;
  }

  // Paging past the end (stale link, or the last item on a page was cancelled).
  if (!failed && page > pages) {
    const next = new URLSearchParams();
    if (status !== "all") next.set("status", status);
    if (pages > 1) next.set("page", String(pages));
    const query = next.toString();
    redirect(`/dashboard/rentals${query ? `?${query}` : ""}`);
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
      ) : counts.all === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No rentals yet"
          description="When you book equipment, the rental and its payment status will appear here."
          action={<ButtonLink href="/equipment">Browse equipment</ButtonLink>}
        />
      ) : (
        <CustomerRentals
          bookings={bookings}
          page={page}
          pages={pages}
          total={total}
          status={status}
          counts={counts}
        />
      )}
    </>
  );
}
