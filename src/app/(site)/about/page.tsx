import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  Handshake,
  Leaf,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { ButtonLink } from "@/components/layout/button-link";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "GearNest is a rental marketplace built for the crews, studios and growers who keep things moving — transparent rates, verified owners and secure payments.",
};

const STATS = [
  { value: "1,200+", label: "rentals completed" },
  { value: "48", label: "cities served" },
  { value: "4.9/5", label: "average rating" },
  { value: "10%", label: "platform commission" },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trust is the product",
    description:
      "Owners verify their identity and equipment before a listing goes live. Renters see real terms, real availability and a real rate before paying.",
  },
  {
    icon: Handshake,
    title: "Owners stay in control",
    description:
      "You set the price, the dates and the conditions. Every booking is approved by the owner, and you can pause a listing whenever you need the gear back.",
  },
  {
    icon: Sparkles,
    title: "No surprises, ever",
    description:
      "Duration and quantity are priced on the server before checkout. Payments go through Stripe, and a booking only exists once payment is confirmed.",
  },
  {
    icon: Leaf,
    title: "Better use of what exists",
    description:
      "Most equipment sits idle most of the year. Sharing it means fewer machines built, less money tied up and more work done with what we already have.",
  },
];

const TEAM = [
  {
    name: "Maya Ortega",
    role: "Founder & CEO",
    bio: "Spent a decade running site logistics before deciding renting gear should not require three phone calls and a fax.",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Daniel Reyes",
    role: "Head of Marketplace",
    bio: "Works with owners across Texas to keep listings accurate, pricing fair and availability trustworthy.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Priya Nair",
    role: "Engineering Lead",
    bio: "Builds the availability and payments systems that make a booking confirm the moment the card clears.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About GearNest"
        title={
          <>
            Built for the people who
            <br className="hidden sm:block" /> make things happen.
          </>
        }
        description="GearNest started with a simple frustration: renting a machine should take minutes, not a week of phone calls. We built a marketplace where owners list real gear, renters see real rates, and payments are settled before anything leaves the yard."
      >
        <ButtonLink href="/equipment" className="h-11 px-5">
          Browse equipment
          <ArrowRight className="size-4" />
        </ButtonLink>
      </PageHero>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Our story"
                title="A catalogue, not a classifieds board"
                description="We kept seeing the same problems: listings with no real availability, rates that changed at pickup and payments nobody could trace. GearNest treats every listing like a product page — with the rate, the condition and the terms in plain sight."
              />
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                Owners list their equipment with photos, specifications and the
                conditions of the rental. An admin reviews each listing before it
                goes public. Renters pick dates, see the calculated total and pay
                securely. The booking is created only after payment is confirmed,
                so nobody double-books a machine that is already out on site.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Today GearNest connects construction crews, photography studios,
                event producers, farms and independent operators across Central
                Texas — and we are adding new cities every quarter.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, index) => (
                <Reveal key={stat.label} delay={index * 0.05}>
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <p className="font-heading text-3xl font-semibold tracking-tight">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-muted/50 py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="What we believe"
            title="Four principles behind every listing"
            description="These are the rules we hold ourselves to, and the ones we hold owners to as well."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.05}>
                <div className="flex h-full gap-4 rounded-2xl border border-border bg-card p-6">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <value.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-heading text-lg">{value.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="The team"
            title="Small team, practical experience"
            description="We have rented the excavators, packed the vans and chased the invoices. That is why GearNest works the way it does."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((person, index) => (
              <Reveal key={person.name} delay={index * 0.06} className="h-full">
                <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="relative aspect-[4/3] bg-muted">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="flex flex-1 flex-col p-5">
                    <p className="font-heading text-lg">{person.name}</p>
                    <p className="label-mono mt-1 text-muted-foreground">
                      {person.role}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {person.bio}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20 lg:pb-24">
        <Container>
          <div className="grid gap-6 rounded-3xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="label-mono text-muted-foreground">Join the marketplace</p>
              <h2 className="mt-3 text-3xl leading-[1.05]">
                Rent the gear. Or put yours to work.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Whether you need a machine for the weekend or want to earn from
                equipment that is sitting idle, GearNest has a side of the market
                for you.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ButtonLink href="/register" className="h-11 px-5">
                Create an account
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/how-it-works" variant="outline" className="h-11 px-5">
                <Users className="size-4" />
                How it works
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost" className="h-11 px-5">
                <Wrench className="size-4" />
                Talk to us
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
