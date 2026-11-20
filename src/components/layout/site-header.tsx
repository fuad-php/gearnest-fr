"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/layout/button-link";
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
import type { AppUser } from "@/types";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "All Equipment" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as AppUser | undefined;

  async function signOut() {
    await authClient.signOut();
    clearTokenCache();
    setOpen(false);
    toast.success("Signed out", { description: "See you on the next job." });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" aria-label="GearNest home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative text-sm text-muted-foreground transition-colors hover:text-foreground",
                isActive(pathname, item.href) && "text-foreground",
              )}
            >
              {item.label}
              {isActive(pathname, item.href) ? (
                <span className="absolute -bottom-[21px] left-0 h-0.5 w-full bg-accent" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isPending ? (
            <span className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
          ) : user ? (
            <>
              <ButtonLink href="/dashboard" variant="outline">
                <LayoutDashboard className="size-4" />
                Dashboard
              </ButtonLink>
              <span
                className="grid size-9 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                title={user.name}
              >
                {initials(user.name)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                aria-label="Sign out"
              >
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost">
                Log in
              </ButtonLink>
              <ButtonLink href="/register">Get started</ButtonLink>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[88vw] max-w-sm border-border bg-background p-0"
          >
            <SheetHeader className="border-b border-border px-5 py-4">
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col px-3 py-4" aria-label="Mobile">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-3 text-base text-muted-foreground hover:bg-muted hover:text-foreground",
                    isActive(pathname, item.href) &&
                      "bg-muted text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-2 border-t border-border p-5">
              {user ? (
                <>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {initials(user.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <ButtonLink
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="w-full"
                  >
                    Dashboard
                  </ButtonLink>
                  <Button variant="outline" onClick={signOut} className="w-full">
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <ButtonLink
                    href="/login"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="w-full"
                  >
                    Log in
                  </ButtonLink>
                  <ButtonLink
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="w-full"
                  >
                    Create an account
                  </ButtonLink>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
