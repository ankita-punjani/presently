"use client";

import { useOptimistic, useTransition } from "react";
import { setStarAction } from "@/app/ideas/actions";

type Props = { ideaId: number; title: string; starred: boolean };

export function StarButton({ ideaId, title, starred }: Props) {
  const [, startTransition] = useTransition();
  const [shown, setShown] = useOptimistic(starred);

  function toggle() {
    startTransition(async () => {
      setShown(!shown);
      await setStarAction(ideaId, !shown);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={shown}
      aria-label={shown ? `Unstar ${title}` : `Star ${title}`}
      className={`flex size-10 items-center justify-center rounded-full border-2 border-ink text-lg transition hover:scale-110 active:scale-95 ${
        shown ? "bg-pink" : "bg-white grayscale"
      }`}
    >
      <span aria-hidden>⭐</span>
    </button>
  );
}
