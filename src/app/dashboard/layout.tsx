import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getServerSession } from "@/lib/server-api";
import type { AppUser } from "@/types";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login?next=/dashboard");
  }

  const user = session.user as unknown as AppUser;

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
