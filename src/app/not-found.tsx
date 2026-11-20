import Link from "next/link";
import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/layout/button-link";
import { Logo } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-5 text-center">
      <Link href="/" aria-label="GearNest home">
        <Logo />
      </Link>
      <p className="label-mono mt-10 text-muted-foreground">404 — not found</p>
      <h1 className="mt-4 max-w-xl text-4xl leading-[1.05] sm:text-5xl">
        This page has left the job site.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        The link may be outdated, or the equipment listing was removed. Head back
        to the catalogue and keep looking.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/equipment" className="h-11 px-5">
          <Compass className="size-4" />
          Browse equipment
        </ButtonLink>
        <ButtonLink href="/" variant="outline" className="h-11 px-5">
          Back home
        </ButtonLink>
      </div>
    </div>
  );
}
