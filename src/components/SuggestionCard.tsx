"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { SaveResult } from "@/app/quiz/actions";
import type { Suggestion } from "@/lib/gift-finder";
import { formatMoney } from "@/lib/format";
import { giftEmoji } from "@/lib/gift-emoji";
import { amazonSearch } from "@/lib/trusted-stores";
import { GiftArt } from "./GiftArt";

type Props = {
  suggestion: Suggestion;
  emoji: string;
  onSave: (suggestion: Suggestion) => Promise<SaveResult>;
};

export function SuggestionCard({ suggestion, emoji, onSave }: Props) {
  const [saved, setSaved] = useState<SaveResult | null>(null);
  const [isSaving, startSaving] = useTransition();

  function save() {
    startSaving(async () => setSaved(await onSave(suggestion)));
  }

  return (
    <article className="sticker flex h-full flex-col overflow-hidden transition hover:-rotate-1">
      <GiftArt emoji={giftEmoji(suggestion.title, emoji)} category={suggestion.category} />
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-xl font-bold leading-tight">{suggestion.title}</h2>
        <p className="mt-1 text-sm font-semibold">
          {suggestion.price > 0 ? `~${formatMoney(suggestion.price)}` : "Prices vary"} · <span className="text-ink/70">✓ {suggestion.store}</span>
        </p>
        <p className="mt-2 flex-1 text-sm text-ink/80">{suggestion.whyItFits}</p>

        {saved?.error && <p role="alert" className="mt-2 text-sm font-semibold text-pink">{saved.error}</p>}

        {suggestion.store !== "Amazon" && (
          <a
            href={amazonSearch(suggestion.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-sm font-semibold underline decoration-pink decoration-2 underline-offset-4"
          >
            Not there? Find it on Amazon →
          </a>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <a href={suggestion.link} target="_blank" rel="noopener noreferrer" className="btn-pink px-4 py-2 text-sm">
            Shop 🛍️
          </a>
          {saved?.ideaId ? (
            <Link href={`/ideas/${saved.ideaId}`} className="btn-plain bg-lime px-4 py-2 text-sm">Saved ✅</Link>
          ) : (
            <button type="button" onClick={save} disabled={isSaving} className="btn-plain px-4 py-2 text-sm">
              {isSaving ? "Saving…" : "+ Save"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
