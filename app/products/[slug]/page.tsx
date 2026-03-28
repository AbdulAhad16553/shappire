import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/lib/data";
import { AddToCart } from "@/components/add-to-cart";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

function formatPrice(n: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(n);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

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
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width:768px) 100vw, 50vw"
            unoptimized
          />
        </div>
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
          <p className="mt-6 text-xl text-stone-900">
            {formatPrice(product.price, product.currency)}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.15em] text-stone-500">
            SKU {product.id}
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-700">
                Size
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="min-w-[44px] border border-stone-300 px-3 py-2 text-sm hover:border-stone-900"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <AddToCart product={product} />
          </div>

          <div className="mt-10 border-t border-stone-200 pt-8 text-sm leading-relaxed text-stone-600">
            <p>
              Dummy product detail — fabrics, care, and fit notes would live here.
              Designed for a luxury fashion layout: generous imagery, clear price,
              and a decisive add-to-bag path.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
