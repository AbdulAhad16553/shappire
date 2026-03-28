"use client";

import { useMemo, useState } from "react";
import { products, type CategorySlug } from "@/lib/data";
import { ProductCard } from "@/components/product-card";

type TabId = "unstitched" | "rtw" | "west" | "combo";

const tabs: {
  id: TabId;
  label: string;
  filter: (c: CategorySlug) => boolean;
}[] = [
  { id: "unstitched", label: "Unstitched", filter: (c) => c === "unstitched" },
  { id: "rtw", label: "Ready to Wear", filter: (c) => c === "ready-to-wear" },
  { id: "west", label: "West", filter: (c) => c === "west" },
  {
    id: "combo",
    label: "Combo picks",
    filter: (c) => c === "accessories" || c === "ready-to-wear",
  },
];

export function HomeTrending() {
  const [tab, setTab] = useState<TabId>("unstitched");

  const list = useMemo(() => {
    const t = tabs.find((x) => x.id === tab)!;
    return products.filter((p) => t.filter(p.category)).slice(0, 8);
  }, [tab]);

  return (
    <section className="border-t border-stone-200 bg-white py-14 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900 md:text-4xl">
            Trending
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Discover the best-selling styles
          </p>
        </div>
        <div
          className="mt-8 flex flex-wrap justify-center gap-2 border-b border-stone-200 pb-4"
          role="tablist"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition ${
                tab === t.id
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
