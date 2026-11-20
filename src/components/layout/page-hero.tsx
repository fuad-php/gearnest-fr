import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-[#ece8de]/50">
      <Container className="py-14 lg:py-20">
        <p className="label-mono flex items-center gap-3 text-muted-foreground">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          {eyebrow}
        </p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl leading-[1.02] sm:text-5xl lg:text-[3.25rem]">
              {title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
          {children ? <div className="shrink-0">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
