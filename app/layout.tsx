import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/lib/data";
import { getStoreNavSections } from "@/lib/products-gql";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description:
    "Luxury fashion storefront — Libas e Insha.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navSections = await getStoreNavSections();

  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-[var(--background)] font-[family-name:var(--font-sans)] text-stone-950">
        <Providers>
          <p className="bg-[#181818] py-2.5 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-[#deceb0]">
            Libas e Insha · Wear Elegance · International delivery
          </p>
          <SiteHeader navSections={navSections} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
