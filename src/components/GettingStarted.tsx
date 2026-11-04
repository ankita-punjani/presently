import Link from "next/link";

type Progress = { person: boolean; idea: boolean; star: boolean; birthday: boolean; wish: boolean };

const STEPS: { key: keyof Progress; label: string; href: string }[] = [
  { key: "person", label: "Add someone you shop for", href: "/people/new" },
  { key: "idea", label: "Save a gift idea, or find one with the quiz 🔮", href: "/quiz" },
  { key: "star", label: "Star your favorite idea ⭐", href: "/ideas" },
  { key: "birthday", label: "Add someone’s birthday 🎂", href: "/people" },
  { key: "wish", label: "Add something you want to your wishlist ✨", href: "/wishlist" },
];

export function GettingStarted({ progress }: { progress: Progress }) {
  const done = STEPS.filter((step) => progress[step.key]).length;
  if (done === STEPS.length) return null;

  return (
    <section aria-labelledby="getting-started" className="sticker mt-6 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="getting-started" className="font-display text-2xl font-bold">Getting started 🚀</h2>
        <p className="text-sm font-semibold text-ink/70">{done} of {STEPS.length} done</p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-ink bg-surface">
        <div className="h-full bg-lime" style={{ width: `${(done / STEPS.length) * 100}%` }} />
      </div>
      <ol className="mt-4 space-y-2">
        {STEPS.map((step) => (
          <li key={step.key}>
            {progress[step.key] ? (
              <span className="flex items-center gap-3 text-ink/50 line-through">
                <span aria-hidden>✅</span>
                {step.label}
                <span className="sr-only">(done)</span>
              </span>
            ) : (
              <Link href={step.href} className="flex items-center gap-3 font-semibold hover:text-pink">
                <span aria-hidden>⭕</span>
                {step.label} →
              </Link>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
