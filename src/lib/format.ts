// Birthdays are stored as plain "YYYY-MM-DD" text, so format in UTC to stop the
// day shifting with the viewer's timezone.
export function formatBirthday(birthday: string) {
  return new Date(`${birthday}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatMoney(amount: string | number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount));
}

export function splitInterests(interests: string | null) {
  return (interests ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
