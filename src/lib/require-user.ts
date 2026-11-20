import "server-only";

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server-api";
import type { AppUser, Role } from "@/types";

export async function requireUser(next: string) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return session.user as unknown as AppUser;
}

export async function requireRole(roles: Role[], next: string) {
  const user = await requireUser(next);

  if (!roles.includes(user.role)) {
    redirect("/dashboard");
  }

  return user;
}
