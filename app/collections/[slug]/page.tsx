import Link from "next/link";
import { notFound } from "next/navigation";
import {
  collectionMeta,
} from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { getStoreCategories, getStoreProductCats, getStoreProductsByCategory } from "@/lib/products-gql";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const categories = await getStoreCategories();
  const productCats = await getStoreProductCats();
  const categorySlugs = productCats
    .filter((cat) => cat.type === "category")
    .map((cat) => cat.slug);
  return [
    { slug: "all" },
    ...categories.map((c) => ({ slug: c.slug })),
    ...categorySlugs.map((slug) => ({ slug })),
  ];
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await getStoreCategories();
  const productCats = await getStoreProductCats();
  const valid = new Set([
    "all",
    ...categories.map((c) => c.slug),
    ...productCats.filter((cat) => cat.type === "category").map((cat) => cat.slug),
  ]);
  if (!valid.has(slug)) notFound();

  const list = await getStoreProductsByCategory(slug === "all" ? "all" : slug);
  const dynamicMeta = categories.find((c) => c.slug === slug);
  const dynamicCategoryMeta = productCats.find((c) => c.type === "category" && c.slug === slug);
  const meta =
    slug === "all"
      ? {
          title: "All products",
          description: "Browse the full catalog — new arrivals and classics.",
        }
      : dynamicMeta
        ? { title: dynamicMeta.title, description: dynamicMeta.description }
        : dynamicCategoryMeta
          ? { title: dynamicCategoryMeta.name, description: `${dynamicCategoryMeta.name} products` }
        : collectionMeta[slug];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6 md:py-14">
      <nav className="text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-800">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">{meta.title}</span>
      </nav>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-stone-900 md:text-5xl">
        {meta.title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-600">
        {meta.description}
      </p>
      <p className="mt-2 text-xs text-stone-500">{list.length} products</p>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
