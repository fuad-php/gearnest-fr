"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { ApiError, authApi } from "@/lib/api";

export function FavoriteButton({
  equipmentId,
  initialFavorited,
}: {
  equipmentId: string;
  initialFavorited: boolean;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const next = !favorited;

    try {
      if (next) {
        await authApi(`/api/favorites/${equipmentId}`, { method: "POST" });
        toast.success("Saved to favorites");
      } else {
        await authApi(`/api/favorites/${equipmentId}`, { method: "DELETE" });
        toast.success("Removed from favorites");
      }
      setFavorited(next);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        toast.error("Sign in to save favorites");
        router.push(`/login?next=/equipment/${equipmentId}`);
        return;
      }
      toast.error("Could not update favorites", {
        description: error instanceof Error ? error.message : "Try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggle}
      disabled={loading}
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
      className={cn(
        "h-11 gap-2 px-4",
        favorited && "border-accent/40 bg-accent/5 text-accent",
      )}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Heart className={cn("size-4", favorited && "fill-current")} />
      )}
      {favorited ? "Saved" : "Save"}
    </Button>
  );
}
