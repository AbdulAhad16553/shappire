"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { IconClose } from "@/components/icons";

function formatPrice(n: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(n);
}

export function CartDrawer() {
  const { lines, open, setOpen, remove, setQty } = useCart();
  const subtotal = lines.reduce(
    (s, l) => s + l.product.price * l.qty,
    0,
  );
  const currency = lines[0]?.product.currency ?? "USD";

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[min(100%,420px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">
            Bag ({lines.length})
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded p-2 text-stone-700 hover:bg-stone-100"
            aria-label="Close bag"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {lines.length === 0 ? (
            <p className="text-sm text-stone-500">Your bag is empty.</p>
          ) : (
            <ul className="space-y-6">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3 border-b border-stone-100 pb-6">
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative h-28 w-20 shrink-0 overflow-hidden bg-stone-100"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={80}
                      height={112}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium leading-snug text-stone-900 hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-stone-500">{product.subtitle}</p>
                    <p className="mt-2 text-sm text-stone-800">
                      {formatPrice(product.price, product.currency)}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <label className="sr-only" htmlFor={`qty-${product.id}`}>
                        Quantity
                      </label>
                      <select
                        id={`qty-${product.id}`}
                        value={qty}
                        onChange={(e) =>
                          setQty(product.id, Number(e.target.value))
                        }
                        className="rounded border border-stone-300 bg-white px-2 py-1 text-sm"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        className="text-xs uppercase tracking-wide text-stone-500 underline hover:text-stone-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-stone-200 p-4">
          <div className="mb-4 flex justify-between text-sm">
            <span className="text-stone-600">Subtotal</span>
            <span className="font-medium text-stone-900">
              {formatPrice(subtotal, currency)}
            </span>
          </div>
          <button
            type="button"
            className="w-full bg-stone-900 py-3 text-center text-sm font-semibold uppercase tracking-[0.15em] text-white hover:bg-stone-800"
          >
            Checkout
          </button>
          <p className="mt-3 text-center text-xs text-stone-500">
            Shipping &amp; taxes calculated at checkout.
          </p>
        </div>
      </aside>
    </>
  );
}
