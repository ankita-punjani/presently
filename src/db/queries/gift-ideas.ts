import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, giftIdeas, people } from "@/db/schema";

export type IdeaInput = Pick<
  typeof giftIdeas.$inferInsert,
  "personId" | "categoryId" | "title" | "price" | "link" | "store" | "status" | "occasion" | "boughtOn" | "notes"
>;

const ideaWithNames = {
  idea: giftIdeas,
  personName: people.name,
  categoryName: categories.name,
  categoryEmoji: categories.emoji,
};

function selectIdeas() {
  return db
    .select(ideaWithNames)
    .from(giftIdeas)
    .innerJoin(people, eq(giftIdeas.personId, people.id))
    .innerJoin(categories, eq(giftIdeas.categoryId, categories.id));
}

export type IdeaRow = Awaited<ReturnType<typeof selectIdeas>>[number];

export function listCategories() {
  return db.select().from(categories).orderBy(asc(categories.id));
}

export function listIdeas(userId: string) {
  return selectIdeas().where(eq(giftIdeas.userId, userId)).orderBy(desc(giftIdeas.createdAt));
}

export function listIdeasForPerson(userId: string, personId: number) {
  return selectIdeas()
    .where(and(eq(giftIdeas.userId, userId), eq(giftIdeas.personId, personId)))
    .orderBy(desc(giftIdeas.createdAt));
}

export async function getIdea(userId: string, id: number) {
  const [row] = await selectIdeas().where(and(eq(giftIdeas.id, id), eq(giftIdeas.userId, userId)));
  return row ?? null;
}

// The form sends personId, so a tampered form could name someone else's person.
async function ownsPerson(userId: string, personId: number) {
  const [row] = await db
    .select({ id: people.id })
    .from(people)
    .where(and(eq(people.id, personId), eq(people.userId, userId)));
  return Boolean(row);
}

export async function createIdea(userId: string, input: IdeaInput) {
  if (!(await ownsPerson(userId, input.personId))) return null;
  const [idea] = await db
    .insert(giftIdeas)
    .values({ ...input, userId })
    .returning();
  return idea;
}

export async function updateIdea(userId: string, id: number, input: IdeaInput) {
  if (!(await ownsPerson(userId, input.personId))) return null;
  const [idea] = await db
    .update(giftIdeas)
    .set(input)
    .where(and(eq(giftIdeas.id, id), eq(giftIdeas.userId, userId)))
    .returning();
  return idea ?? null;
}

export async function deleteIdea(userId: string, id: number) {
  await db.delete(giftIdeas).where(and(eq(giftIdeas.id, id), eq(giftIdeas.userId, userId)));
}
