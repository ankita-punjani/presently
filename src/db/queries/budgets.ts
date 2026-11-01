import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { budgets } from "@/db/schema";

export type Budget = typeof budgets.$inferSelect;
export type BudgetInput = Pick<typeof budgets.$inferInsert, "name" | "amount" | "startDate" | "endDate">;

export function listBudgets(userId: string) {
  return db.select().from(budgets).where(eq(budgets.userId, userId)).orderBy(asc(budgets.startDate));
}

export async function getBudget(userId: string, id: number) {
  const [budget] = await db.select().from(budgets).where(and(eq(budgets.id, id), eq(budgets.userId, userId)));
  return budget ?? null;
}

export async function createBudget(userId: string, input: BudgetInput) {
  const [budget] = await db.insert(budgets).values({ ...input, userId }).returning();
  return budget;
}

export async function updateBudget(userId: string, id: number, input: BudgetInput) {
  await db.update(budgets).set(input).where(and(eq(budgets.id, id), eq(budgets.userId, userId)));
}

export async function deleteBudget(userId: string, id: number) {
  await db.delete(budgets).where(and(eq(budgets.id, id), eq(budgets.userId, userId)));
}
