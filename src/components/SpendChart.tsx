"use client";

import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMoney } from "@/lib/format";
import type { CategorySpend } from "@/lib/stats";

type TooltipProps = { active?: boolean; payload?: { payload: CategorySpend }[] };

function SpendTooltip({ active, payload }: TooltipProps) {
  const entry = payload?.[0]?.payload;
  if (!active || !entry) return null;
  return (
    <div className="rounded-xl border-2 border-ink bg-surface px-3 py-2 text-sm font-semibold">
      {entry.emoji} {entry.category}: {formatMoney(entry.spent)}
    </div>
  );
}

export function SpendChart({ data }: { data: CategorySpend[] }) {
  const rows = data.map((entry) => ({ ...entry, label: `${entry.emoji} ${entry.category}` }));

  return (
    <>
      <div aria-hidden style={{ height: Math.max(140, rows.length * 56) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 64, bottom: 0, left: 0 }}>
            <XAxis type="number" hide domain={[0, "dataMax"]} />
            <YAxis
              type="category"
              dataKey="label"
              width={170}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-ink)", fontSize: 13, fontWeight: 600 }}
            />
            <Tooltip cursor={{ fill: "var(--color-ink)", fillOpacity: 0.05 }} content={<SpendTooltip />} />
            <Bar dataKey="spent" fill="var(--color-pink)" radius={[0, 4, 4, 0]} maxBarSize={28} isAnimationActive={false}>
              <LabelList
                dataKey="spent"
                position="right"
                formatter={(value: unknown) => formatMoney(Number(value))}
                style={{ fill: "var(--color-ink)", fontSize: 13, fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>Spending by category</caption>
        <thead><tr><th>Category</th><th>Spent</th></tr></thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.category}><td>{entry.category}</td><td>{formatMoney(entry.spent)}</td></tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
