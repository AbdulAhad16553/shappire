"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/lib/data";
import { useCart } from "@/contexts/cart-context";
import { IconBag, IconMenu, IconSearch, IconUser } from "@/components/icons";
import { MobileDrawer } from "@/components/mobile-drawer";
import type { StoreNavSection } from "@/lib/products-gql";

const desktopNav = [
  { label: "Ready to Wear", href: "/collections/ready-to-wear" },
  { label: "Unstitched", href: "/collections/unstitched" },
  { label: "West", href: "/collections/west" },
  { label: "Modest Wear", href: "/collections/modest-wear" },
  { label: "New In", href: "/collections/all" },
];

export function SiteHeader({ navSections }: { navSections?: StoreNavSection[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lines, setOpen } = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const primaryNav =
    navSections && navSections.length
      ? navSections.map((s) => ({ label: s.title, href: s.href }))
      : desktopNav;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-stone-700/20 bg-[#deceb0]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
            <button
              type="button"
              className="rounded p-2 text-stone-800 hover:bg-stone-100 md:hidden"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <IconMenu className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="hidden rounded p-2 text-stone-800 hover:bg-stone-100 md:block"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <IconMenu className="h-6 w-6" />
            </button>
            <Link
              href="/"
              className="font-[family-name:var(--font-display)] text-xl tracking-[0.28em] text-[#181818] md:text-2xl"
            >
              {SITE.name.toUpperCase()}
            </Link>
          </div>

          <nav
            className="hidden flex-[2] justify-center lg:flex"
            aria-label="Primary"
          >
            <ul className="flex flex-wrap items-center justify-center gap-6 text-[13px] uppercase tracking-[0.12em] text-stone-800">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-stone-500 whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            <button
              type="button"
              className="rounded p-2 text-stone-800 hover:bg-stone-100"
              aria-label="Search"
            >
              <IconSearch className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <Link
              href="/account"
              className="rounded p-2 text-stone-800 hover:bg-stone-100"
              aria-label="Account"
            >
              <IconUser className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
            <button
              type="button"
              className="relative rounded p-2 text-stone-800 hover:bg-stone-100"
              aria-label="Shopping bag"
              onClick={() => setOpen(true)}
            >
              <IconBag className="h-5 w-5 sm:h-6 sm:w-6" />
              {count > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-stone-900 px-1 text-[10px] font-semibold text-white">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} sections={navSections} />
    </>
  );
}
