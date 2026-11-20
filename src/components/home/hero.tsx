"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BadgeCheck, MapPin, ShieldCheck, Star } from "lucide-react";
import { ButtonLink } from "@/components/layout/button-link";
import { Container } from "@/components/layout/container";

const STATS = [
  { value: "12k+", label: "Rentals completed" },
  { value: "480", label: "Verified owners" },
  { value: "4.9/5", label: "Average rating" },
];

export function Hero() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };

  const item = {
    hidden: reduce ? {} : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative overflow-hidden border-b border-border">
      <Container className="grid items-center gap-14 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-24">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="label-mono flex items-center gap-3 text-muted-foreground"
          >
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            Equipment rental, without the friction
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-[2.9rem] leading-[0.94] sm:text-6xl lg:text-[4.4rem]"
          >
            Rent the right gear.
            <br />
            Keep the good work{" "}
            <span className="relative inline-block text-primary">
              moving.
              <svg
                viewBox="0 0 220 14"
                aria-hidden="true"
                className="absolute -bottom-2 left-0 h-3 w-full text-accent"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9c40-6 80-7 120-4s60 3 96-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Borrow excavators, cinema cameras, tractors and event kits from
            verified owners nearby. Clear terms, honest pricing and a secure
            checkout — so the job gets done.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/equipment" className="h-11 px-5 text-[0.95rem]">
              Browse equipment
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink
              href="/register?role=owner"
              variant="outline"
              className="h-11 px-5 text-[0.95rem]"
            >
              List your gear
            </ButtonLink>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary" />
              Verified owners
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="size-4 text-primary" />
              Transparent terms
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-4 text-primary" />
              Secure Stripe checkout
            </span>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6"
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="font-heading text-2xl font-semibold">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-border bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
              alt="Excavator on a construction site at golden hour"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14231c]/55 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 text-[#f6f3ec]">
              <div>
                <p className="label-mono text-[#d7ded9]">Available this week</p>
                <p className="mt-1 font-heading text-xl">CAT 320 Excavator</p>
              </div>
              <span className="rounded-full bg-[#f6f3ec] px-3 py-1.5 font-mono text-xs font-semibold text-[#14231c]">
                $420/day
              </span>
            </div>
          </div>

          <motion.div
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 bottom-24 hidden w-56 rounded-xl border border-border bg-card p-3 shadow-sm sm:block"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium">Owner verified</p>
                <p className="text-xs text-muted-foreground">
                  ID + equipment check
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
              <MapPin className="size-3.5" />
              Austin, TX · 2.4 mi away
            </div>
          </motion.div>

          <motion.div
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
            className="absolute -right-4 top-6 grid size-24 place-items-center rounded-full border border-dashed border-accent/60 bg-background text-center"
          >
            <div className="grid size-16 place-items-center rounded-full bg-accent/10">
              <ShieldCheck className="size-7 text-accent" />
            </div>
          </motion.div>

          <div className="absolute -bottom-6 right-8 hidden w-36 overflow-hidden rounded-xl border border-border bg-muted md:block">
            <div className="relative aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80"
                alt="Camera kit available on GearNest"
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </Container>

      <div className="border-t border-border bg-primary py-3 text-primary-foreground">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8">
            {[...Array(2)].map((_, group) => (
              <div key={group} className="flex items-center gap-8" aria-hidden={group === 1}>
                {[
                  "Construction",
                  "Photography",
                  "Vehicles",
                  "Agriculture",
                  "Electronics",
                  "Events",
                ].map((label) => (
                  <span
                    key={`${group}-${label}`}
                    className="label-mono flex items-center gap-8 text-primary-foreground/85"
                  >
                    {label}
                    <span className="text-accent">✳</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
