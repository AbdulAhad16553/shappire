import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-stone-900">
        404
      </h1>
      <p className="mt-4 text-stone-600">This page could not be found.</p>
      <Link
        href="/"
        className="mt-8 inline-block border border-stone-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-900 hover:bg-stone-900 hover:text-white"
      >
        Home
      </Link>
    </div>
  );
}
