import Link from "next/link";
import { listPeople } from "@/db/queries/people";
import { requireUser } from "@/lib/auth";
import { birthdaysInMonth, monthCells, monthKey, parseMonth, todayString } from "@/lib/dates";

export const metadata = { title: "Calendar · Presently 🎀" };

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = { searchParams: Promise<{ month?: string }> };

export default async function CalendarPage({ searchParams }: Props) {
  const user = await requireUser();
  const { year, month } = parseMonth((await searchParams).month);
  const people = await listPeople(user.id);

  const birthdays = birthdaysInMonth(people, year, month);
  const today = todayString();
  const title = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const isToday = (day: number) => `${monthKey(year, month)}-${String(day).padStart(2, "0")}` === today;
  const sortedDays = [...birthdays.keys()].sort((a, b) => a - b);

  return (
    <div className="pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        <nav aria-label="Change month" className="flex gap-2">
          <Link href={`/calendar?month=${monthKey(year, month - 1)}`} className="btn-plain px-4 py-2" aria-label="Previous month">←</Link>
          <Link href="/calendar" className="btn-plain px-4 py-2">Today</Link>
          <Link href={`/calendar?month=${monthKey(year, month + 1)}`} className="btn-plain px-4 py-2" aria-label="Next month">→</Link>
        </nav>
      </div>

      <div className="sticker mt-6 p-2 sm:p-4">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold sm:text-sm">
          {WEEKDAYS.map((day) => <div key={day} className="py-1">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {monthCells(year, month).map((day, index) => (
            <div
              key={index}
              className={`min-h-14 rounded-lg p-1 text-sm sm:min-h-24 sm:p-2 ${
                day === null ? "" : birthdays.has(day) ? "bg-tangerine/30" : "bg-ink/5"
              }`}
            >
              {day !== null && (
                <>
                  <span className={`inline-flex size-6 items-center justify-center rounded-full font-bold ${isToday(day) ? "bg-pink text-white" : ""}`}>
                    {day}
                  </span>
                  {birthdays.get(day)?.map((person) => (
                    <Link key={person.id} href={`/people/${person.id}`} className="mt-1 hidden truncate rounded bg-white px-1 text-xs font-semibold hover:text-pink sm:block">
                      🎂 {person.name}
                    </Link>
                  ))}
                  {birthdays.has(day) && <span className="block text-center sm:hidden" aria-hidden>🎂</span>}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold">Birthdays this month</h2>
        {sortedDays.length === 0 ? (
          <p className="mt-2 text-ink/70">
            A quiet month. <Link href="/people/new" className="font-semibold underline decoration-pink decoration-2 underline-offset-4">Add someone</Link> or look ahead.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {sortedDays.flatMap((day) =>
              birthdays.get(day)!.map((person) => (
                <li key={person.id}>
                  <Link href={`/people/${person.id}`} className="sticker flex items-center justify-between px-4 py-3 font-semibold transition hover:-rotate-1">
                    <span>🎂 {person.name}</span>
                    <span className="text-sm text-ink/70">{title.split(" ")[0]} {day}</span>
                  </Link>
                </li>
              )),
            )}
          </ul>
        )}
      </section>
    </div>
  );
}
