import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { EquipmentForm } from "@/components/dashboard/equipment-form";
import { requireRole } from "@/lib/require-user";

export const metadata: Metadata = { title: "Add Equipment" };

export default async function AddEquipmentPage() {
  await requireRole(["owner"], "/dashboard/owner/add-equipment");

  return (
    <>
      <PageHeader
        eyebrow="Owner"
        title="Add equipment"
        description="List a machine or kit for rent. An admin reviews every new listing before it appears in the catalogue."
      />
      <EquipmentForm />
    </>
  );
}
