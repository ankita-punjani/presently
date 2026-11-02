"use client";

import { useState } from "react";

type Props = { src: string | null; alt: string; emoji: string };

// Stores can block or remove images, so a broken photo falls back to the emoji.
export function GiftImage({ src, alt, emoji }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex h-44 items-center justify-center border-b-2 border-ink bg-lilac/30">
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element -- product photos come from many store hosts
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full bg-white object-contain p-2"
        />
      ) : (
        <span className="text-7xl" aria-hidden>{emoji}</span>
      )}
    </div>
  );
}
