import Link from "next/link";
import { BirthdayChip } from "@/components/BirthdayChip";
import { listPeople } from "@/db/queries/people";
import { requireUser } from "@/lib/auth";
import { daysUntilBirthday } from "@/lib/dates";
import { formatBirthday, splitInterests } from "@/lib/format";

export const metadata = { title: "People · Presently 🎀" };

export default async function PeoplePage() {
  const user = await requireUser();
  // Soonest birthday first; anyone without a birthday goes last.
  const days = (birthday: string | null) => (birthday ? daysUntilBirthday(birthday) : Number.POSITIVE_INFINITY);
  const people = (await listPeople(user.id)).toSorted((a, b) => days(a.birthday) - days(b.birthday));

  return (
    <div className="pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Your people</h1>
        <Link href="/people/new" className="btn-pink">Add someone ➕</Link>
      </div>

      {people.length === 0 ? (
        <div className="sticker mt-8 -rotate-1 bg-lime/40 p-8 text-center">
          <p className="text-5xl" aria-hidden>👀</p>
          <p className="mt-3 font-display text-2xl font-bold">No one to shop for? Suspicious.</p>
          <p className="mt-1 text-ink/70">Add your first person and start saving ideas.</p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => (
            <li key={person.id}>
              <Link href={`/people/${person.id}`} className="sticker block h-full p-5 transition hover:-rotate-1">
                <h2 className="font-display text-2xl font-bold leading-tight">{person.name}</h2>
                <p className="mt-1 text-sm capitalize text-ink/70">
                  {person.relationship}
                  {person.birthday && ` · 🎂 ${formatBirthday(person.birthday)}`}
                </p>
                <div className="mt-3"><BirthdayChip birthday={person.birthday} /></div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {splitInterests(person.interests).slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-lilac/40 px-3 py-0.5 text-sm font-medium">{tag}</span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
