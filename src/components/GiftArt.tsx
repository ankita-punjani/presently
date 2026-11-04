const TINTS: Record<string, string> = {
  Clothing: "bg-pink/35",
  Shoes: "bg-lime/45",
  Accessories: "bg-lilac/45",
  "Skincare & beauty": "bg-lilac/55",
  "Gaming & tech": "bg-lime/60",
  "Home & cozy": "bg-tangerine/35",
  "Food & drink": "bg-tangerine/55",
  "Books & hobbies": "bg-lilac/35",
  Experiences: "bg-pink/20",
};

type Props = { emoji: string; category: string; size?: "lg" | "sm" };

// A sticker-style illustration for a gift: its emoji on a tinted, polka-dot card.
export function GiftArt({ emoji, category, size = "lg" }: Props) {
  const tint = TINTS[category] ?? "bg-lilac/40";

  if (size === "sm") {
    return (
      <span aria-hidden className={`inline-flex size-14 -rotate-6 items-center justify-center rounded-2xl border-2 border-ink text-3xl shadow-[3px_3px_0_0_var(--color-ink)] ${tint}`}>
        {emoji}
      </span>
    );
  }

  return (
    <div
      aria-hidden
      className={`group relative flex h-44 items-center justify-center overflow-hidden border-b-2 border-ink ${tint}`}
      style={{
        backgroundImage: "radial-gradient(color-mix(in srgb, var(--color-ink) 12%, transparent) 1.5px, transparent 1.5px)",
        backgroundSize: "18px 18px",
      }}
    >
      <span className="absolute left-4 top-3 rotate-12 text-xl">✨</span>
      <span className="absolute bottom-3 right-4 -rotate-12 text-lg">🎀</span>
      <span className="absolute right-6 top-5 size-3 rounded-full border-2 border-ink bg-lime" />
      <span className="absolute bottom-6 left-7 size-2.5 rounded-full border-2 border-ink bg-pink" />
      <span className="flex size-28 -rotate-6 items-center justify-center rounded-full border-2 border-ink bg-surface text-6xl shadow-[4px_4px_0_0_var(--color-ink)] transition group-hover:rotate-6 group-hover:scale-105">
        {emoji}
      </span>
    </div>
  );
}
