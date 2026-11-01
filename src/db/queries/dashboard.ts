import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, giftIdeas } from "@/db/schema";
import { computeStats, type DateRange } from "@/lib/stats";

export async function getDashboardStats(userId: string, range: DateRange) {
  const rows = await db
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

  return computeStats(rows, range);
}
