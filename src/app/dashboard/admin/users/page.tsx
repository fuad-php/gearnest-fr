import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { AdminUsersTable } from "@/components/dashboard/admin-users-table";
import { requireRole } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";
import type { AppUser, ListResponse } from "@/types";

export const metadata: Metadata = { title: "All Users" };

export default async function AdminUsersPage() {
  const admin = await requireRole(["admin"], "/dashboard/admin/users");

  let users: AppUser[] = [];
  let failed = false;

  try {
    const result = await serverApi<ListResponse<AppUser>>(
      "/api/admin/users?limit=50",
    );
    users = result.data;
  } catch {
    failed = true;
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="All users"
        description="Every account on the marketplace. Promote trusted renters to owners or grant admin access. You cannot change your own role."
      />

      {failed ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-heading text-lg">Users could not load</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The API did not respond. Refresh the page to try again.
          </p>
        </div>
      ) : (
        <AdminUsersTable users={users} currentUserId={admin.id} />
      )}
    </>
  );
}
