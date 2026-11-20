import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { OwnerEquipmentList } from "@/components/dashboard/owner-equipment-list";
import { ButtonLink } from "@/components/layout/button-link";
import { requireRole } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";
import type { Equipment } from "@/types";

export const metadata: Metadata = { title: "My Equipment" };

export default async function OwnerEquipmentPage() {
  await requireRole(["owner"], "/dashboard/owner/equipment");

  let items: Equipment[] = [];
  let failed = false;

  try {
    const result = await serverApi<{ data: Equipment[] }>("/api/owner/equipment");
    items = result.data;
  } catch {
    failed = true;
  }

  return (
    <>
      <PageHeader
        eyebrow="Owner"
        title="My equipment"
        description="Every listing you own, including pending and rejected items."
        action={
          <ButtonLink href="/dashboard/owner/add-equipment">Add equipment</ButtonLink>
        }
      />

      {failed ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-heading text-lg">Listings could not load</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The API did not respond. Refresh the page to try again.
          </p>
        </div>
      ) : (
        <OwnerEquipmentList items={items} />
      )}
    </>
  );
}
