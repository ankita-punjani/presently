"use client";

import confetti from "canvas-confetti";
import { useOptimistic, useTransition } from "react";
import { setStatusAction } from "@/app/ideas/actions";

const OPTIONS = [
  { status: "idea", label: "💡 Idea", on: "bg-lilac" },
  { status: "bought", label: "🛍️ Bought", on: "bg-tangerine" },
  { status: "given", label: "🎉 Given", on: "bg-lime" },
];

const COLORS = ["#ff4f9a", "#ff8a3d", "#c6f432", "#b9a6ff"];

export function StatusButtons({ ideaId, status }: { ideaId: number; status: string }) {
  const [, startTransition] = useTransition();
  const [shown, setShown] = useOptimistic(status);

  function choose(next: string) {
    if (next === shown) return;
    if (next === "given" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: COLORS });
    }
    startTransition(async () => {
      setShown(next);
      await setStatusAction(ideaId, next);
    });
  }

  return (
    <div role="group" aria-label="Gift status" className="inline-flex flex-wrap gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.status}
          type="button"
          aria-pressed={shown === option.status}
          onClick={() => choose(option.status)}
          className={`rounded-full border-2 border-ink px-3 py-1 text-sm font-bold transition hover:-translate-y-0.5 ${
            shown === option.status ? option.on : "bg-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
