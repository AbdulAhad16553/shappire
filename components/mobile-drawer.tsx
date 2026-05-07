"use client";

import Link from "next/link";
import { useEffect } from "react";
import { navDrawer } from "@/lib/data";
import { IconClose } from "@/components/icons";
import type { StoreNavSection } from "@/lib/products-gql";

export function MobileDrawer({
  open,
  onClose,
  sections,
}: {
  open: boolean;
  onClose: () => void;
  sections?: StoreNavSection[];
}) {
  const drawerSections = sections && sections.length ? sections : navDrawer;
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
        onClick={onClose}
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[min(100%,380px)] flex-col bg-[#faf9f7] shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between border-b border-stone-200/80 px-4 py-4">
          <span className="font-[family-name:var(--font-display)] text-xl tracking-[0.2em] text-stone-900">
            MENU
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-stone-700 hover:bg-stone-200/60"
            aria-label="Close menu"
          >
            <IconClose className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-1">
            {drawerSections.map((section) => (
              <li key={section.title} className="border-b border-stone-200/60 py-3">
                <Link
                  href={section.href}
                  onClick={onClose}
                  className="flex items-center justify-between font-medium text-stone-900 hover:text-stone-600"
                >
                  {section.title}
                </Link>
                {section.children && (
                  <ul className="mt-2 space-y-1 pl-1">
                    {section.children.map((c) => (
                      <li key={c.href + c.label}>
                        <Link
                          href={c.href}
                          onClick={onClose}
                          className="block py-1.5 text-sm text-stone-600 hover:text-stone-900"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-2 border-t border-stone-200 pt-6 text-sm text-stone-600">
            <Link href="/collections/all" onClick={onClose} className="block py-1 hover:text-stone-900">
              New In
            </Link>
            <Link href="/collections/ready-to-wear" onClick={onClose} className="block py-1 hover:text-stone-900">
              Sale
            </Link>
            <p className="pt-4 text-xs uppercase tracking-widest text-stone-500">
              Help
            </p>
            <span className="block py-1">Order tracking</span>
            <span className="block py-1">Exchanges &amp; returns</span>
            <span className="block py-1">Store locator</span>
          </div>
        </nav>
      </aside>
    </>
  );
}
