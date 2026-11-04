import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { budgets, categories, giftIdeas, people, stars, wishes } from "@/db/schema";
import { todayString } from "@/lib/dates";
import { computeStats, type DateRange } from "@/lib/stats";
import { listBudgets } from "./budgets";

export function listSpendingRows(userId: string) {
  return db
    .select({
      price: giftIdeas.price,
      status: giftIdeas.status,
      boughtOn: giftIdeas.boughtOn,
      categoryName: categories.name,
      categoryEmoji: categories.emoji,
    })
    .from(giftIdeas)
    .innerJoin(categories, eq(giftIdeas.categoryId, categories.id))
    .where(eq(giftIdeas.userId, userId));
}

// "This season" is the budget running today, or the calendar year if there isn't one.
export async function getDashboard(userId: string, today = todayString()) {
  const [rows, budgets] = await Promise.all([listSpendingRows(userId), listBudgets(userId)]);
  const budget = budgets.find((b) => b.startDate <= today && today <= b.endDate) ?? null;
  const year = today.slice(0, 4);
  const range: DateRange = budget
    ? { start: budget.startDate, end: budget.endDate }
    : { start: `${year}-01-01`, end: `${year}-12-31` };

  return { budget, seasonLabel: budget?.name ?? year, stats: computeStats(rows, range) };
}

// How far a new user has got, for the getting-started checklist.
export async function getSetupProgress(userId: string) {
  const total = async (table: typeof people | typeof giftIdeas | typeof budgets | typeof wishes | typeof stars) => {
    const [row] = await db.select({ total: count() }).from(table).where(eq(table.userId, userId));
    return row.total;
  };
  const [peopleCount, ideaCount, starCount, budgetCount, wishCount] = await Promise.all([
    total(people),
    total(giftIdeas),
    total(stars),
    total(budgets),
    total(wishes),
  ]);
  return {
    person: peopleCount > 0,
    idea: ideaCount > 0,
    star: starCount > 0,
    budget: budgetCount > 0,
    wish: wishCount > 0,
  };
}
