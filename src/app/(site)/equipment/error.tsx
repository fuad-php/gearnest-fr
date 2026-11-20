"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/layout/button-link";

export default function EquipmentError({
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
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-24 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </span>
      <h1 className="mt-5 text-3xl">The catalogue is taking a break</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        We could not load the equipment list. Try again, or head back to the home
        page while the API reconnects.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={reset} className="h-10 px-5">
          <RotateCcw className="size-4" />
          Try again
        </Button>
        <ButtonLink href="/" variant="outline" className="h-10 px-5">
          Back home
        </ButtonLink>
      </div>
    </div>
  );
}
