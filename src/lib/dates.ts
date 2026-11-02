// Dates are compared as plain "YYYY-MM-DD" text. "Today" uses Pacific time, where
// the app's users are, so a birthday doesn't flip at 4pm when UTC changes day.
const APP_TIME_ZONE = "America/Los_Angeles";

export function todayString(now = new Date()) {
  return now.toLocaleDateString("en-CA", { timeZone: APP_TIME_ZONE });
}

const DAY_MS = 86_400_000;

// Days from today until the next time this birthday comes around (0 = today).
export function daysUntilBirthday(birthday: string, today = todayString()) {
  const [, month, day] = birthday.split("-").map(Number);
  const [year] = today.split("-").map(Number);
  const start = Date.parse(`${today}T00:00:00Z`);
  // Date.UTC rolls Feb 29 over to Mar 1 in non-leap years.
  const thisYear = Date.UTC(year, month - 1, day);
  const next = thisYear >= start ? thisYear : Date.UTC(year + 1, month - 1, day);
  return Math.round((next - start) / DAY_MS);
}

// The day a birthday lands on in a given year. Feb 29 becomes Mar 1, as in the countdown.
function birthdayIn(birthday: string, year: number) {
  const [, month, day] = birthday.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function parseMonth(value: string | undefined, today = todayString()) {
  const text = value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : today.slice(0, 7);
  const [year, month] = text.split("-").map(Number);
  return { year, month };
}

export function monthKey(year: number, month: number) {
  const date = new Date(Date.UTC(year, month - 1, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function birthdaysInMonth<T extends { birthday: string | null }>(people: T[], year: number, month: number) {
  const days = new Map<number, T[]>();
  for (const person of people) {
    if (!person.birthday) continue;
    const date = birthdayIn(person.birthday, year);
    if (date.getUTCMonth() !== month - 1) continue;
    days.set(date.getUTCDate(), [...(days.get(date.getUTCDate()) ?? []), person]);
  }
  return days;
}

// Blank cells before the 1st, then each day number. Weeks start on Sunday.
export function monthCells(year: number, month: number) {
  const leading = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const total = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return [...Array(leading).fill(null), ...Array.from({ length: total }, (_, index) => index + 1)] as (number | null)[];
}
