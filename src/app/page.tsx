import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const FLOATERS = [
  { emoji: "🎁", place: "left-[4%] top-8", tilt: "-12deg", delay: "0s" },
  { emoji: "🎀", place: "right-[6%] top-2", tilt: "10deg", delay: "0.8s" },
  { emoji: "🎂", place: "left-[10%] top-72", tilt: "8deg", delay: "1.6s" },
  { emoji: "🔮", place: "right-[9%] top-64", tilt: "-8deg", delay: "2.4s" },
];

const TICKER = ["Never miss a birthday", "Save every gift hint", "Spend what you planned", "Find the perfect gift", "Share your wishlist", "Free for everyone"];

const STEPS = [
  { emoji: "👯", title: "Add your people", body: "Birthdays, budgets, and what they’re into right now." },
  { emoji: "💡", title: "Save ideas all year", body: "They mention a perfume in July? Saved before you forget it." },
  { emoji: "🎉", title: "Show up with the perfect gift", body: "Get a countdown, stick to a budget, and enjoy the confetti." },
];

const FEATURES = [
  { emoji: "🔮", title: "Gift-finder quiz", body: "5 quick questions, 8 ideas that actually fit, with links to stores you trust.", tint: "bg-lilac/40" },
  { emoji: "🎂", title: "Birthday countdowns", body: "Reminders 14 days out and a calendar of everyone you love.", tint: "bg-tangerine/30" },
  { emoji: "💸", title: "Budget tracker", body: "See spending per season and per person before December sneaks up.", tint: "bg-lime/40" },
  { emoji: "📊", title: "Your gifting, wrapped", body: "Big colorful stats on where your money goes.", tint: "bg-pink/20" },
  { emoji: "✨", title: "Your own wishlist", body: "Send one link so people finally know what you want.", tint: "bg-lilac/40" },
  { emoji: "🎲", title: "Gift roulette", body: "Can’t decide? Let fate pick from your saved ideas.", tint: "bg-tangerine/30" },
];

const SAMPLE = [
  { emoji: "💆", title: "Theragun Mini massage gun", who: "For Adi · $199", tilt: "-rotate-3", tint: "bg-lime/50" },
  { emoji: "🌸", title: "Tom Ford Oud Wood", who: "For Adi · $98", tilt: "rotate-2", tint: "bg-pink/25" },
  { emoji: "🌶️", title: "Masala dabba spice box", who: "For Bhavya · $32", tilt: "-rotate-1", tint: "bg-tangerine/30" },
];

export default async function Home() {
  if (await getSession()) redirect("/dashboard");

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hidden h-96 lg:block">
        {FLOATERS.map((floater) => (
          <span
            key={floater.emoji}
            className={`animate-float absolute text-6xl ${floater.place}`}
            style={{ "--tilt": floater.tilt, animationDelay: floater.delay } as React.CSSProperties}
          >
            {floater.emoji}
          </span>
        ))}
      </div>

      <section className="animate-pop-in relative pt-10 text-center sm:pt-16">
        <p className="inline-block -rotate-2 rounded-full border-2 border-ink bg-lime px-4 py-1 text-sm font-bold text-[#1a1a1a]">
          free for everyone 🎉
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl">
          The right <span className="text-pink">present</span>, right on time.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
          Save gift ideas for your people all year, and never panic-buy at the airport again.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/signup" className="btn-pink px-7 py-3 text-lg">Start my list 🎁</Link>
          <Link href="/login" className="btn-plain px-7 py-3 text-lg">I have an account</Link>
        </div>
      </section>

      <section aria-label="Example gift ideas" className="relative mx-auto mt-14 grid max-w-3xl gap-5 sm:grid-cols-3">
        {SAMPLE.map((card) => (
          <div key={card.title} className={`sticker ${card.tint} ${card.tilt} p-5 transition hover:rotate-0`}>
            <p className="text-5xl" aria-hidden>{card.emoji}</p>
            <p className="mt-3 font-display text-lg font-bold leading-tight">{card.title}</p>
            <p className="mt-1 text-sm text-ink/70">{card.who}</p>
          </div>
        ))}
      </section>

      <div aria-hidden className="mt-14 -rotate-1 overflow-hidden border-y-2 border-ink bg-pink py-3 text-white">
        <div className="animate-marquee flex w-max gap-10 font-display text-lg font-bold">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((item, index) => (
            <span key={index} className="whitespace-nowrap">{item} ✦</span>
          ))}
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-center font-display text-4xl font-extrabold tracking-tight">How it works</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="sticker relative p-6">
              <span className="absolute -left-2 -top-3 flex size-9 items-center justify-center rounded-full border-2 border-ink bg-tangerine font-display font-bold">
                {index + 1}
              </span>
              <p className="text-4xl" aria-hidden>{step.emoji}</p>
              <h3 className="mt-3 font-display text-xl font-bold leading-tight">{step.title}</h3>
              <p className="mt-2 text-ink/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="text-center font-display text-4xl font-extrabold tracking-tight">Packed with good stuff</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className={`sticker ${feature.tint} p-6 transition hover:-rotate-1`}>
              <p className="text-4xl" aria-hidden>{feature.emoji}</p>
              <h3 className="mt-3 font-display text-xl font-bold leading-tight">{feature.title}</h3>
              <p className="mt-2 text-ink/70">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sticker mt-16 bg-lime/40 p-10 text-center">
        <h2 className="font-display text-4xl font-extrabold tracking-tight">Someone’s birthday is coming up.</h2>
        <p className="mt-2 text-ink/70">Be the friend who remembered.</p>
        <Link href="/signup" className="btn-pink mt-6 px-7 py-3 text-lg">Start my list 🎁</Link>
      </section>
    </div>
  );
}
