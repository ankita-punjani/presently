import { and, asc, desc, eq, ilike, isNotNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, giftIdeas, people, stars } from "@/db/schema";
import { daysUntilBirthday } from "@/lib/dates";

export type IdeaInput = Pick<
  typeof giftIdeas.$inferInsert,
  "personId" | "categoryId" | "title" | "price" | "link" | "store" | "status" | "occasion" | "boughtOn" | "notes"
> &
  Partial<Pick<typeof giftIdeas.$inferInsert, "imageUrl" | "source" | "customCategory">>;

const ideaWithNames = {
  idea: giftIdeas,
  personName: people.name,
  personBirthday: people.birthday,
  categoryName: categories.name,
  categoryEmoji: categories.emoji,
  starred: sql<boolean>`${stars.giftIdeaId} is not null`,
};

function selectIdeas(userId: string) {
  return db
    .select(ideaWithNames)
    .from(giftIdeas)
    .innerJoin(people, eq(giftIdeas.personId, people.id))
    .innerJoin(categories, eq(giftIdeas.categoryId, categories.id))
    .leftJoin(stars, and(eq(stars.giftIdeaId, giftIdeas.id), eq(stars.userId, userId)));
}

export type IdeaRow = Awaited<ReturnType<typeof selectIdeas>>[number];

export function listCategories() {
  // Alphabetical, with "Other" always last.
  return db.select().from(categories).orderBy(sql`${categories.name} = 'Other'`, asc(categories.name));
}

export async function getCategory(id: number) {
  const [row] = await db.select().from(categories).where(eq(categories.id, id));
  return row ?? null;
}

export type IdeaFilters = {
  q?: string;
  personId?: number;
  categoryId?: number;
  status?: string;
  sort?: string;
};

const ORDER = {
  newest: [desc(giftIdeas.createdAt)],
  "price-low": [sql`${giftIdeas.price} asc nulls last`, desc(giftIdeas.createdAt)],
  "price-high": [sql`${giftIdeas.price} desc nulls last`, desc(giftIdeas.createdAt)],
};

export async function listIdeas(userId: string, filters: IdeaFilters = {}) {
  const { q, personId, categoryId, status, sort } = filters;
  // Escape so a search for "50%" means the text, not a wildcard.
  const pattern = q && `%${q.replace(/[\\%_]/g, "\\$&")}%`;

  const rows = await selectIdeas(userId)
    .where(
      and(
        eq(giftIdeas.userId, userId),
        pattern ? or(ilike(giftIdeas.title, pattern), ilike(giftIdeas.store, pattern), ilike(giftIdeas.notes, pattern)) : undefined,
        personId ? eq(giftIdeas.personId, personId) : undefined,
        categoryId ? eq(giftIdeas.categoryId, categoryId) : undefined,
        status ? eq(giftIdeas.status, status) : undefined,
      ),
    )
    .orderBy(...(ORDER[sort as keyof typeof ORDER] ?? ORDER.newest));

  if (sort !== "birthday") return rows;
  // "Soonest" depends on today's date, so it's easiest to sort here.
  const days = (row: IdeaRow) =>
    row.personBirthday ? daysUntilBirthday(row.personBirthday) : Number.POSITIVE_INFINITY;
  return rows.toSorted((a, b) => days(a) - days(b));
}

export function listIdeasForPerson(userId: string, personId: number) {
  return selectIdeas(userId)
    .where(and(eq(giftIdeas.userId, userId), eq(giftIdeas.personId, personId)))
    .orderBy(desc(giftIdeas.createdAt));
}

export function listStarred(userId: string) {
  return selectIdeas(userId)
    .where(and(eq(giftIdeas.userId, userId), isNotNull(stars.giftIdeaId)))
    .orderBy(desc(stars.createdAt));
}

export async function getIdea(userId: string, id: number) {
  const [row] = await selectIdeas(userId).where(and(eq(giftIdeas.id, id), eq(giftIdeas.userId, userId)));
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

export async function setIdeaStatus(userId: string, id: number, status: string, boughtOn: string | null) {
  await db
    .update(giftIdeas)
    .set({ status, boughtOn })
    .where(and(eq(giftIdeas.id, id), eq(giftIdeas.userId, userId)));
}

export async function deleteIdea(userId: string, id: number) {
  await db.delete(giftIdeas).where(and(eq(giftIdeas.id, id), eq(giftIdeas.userId, userId)));
}

export async function setStar(userId: string, giftIdeaId: number, starred: boolean) {
  if (!starred) {
    await db.delete(stars).where(and(eq(stars.userId, userId), eq(stars.giftIdeaId, giftIdeaId)));
    return;
  }
  if (await getIdea(userId, giftIdeaId)) {
    await db.insert(stars).values({ userId, giftIdeaId }).onConflictDoNothing();
  }
}

// For people cards: how many ideas each person has, and how many are bought or given.
export async function countIdeasByPerson(userId: string) {
  const rows = await db
    .select({
      personId: giftIdeas.personId,
      total: sql<number>`count(*)::int`,
      bought: sql<number>`count(*) filter (where ${giftIdeas.status} <> 'idea')::int`,
    })
    .from(giftIdeas)
    .where(eq(giftIdeas.userId, userId))
    .groupBy(giftIdeas.personId);
  return new Map(rows.map((row) => [row.personId, row]));
}
