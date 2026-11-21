import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarRange,
  ChevronRight,
  MapPin,
  Package,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import { BookingPanel } from "@/components/equipment/booking-panel";
import { FavoriteButton } from "@/components/equipment/favorite-button";
import { Reveal } from "@/components/motion/reveal";
import { publicApi, ApiError } from "@/lib/api";
import { getServerSession, serverApi } from "@/lib/server-api";
import { formatDate, initials, RENTAL_LABEL, RENTAL_SUFFIX } from "@/lib/format";
import type { Equipment, ListResponse } from "@/types";

async function loadEquipment(id: string) {
  try {
    const result = await publicApi<{ data: Equipment }>(`/api/equipment/${id}`);
    return result.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/equipment/[id]">): Promise<Metadata> {
  const { id } = await params;

  try {
    const result = await publicApi<{ data: Equipment }>(`/api/equipment/${id}`);
    return {
      title: result.data.name,
      description: result.data.description.slice(0, 155),
    };
  } catch {
    return { title: "Equipment" };
  }
}

export default async function EquipmentDetailsPage({
  params,
}: PageProps<"/equipment/[id]">) {
  const { id } = await params;
  const session = await getServerSession();

  if (!session?.user) {
    redirect(`/login?next=/equipment/${id}`);
  }

  const equipment = await loadEquipment(id);

  let favorited = false;
  try {
    const ids = await serverApi<{ data: string[] }>("/api/favorites/ids");
    favorited = ids.data.includes(equipment.id);
  } catch {
    favorited = false;
  }

  let related: Equipment[] = [];
  try {
    const result = await publicApi<ListResponse<Equipment>>(
      `/api/equipment?category=${encodeURIComponent(equipment.category)}&limit=4&sort=recent`,
    );
    related = result.data.filter((item) => item.id !== equipment.id).slice(0, 3);
  } catch {
    related = [];
  }

  const owner = equipment.owner;

  return (
    <>
      <div className="border-b border-border">
        <Container className="flex flex-wrap items-center gap-1.5 py-4 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href="/equipment" className="hover:text-foreground">
            Equipment
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="truncate text-foreground">{equipment.name}</span>
        </Container>
      </div>

      <section className="py-8 lg:py-12">
        <Container>
          <Link
            href="/equipment"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to catalogue
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.55fr_0.95fr] lg:gap-10">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
                <Image
                  src={equipment.image}
                  alt={equipment.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 62vw"
                  className="object-cover"
                />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#f6f3ec]/95 px-3 py-1 text-[11px] font-medium text-[#17493a]">
                    {equipment.condition}
                  </span>
                  <span className="rounded-full bg-[#14231c]/85 px-3 py-1 text-[11px] font-medium text-[#f6f3ec]">
                    {equipment.quantity > 0 ? "Available" : "Fully booked"}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <p className="label-mono text-muted-foreground">
                  {equipment.category}
                </p>
                <h1 className="mt-3 text-3xl leading-[1.05] sm:text-4xl lg:text-[2.9rem]">
                  {equipment.name}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {equipment.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarRange className="size-4" />
                    {RENTAL_LABEL[equipment.rentalType]} rental
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Package className="size-4" />
                    {equipment.quantity} unit{equipment.quantity === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-y border-border py-5">
                  <div>
                    <p className="label-mono text-muted-foreground">Rate</p>
                    <p className="mt-1 font-mono text-3xl font-semibold tracking-tight">
                      ${equipment.price}
                      <span className="ml-1 text-sm font-normal text-muted-foreground">
                        {RENTAL_SUFFIX[equipment.rentalType]}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <FavoriteButton
                      equipmentId={equipment.id}
                      initialFavorited={favorited}
                    />
                    <a
                      href="#booking"
                      className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
                    >
                      Book now
                    </a>
                  </div>
                </div>

                <section className="mt-8">
                  <h2 className="font-heading text-xl">About this equipment</h2>
                  <p className="mt-3 whitespace-pre-line text-[0.95rem] leading-relaxed text-muted-foreground">
                    {equipment.description}
                  </p>
                </section>

                <section className="mt-8">
                  <h2 className="font-heading text-xl">Specifications</h2>
                  <dl className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
                    {[
                      { label: "Brand", value: equipment.brand || "—" },
                      { label: "Model", value: equipment.model || "—" },
                      { label: "Condition", value: equipment.condition },
                      { label: "Rental type", value: RENTAL_LABEL[equipment.rentalType] },
                      { label: "Units available", value: String(equipment.quantity) },
                      { label: "Listed", value: formatDate(equipment.createdAt) },
                    ].map((spec) => (
                      <div key={spec.label} className="bg-card px-4 py-3">
                        <dt className="label-mono text-muted-foreground">
                          {spec.label}
                        </dt>
                        <dd className="mt-1 text-sm font-medium">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <section className="mt-8 rounded-2xl border border-border bg-muted/60 p-5">
                  <h2 className="flex items-center gap-2 font-heading text-lg">
                    <ShieldCheck className="size-4 text-primary" />
                    Rental terms
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {equipment.terms}
                  </p>
                </section>

                {owner ? (
                  <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid size-12 place-items-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {owner.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={owner.image}
                            alt={owner.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          initials(owner.name)
                        )}
                      </span>
                      <div>
                        <p className="text-xs text-muted-foreground">Listed by</p>
                        <p className="font-medium">{owner.name}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <BadgeCheck className="size-3.5 text-primary" />
                        Verified owner
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Wrench className="size-3.5 text-primary" />
                        Equipment checked
                      </span>
                      {owner.createdAt ? (
                        <span>Member since {new Date(owner.createdAt).getFullYear()}</span>
                      ) : null}
                    </div>
                  </section>
                ) : null}
              </div>
            </div>

            <aside id="booking" className="lg:sticky lg:top-24 lg:self-start">
              <BookingPanel equipment={equipment} />
            </aside>
          </div>
        </Container>
      </section>

      {related.length ? (
        <section className="border-t border-border py-16 lg:py-20">
          <Container>
            <SectionHeading
              eyebrow="More in this category"
              title="You might also need"
              description={`Other ${equipment.category.toLowerCase()} listings from verified owners.`}
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.05} className="h-full">
                  <EquipmentCard equipment={item} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
