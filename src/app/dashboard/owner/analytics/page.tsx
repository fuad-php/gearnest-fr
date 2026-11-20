import type { Metadata } from "next";
import { BarChart3, Boxes, CalendarCheck, CircleDollarSign, Wallet } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { MonthlyChart } from "@/components/charts/monthly-chart";
import { requireRole } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";
import { formatCents } from "@/lib/format";
import type { OwnerStats } from "@/types";

export const metadata: Metadata = { title: "Owner Analytics" };

const EMPTY: OwnerStats = {
  totalEquipment: 0,
  approvedEquipment: 0,
  totalBookings: 0,
  completedRentals: 0,
  totalEarningsCents: 0,
  monthly: [],
};

export default async function OwnerAnalyticsPage() {
  await requireRole(["owner"], "/dashboard/owner/analytics");

  let stats = EMPTY;
  let failed = false;

  try {
    const result = await serverApi<{ data: OwnerStats }>("/api/owner/stats");
    stats = result.data;
  } catch {
    failed = true;
  }

  return (
    <>
      <PageHeader
        eyebrow="Owner"
        title="Analytics"
        description="How your listings are performing: equipment, completed rentals and earnings over the last six months."
      />

      {failed ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-heading text-lg">Analytics could not load</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The API did not respond. Refresh the page to try again.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Equipment listed"
              value={stats.totalEquipment}
              hint={`${stats.approvedEquipment} approved and live`}
              icon={Boxes}
            />
            <StatCard
              label="Total rentals"
              value={stats.totalBookings}
              hint="All bookings on your gear"
              icon={CalendarCheck}
            />
            <StatCard
              label="Completed rentals"
              value={stats.completedRentals}
              hint="Returned and closed out"
              icon={BarChart3}
            />
            <StatCard
              label="Earnings"
              value={formatCents(stats.totalEarningsCents)}
              hint="Paid rentals, before platform fees"
              icon={Wallet}
              tone="dark"
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="label-mono text-muted-foreground">Bookings</p>
                  <h2 className="mt-1 font-heading text-lg">Last six months</h2>
                </div>
                <CircleDollarSign className="size-5 text-primary" />
              </div>
              <div className="mt-4">
                <MonthlyChart data={stats.monthly} metric="bookings" />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="label-mono text-muted-foreground">Earnings</p>
                  <h2 className="mt-1 font-heading text-lg">Monthly revenue</h2>
                </div>
                <Wallet className="size-5 text-accent" />
              </div>
              <div className="mt-4">
                <MonthlyChart data={stats.monthly} metric="revenue" />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
