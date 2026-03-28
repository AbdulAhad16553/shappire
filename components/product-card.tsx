import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";

function formatPrice(n: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(n);
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-stone-100"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          unoptimized
        />
        {product.newIn && (
          <span className="absolute left-2 top-2 bg-white/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-stone-900">
            New In
          </span>
        )}
      </Link>
      <div className="mt-3 space-y-1">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-medium leading-snug text-stone-900 hover:underline"
        >
          {product.name}
        </Link>
        <p className="text-xs text-stone-500">{product.subtitle}</p>
        <p className="text-sm text-stone-800">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </article>
  );
}
