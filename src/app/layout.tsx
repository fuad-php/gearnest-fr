import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "GearNest — Rent the right gear",
    template: "%s · GearNest",
  },
  description:
    "GearNest connects verified equipment owners with customers who need the right tool for the job. Browse, book and pay securely.",
  keywords: [
    "equipment rental",
    "construction equipment",
    "camera rental",
    "vehicle rental",
    "GearNest",
  ],
  openGraph: {
    title: "GearNest — Rent the right gear",
    description:
      "A transparent rental marketplace for construction, photography, vehicles, agriculture, electronics and event gear.",
    type: "website",
    url: appUrl,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bricolage.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#14231c",
              border: "1px solid #dcd7cb",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
