import type { Metadata } from "next";
import Link from "next/link";
import { PaymentSuccess } from "@/components/payment/payment-success";
import { ButtonLink } from "@/components/layout/button-link";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = {
  title: "Payment status",
  robots: { index: false, follow: false },
};

export default async function PaymentSuccessPage({
  searchParams,
}: PageProps<"/payment/success">) {
  const params = await searchParams;
  const raw = params.session_id;
  const sessionId = Array.isArray(raw) ? raw[0] : raw;

  if (!sessionId) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-background px-5 text-center">
        <Link href="/" aria-label="GearNest home">
          <Logo />
        </Link>
        <h1 className="mt-8 text-2xl">No checkout session found</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          This page is opened after a successful Stripe checkout. Head back to
          the catalogue to start a rental.
        </p>
        <ButtonLink href="/equipment" className="mt-6 h-11">
          Browse equipment
        </ButtonLink>
      </div>
    );
  }

  return <PaymentSuccess sessionId={sessionId} />;
}
