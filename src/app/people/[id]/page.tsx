import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/DeleteButton";
import { IdeaCard } from "@/components/IdeaCard";
import { listIdeasForPerson } from "@/db/queries/gift-ideas";
import { getPerson } from "@/db/queries/people";
import { requireUser } from "@/lib/auth";
import { formatBirthday, formatMoney, splitInterests } from "@/lib/format";
import { parseId } from "@/lib/params";
import { deletePersonAction } from "../actions";

export const metadata = { title: "Person · Presently 🎀" };

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const id = parseId((await params).id);
  const person = id && (await getPerson(user.id, id));
  if (!person) notFound();

  const interests = splitInterests(person.interests);
  const ideas = await listIdeasForPerson(user.id, person.id);

  return (
    <div className="pt-6">
      <Link href="/people" className="text-sm font-semibold hover:text-pink">← Your people</Link>

      <div className="sticker mt-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{person.name}</h1>
            <p className="mt-1 capitalize text-ink/70">
              {person.relationship}
              {person.giftFor !== "no preference" && ` · ${person.giftFor}`}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/people/${person.id}/edit`} className="btn-plain">Edit</Link>
            <DeleteButton
              name={person.name}
              keepLabel="Keep them"
              warning="Their gift ideas will go too."
              action={deletePersonAction.bind(null, person.id)}
            />
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-tangerine/20 p-4">
            <dt className="text-sm font-semibold">Birthday</dt>
            <dd className="font-display text-2xl font-bold">
              {person.birthday ? `🎂 ${formatBirthday(person.birthday)}` : "Not added yet"}
            </dd>
          </div>
          <div className="rounded-xl bg-lime/40 p-4">
            <dt className="text-sm font-semibold">Budget</dt>
            <dd className="font-display text-2xl font-bold">
              {person.budget ? formatMoney(person.budget) : "No budget set"}
            </dd>
          </div>
        </dl>

        {interests.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold">Interests</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {interests.map((tag) => (
                <span key={tag} className="rounded-full bg-lilac/40 px-3 py-0.5 text-sm font-medium">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {person.notes && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold">Notes</h2>
            <p className="mt-1 whitespace-pre-wrap text-ink/80">{person.notes}</p>
          </div>
        )}
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Gift ideas</h2>
          <Link href={`/ideas/new?person=${person.id}`} className="btn-pink">Add an idea 💡</Link>
        </div>
        {ideas.length === 0 ? (
          <p className="mt-4 text-ink/70">Nothing saved for {person.name} yet. What have they been hinting at?</p>
        ) : (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map((row) => (
              <li key={row.idea.id}><IdeaCard row={row} /></li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
