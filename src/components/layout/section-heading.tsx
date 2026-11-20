import type { ReactNode } from "react";
import { cn } from "cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <p className="label-mono flex items-center gap-3 text-muted-foreground">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className="mt-4 text-3xl leading-[1.05] sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
