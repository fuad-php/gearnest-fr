import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "accent" | "dark";
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-card p-5",
        tone === "dark" && "border-[#2a4036] bg-[#14231c] text-[#f6f3ec]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "label-mono text-muted-foreground",
            tone === "dark" && "text-[#8fa197]",
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            "grid size-9 place-items-center rounded-lg bg-primary/10 text-primary",
            tone === "accent" && "bg-accent/10 text-accent",
            tone === "dark" && "bg-[#1e332a] text-[#e4572e]",
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 font-heading text-3xl font-semibold tracking-tight">
        {value}
      </p>
      {hint ? (
        <p
          className={cn(
            "mt-1 text-xs text-muted-foreground",
            tone === "dark" && "text-[#8fa197]",
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
