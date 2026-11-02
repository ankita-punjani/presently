import Link from "next/link";
import type { IdeaRow } from "@/db/queries/gift-ideas";
import { formatMoney } from "@/lib/format";
import { giftEmoji } from "@/lib/gift-emoji";
import { GiftImage } from "./GiftImage";
import { StarButton } from "./StarButton";
import { StatusPill } from "./StatusPill";

export function IdeaCard({ row, showPerson = false }: { row: IdeaRow; showPerson?: boolean }) {
  const { idea, personName, categoryName, categoryEmoji, starred } = row;

  return (
    <div className="sticker relative h-full transition hover:-rotate-1">
      <Link href={`/ideas/${idea.id}`} className="block h-full p-5">
        {idea.imageUrl ? (
          <div className="-mx-5 -mt-5 mb-3 overflow-hidden rounded-t-[14px]">
            <GiftImage src={idea.imageUrl} alt={idea.title} emoji={giftEmoji(idea.title, categoryEmoji)} />
          </div>
        ) : (
          <p className="text-3xl" aria-hidden>{giftEmoji(idea.title, categoryEmoji)}</p>
        )}
        <h3 className="mt-2 pr-8 font-display text-xl font-bold leading-tight">{idea.title}</h3>
        <p className="mt-1 text-sm text-ink/70">
          {showPerson ? `For ${personName}` : categoryName}
          {idea.price && ` · ${formatMoney(idea.price)}`}
        </p>
        <div className="mt-3"><StatusPill status={idea.status} /></div>
      </Link>
      <div className="absolute right-3 top-3">
        <StarButton ideaId={idea.id} title={idea.title} starred={starred} />
      </div>
    </div>
  );
}
