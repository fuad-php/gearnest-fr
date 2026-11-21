"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Boxes,
  CalendarCheck,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  ShieldCheck,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import { initials } from "@/lib/format";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import type { AppUser } from "@/types";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

const SHARED: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My Profile", icon: UserRound },
];

const CUSTOMER: NavItem[] = [
  { href: "/dashboard/rentals", label: "My Rentals", icon: CalendarCheck },
  { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
];

const OWNER: NavItem[] = [
  { href: "/dashboard/owner/add-equipment", label: "Add Equipment", icon: PlusCircle },
  { href: "/dashboard/owner/equipment", label: "My Equipment", icon: Boxes },
  { href: "/dashboard/owner/rentals", label: "My Equipment Rental", icon: CalendarCheck },
  { href: "/dashboard/owner/analytics", label: "Analytics", icon: BarChart3 },
];

const ADMIN: NavItem[] = [
  { href: "/dashboard/admin/users", label: "All Users", icon: Users },
  { href: "/dashboard/admin/equipment", label: "All Equipment", icon: Wrench },
  { href: "/dashboard/admin/rentals", label: "All Rentals", icon: CalendarCheck },
  { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
];

function navFor(role: AppUser["role"]) {
  if (role === "owner") return [...SHARED, ...OWNER];
  if (role === "admin") return [...SHARED, ...ADMIN];
  return [...SHARED, ...CUSTOMER];
}

const ROLE_LABEL: Record<AppUser["role"], string> = {
  customer: "Customer",
  owner: "Equipment owner",
  admin: "Administrator",
};

export function DashboardShell({
  user,
  children,
}: {
  user: AppUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const nav = navFor(user.role);

  async function signOut() {
    await authClient.signOut();
    clearTokenCache();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  }

  const navList = (onNavigate?: () => void) => (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Dashboard">
      <p className="label-mono px-3 pb-2 text-[#6f8578]">
        {ROLE_LABEL[user.role]}
      </p>
      {nav.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-[#1e332a] text-[#f6f3ec]"
                : "text-[#b9c4bd] hover:bg-[#1a2c24] hover:text-[#f6f3ec]",
            )}
          >
            <item.icon
              className={cn(
                "size-4",
                active ? "text-[#e4572e]" : "text-[#6f8578]",
              )}
            />
            {item.label}
          </Link>
        );
      })}

      <div className="mt-auto border-t border-[#2a4036] pt-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#b9c4bd] hover:bg-[#1a2c24] hover:text-[#f6f3ec]"
        >
          <ShieldCheck className="size-4 text-[#6f8578]" />
          Back to marketplace
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#b9c4bd] hover:bg-[#1a2c24] hover:text-[#f6f3ec]"
        >
          <LogOut className="size-4 text-[#6f8578]" />
          Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-svh bg-background">
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border focus:border-border focus:bg-card focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:shadow-sm"
      >
        Skip to dashboard content
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#14231c] lg:flex">
        <div className="flex h-16 items-center border-b border-[#2a4036] px-5">
          <Link href="/" aria-label="GearNest home">
            <Logo
              className="text-[#f6f3ec] [&_span]:text-[#f6f3ec]"
              markClassName="text-[#f6f3ec]"
            />
          </Link>
        </div>

        <div className="border-b border-[#2a4036] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#1e332a] text-sm font-semibold text-[#f6f3ec]">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name}
                  className="size-full object-cover"
                />
              ) : (
                initials(user.name)
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#f6f3ec]">
                {user.name}
              </p>
              <p className="truncate text-xs text-[#8fa197]">{user.email}</p>
            </div>
          </div>
        </div>

        {navList()}
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Open dashboard menu"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[85vw] max-w-xs border-[#2a4036] bg-[#14231c] p-0 text-[#f6f3ec]"
              >
                <SheetHeader className="border-b border-[#2a4036] px-5 py-4">
                  <SheetTitle className="text-[#f6f3ec]">
                    <Logo
                      className="text-[#f6f3ec] [&_span]:text-[#f6f3ec]"
                      markClassName="text-[#f6f3ec]"
                    />
                  </SheetTitle>
                </SheetHeader>
                {navList(() => setOpen(false))}
              </SheetContent>
            </Sheet>

            <div>
              <p className="label-mono text-muted-foreground">Dashboard</p>
              <p className="text-sm font-medium">{ROLE_LABEL[user.role]}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.name}
            </span>
            <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name} className="size-full object-cover" />
              ) : (
                initials(user.name)
              )}
            </span>
          </div>
        </header>

        <div className="px-5 py-8 lg:px-8">{children}</div>      </div>
    </div>
  );
}
