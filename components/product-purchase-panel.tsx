"use client";

import { useMemo, useState } from "react";
import { AddToCart } from "@/components/add-to-cart";
import type { Product } from "@/lib/data";

function formatPrice(n: number, currency: string) {
  const safeCurrency = /^[A-Z]{3}$/.test(currency) ? currency : "PKR";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: safeCurrency,
    minimumFractionDigits: 0,
  }).format(n);
}

export function ProductPurchasePanel({ product }: { product: Product }) {
  const hasVariations = Boolean(product.variations?.length);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(
    product.variations?.[0]?.id || null,
  );

  const selectedVariation = useMemo(
    () => product.variations?.find((variation) => variation.id === selectedVariationId),
    [product.variations, selectedVariationId],
  );

  const activePrice = selectedVariation?.price ?? product.price;
  const activeCompareAtPrice = selectedVariation?.compareAtPrice ?? product.compareAtPrice;
  const activeSku = selectedVariation?.sku || product.sku || product.id;
  const cartProduct: Product = selectedVariation
    ? {
        ...product,
        id: `${product.id}:${selectedVariation.id}`,
        sku: selectedVariation.sku || product.sku,
        price: selectedVariation.price,
        subtitle: `${product.subtitle}${selectedVariation.size ? ` - ${selectedVariation.size}` : ""}`,
      }
    : product;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-3">
        {activeCompareAtPrice && activeCompareAtPrice > activePrice ? (
          <p className="text-sm text-stone-500 line-through">
            {formatPrice(activeCompareAtPrice, product.currency)}
          </p>
        ) : null}
        <p className="text-xl text-stone-900">{formatPrice(activePrice, product.currency)}</p>
      </div>
      <p className="text-xs uppercase tracking-[0.15em] text-stone-500">SKU {activeSku}</p>
      {hasVariations ? (
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-700">Size</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variations!.map((variation) => {
              const active = variation.id === selectedVariationId;
              return (
                <button
                  key={variation.id}
                  type="button"
                  onClick={() => setSelectedVariationId(variation.id)}
                  className={`min-w-[44px] border px-3 py-2 text-sm transition ${
                    active ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 hover:border-stone-900"
                  }`}
                >
                  {variation.size || variation.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      <AddToCart product={cartProduct} />
    </div>
  );
}
