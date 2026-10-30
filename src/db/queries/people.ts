import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { people } from "@/db/schema";

export type Person = typeof people.$inferSelect;
export type PersonInput = Pick<
  typeof people.$inferInsert,
  "name" | "relationship" | "birthday" | "giftFor" | "interests" | "budget" | "notes"
>;

// Every query takes userId and filters on it, so one user can never read or
// change another user's people.

export function listPeople(userId: string) {
  return db.select().from(people).where(eq(people.userId, userId)).orderBy(asc(people.name));
}

export async function getPerson(userId: string, id: number) {
  const [person] = await db
    .select()
    .from(people)
    .where(and(eq(people.id, id), eq(people.userId, userId)));
  return person ?? null;
}

export async function createPerson(userId: string, input: PersonInput) {
  const [person] = await db
    .insert(people)
    .values({ ...input, userId })
    .returning();
  return person;
}

export async function updatePerson(userId: string, id: number, input: PersonInput) {
  const [person] = await db
    .update(people)
    .set(input)
    .where(and(eq(people.id, id), eq(people.userId, userId)))
    .returning();
  return person ?? null;
}

export async function deletePerson(userId: string, id: number) {
  await db.delete(people).where(and(eq(people.id, id), eq(people.userId, userId)));
}
