import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg pt-16 text-center">
      <p className="animate-float text-8xl [--tilt:-6deg]" aria-hidden>📦</p>
      <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight">Nothing in this box.</h1>
      <p className="mt-2 text-ink/70">This page doesn’t exist, or it isn’t yours to open.</p>
      <Link href="/" className="btn-pink mt-6">Take me home</Link>
    </div>
  );
}
