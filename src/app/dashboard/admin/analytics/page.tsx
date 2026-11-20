import type { Metadata } from "next";
import {
  BarChart3,
  Boxes,
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  ShieldAlert,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { MonthlyChart } from "@/components/charts/monthly-chart";
import { requireRole } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";
import { formatCents } from "@/lib/format";
import type { AdminStats } from "@/types";

export const metadata: Metadata = { title: "Platform Analytics" };

const EMPTY: AdminStats = {
  totalUsers: 0,
  totalOwners: 0,
  totalCustomers: 0,
  totalEquipment: 0,
  pendingApprovals: 0,
  totalBookings: 0,
  completedRentals: 0,
  totalRevenueCents: 0,
  monthly: [],
};

export default async function AdminAnalyticsPage() {
  await requireRole(["admin"], "/dashboard/admin/analytics");

  let stats = EMPTY;
  let failed = false;

  try {
    const result = await serverApi<{ data: AdminStats }>("/api/admin/stats");
    stats = result.data;
  } catch {
    failed = true;
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Platform analytics"
        description="The health of the marketplace at a glance: accounts, listings, moderation queue, rentals and revenue."
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
              label="Total users"
              value={stats.totalUsers}
              hint={`${stats.totalCustomers} customers · ${stats.totalOwners} owners`}
              icon={Users}
            />
            <StatCard
              label="Equipment"
              value={stats.totalEquipment}
              hint="Listings across all owners"
              icon={Boxes}
            />
            <StatCard
              label="Pending approvals"
              value={stats.pendingApprovals}
              hint={
                stats.pendingApprovals
                  ? "Waiting for moderation"
                  : "Moderation queue is clear"
              }
              icon={ShieldAlert}
              tone={stats.pendingApprovals ? "accent" : "default"}
            />
            <StatCard
              label="Revenue"
              value={formatCents(stats.totalRevenueCents)}
              hint="Paid rentals, all time"
              icon={CircleDollarSign}
              tone="dark"
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Total bookings"
              value={stats.totalBookings}
              hint="Confirmed rentals across the platform"
              icon={CalendarCheck}
            />
            <StatCard
              label="Completed rentals"
              value={stats.completedRentals}
              hint="Returned and closed out"
              icon={CheckCircle2}
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="label-mono text-muted-foreground">Bookings</p>
                  <h2 className="mt-1 font-heading text-lg">Monthly bookings</h2>
                </div>
                <BarChart3 className="size-5 text-primary" />
              </div>
              <div className="mt-4">
                <MonthlyChart data={stats.monthly} metric="bookings" />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="label-mono text-muted-foreground">Revenue</p>
                  <h2 className="mt-1 font-heading text-lg">Monthly revenue</h2>
                </div>
                <CircleDollarSign className="size-5 text-accent" />
              </div>
              <div className="mt-4">
                <MonthlyChart data={stats.monthly} metric="revenue" />
              </div>
            </div>
          </div>

          {stats.pendingApprovals ? (
            <p className="mt-4 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-muted-foreground">
              <span className="font-medium text-accent">
                {stats.pendingApprovals} listing
                {stats.pendingApprovals === 1 ? "" : "s"}
              </span>{" "}
              awaiting review. Open All Equipment to approve or reject.
            </p>
          ) : null}
        </>
      )}
    </>
  );
}
