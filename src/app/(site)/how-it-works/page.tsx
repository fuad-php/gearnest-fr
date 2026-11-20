import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarRange,
  CreditCard,
  PackageCheck,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { ButtonLink } from "@/components/layout/button-link";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How renting works on GearNest: find gear, pick your dates, pay securely and get to work. Owners list equipment, approve bookings and get paid.",
};

const RENTER_STEPS = [
  {
    icon: Search,
    title: "Search the catalogue",
    description:
      "Search by name or location, then narrow by category, rental type, price and availability. Every listing shows the real daily, weekly or monthly rate up front.",
    detail:
      "Filters run on the server, so results stay fast even as the catalogue grows. Sign in to open a details page and save favourites.",
  },
  {
    icon: CalendarRange,
    title: "Choose dates and quantity",
    description:
      "Pick a start and end date, set how many units you need and tell the owner where to deliver. Availability is checked against confirmed bookings in real time.",
    detail:
      "The total is calculated on the server from the owner's rate and your duration — daily, weekly (7-day blocks) or monthly (30-day blocks), multiplied by quantity.",
  },
  {
    icon: CreditCard,
    title: "Pay securely with Stripe",
    description:
      "Checkout happens on Stripe. Card details never touch GearNest, and your booking is created only after the payment is confirmed.",
    detail:
      "If a checkout is abandoned, nothing is booked. The draft expires automatically, so the dates stay open for other renters.",
  },
  {
    icon: PackageCheck,
    title: "Receive, use and return",
    description:
      "The owner is notified as soon as you pay and arranges delivery or pickup. When the rental is over, return the gear as agreed and leave a review.",
    detail:
      "Track the booking status in your dashboard. Owners mark rentals active on handover and completed on return.",
  },
];

const OWNER_STEPS = [
  {
    icon: ShieldCheck,
    title: "List your equipment",
    description:
      "Add photos, specifications, a rate and the rental terms. Upload images directly or paste a URL — uploads go through our server so the image key stays private.",
    detail: "Every new listing is reviewed by an admin before it appears publicly.",
  },
  {
    icon: CalendarRange,
    title: "Approve every booking",
    description:
      "You decide what goes out and when. Mark a rental active when it leaves, completed when it returns, or cancel if plans change.",
    detail:
      "Bookings move through clear states: confirmed → active → completed. Overlapping dates are checked automatically.",
  },
  {
    icon: CreditCard,
    title: "Get paid through Stripe",
    description:
      "Renters pay at checkout. Earnings are recorded against each booking and shown in your analytics dashboard.",
    detail: "A flat 10% platform commission per rental. No listing fee, ever.",
  },
];

const FAQ = [
  {
    question: "When is my booking confirmed?",
    answer:
      "Only after payment is confirmed. We create a short-lived checkout draft, send you to Stripe, and write the booking once Stripe reports the session as paid. You will land on a confirmation page with the booking ID.",
  },
  {
    question: "How is the price calculated?",
    answer:
      "The owner sets a rate for daily, weekly or monthly rental. The server works out the number of days, converts that to rental units (a week is a 7-day block, a month is 30 days), multiplies by quantity and returns the total in cents before you pay.",
  },
  {
    question: "What happens if the gear is already booked?",
    answer:
      "Availability is the sum of overlapping confirmed and active bookings. If your requested quantity would exceed the units the owner has, checkout is blocked with the remaining count so you can adjust dates or quantity.",
  },
  {
    question: "Can I cancel a rental?",
    answer:
      "Yes, while the booking is confirmed and has not started yet. Cancelling marks the payment as refunded and notifies the owner. Rentals that are already active cannot be cancelled — the owner closes them out as completed instead.",
  },
  {
    question: "How do owners get approved?",
    answer:
      "Register as an owner, complete your profile and submit your first listing. An admin reviews the equipment details and photos before approving it. Admin accounts are created internally and never through public registration.",
  },
  {
    question: "Is my payment information safe?",
    answer:
      "Card data is handled entirely by Stripe. GearNest stores only the payment status, amount and session reference against your booking. Server secrets such as the Stripe key and image upload key never reach the browser.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title={
          <>
            From search to site
            <br className="hidden sm:block" /> in four steps.
          </>
        }
        description="GearNest keeps the rental process short and predictable — for the people renting gear and for the people earning from it. Here is exactly what happens at each step."
      >
        <ButtonLink href="/equipment" className="h-11 px-5">
          Find equipment
          <ArrowRight className="size-4" />
        </ButtonLink>
      </PageHero>

      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="For renters"
            title="Renting gear, end to end"
            description="No phone tag, no hidden fees, no double bookings. Every step is visible before you commit."
          />

          <ol className="mt-10 space-y-5">
            {RENTER_STEPS.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.04}>
                <li className="grid gap-5 rounded-2xl border border-border bg-card p-6 sm:grid-cols-[auto_1fr] sm:p-7">
                  <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="size-5" />
                    </span>
                    <span className="font-mono text-sm text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                    <p className="mt-3 rounded-xl bg-background px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-y border-border bg-[#14231c] py-16 text-[#f6f3ec] lg:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className="label-mono flex items-center gap-3 text-[#8fa197]">
              <span className="h-px w-8 bg-[#e4572e]" aria-hidden="true" />
              For owners
            </p>
            <h2 className="mt-4 text-3xl leading-[1.05] sm:text-4xl lg:text-[2.75rem]">
              Put idle equipment to work
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#b9c4bd]">
              Listing is free. You keep control of the calendar and the rate. We
              handle discovery, secure payments and the records.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {OWNER_STEPS.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.06}>
                <div className="flex h-full flex-col border-t border-[#2a4036] pt-6">
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
                  <p className="mt-3 text-xs leading-relaxed text-[#8fa197]">
                    {step.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10">
            <ButtonLink
              href="/register?role=owner"
              className="h-11 bg-[#e4572e] px-5 text-[#14231c] hover:bg-[#ef6a42]"
            >
              Start listing equipment
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeading
              eyebrow="Questions"
              title="Answers before you book"
              description="The details that usually cause friction, explained plainly. Still unsure? Send us a message."
            />
            <ButtonLink href="/contact" variant="outline" className="mt-6 h-11 px-5">
              Contact support
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>

          <div className="space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-border bg-card px-5 py-4 open:bg-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">
                  {item.question}
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20 lg:pb-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-card p-6 sm:p-10 lg:flex-row lg:items-center">
            <div>
              <p className="label-mono flex items-center gap-2 text-muted-foreground">
                <Star className="size-3.5 fill-current text-accent" />
                Ready when you are
              </p>
              <h2 className="mt-3 text-3xl leading-[1.05]">
                The right gear is one search away.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/equipment" className="h-11 px-5">
                Browse the catalogue
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/register" variant="outline" className="h-11 px-5">
                Create an account
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
