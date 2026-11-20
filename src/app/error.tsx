"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
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
    <div className="flex min-h-svh items-center justify-center bg-background px-5">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl">Something broke on our side</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The page could not finish loading. Try again — if it keeps happening,
          the API may be waking up.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} className="h-10 px-5">
            <RotateCcw className="size-4" />
            Try again
          </Button>
          <Button variant="outline" className="h-10 px-5" render={<Link href="/" />}>
            Back home
          </Button>
        </div>
      </div>
    </div>
  );
}
