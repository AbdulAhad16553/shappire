import Link from "next/link";
import { SITE } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-[#f7f5f2]">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg tracking-[0.25em] text-stone-900">
            {SITE.name.toUpperCase()}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {SITE.tagline}. Crafted for international delivery — dummy storefront for layout demo.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-900">
            Shop
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-stone-600">
            <li>
              <Link href="/collections/ready-to-wear" className="hover:text-stone-900">
                Ready to Wear
              </Link>
            </li>
            <li>
              <Link href="/collections/unstitched" className="hover:text-stone-900">
                Unstitched
              </Link>
            </li>
            <li>
              <Link href="/collections/west" className="hover:text-stone-900">
                West
              </Link>
            </li>
            <li>
              <Link href="/collections/modest-wear" className="hover:text-stone-900">
                Modest Wear
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-900">
            Customer care
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-stone-600">
            <li>
              <span className="cursor-default">Order tracking</span>
            </li>
            <li>
              <span className="cursor-default">Exchanges &amp; returns</span>
            </li>
            <li>
              <span className="cursor-default">Shipping internationally</span>
            </li>
            <li>
              <span className="cursor-default">Contact</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-900">
            Stores
          </h3>
          <p className="mt-4 text-sm text-stone-600">
            Visit our flagship locations — hours and addresses (demo).
          </p>
        </div>
      </div>
      <div className="border-t border-stone-200/80 py-6 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {SITE.name}. Dummy site — not affiliated with any retailer.
      </div>
    </footer>
  );
}
