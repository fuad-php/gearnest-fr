import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";

const EXPLORE = [
  { href: "/equipment", label: "All Equipment" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About GearNest" },
  { href: "/contact", label: "Contact Us" },
];

const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function LinkedInLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M6.94 8.5H4V20h2.94V8.5ZM5.47 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.6c0-3.2-1.7-4.7-4-4.7-1.8 0-2.6 1-3.1 1.7V8.5H10V20h2.94v-6.2c0-1.6.3-3.1 2.1-3.1 1.8 0 1.9 1.7 1.9 3.2V20H20v-6.4Z" />
    </svg>
  );
}

function YouTubeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 9.5v5l4.5-2.5L10 9.5Z" fill="currentColor" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[#14231c] text-[#f6f3ec]">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <Link href="/" aria-label="GearNest home">
              <Logo
                className="text-[#f6f3ec] [&_span]:text-[#f6f3ec]"
                markClassName="text-[#f6f3ec]"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#b9c4bd]">
              A transparent rental marketplace for the crews, studios and growers
              who keep things moving.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GearNest on X"
                className="grid size-9 place-items-center rounded-full border border-[#2a4036] text-[#d7ded9] transition-colors hover:border-[#e4572e] hover:text-[#e4572e]"
              >
                <XLogo className="size-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GearNest on Instagram"
                className="grid size-9 place-items-center rounded-full border border-[#2a4036] text-[#d7ded9] transition-colors hover:border-[#e4572e] hover:text-[#e4572e]"
              >
                <InstagramLogo className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GearNest on LinkedIn"
                className="grid size-9 place-items-center rounded-full border border-[#2a4036] text-[#d7ded9] transition-colors hover:border-[#e4572e] hover:text-[#e4572e]"
              >
                <LinkedInLogo className="size-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GearNest on YouTube"
                className="grid size-9 place-items-center rounded-full border border-[#2a4036] text-[#d7ded9] transition-colors hover:border-[#e4572e] hover:text-[#e4572e]"
              >
                <YouTubeLogo className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="label-mono text-[#8fa197]">Explore</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {EXPLORE.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#d7ded9] transition-colors hover:text-[#e4572e]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label-mono text-[#8fa197]">Categories</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/equipment?category=${encodeURIComponent(category)}`}
                    className="text-[#d7ded9] transition-colors hover:text-[#e4572e]"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label-mono text-[#8fa197]">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#d7ded9]">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#e4572e]" />
                <span>120 Congress Ave, Austin, TX 78701</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-[#e4572e]" />
                <a href="mailto:hello@gearnest.com" className="hover:text-[#e4572e]">
                  hello@gearnest.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-[#e4572e]" />
                <a href="tel:+15125550110" className="hover:text-[#e4572e]">
                  +1 (512) 555-0110
                </a>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-[#8fa197]">
              Support hours: Mon–Sat, 8am–7pm CT.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[#2a4036] pt-6 text-xs text-[#8fa197] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GearNest. All rights reserved.</p>
          <p>Built for people who make things happen.</p>
        </div>
      </Container>
    </footer>
  );
}
