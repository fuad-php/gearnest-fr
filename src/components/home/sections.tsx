import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  CalendarRange,
  CreditCard,
  Lock,
  PackageCheck,
  Quote,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ButtonLink } from "@/components/layout/button-link";
import { Reveal } from "@/components/motion/reveal";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import { RENTAL_LABEL } from "@/lib/format";
import type { Category, Equipment, Review } from "@/types";

export function FeaturedSection({ equipment }: { equipment: Equipment[] }) {
  return (
    <section className="py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="01 — Featured equipment"
          title="Gear that's ready to work"
          description="Hand-picked machines and kits from owners with a track record. Every listing shows the real daily rate, availability and rental terms up front."
          action={
            <ButtonLink href="/equipment" variant="outline">
              View all equipment
              <ArrowUpRight className="size-4" />
            </ButtonLink>
          }
        />

        {equipment.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.05} className="h-full">
                <EquipmentCard equipment={item} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <p className="font-heading text-lg">Equipment is on its way</p>
            <p className="mt-2 text-sm text-muted-foreground">
              New listings are being approved. Check back shortly or browse the
              full catalogue.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}

export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="border-y border-border bg-[#ece8de]/50 py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="02 — Categories"
          title="Browse by what the job needs"
          description="Six categories, one place to find the right tool. Filter by rental type, location and availability on the full catalogue."
          action={
            <ButtonLink href="/equipment" variant="ghost">
              Explore catalogue
              <ArrowRight className="size-4" />
            </ButtonLink>
          }
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={index * 0.04}>
              <Link
                href={`/equipment?category=${encodeURIComponent(category.label)}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted"
              >
                <Image
                  src={category.image}
                  alt={category.label}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14231c]/80 via-[#14231c]/10 to-transparent" />
                <span className="absolute right-3 top-3 rounded-full bg-[#f6f3ec]/95 px-2.5 py-1 font-mono text-[11px] font-medium text-[#14231c]">
                  {category.count} listed
                </span>
                <div className="absolute inset-x-4 bottom-4 text-[#f6f3ec]">
                  <p className="font-heading text-xl leading-tight">
                    {category.short}
                  </p>
                  <p className="mt-1 max-w-[85%] text-xs leading-relaxed text-[#d7ded9]">
                    {category.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#f6f3ec]">
                    Browse category
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Verified owners",
    description:
      "Every owner completes an identity and equipment check before a listing goes live. You know who you are renting from.",
  },
  {
    icon: CalendarRange,
    title: "Flexible rental periods",
    description:
      "Daily, weekly or monthly — pick the term that fits the project. Availability is checked against real bookings.",
  },
  {
    icon: BadgeDollarSign,
    title: "Transparent pricing",
    description:
      "The rate you see is the rate you pay. Duration and quantity are calculated before checkout, with no surprise fees.",
  },
  {
    icon: Lock,
    title: "Secure Stripe payments",
    description:
      "Card details never touch GearNest. Payments are processed by Stripe and recorded against your booking.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading
            eyebrow="03 — Why GearNest"
            title="Rental that respects your time and your budget"
            description="The marketplace is built around the details that usually go wrong: unclear terms, double bookings and payments you cannot trace. We fixed them."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/equipment">
              Find equipment
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/how-it-works" variant="outline">
              See how it works
            </ButtonLink>
          </div>
        </div>

        <div>
          {BENEFITS.map((benefit, index) => (
            <Reveal key={benefit.title} delay={index * 0.06}>
              <div className="flex gap-5 border-t border-border py-7 first:border-t-0 first:pt-0">
                <span className="label-mono mt-1 text-muted-foreground">
                  0{index + 1}
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-card text-primary">
                  <benefit.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-lg">{benefit.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

const STEPS = [
  {
    icon: Search,
    title: "Find the right gear",
    description:
      "Search by name or location, filter by category, rental type and budget, then compare availability.",
  },
  {
    icon: CalendarRange,
    title: "Book your dates",
    description:
      "Choose a start and end date, the quantity you need and where it should be delivered. See the total before paying.",
  },
  {
    icon: CreditCard,
    title: "Pay and get to work",
    description:
      "Complete a secure Stripe checkout. The booking is confirmed instantly and the owner is notified.",
  },
  {
    icon: PackageCheck,
    title: "Return and review",
    description:
      "Use the gear, return it as agreed and leave a review so the next renter knows what to expect.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-[#14231c] py-20 text-[#f6f3ec] lg:py-24">
      <Container>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="label-mono flex items-center gap-3 text-[#8fa197]">
              <span className="h-px w-8 bg-[#e4572e]" aria-hidden="true" />
              04 — How it works
            </p>
            <h2 className="mt-4 text-3xl leading-[1.05] sm:text-4xl lg:text-[2.75rem]">
              Four steps from search to site
            </h2>
          </div>
          <ButtonLink
            href="/how-it-works"
            variant="outline"
            className="border-[#3a5145] bg-transparent text-[#f6f3ec] hover:bg-[#1e332a] hover:text-[#f6f3ec]"
          >
            Full walkthrough
            <ArrowUpRight className="size-4" />
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.07}>
              <div className="border-t border-[#2a4036] pt-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-[#1e332a] text-[#e4572e]">
                    <step.icon className="size-5" />
                  </span>
                  <span className="font-mono text-sm text-[#6f8578]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#b9c4bd]">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section className="py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="05 — Customer reviews"
          title="Trusted by the people doing the work"
          description="Real feedback from renters and owners across Central Texas."
          action={
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
              <span className="font-heading text-2xl font-semibold">4.9</span>
              <div>
                <div className="flex gap-0.5 text-accent">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  From 1,200+ rentals
                </p>
              </div>
            </div>
          }
        />

        {reviews.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {reviews.slice(0, 4).map((review, index) => (
              <Reveal key={review.id} delay={index * 0.05}>
                <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 text-accent">
                      {[...Array(5)].map((_, star) => (
                        <Star
                          key={star}
                          className={
                            star < review.rating
                              ? "size-4 fill-current"
                              : "size-4 text-border"
                          }
                        />
                      ))}
                    </div>
                    <Quote className="size-7 text-border" />
                  </div>
                  <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-foreground/90">
                    “{review.comment}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                    <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {review.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{review.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.role} · {review.location}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Reviews will appear here once the first rentals are completed.
          </div>
        )}
      </Container>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="pb-20 lg:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-[#2a4036] bg-[#17493a] px-6 py-12 text-[#f6f3ec] sm:px-10 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full border border-[#2f5d4a]" />
          <div className="pointer-events-none absolute -bottom-28 right-16 size-64 rounded-full border border-[#2f5d4a]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="label-mono text-[#a9c2b5]">For equipment owners</p>
              <h2 className="mt-3 max-w-2xl text-3xl leading-[1.05] sm:text-4xl lg:text-[2.6rem]">
                Your gear could be earning this weekend.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#c8d6cd]">
                List your equipment in minutes, set your own rates and approve
                every booking. We handle discovery, payments and the paperwork.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <ButtonLink
                href="/register?role=owner"
                className="h-11 bg-[#e4572e] px-5 text-[#14231c] hover:bg-[#ef6a42]"
              >
                Start listing
                <ArrowRight className="size-4" />
              </ButtonLink>
              <p className="text-xs text-[#a9c2b5]">
                No listing fee. 10% platform commission per rental.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
