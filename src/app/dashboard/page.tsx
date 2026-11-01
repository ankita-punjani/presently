import Link from "next/link";
import { SpendChart } from "@/components/SpendChart";
import { StatCard } from "@/components/StatCard";
import { getDashboardStats } from "@/db/queries/dashboard";
import { listPeople } from "@/db/queries/people";
import { requireUser } from "@/lib/auth";
import { todayString } from "@/lib/dates";
import { formatMoney } from "@/lib/format";

export const metadata = { title: "Dashboard · Presently 🎀" };

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = user.name.split(" ")[0];
  const year = todayString().slice(0, 4);

  const [people, stats] = await Promise.all([
    listPeople(user.id),
    getDashboardStats(user.id, { start: `${year}-01-01`, end: `${year}-12-31` }),
  ]);

  return (
    <div className="pt-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Hey {firstName} <span aria-hidden>✨</span>
      </h1>
      <p className="mt-2 text-ink/70">Here’s your gifting so far in {year}.</p>

      {people.length === 0 ? (
        <div className="sticker mt-8 -rotate-1 bg-lime/40 p-8 text-center">
          <p className="text-5xl" aria-hidden>👀</p>
          <p className="mt-3 font-display text-2xl font-bold">No one to shop for? Suspicious.</p>
          <p className="mb-5 mt-1 text-ink/70">Add your first person and start saving ideas.</p>
          <Link href="/people/new" className="btn-pink">Add someone ➕</Link>
        </div>
      ) : (
        <>
          <section aria-label="Your stats" className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total spent" value={formatMoney(stats.totalSpent)} tint="bg-pink/25" tilt="-rotate-1" />
            <StatCard label="Average gift" value={formatMoney(stats.averageGift)} tint="bg-lime/50" tilt="rotate-1" />
            <StatCard label="Gifts bought" value={String(stats.giftsBought)} tint="bg-tangerine/30" tilt="-rotate-1" />
            <StatCard label="Ideas not bought yet" value={String(stats.ideasNotBought)} tint="bg-lilac/40" tilt="rotate-1" />
          </section>

          <section className="sticker mt-8 p-5 sm:p-6">
            <h2 className="font-display text-2xl font-bold">Where your money went</h2>
            <p className="mb-4 text-sm text-ink/70">Spending by category in {year}</p>
            {stats.byCategory.length === 0 ? (
              <p className="py-6 text-center text-ink/70">
                Nothing bought yet. Mark a gift as bought and it’ll show up here 🛍️
              </p>
            ) : (
              <SpendChart data={stats.byCategory} />
            )}
          </section>
        </>
      )}
    </div>
  );
}
