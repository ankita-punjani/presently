import { and, asc, count, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { giftIdeas, people } from "@/db/schema";
import { daysUntilBirthday } from "@/lib/dates";

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

export type UpcomingBirthday = { id: number; name: string; days: number; birthday: string; ideaCount: number };

// Soonest first. ideaCount only counts ideas still waiting to be bought.
export async function listUpcomingBirthdays(userId: string): Promise<UpcomingBirthday[]> {
  const rows = await db
    .select({
      id: people.id,
      name: people.name,
      birthday: people.birthday,
      ideaCount: sql<number>`${count(giftIdeas.id)}::int`,
    })
    .from(people)
    .leftJoin(giftIdeas, and(eq(giftIdeas.personId, people.id), eq(giftIdeas.status, "idea")))
    .where(and(eq(people.userId, userId), isNotNull(people.birthday)))
    .groupBy(people.id);

  return rows
    .map((row) => ({ ...row, birthday: row.birthday!, days: daysUntilBirthday(row.birthday!) }))
    .sort((a, b) => a.days - b.days);
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
