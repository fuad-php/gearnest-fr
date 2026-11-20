import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Star } from "lucide-react";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden overflow-hidden bg-[#14231c] p-12 text-[#f6f3ec] lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border border-[#2a4036]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full border border-[#2a4036]"
        />

        <Link href="/" aria-label="GearNest home" className="relative">
          <Logo
            className="text-[#f6f3ec] [&_span]:text-[#f6f3ec]"
            markClassName="text-[#f6f3ec]"
          />
        </Link>

        <div className="relative">
          <p className="label-mono flex items-center gap-3 text-[#8fa197]">
            <span className="h-px w-8 bg-[#e4572e]" aria-hidden="true" />
            GearNest marketplace
          </p>
          <h2 className="mt-5 max-w-md text-4xl leading-[1.02] xl:text-5xl">
            The right tool,
            <br />
            one click away.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#b9c4bd]">
            Join a marketplace built for crews, studios and growers. Verified
            owners, clear terms and secure payments on every rental.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-[#2a4036] pt-6">
            <div>
              <dt className="font-heading text-2xl font-semibold">12k+</dt>
              <dd className="mt-1 text-xs text-[#8fa197]">Rentals</dd>
            </div>
            <div>
              <dt className="font-heading text-2xl font-semibold">480</dt>
              <dd className="mt-1 text-xs text-[#8fa197]">Owners</dd>
            </div>
            <div>
              <dt className="font-heading text-2xl font-semibold">4.9</dt>
              <dd className="mt-1 text-xs text-[#8fa197]">Avg rating</dd>
            </div>
          </dl>
        </div>

        <figure className="relative rounded-2xl border border-[#2a4036] bg-[#1e332a]/60 p-5">
          <div className="flex gap-0.5 text-[#e4572e]">
            {[...Array(5)].map((_, index) => (
              <Star key={index} className="size-3.5 fill-current" />
            ))}
          </div>
          <blockquote className="mt-3 text-sm leading-relaxed text-[#d7ded9]">
            “Booked a camera kit for a two-day shoot. The listing was accurate,
            the owner replied in minutes and checkout took one page.”
          </blockquote>
          <figcaption className="mt-3 text-xs text-[#8fa197]">
            Sofia Bennett · Customer, Round Rock
          </figcaption>
        </figure>
      </aside>

      <main className="flex min-h-svh flex-col">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 lg:hidden">
          <Link href="/" aria-label="GearNest home">
            <Logo />
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
