import Link from "next/link";
import { BirthdayBanner } from "@/components/BirthdayBanner";
import { GettingStarted } from "@/components/GettingStarted";
import { birthdayLabel } from "@/components/BirthdayChip";
import { SpendChart } from "@/components/SpendChart";
import { StatCard } from "@/components/StatCard";
import { getDashboard, getSetupProgress } from "@/db/queries/dashboard";
import { listPeople, listUpcomingBirthdays } from "@/db/queries/people";
import { requireUser } from "@/lib/auth";
import { formatBirthday, formatMoney } from "@/lib/format";

export const metadata = { title: "Dashboard · Presently 🎀" };

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = user.name.split(" ")[0];

  const [people, birthdays, { seasonLabel, stats }, progress] = await Promise.all([
    listPeople(user.id),
    listUpcomingBirthdays(user.id),
    getDashboard(user.id),
    getSetupProgress(user.id),
  ]);

  return (
    <div className="pt-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Hey {firstName} <span aria-hidden>✨</span>
      </h1>
      <p className="mt-2 text-ink/70">Here’s your gifting so far in {seasonLabel}.</p>

      <GettingStarted progress={progress} />

      {people.length === 0 ? (
        <div className="sticker mt-8 -rotate-1 bg-lime/40 p-8 text-center">
          <p className="text-5xl" aria-hidden>👀</p>
          <p className="mt-3 font-display text-2xl font-bold">No one to shop for? Suspicious.</p>
          <p className="mb-5 mt-1 text-ink/70">Add your first person and start saving ideas.</p>
          <Link href="/people/new" className="btn-pink">Add someone ➕</Link>
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/quiz" className="btn-pink">Find a gift 🔮</Link>
            <Link href="/ideas/new" className="btn-plain">Save an idea 💡</Link>
            <Link href="/people/new" className="btn-plain">Add someone ➕</Link>
          </div>

          <BirthdayBanner birthdays={birthdays} />

          <section aria-label="Your stats" className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total spent" value={formatMoney(stats.totalSpent)} tint="bg-pink/25" tilt="-rotate-1" />
            <StatCard label="Average gift" value={formatMoney(stats.averageGift)} tint="bg-lime/50" tilt="rotate-1" />
            <StatCard label="Gifts bought" value={String(stats.giftsBought)} tint="bg-tangerine/30" tilt="-rotate-1" />
            <StatCard label="Ideas not bought yet" value={String(stats.ideasNotBought)} tint="bg-lilac/40" tilt="rotate-1" />
          </section>

          <section className="sticker mt-8 p-5 sm:p-6">
            <h2 className="font-display text-2xl font-bold">Where your money went</h2>
            <p className="mb-4 text-sm text-ink/70">Spending by category in {seasonLabel}</p>
            {stats.byCategory.length === 0 ? (
              <p className="py-6 text-center text-ink/70">
                Nothing bought yet. Mark a gift as bought and it’ll show up here 🛍️
              </p>
            ) : (
              <SpendChart data={stats.byCategory} />
            )}
          </section>

          {birthdays.length > 0 && (
            <section className="sticker mt-8 p-5 sm:p-6">
              <h2 className="font-display text-2xl font-bold">Coming up</h2>
              <ul className="mt-3 divide-y-2 divide-ink/10">
                {birthdays.slice(0, 5).map((birthday) => (
                  <li key={birthday.id}>
                    <Link href={`/people/${birthday.id}`} className="flex items-center justify-between gap-3 py-3 font-semibold hover:text-pink">
                      <span>{birthday.name}</span>
                      <span className="whitespace-nowrap text-sm text-ink/70">
                        {formatBirthday(birthday.birthday)} · {birthdayLabel(birthday.days)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
