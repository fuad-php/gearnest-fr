import { cn } from "cn";

const STYLES: Record<string, string> = {
  pending: "bg-[#f5e6c8] text-[#7a5b12]",
  approved: "bg-[#dcebe1] text-[#17493a]",
  rejected: "bg-[#f6ded9] text-[#9a2f1b]",
  confirmed: "bg-[#dcebe1] text-[#17493a]",
  active: "bg-[#dbe6f2] text-[#1d4a72]",
  completed: "bg-[#ece8de] text-[#4b554f]",
  cancelled: "bg-[#f6ded9] text-[#9a2f1b]",
  paid: "bg-[#dcebe1] text-[#17493a]",
  refunded: "bg-[#f5e6c8] text-[#7a5b12]",
  failed: "bg-[#f6ded9] text-[#9a2f1b]",
  customer: "bg-[#ece8de] text-[#4b554f]",
  owner: "bg-[#dcebe1] text-[#17493a]",
  admin: "bg-[#e6dff2] text-[#4a3670]",
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
