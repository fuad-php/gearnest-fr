import type { Metadata } from "next";
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the GearNest team about a booking, a listing or a partnership. We reply within one business day, Monday to Saturday.",
};

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@gearnest.com",
    href: "mailto:hello@gearnest.com",
    hint: "Best for booking questions and listing reviews.",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (512) 555-0110",
    href: "tel:+15125550110",
    hint: "Mon–Sat, 8am–7pm Central Time.",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "120 Congress Ave, Austin, TX 78701",
    href: "https://maps.google.com/?q=120+Congress+Ave+Austin+TX+78701",
    hint: "Visits by appointment — we are usually out with the gear.",
  },
];

const QUICK_LINKS = [
  {
    title: "Booking help",
    body: "Dates, availability, delivery details or a payment that looks wrong.",
  },
  {
    title: "List your equipment",
    body: "Get your machine reviewed and live in the catalogue.",
  },
  {
    title: "Report a problem",
    body: "Something broken, late or not as described? Tell us and we will step in.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Tell us what you need.
            <br className="hidden sm:block" /> We will get back to you.
          </>
        }
        description="Questions about a booking, a listing or a partnership — send a message and a real person on the GearNest team will reply within one business day."
      >
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <Clock className="size-4 text-primary" />
          <div>
            <p className="text-sm font-medium">Mon–Sat, 8am–7pm CT</p>
            <p className="text-xs text-muted-foreground">
              Average reply time: under 4 hours
            </p>
          </div>
        </div>
      </PageHero>

      <section className="py-14 lg:py-18">
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            {CHANNELS.map((channel, index) => (
              <Reveal key={channel.label} delay={index * 0.05}>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <channel.icon className="size-5" />
                  </span>
                  <p className="label-mono mt-4 text-muted-foreground">
                    {channel.label}
                  </p>
                  <p className="mt-1.5 flex items-start gap-1 font-medium group-hover:text-primary">
                    {channel.value}
                    <ArrowUpRight className="mt-1 size-3.5 shrink-0" />
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {channel.hint}
                  </p>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div>
              <h2 className="flex items-center gap-2 font-heading text-2xl">
                <MessageSquare className="size-5 text-primary" />
                Send a message
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The more detail you include, the faster we can help. Booking IDs
                start with the last six characters shown in your dashboard.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-[#14231c] p-6 text-[#f6f3ec]">
                <p className="label-mono text-[#8fa197]">Before you write</p>
                <ul className="mt-4 space-y-4">
                  {QUICK_LINKS.map((item) => (
                    <li key={item.title}>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#b9c4bd]">
                        {item.body}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-[#2a4036] pt-4 text-xs leading-relaxed text-[#8fa197]">
                  For urgent issues during an active rental, call the number above
                  and include your booking ID.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="label-mono text-muted-foreground">Office hours</p>
                <dl className="mt-3 space-y-2 text-sm">
                  {[
                    { day: "Monday – Friday", hours: "8:00am – 7:00pm" },
                    { day: "Saturday", hours: "9:00am – 5:00pm" },
                    { day: "Sunday", hours: "Closed" },
                  ].map((row) => (
                    <div
                      key={row.day}
                      className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0"
                    >
                      <dt className="text-muted-foreground">{row.day}</dt>
                      <dd className="font-mono text-xs">{row.hours}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  All times Central. Messages sent outside hours are answered the
                  next business morning.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
