import { cn } from "cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-8", className)}
    >
      <path
        d="M16 1.8l2.7 3.3 4.2-1 1 4.2 4.2 1-1 4.2 3.3 2.7-3.3 2.7 1 4.2-4.2 1-1 4.2-4.2-1L16 30.2l-2.7-3.3-4.2 1-1-4.2-4.2-1 1-4.2L1.6 16l3.3-2.7-1-4.2 4.2-1 1-4.2 4.2 1z"
        fill="currentColor"
      />
      <circle cx="16" cy="16" r="5.4" fill="var(--background)" />
      <circle cx="16" cy="16" r="2.1" fill="#E4572E" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("text-primary", markClassName)} />
      <span className="font-heading text-xl font-semibold tracking-tight">
        Gear<span className="text-primary">Nest</span>
      </span>
    </span>
  );
}
