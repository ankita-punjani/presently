export type StatRow = {
  price: string | null;
  status: string;
  boughtOn: string | null;
  categoryName: string;
  categoryEmoji: string;
};

export type DateRange = { start: string; end: string };

export type CategorySpend = { category: string; emoji: string; spent: number };

export type DashboardStats = {
  totalSpent: number;
  averageGift: number;
  giftsBought: number;
  ideasNotBought: number;
  byCategory: CategorySpend[];
};

const round = (cents: number) => Math.round(cents) / 100;

// A gift counts as spending once it's bought or given, on a date inside the range.
// Sums use whole cents because 0.1 + 0.2 isn't exactly 0.3 in floating point.
export function computeStats(rows: StatRow[], range: DateRange): DashboardStats {
  const spent = rows.filter(
    (row) =>
      row.status !== "idea" &&
      row.boughtOn !== null &&
      row.boughtOn >= range.start &&
      row.boughtOn <= range.end,
  );
  const priced = spent.filter((row) => row.price !== null);

  const cents = (row: StatRow) => Math.round(Number(row.price ?? 0) * 100);
  const totalCents = priced.reduce((sum, row) => sum + cents(row), 0);

  const byCategory = new Map<string, CategorySpend>();
  for (const row of priced) {
    const entry = byCategory.get(row.categoryName) ?? {
      category: row.categoryName,
      emoji: row.categoryEmoji,
      spent: 0,
    };
    entry.spent += cents(row);
    byCategory.set(row.categoryName, entry);
  }

  return {
    totalSpent: round(totalCents),
    averageGift: priced.length ? round(totalCents / priced.length) : 0,
    giftsBought: spent.length,
    ideasNotBought: rows.filter((row) => row.status === "idea").length,
    byCategory: [...byCategory.values()]
      .map((entry) => ({ ...entry, spent: round(entry.spent) }))
      .sort((a, b) => b.spent - a.spent),
  };
}
