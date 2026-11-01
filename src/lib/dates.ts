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
