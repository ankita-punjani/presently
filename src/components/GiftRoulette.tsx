"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type Idea = { id: number; title: string };

const SPIN_MS = 1400;
const STEP_MS = 90;

const randomIdea = (ideas: Idea[]) => ideas[Math.floor(Math.random() * ideas.length)];

export function GiftRoulette({ ideas }: { ideas: Idea[] }) {
  const [shown, setShown] = useState<Idea | null>(null);
  const [spinning, setSpinning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  function spin() {
    const winner = randomIdea(ideas);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(winner);

    setSpinning(true);
    const stopAt = Date.now() + SPIN_MS;
    timer.current = setInterval(() => {
      if (Date.now() < stopAt) return setShown(randomIdea(ideas));
      clearInterval(timer.current);
      setShown(winner);
      setSpinning(false);
    }, STEP_MS);
  }

  return (
    <div className="sticker mt-6 flex flex-wrap items-center justify-between gap-3 bg-lilac/30 px-5 py-4">
      <div aria-live="polite">
        <p className="text-sm font-semibold">Can’t decide?</p>
        {shown ? (
          spinning ? (
            <p className="font-display text-xl font-bold">{shown.title}</p>
          ) : (
            <Link href={`/ideas/${shown.id}`} className="font-display text-xl font-bold underline decoration-pink decoration-2 underline-offset-4">
              🎯 {shown.title}
            </Link>
          )
        ) : (
          <p className="font-display text-xl font-bold">Let fate pick the gift.</p>
        )}
      </div>
      <button type="button" onClick={spin} disabled={spinning} className="btn-pink">
        {spinning ? "Spinning…" : shown ? "Spin again 🎲" : "Surprise me 🎲"}
      </button>
    </div>
  );
}
