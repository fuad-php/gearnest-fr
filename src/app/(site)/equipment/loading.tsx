import { Container } from "@/components/layout/container";

export default function EquipmentLoading() {
  return (
    <>
      <section className="border-b border-border bg-muted/50">
        <Container className="py-12 lg:py-16">
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
          <div className="mt-5 h-12 w-full max-w-lg animate-pulse rounded bg-muted" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
        </Container>
      </section>

      <section className="py-10 lg:py-14">
        <Container>
          <div className="h-40 animate-pulse rounded-2xl border border-border bg-card" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="aspect-[4/3] bg-muted" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-10 w-full rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
