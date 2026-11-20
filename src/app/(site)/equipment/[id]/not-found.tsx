import { PackageSearch } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/layout/button-link";

export default function EquipmentNotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <PackageSearch className="size-6" />
      </span>
      <p className="label-mono mt-5 text-muted-foreground">404 — Not found</p>
      <h1 className="mt-3 text-3xl">This listing is no longer available</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        The equipment may have been removed by its owner or is waiting for admin
        approval. Browse the catalogue for similar gear.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/equipment" className="h-10 px-5">
          Browse equipment
        </ButtonLink>
        <ButtonLink href="/" variant="outline" className="h-10 px-5">
          Back home
        </ButtonLink>
      </div>
    </Container>
  );
}
