import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  CalendarCheck,
  Heart,
  PlusCircle,
  Search,
  Users,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { getServerSession } from "@/lib/server-api";
import type { AppUser } from "@/types";

export const metadata: Metadata = { title: "Dashboard" };

const LINKS = {
  customer: [
    {
      href: "/equipment",
      title: "Browse equipment",
      description: "Find gear for your next project.",
      icon: Search,
    },
    {
      href: "/dashboard/rentals",
      title: "My rentals",
      description: "Track bookings and payment status.",
      icon: CalendarCheck,
    },
    {
      href: "/dashboard/favorites",
      title: "Favorites",
      description: "Gear you saved for later.",
      icon: Heart,
    },
  ],
  owner: [
    {
      href: "/dashboard/owner/add-equipment",
      title: "Add equipment",
      description: "List a new machine or kit.",
      icon: PlusCircle,
    },
    {
      href: "/dashboard/owner/equipment",
      title: "My equipment",
      description: "Manage listings and availability.",
      icon: Boxes,
    },
    {
      href: "/dashboard/owner/rentals",
      title: "Rental requests",
      description: "See who booked your gear.",
      icon: CalendarCheck,
    },
    {
      href: "/dashboard/owner/analytics",
      title: "Analytics",
      description: "Earnings and booking trends.",
      icon: BarChart3,
    },
  ],
  admin: [
    {
      href: "/dashboard/admin/users",
      title: "All users",
      description: "Manage roles and accounts.",
      icon: Users,
    },
    {
      href: "/dashboard/admin/equipment",
      title: "All equipment",
      description: "Approve or reject listings.",
      icon: Wrench,
    },
    {
      href: "/dashboard/admin/rentals",
      title: "All rentals",
      description: "Monitor every booking.",
      icon: CalendarCheck,
    },
    {
      href: "/dashboard/admin/analytics",
      title: "Platform analytics",
      description: "Users, bookings and revenue.",
      icon: BarChart3,
    },
  ],
} satisfies Record<AppUser["role"], unknown[]>;

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login?next=/dashboard");

  const user = session.user as unknown as AppUser;
  const links = LINKS[user.role];
  const firstName = user.name.split(" ")[0];
  const profileComplete = Boolean(user.phone && user.address && user.image);

  return (
    <>
      <PageHeader
        eyebrow={`Signed in as ${user.role}`}
        title={`Good to see you, ${firstName}`}
        description={
          user.role === "owner"
            ? "Manage your listings, fulfil rentals and keep an eye on earnings."
            : user.role === "admin"
              ? "Keep the marketplace healthy: approve listings, manage roles and monitor rentals."
              : "Find gear, track your bookings and save favourites for the next job."
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <link.icon className="size-5" />
            </span>
            <p className="mt-4 font-heading text-base">{link.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {link.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
              Open
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg">Getting started</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Three things that make every rental smoother.
          </p>
          <ol className="mt-5 space-y-4">
            {[
              {
                title: "Complete your profile",
                body: "Add a phone number and address so the other side can reach you.",
                done: profileComplete,
              },
              {
                title: user.role === "owner" ? "List your first item" : "Save a favourite",
                body:
                  user.role === "owner"
                    ? "Approved listings appear in the public catalogue within minutes."
                    : "Tap the heart on any equipment page to keep it handy.",
                done: false,
              },
              {
                title: "Review the rental terms",
                body: "Every listing explains deposits, fuel and return conditions up front.",
                done: false,
              },
            ].map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border font-mono text-xs">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">
                    {step.title}
                    {step.done ? (
                      <span className="ml-2 text-[11px] font-normal text-primary">
                        Done
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-border bg-[#14231c] p-6 text-[#f6f3ec]">
          <p className="label-mono text-[#8fa197]">Account</p>
          <p className="mt-3 font-heading text-lg">{user.name}</p>
          <p className="mt-1 truncate text-sm text-[#b9c4bd]">{user.email}</p>
          <dl className="mt-5 space-y-3 border-t border-[#2a4036] pt-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[#8fa197]">Role</dt>
              <dd className="capitalize">{user.role}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[#8fa197]">Phone</dt>
              <dd className="truncate">{user.phone || "Not set"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[#8fa197]">Profile</dt>
              <dd>{profileComplete ? "Complete" : "Incomplete"}</dd>
            </div>
          </dl>
          <Link
            href="/dashboard/profile"
            className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[#e4572e] hover:underline"
          >
            Edit profile
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
