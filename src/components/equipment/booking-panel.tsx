"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarRange,
  Loader2,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, authApi, publicApi } from "@/lib/api";
import { formatCurrency, RENTAL_LABEL, RENTAL_SUFFIX } from "@/lib/format";
import type { Equipment } from "@/types";

const schema = z
  .object({
    startDate: z.string().min(1, "Choose a start date"),
    endDate: z.string().min(1, "Choose an end date"),
    quantity: z
      .number({ error: "Enter a quantity" })
      .int("Quantity must be a whole number")
      .min(1, "At least one unit"),
    contactNumber: z.string().trim().min(6, "Enter a contact number"),
    deliveryAddress: z.string().trim().min(8, "Enter a delivery address"),
    notes: z.string().trim().max(1000).optional(),
  })
  .refine((values) => new Date(values.endDate) > new Date(values.startDate), {
    message: "End date must be after the start date",
    path: ["endDate"],
  });

type Values = z.infer<typeof schema>;

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function estimate(price: number, rentalType: string, start: string, end: string, quantity: number) {
  if (!start || !end) return null;

  const diff = new Date(end).getTime() - new Date(start).getTime();
  if (Number.isNaN(diff) || diff <= 0) return null;

  const days = Math.max(1, Math.ceil(diff / 86_400_000));
  const units =
    rentalType === "weekly"
      ? Math.max(1, Math.ceil(days / 7))
      : rentalType === "monthly"
        ? Math.max(1, Math.ceil(days / 30))
        : days;

  return { days, units, total: price * units * quantity };
}

export function BookingPanel({ equipment }: { equipment: Equipment }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(equipment.quantity);
  const [checking, setChecking] = useState(false);

  const today = useMemo(() => new Date(), []);
  const minDate = isoDate(today);
  const defaultStart = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return isoDate(date);
  }, []);
  const defaultEnd = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return isoDate(date);
  }, []);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: defaultStart,
      endDate: defaultEnd,
      quantity: 1,
      contactNumber: "",
      deliveryAddress: "",
      notes: "",
    },
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const quantity = Number(form.watch("quantity")) || 0;
  const quote = estimate(equipment.price, equipment.rentalType, startDate, endDate, quantity);

  useEffect(() => {
    if (!startDate || !endDate) return;
    if (new Date(endDate) <= new Date(startDate)) return;

    let active = true;
    setChecking(true);

    const timer = setTimeout(async () => {
      try {
        const result = await publicApi<{
          data: { remaining: number };
        }>(
          `/api/equipment/${equipment.id}/availability?startDate=${startDate}&endDate=${endDate}`,
        );
        if (active) setRemaining(result.data.remaining);
      } catch {
        if (active) setRemaining(null);
      } finally {
        if (active) setChecking(false);
      }
    }, 350);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [startDate, endDate, equipment.id]);

  function stepQuantity(delta: number) {
    const next = Math.min(
      Math.max(1, quantity + delta),
      Math.max(1, equipment.quantity),
    );
    form.setValue("quantity", next, { shouldValidate: true });
  }

  async function onSubmit(values: Values) {
    if (remaining !== null && values.quantity > remaining) {
      toast.error("Not enough units available", {
        description: `Only ${remaining} unit(s) are free for those dates.`,
      });
      return;
    }

    setSubmitting(true);

    try {
      const result = await authApi<{
        data: { url: string; provider: string };
      }>("/api/payments/checkout", {
        method: "POST",
        body: JSON.stringify({
          equipmentId: equipment.id,
          startDate: values.startDate,
          endDate: values.endDate,
          quantity: values.quantity,
          contactNumber: values.contactNumber,
          deliveryAddress: values.deliveryAddress,
          notes: values.notes ?? "",
        }),
      });

      if (result.data.provider === "demo") {
        toast.info("Demo checkout", {
          description:
            "Stripe is not configured, so this rental is being confirmed in demo mode.",
        });
      }

      window.location.assign(result.data.url);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        toast.error("Sign in to book this equipment");
        router.push(`/login?next=/equipment/${equipment.id}`);
        return;
      }

      toast.error("Could not start checkout", {
        description: error instanceof Error ? error.message : "Try again.",
      });
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
      noValidate
    >
      <div className="flex items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="label-mono text-muted-foreground">From</p>
          <p className="mt-1 font-mono text-2xl font-semibold tracking-tight">
            {formatCurrency(equipment.price)}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              {RENTAL_SUFFIX[equipment.rentalType]}
            </span>
          </p>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium">
          {RENTAL_LABEL[equipment.rentalType]} rate
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Start date</Label>
          <Input
            id="startDate"
            type="date"
            min={minDate}
            className="h-11"
            aria-invalid={Boolean(form.formState.errors.startDate)}
            {...form.register("startDate")}
          />
          {form.formState.errors.startDate ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.startDate.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="endDate">End date</Label>
          <Input
            id="endDate"
            type="date"
            min={startDate || minDate}
            className="h-11"
            aria-invalid={Boolean(form.formState.errors.endDate)}
            {...form.register("endDate")}
          />
          {form.formState.errors.endDate ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.endDate.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
        <div>
          <p className="text-xs font-medium">Quantity</p>
          <p className="text-[11px] text-muted-foreground">
            {checking
              ? "Checking availability…"
              : remaining === null
                ? `${equipment.quantity} in total`
                : `${remaining} of ${equipment.quantity} free for these dates`}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => stepQuantity(-1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="size-3.5" />
          </Button>
          <Input
            type="number"
            min={1}
            max={equipment.quantity}
            className="h-8 w-12 text-center font-mono"
            aria-label="Quantity"
            {...form.register("quantity", { valueAsNumber: true })}
          />
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => stepQuantity(1)}
            disabled={quantity >= equipment.quantity}
            aria-label="Increase quantity"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <Label htmlFor="contactNumber">Contact number</Label>
        <Input
          id="contactNumber"
          placeholder="+1 (512) 555-0100"
          className="h-11"
          aria-invalid={Boolean(form.formState.errors.contactNumber)}
          {...form.register("contactNumber")}
        />
        {form.formState.errors.contactNumber ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.contactNumber.message}
          </p>
        ) : null}
      </div>

      <div className="mt-3 space-y-1.5">
        <Label htmlFor="deliveryAddress">Delivery address</Label>
        <Textarea
          id="deliveryAddress"
          rows={2}
          placeholder="Where should the owner deliver?"
          aria-invalid={Boolean(form.formState.errors.deliveryAddress)}
          {...form.register("deliveryAddress")}
        />
        {form.formState.errors.deliveryAddress ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.deliveryAddress.message}
          </p>
        ) : null}
      </div>

      <div className="mt-3 space-y-1.5">
        <Label htmlFor="notes">Notes for the owner (optional)</Label>
        <Textarea
          id="notes"
          rows={2}
          placeholder="Site access, pickup time, operator needs…"
          {...form.register("notes")}
        />
      </div>

      <div className="mt-4 rounded-xl bg-muted/60 p-3">
        <dl className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">
              {quote
                ? `${quote.days} day${quote.days > 1 ? "s" : ""} × ${quote.units} ${equipment.rentalType} unit${quote.units > 1 ? "s" : ""}`
                : "Rental period"}
            </dt>
            <dd className="font-mono">{quote ? formatCurrency(quote.total) : "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border pt-1.5">
            <dt className="text-muted-foreground">Quantity</dt>
            <dd className="font-mono">{quantity || "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border pt-1.5">
            <dt className="font-medium">Total</dt>
            <dd className="font-mono text-lg font-semibold">
              {quote ? formatCurrency(quote.total) : "—"}
            </dd>
          </div>
        </dl>
      </div>

      <Button type="submit" className="mt-4 h-11 w-full" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
        {submitting ? "Opening checkout…" : "Continue to secure checkout"}
      </Button>

      <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
        Your booking is created only after payment is confirmed. You will be
        redirected to Stripe to pay securely.
      </p>

      <p className="mt-2 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
        <CalendarRange className="mt-0.5 size-3.5 shrink-0 text-primary" />
        Availability is checked against confirmed bookings before checkout.
      </p>
    </form>
  );
}
