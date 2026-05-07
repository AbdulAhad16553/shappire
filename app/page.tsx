import Image from "next/image";
import Link from "next/link";
import { SITE, trendTiles } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { HomeTrending } from "@/components/home-trending";
import {
  getStoreCategories,
  getStoreInspirations,
  getStoreNavSections,
  getStoreProductCats,
  getStoreProducts,
} from "@/lib/products-gql";

export default async function HomePage() {
  const allProducts = await getStoreProducts();
  const collections = await getStoreCategories();
  const navSections = await getStoreNavSections();
  const inspiration = await getStoreInspirations();
  const productCats = await getStoreProductCats();
  const flaggedNewIn = allProducts.filter((p) => p.newIn);
  const newIn = (flaggedNewIn.length ? flaggedNewIn : allProducts).slice(0, 8);
  const dynamicProductCats = productCats
    .filter((c) => c.type === "category")
    .slice(0, 10);
  const pills = dynamicProductCats.length
    ? dynamicProductCats
    : inspiration.slice(0, 6).map((item) => ({
        name: item.name,
        slug: item.slug,
      }));
  const heroImageBySlug: Record<string, string> = {
    "ready-to-wear": "/images/hero-rtw.svg",
    unstitched: "/images/hero-unstitched.svg",
    west: "/images/hero-west.svg",
  };
  const heroes = (collections.length ? collections : [
    { slug: "ready-to-wear", title: "Ready to Wear", description: "Spring Summer '26" },
    { slug: "unstitched", title: "Unstitched", description: "Spring Summer '26" },
    { slug: "west", title: "West", description: "Spring Summer '26" },
  ]).slice(0, 3).map((collection) => ({
    title: collection.title,
    subtitle: collection.description || "Spring Summer '26",
    href: `/collections/${collection.slug}`,
    image: collection.image || heroImageBySlug[collection.slug] || "/images/hero-rtw.svg",
  }));

  return (
    <>
      <section className="border-b border-stone-200 bg-[#faf9f7]">
        <div className="mx-auto grid max-w-[1400px] gap-3 px-3 py-4 md:grid-cols-3 md:gap-4 md:px-6 md:py-6">
          {heroes.map((h) => (
            <Link
              key={h.title}
              href={h.href}
              className="group relative block aspect-[4/5] overflow-hidden bg-stone-200 md:aspect-[3/4]"
            >
              <Image
                src={h.image}
                alt=""
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.02]"
                sizes="(max-width:768px) 100vw, 33vw"
                priority
                unoptimized
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/50 to-transparent pb-8 text-center text-white md:pb-12">
                <span className="text-[11px] font-semibold uppercase tracking-[0.35em]">
                  {h.title}
                </span>
                <span className="mt-2 text-[10px] uppercase tracking-[0.25em] text-white/90">
                  {h.subtitle}
                </span>
                <span className="mt-4 inline-block border border-white/80 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-white hover:text-stone-900">
                  Shop now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1400px] px-4 text-center md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
            240+ items
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-stone-900 md:text-5xl">
            New In
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-stone-600">
            Refresh your wardrobe with this week&apos;s arrivals. Discover the latest
            trends, collection highlights, and key pieces for the season —{" "}
            <span className="font-medium text-stone-800">{SITE.tagline}</span>.
          </p>
          <Link
            href="/collections/all"
            className="mt-8 inline-block border border-stone-900 bg-stone-900 px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-stone-800"
          >
            Shop now
          </Link>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1400px] flex-wrap justify-center gap-2 px-4 md:px-6">
          {pills.map((pill) => (
            <Link
              key={`${pill.slug}-${pill.name}`}
              href={`/collections/${pill.slug}`}
              className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-700 hover:border-stone-400 hover:bg-stone-100"
            >
              {pill.name}
            </Link>
          ))}
        </div>
        <div className="mx-auto mt-12 grid max-w-[1400px] grid-cols-2 gap-x-4 gap-y-10 px-4 md:grid-cols-4 md:px-6">
          {newIn.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="border-y border-stone-200 bg-[#f7f5f2] py-14 md:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 md:grid-cols-2 md:gap-16 md:px-6 lg:grid-cols-4">
          {navSections.slice(0, 4).map((section) => (
            <CategoryBlock
              key={section.href}
              title={section.title}
              body="Curated dynamic storefront collection."
              links={section.children.length ? section.children : [{ label: "Shop now", href: section.href }]}
            />
          ))}
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {trendTiles.map((t) => (
              <Link
                key={t.title}
                href={t.href}
                className="flex min-h-[200px] flex-col justify-end border border-stone-200 bg-gradient-to-br from-stone-100 to-stone-200 p-6 hover:opacity-95"
              >
                <h3 className="font-[family-name:var(--font-display)] text-2xl text-stone-900">
                  {t.title}
                </h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600">
                  {t.subtitle}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeTrending />

      <section className="border-t border-stone-200 bg-[#faf9f7] py-14 md:py-20">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl text-stone-900 md:text-4xl">
            World of inspiration
          </h2>
          <p className="mt-2 text-center text-sm text-stone-600">
            Click through the looks you love.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {inspiration.map((row) => (
              <blockquote
                key={row.name}
                className="border border-stone-200 bg-white p-8 shadow-sm"
              >
                <p className="text-sm leading-relaxed text-stone-700">
                  “{row.quote}”
                </p>
                <footer className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  — {row.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export const dynamic = "force-dynamic";

function CategoryBlock({
  title,
  body,
  links,
}: {
  title: string;
  body: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-stone-900">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-stone-600">{body}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="border border-stone-300 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-800 hover:border-stone-900"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
