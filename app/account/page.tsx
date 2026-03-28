import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center md:py-24">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
        Account
      </h1>
      <p className="mt-4 text-sm text-stone-600">
        Sign-in and order history would connect to your backend (e.g. Nhost Auth).
        This is a layout placeholder.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.15em] text-stone-900 underline"
      >
        Continue shopping
      </Link>
    </div>
  );
}
