"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/layout/button-link";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { authApi } from "@/lib/api";
import type { Favorite } from "@/types";

export function FavoritesGrid({ favorites }: { favorites: Favorite[] }) {
  const router = useRouter();
  const [items, setItems] = useState(favorites);
  const [removing, setRemoving] = useState<string | null>(null);

  async function remove(equipmentId: string) {
    setRemoving(equipmentId);

    try {
      await authApi(`/api/favorites/${equipmentId}`, { method: "DELETE" });
      setItems((current) => current.filter((item) => item.equipment.id !== equipmentId));
      toast.success("Removed from favorites");
      router.refresh();
    } catch (error) {
      toast.error("Could not remove this favorite", {
        description: error instanceof Error ? error.message : "Try again.",
      });
    } finally {
      setRemoving(null);
    }
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={Heart}
        title="No favorites saved"
        description="Tap the heart on any equipment listing to keep it here for later."
        action={<ButtonLink href="/equipment">Browse equipment</ButtonLink>}
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((favorite) => (
        <div key={favorite.id} className="flex flex-col gap-2">
          <EquipmentCard equipment={favorite.equipment} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 w-full"
            onClick={() => remove(favorite.equipment.id)}
            disabled={removing === favorite.equipment.id}
          >
            {removing === favorite.equipment.id ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Heart className="size-3.5 fill-current" />
            )}
            Remove from favorites
          </Button>
        </div>
      ))}
    </div>
  );
}
