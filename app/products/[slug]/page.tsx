import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { getStoreProductBySlug, getStoreProducts } from "@/lib/products-gql";

export async function generateStaticParams() {
  const all = await getStoreProducts();
  return all.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getStoreProductBySlug(slug);
  if (!product) notFound();
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6 md:py-14">
      <nav className="text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-800">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/collections/${product.category}`}
          className="hover:text-stone-800 capitalize"
        >
          {product.category.replace(/-/g, " ")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800 line-clamp-1">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 md:grid-cols-2 lg:gap-16">
        <ProductGallery images={gallery} alt={product.name} />
        <div>
          {product.newIn && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500">
              New In
            </span>
          )}
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-stone-900 md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-stone-600">{product.subtitle}</p>
          <ProductPurchasePanel product={product} />

          <div className="mt-10 border-t border-stone-200 pt-8 text-sm leading-relaxed text-stone-600">
            <p>
              {product.description ??
                "Dummy product detail — fabrics, care, and fit notes would live here. Designed for a luxury fashion layout: generous imagery, clear price, and a decisive add-to-bag path."}
            </p>
            {product.details?.length ? (
              <ul className="mt-4 space-y-2">
                {product.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
