"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Loader2,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/layout/button-link";
import { Logo } from "@/components/layout/logo";
import { ApiError, authApi } from "@/lib/api";
import { formatCents, formatDateRange } from "@/lib/format";
import type { Booking } from "@/types";

type State =
  | { status: "confirming" }
  | { status: "success"; booking: Booking; duplicate: boolean }
  | { status: "error"; message: string };

export function PaymentSuccess({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<State>({ status: "confirming" });
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function confirm() {
      try {
        const result = await authApi<{
          data: { booking: Booking; duplicate: boolean };
        }>("/api/payments/confirm", {
          method: "POST",
          body: JSON.stringify({ sessionId }),
        });

        setState({
          status: "success",
          booking: result.data.booking,
          duplicate: result.data.duplicate,
        });
      } catch (error) {
        setState({
          status: "error",
          message:
            error instanceof ApiError
              ? error.message
              : "We could not confirm this payment. If you were charged, contact support with your receipt.",
        });
      }
    }

    void confirm();
  }, [sessionId]);

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-5">
          <Link href="/" aria-label="GearNest home">
            <Logo />
          </Link>
          <span className="label-mono text-muted-foreground">Checkout</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-14">
        <div className="w-full max-w-xl">
          {state.status === "confirming" ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">
              <Loader2 className="mx-auto size-8 animate-spin text-primary" />
              <h1 className="mt-5 text-2xl">Confirming your payment</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Hang tight — we are verifying the checkout session and creating
                your booking.
              </p>
            </div>
          ) : state.status === "success" ? (
            <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <CheckCircle2 className="size-7" />
              </span>
              <div className="mt-5 text-center">
                <p className="label-mono text-muted-foreground">
                  {state.booking.provider === "demo" ? "Demo booking confirmed" : "Payment received"}
                </p>
                <h1 className="mt-3 text-3xl">You are booked.</h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {state.booking.ownerName
                    ? `${state.booking.ownerName} has been notified and will be in touch about delivery.`
                    : "The owner has been notified and will be in touch about delivery."}
                </p>
              </div>

              <dl className="mt-7 space-y-3 rounded-2xl border border-border bg-background p-4 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Equipment</dt>
                  <dd className="text-right font-medium">{state.booking.equipmentName}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-t border-border pt-3">
                  <dt className="text-muted-foreground">Dates</dt>
                  <dd className="text-right font-medium">
                    {formatDateRange(
                      state.booking.rentalStartDate,
                      state.booking.rentalEndDate,
                    )}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-t border-border pt-3">
                  <dt className="text-muted-foreground">Quantity</dt>
                  <dd className="text-right font-mono">{state.booking.quantity}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-t border-border pt-3">
                  <dt className="text-muted-foreground">Total paid</dt>
                  <dd className="text-right font-mono text-base font-semibold">
                    {formatCents(state.booking.totalAmountCents)}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-t border-border pt-3">
                  <dt className="text-muted-foreground">Booking ID</dt>
                  <dd className="text-right font-mono text-xs">{state.booking.id}</dd>
                </div>
              </dl>

              {state.booking.provider === "demo" ? (
                <p className="mt-4 rounded-xl bg-[#ece8de] p-3 text-[11px] leading-relaxed text-muted-foreground">
                  Stripe keys are not configured on this deployment, so the
                  payment was simulated in demo mode. Add{" "}
                  <code className="font-mono">STRIPE_SECRET_KEY</code> to enable
                  real card payments.
                </p>
              ) : null}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <ButtonLink href="/dashboard/rentals" className="h-11 flex-1">
                  <CalendarCheck className="size-4" />
                  View my rentals
                </ButtonLink>
                <ButtonLink
                  href="/equipment"
                  variant="outline"
                  className="h-11 flex-1"
                >
                  <Receipt className="size-4" />
                  Keep browsing
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-8 text-center sm:p-10">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertTriangle className="size-7" />
              </span>
              <h1 className="mt-5 text-2xl">We could not confirm the payment</h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {state.message}
              </p>
              <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                <ButtonLink href="/dashboard/rentals" className="h-11">
                  Check my rentals
                </ButtonLink>
                <Button
                  variant="outline"
                  className="h-11"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
