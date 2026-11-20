import { Container } from "@/components/layout/container";

export default function EquipmentDetailsLoading() {
  return (
    <Container className="py-10 lg:py-14">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.55fr_0.95fr] lg:gap-10">
        <div>
          <div className="aspect-[4/3] animate-pulse rounded-2xl border border-border bg-muted" />
          <div className="mt-8 space-y-4">
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-24 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="h-[540px] animate-pulse rounded-2xl border border-border bg-card" />
      </div>
    </Container>
  );
}
