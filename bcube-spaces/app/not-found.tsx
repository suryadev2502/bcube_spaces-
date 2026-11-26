import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink px-6 text-center text-white">
      <div>
        <p className="eyebrow !text-gold-400">404</p>
        <h1 className="mt-4 text-5xl sm:text-6xl">This space isn’t available.</h1>
        <p className="mt-4 text-white/60">The page or listing you’re looking for may have been moved or unpublished.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-gold">Back to home</Link>
          <Link href="/properties" className="btn-ghost-light">Browse properties</Link>
        </div>
      </div>
    </div>
  );
}
