import { and, count, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { categories, giftIdeas, people, stars, wishes } from "@/db/schema";
import { todayString } from "@/lib/dates";
import { computeStats, type DateRange } from "@/lib/stats";

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

// Stats cover this calendar year.
export async function getDashboard(userId: string, today = todayString()) {
  const year = today.slice(0, 4);
  const range: DateRange = { start: `${year}-01-01`, end: `${year}-12-31` };
  return { seasonLabel: year, stats: computeStats(await listSpendingRows(userId), range) };
}

// How far a new user has got, for the getting-started checklist.
export async function getSetupProgress(userId: string) {
  const total = async (table: typeof people | typeof giftIdeas | typeof wishes | typeof stars) => {
    const [row] = await db.select({ total: count() }).from(table).where(eq(table.userId, userId));
    return row.total;
  };
  const [peopleCount, ideaCount, starCount, wishCount, [birthdays]] = await Promise.all([
    total(people),
    total(giftIdeas),
    total(stars),
    total(wishes),
    db.select({ total: count() }).from(people).where(and(eq(people.userId, userId), isNotNull(people.birthday))),
  ]);
  return {
    person: peopleCount > 0,
    idea: ideaCount > 0,
    star: starCount > 0,
    birthday: birthdays.total > 0,
    wish: wishCount > 0,
  };
}
