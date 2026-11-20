import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { cn } from "cn";
import { formatCurrency, RENTAL_LABEL, RENTAL_SUFFIX } from "@/lib/format";
import type { Equipment } from "@/types";

export function EquipmentCard({
  equipment,
  className,
}: {
  equipment: Equipment;
  className?: string;
}) {
  const available = equipment.quantity > 0;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/50",
        className,
      )}
    >
      <Link
        href={`/equipment/${equipment.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
        aria-label={`View ${equipment.name}`}
      >
        <Image
          src={equipment.image}
          alt={equipment.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
            available
              ? "bg-[#f6f3ec] text-[#17493a]"
              : "bg-[#14231c] text-[#f6f3ec]",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              available ? "bg-[#17493a]" : "bg-[#e4572e]",
            )}
          />
          {available ? "Available" : "Fully booked"}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-[#14231c]/85 px-2.5 py-1 text-[11px] font-medium text-[#f6f3ec]">
          {equipment.condition}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="label-mono text-muted-foreground">{equipment.category}</p>
          <span className="label-mono text-muted-foreground">
            {RENTAL_LABEL[equipment.rentalType]}
          </span>
        </div>

        <h3 className="mt-2 font-heading text-lg leading-snug">
          <Link
            href={`/equipment/${equipment.id}`}
            className="transition-colors hover:text-primary"
          >
            {equipment.name}
          </Link>
        </h3>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          {equipment.location}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
          <p className="font-mono text-lg font-semibold tracking-tight">
            {formatCurrency(equipment.price)}
            <span className="ml-0.5 text-xs font-normal text-muted-foreground">
              {RENTAL_SUFFIX[equipment.rentalType]}
            </span>
          </p>
          <Link
            href={`/equipment/${equipment.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-accent"
          >
            View details
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
