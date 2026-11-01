import Link from "next/link";
import type { UpcomingBirthday } from "@/db/queries/people";

const SOON_DAYS = 14;

function ideasNote(count: number) {
  if (count === 0) return "No ideas saved yet. Time to think!";
  return `You have ${count} ${count === 1 ? "idea" : "ideas"} saved.`;
}

function headline({ name, days }: UpcomingBirthday) {
  if (days === 0) return `It’s ${name}’s birthday today! 🎉`;
  if (days === 1) return `${name}’s birthday is tomorrow 🎂`;
  return `${name}’s birthday is in ${days} days 🎂`;
}

export function BirthdayBanner({ birthdays }: { birthdays: UpcomingBirthday[] }) {
  const soon = birthdays.filter((birthday) => birthday.days <= SOON_DAYS);
  if (soon.length === 0) return null;

  return (
    <section aria-label="Birthdays coming up" className="mt-6 space-y-3">
      {soon.map((birthday) => (
        <Link
          key={birthday.id}
          href={`/people/${birthday.id}`}
          className="sticker flex flex-wrap items-center justify-between gap-2 bg-tangerine px-5 py-3 transition hover:-rotate-1"
        >
          <span className="font-display text-lg font-bold">{headline(birthday)}</span>
          <span className="text-sm font-semibold">{ideasNote(birthday.ideaCount)} →</span>
        </Link>
      ))}
    </section>
  );
}
