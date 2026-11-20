import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { EquipmentForm } from "@/components/dashboard/equipment-form";
import { requireRole } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";
import type { Equipment } from "@/types";

export const metadata: Metadata = { title: "Edit Equipment" };

export default async function EditEquipmentPage({
  params,
}: PageProps<"/dashboard/owner/equipment/[id]/edit">) {
  const { id } = await params;
  await requireRole(["owner"], `/dashboard/owner/equipment/${id}/edit`);

  let equipment: Equipment;

  try {
    const result = await serverApi<{ data: Equipment }>(`/api/owner/equipment/${id}`);
    equipment = result.data;
  } catch {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow="Owner"
        title={`Edit ${equipment.name}`}
        description="Update the details, rate or availability. Approved listings stay live after saving."
      />
      <EquipmentForm initial={equipment} />
    </>
  );
}
