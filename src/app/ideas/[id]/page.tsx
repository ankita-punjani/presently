import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/DeleteButton";
import { GiftArt } from "@/components/GiftArt";
import { StarButton } from "@/components/StarButton";
import { StatusButtons } from "@/components/StatusButtons";
import { getIdea } from "@/db/queries/gift-ideas";
import { requireUser } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import { giftEmoji } from "@/lib/gift-emoji";
import { amazonSearch } from "@/lib/trusted-stores";
import { parseId } from "@/lib/params";
import { deleteIdeaAction } from "../actions";

export const metadata = { title: "Gift idea · Presently 🎀" };

export default async function IdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const id = parseId((await params).id);
  const row = id && (await getIdea(user.id, id));
  if (!row) notFound();

  const { idea, personName, categoryName, categoryEmoji } = row;

  return (
    <div className="pt-6">
      <Link href={`/people/${idea.personId}`} className="text-sm font-semibold hover:text-pink">← {personName}</Link>

      <div className="sticker mt-4 p-6 sm:p-8">
        <div className="-mx-6 -mt-6 mb-6 overflow-hidden rounded-t-[14px] sm:-mx-8 sm:-mt-8">
          <GiftArt emoji={giftEmoji(idea.title, categoryEmoji)} category={categoryName} />
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{idea.title}</h1>
            <p className="mt-1 text-ink/70">For {personName} · {idea.customCategory ? `${idea.customCategory} (Other)` : categoryName}</p>
            <div className="mt-4"><StatusButtons ideaId={idea.id} status={idea.status} /></div>
          </div>
          <div className="flex items-center gap-3">
            <StarButton ideaId={idea.id} title={idea.title} starred={row.starred} />
            <Link href={`/ideas/${idea.id}/edit`} className="btn-plain">Edit</Link>
            <DeleteButton name={idea.title} keepLabel="Keep it" action={deleteIdeaAction.bind(null, idea.id)} />
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-lime/40 p-4">
            <dt className="text-sm font-semibold">Price</dt>
            <dd className="font-display text-2xl font-bold">{idea.price ? formatMoney(idea.price) : "Not sure yet"}</dd>
          </div>
          <div className="rounded-xl bg-lilac/30 p-4">
            <dt className="text-sm font-semibold">Occasion</dt>
            <dd className="font-display text-2xl font-bold capitalize">{idea.occasion}</dd>
          </div>
          <div className="rounded-xl bg-tangerine/20 p-4">
            <dt className="text-sm font-semibold">Store</dt>
            <dd className="font-display text-2xl font-bold">{idea.store ?? "Anywhere"}</dd>
          </div>
        </dl>

        {idea.notes && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold">Notes</h2>
            <p className="mt-1 whitespace-pre-wrap text-ink/80">{idea.notes}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {idea.link && (
            <a href={idea.link} target="_blank" rel="noopener noreferrer" className="btn-pink">
              Go shop 🛍️
            </a>
          )}
          <a
            href={amazonSearch(idea.title)}
            target="_blank"
            rel="noopener noreferrer"
            className={idea.link ? "text-sm font-semibold underline decoration-pink decoration-2 underline-offset-4" : "btn-pink"}
          >
            {idea.link ? "Not there? Find it on Amazon →" : "Find it on Amazon 🛍️"}
          </a>
        </div>
      </div>
    </div>
  );
}
