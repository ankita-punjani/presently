import { formatMoney } from "@/lib/format";

export function BudgetBar({ spent, amount }: { spent: number; amount: number }) {
  const percent = Math.round((spent / amount) * 100);
  const over = spent > amount;
  const color = over ? "bg-pink" : percent >= 80 ? "bg-tangerine" : "bg-lime";

  return (
    <div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(percent, 100)}
        aria-label={`${formatMoney(spent)} of ${formatMoney(amount)} spent`}
        className="h-5 overflow-hidden rounded-full border-2 border-ink bg-surface"
      >
        <div className={`h-full ${color}`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <p className="mt-1 text-sm font-semibold">
        {formatMoney(spent)} of {formatMoney(amount)}
        <span className="text-ink/70">
          {over ? ` · ${formatMoney(spent - amount)} over 😬` : ` · ${formatMoney(amount - spent)} left`}
        </span>
      </p>
    </div>
  );
}
