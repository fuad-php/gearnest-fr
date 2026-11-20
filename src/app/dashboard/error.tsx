"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/layout/button-link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </span>
      <h1 className="mt-5 font-heading text-2xl">This panel could not load</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Something went wrong while loading your dashboard data. Try again — if it
        keeps happening, the API may be restarting.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={reset} className="h-10 px-5">
          <RotateCcw className="size-4" />
          Try again
        </Button>
        <ButtonLink href="/dashboard" variant="outline" className="h-10 px-5">
          Back to overview
        </ButtonLink>
      </div>
    </div>
  );
}
