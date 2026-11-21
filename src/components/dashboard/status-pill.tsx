import { cn } from "cn";

const STYLES: Record<string, string> = {
  pending:
    "bg-[#f5e6c8] text-[#7a5b12] dark:bg-[#43350f] dark:text-[#f0d9a1]",
  approved:
    "bg-[#dcebe1] text-[#17493a] dark:bg-[#1c3a2b] dark:text-[#a8d8bd]",
  rejected:
    "bg-[#f6ded9] text-[#9a2f1b] dark:bg-[#43241f] dark:text-[#f0b0a4]",
  confirmed:
    "bg-[#dcebe1] text-[#17493a] dark:bg-[#1c3a2b] dark:text-[#a8d8bd]",
  active:
    "bg-[#dbe6f2] text-[#1d4a72] dark:bg-[#1d3348] dark:text-[#a9cbea]",
  completed:
    "bg-[#ece8de] text-[#4b554f] dark:bg-[#2a3a31] dark:text-[#c3cdc6]",
  cancelled:
    "bg-[#f6ded9] text-[#9a2f1b] dark:bg-[#43241f] dark:text-[#f0b0a4]",
  paid: "bg-[#dcebe1] text-[#17493a] dark:bg-[#1c3a2b] dark:text-[#a8d8bd]",
  refunded:
    "bg-[#f5e6c8] text-[#7a5b12] dark:bg-[#43350f] dark:text-[#f0d9a1]",
  failed:
    "bg-[#f6ded9] text-[#9a2f1b] dark:bg-[#43241f] dark:text-[#f0b0a4]",
  customer:
    "bg-[#ece8de] text-[#4b554f] dark:bg-[#2a3a31] dark:text-[#c3cdc6]",
  owner: "bg-[#dcebe1] text-[#17493a] dark:bg-[#1c3a2b] dark:text-[#a8d8bd]",
  admin: "bg-[#e6dff2] text-[#4a3670] dark:bg-[#332a44] dark:text-[#cdbce8]",
};

const LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  confirmed: "Confirmed",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
  paid: "Paid",
  refunded: "Refunded",
  failed: "Failed",
  customer: "Customer",
  owner: "Owner",
  admin: "Admin",
};

export function StatusPill({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize",
        STYLES[status] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {LABELS[status] ?? status}
    </span>
  );
}
