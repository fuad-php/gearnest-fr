"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Boxes, Loader2, MapPin, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/layout/button-link";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusPill } from "@/components/dashboard/status-pill";
import { authApi } from "@/lib/api";
import { formatCurrency, RENTAL_SUFFIX } from "@/lib/format";
import type { Equipment } from "@/types";

export function OwnerEquipmentList({ items }: { items: Equipment[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function remove(item: Equipment) {
    const confirmed = window.confirm(
      `Delete "${item.name}"? This also removes it from favorites and cannot be undone.`,
    );
    if (!confirmed) return;

    setDeleting(item.id);

    try {
      await authApi(`/api/equipment/${item.id}`, { method: "DELETE" });
      toast.success("Listing deleted");
      router.refresh();
    } catch (error) {
      toast.error("Could not delete this listing", {
        description: error instanceof Error ? error.message : "Try again.",
      });
    } finally {
      setDeleting(null);
    }
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={Boxes}
        title="No equipment listed yet"
        description="Add your first machine or kit. It will be reviewed by an admin and then appear in the public catalogue."
        action={<ButtonLink href="/dashboard/owner/add-equipment">Add equipment</ButtonLink>}
      />
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li
          key={item.id}
          className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[132px_1fr]"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted sm:aspect-square">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="132px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="label-mono text-muted-foreground">{item.category}</p>
                <Link
                  href={`/equipment/${item.id}`}
                  className="mt-1 block font-heading text-lg hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {item.location}
                  </span>
                  <span className="font-mono">
                    {formatCurrency(item.price)}
                    {RENTAL_SUFFIX[item.rentalType]}
                  </span>
                  <span>{item.quantity} unit{item.quantity === 1 ? "" : "s"}</span>
                </p>
              </div>
              <StatusPill status={item.status} />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                {item.status === "pending"
                  ? "Waiting for admin approval."
                  : item.status === "rejected"
                    ? "Rejected by an admin. Edit the details and resubmit."
                    : "Live in the public catalogue."}
              </p>
              <div className="flex gap-2">
                <ButtonLink
                  href={`/dashboard/owner/equipment/${item.id}/edit`}
                  variant="outline"
                  size="sm"
                  className="h-8"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </ButtonLink>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-8"
                  onClick={() => remove(item)}
                  disabled={deleting === item.id}
                >
                  {deleting === item.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
