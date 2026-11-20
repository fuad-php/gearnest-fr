"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusPill } from "@/components/dashboard/status-pill";
import { authApi } from "@/lib/api";
import { formatDate, initials } from "@/lib/format";
import type { AppUser } from "@/types";

const ROLE_TABS = [
  { value: "all", label: "Everyone" },
  { value: "customer", label: "Customers" },
  { value: "owner", label: "Owners" },
  { value: "admin", label: "Admins" },
];

export function AdminUsersTable({
  users,
  currentUserId,
}: {
  users: AppUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = role === "all" || user.role === role;
      const matchesTerm =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);
      return matchesRole && matchesTerm;
    });
  }, [users, search, role]);

  async function changeRole(user: AppUser, nextRole: string) {
    if (nextRole === user.role) return;
    setUpdating(user.id);

    try {
      await authApi(`/api/admin/users/${user.id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: nextRole }),
      });
      toast.success(`${user.name} is now ${nextRole}`);
      router.refresh();
    } catch (error) {
      toast.error("Could not change this role", {
        description: error instanceof Error ? error.message : "Try again.",
      });
    } finally {
      setUpdating(null);
    }
  }

  if (!users.length) {
    return (
      <EmptyState
        icon={Users}
        title="No users yet"
        description="Accounts will appear here as people register."
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {ROLE_TABS.map((item) => {
            const count =
              item.value === "all"
                ? users.length
                : users.filter((user) => user.role === item.value).length;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setRole(item.value)}
                aria-pressed={role === item.value}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
                  role === item.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
                <span className="font-mono text-[11px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or email"
            className="h-10 pl-9"
            aria-label="Search users"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="max-h-[560px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden sm:table-cell">Joined</TableHead>
                <TableHead className="text-right">Change role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.image} alt={user.name} className="size-full object-cover" />
                        ) : (
                          initials(user.name)
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {user.name}
                          {user.id === currentUserId ? (
                            <span className="ml-2 text-[11px] font-normal text-muted-foreground">
                              you
                            </span>
                          ) : null}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusPill status={user.role} />
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {user.phone || "—"}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                    {user.createdAt ? formatDate(user.createdAt) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {updating === user.id ? (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      ) : null}
                      <select
                        value={user.role}
                        onChange={(event) => changeRole(user, event.target.value)}
                        disabled={user.id === currentUserId || updating === user.id}
                        aria-label={`Role for ${user.name}`}
                        className="h-8 rounded-lg border border-border bg-background px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50"
                      >
                        <option value="customer">customer</option>
                        <option value="owner">owner</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {!filtered.length ? (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No users match that search.
        </p>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {filtered.length} of {users.length} accounts.
        </p>
      )}
    </div>
  );
}
