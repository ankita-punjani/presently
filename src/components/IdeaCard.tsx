import Link from "next/link";
import type { IdeaRow } from "@/db/queries/gift-ideas";
import { formatMoney } from "@/lib/format";
import { StatusPill } from "./StatusPill";

export function IdeaCard({ row, showPerson = false }: { row: IdeaRow; showPerson?: boolean }) {
  const { idea, personName, categoryName, categoryEmoji } = row;

  return (
    <Link href={`/ideas/${idea.id}`} className="sticker block h-full p-5 transition hover:-rotate-1">
      <p className="text-3xl" aria-hidden>{categoryEmoji}</p>
      <h3 className="mt-2 font-display text-xl font-bold leading-tight">{idea.title}</h3>
      <p className="mt-1 text-sm text-ink/70">
        {showPerson ? `For ${personName}` : categoryName}
        {idea.price && ` · ${formatMoney(idea.price)}`}
      </p>
      <div className="mt-3"><StatusPill status={idea.status} /></div>
    </Link>
  );
}
