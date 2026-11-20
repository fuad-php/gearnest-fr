import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { FavoritesGrid } from "@/components/dashboard/favorites-grid";
import { getServerSession, serverApi } from "@/lib/server-api";
import type { AppUser, Favorite } from "@/types";

export const metadata: Metadata = { title: "Favorites" };

export default async function FavoritesPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login?next=/dashboard/favorites");

  const user = session.user as unknown as AppUser;
  if (user.role === "admin") redirect("/dashboard/admin/equipment");

  let favorites: Favorite[] = [];
  let failed = false;

  try {
    const result = await serverApi<{ data: Favorite[] }>("/api/favorites");
    favorites = result.data;
  } catch {
    failed = true;
  }

  return (
    <>
      <PageHeader
        eyebrow="Saved gear"
        title="Favorites"
        description="Equipment you bookmarked. Availability and pricing are always live."
      />

      {failed ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-heading text-lg">Favorites could not load</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The API did not respond. Refresh the page to try again.
          </p>
        </div>
      ) : (
        <FavoritesGrid favorites={favorites} />
      )}
    </>
  );
}
