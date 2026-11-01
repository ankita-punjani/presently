import { daysUntilBirthday } from "@/lib/dates";

export function birthdayLabel(days: number) {
  if (days === 0) return "Today! 🎉";
  if (days === 1) return "Tomorrow 🎂";
  return `${days} days 🎂`;
}

export function BirthdayChip({ birthday }: { birthday: string | null }) {
  if (!birthday) return null;
  const days = daysUntilBirthday(birthday);
  return (
    <span className={`inline-block whitespace-nowrap rounded-full border-2 border-ink px-3 py-0.5 text-sm font-bold ${
      days <= 14 ? "bg-tangerine" : "bg-white"
    }`}>
      {birthdayLabel(days)}
    </span>
  );
}
