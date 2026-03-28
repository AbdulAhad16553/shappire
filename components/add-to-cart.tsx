"use client";

import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/lib/data";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <button
      type="button"
      onClick={() => add(product, 1)}
      className="w-full bg-stone-900 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-stone-800 md:max-w-sm"
    >
      Add to bag
    </button>
  );
}
