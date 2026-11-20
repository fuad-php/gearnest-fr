import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { AdminEquipmentTable } from "@/components/dashboard/admin-equipment-table";
import { requireRole } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";
import type { Equipment, ListResponse } from "@/types";

export const metadata: Metadata = { title: "All Equipment" };

export default async function AdminEquipmentPage() {
  await requireRole(["admin"], "/dashboard/admin/equipment");

  let items: Equipment[] = [];
  let failed = false;

  try {
    const result = await serverApi<ListResponse<Equipment>>(
      "/api/admin/equipment?limit=50",
    );
    items = result.data;
  } catch {
    failed = true;
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="All equipment"
        description="Review owner listings. Approving makes a listing public in the catalogue; rejecting keeps it out until the owner resubmits."
      />

      {failed ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-heading text-lg">Listings could not load</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The API did not respond. Refresh the page to try again.
          </p>
        </div>
      ) : (
        <AdminEquipmentTable items={items} />
      )}
    </>
  );
}
