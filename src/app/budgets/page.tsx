import Link from "next/link";
import { BudgetBar } from "@/components/BudgetBar";
import { DeleteButton } from "@/components/DeleteButton";
import { listBudgets } from "@/db/queries/budgets";
import { listSpendingRows } from "@/db/queries/dashboard";
import { requireUser } from "@/lib/auth";
import { todayString } from "@/lib/dates";
import { formatBirthday } from "@/lib/format";
import { spentInRange } from "@/lib/stats";
import { deleteBudgetAction } from "./actions";

export const metadata = { title: "Budgets · Presently 🎀" };

export default async function BudgetsPage() {
  const user = await requireUser();
  const [budgets, rows] = await Promise.all([listBudgets(user.id), listSpendingRows(user.id)]);
  const today = todayString();

  return (
    <div className="pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Budgets</h1>
        <Link href="/budgets/new" className="btn-pink">New budget 💸</Link>
      </div>

      {budgets.length === 0 ? (
        <div className="sticker mt-8 rotate-1 bg-lime/40 p-8 text-center">
          <p className="text-5xl" aria-hidden>💸</p>
          <p className="mt-3 font-display text-2xl font-bold">December sneaks up on everyone.</p>
          <p className="mt-1 text-ink/70">Set a budget now and thank yourself later.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-6">
          {budgets.map((budget) => (
            <li key={budget.id} className="sticker p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-bold">
                    {budget.name}
                    {budget.startDate <= today && today <= budget.endDate && (
                      <span className="ml-2 rounded-full bg-lime px-3 py-0.5 align-middle font-sans text-sm font-bold">Active</span>
                    )}
                  </h2>
                  <p className="text-sm text-ink/70">
                    {formatBirthday(budget.startDate)} – {formatBirthday(budget.endDate)}, {budget.endDate.slice(0, 4)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link href={`/budgets/${budget.id}/edit`} className="btn-plain">Edit</Link>
                  <DeleteButton name={budget.name} keepLabel="Keep it" action={deleteBudgetAction.bind(null, budget.id)} />
                </div>
              </div>
              <div className="mt-4">
                <BudgetBar
                  spent={spentInRange(rows, { start: budget.startDate, end: budget.endDate })}
                  amount={Number(budget.amount)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
