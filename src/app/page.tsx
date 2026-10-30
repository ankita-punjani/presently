import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const perks = [
  { emoji: "💡", title: "Save ideas the second you think of them", body: "She mentioned a matcha set in July? Saved. Forever.", tint: "bg-lilac/40", tilt: "-rotate-2" },
  { emoji: "🎂", title: "Never miss a birthday", body: "Countdowns for everyone you love, so you're never panic-buying.", tint: "bg-tangerine/30", tilt: "rotate-1" },
  { emoji: "🔮", title: "Stuck? Take the gift quiz", body: "5 quick questions → real gifts with photos from stores you trust.", tint: "bg-lime/50", tilt: "-rotate-1" },
];

export default async function Home() {
  if (await getSession()) redirect("/dashboard");

  return (
    <div className="pt-10 sm:pt-16">
      <section className="text-center">
        <p className="inline-block -rotate-2 rounded-full border-2 border-ink bg-lime px-4 py-1 text-sm font-bold">
          free for everyone 🎉
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
          The right <span className="text-pink">present</span>, right on time.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
          Save gift ideas for your people all year, and never miss a birthday.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/signup" className="btn-pink px-7 py-3 text-lg">Start my list 🎁</Link>
          <Link href="/login" className="btn-plain px-7 py-3 text-lg">I have an account</Link>
        </div>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-3">
        {perks.map((p) => (
          <div key={p.title} className={`sticker ${p.tint} ${p.tilt} p-6 transition hover:rotate-0`}>
            <p className="text-4xl" aria-hidden>{p.emoji}</p>
            <h2 className="mt-3 font-display text-xl font-bold leading-tight">{p.title}</h2>
            <p className="mt-2 text-ink/70">{p.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
