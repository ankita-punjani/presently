import { randomBytes } from "node:crypto";
import { and, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { calendarFeeds, people } from "@/db/schema";
import type { ImportedBirthday } from "@/lib/birthday-import";

export async function getFeedToken(userId: string) {
  const [feed] = await db.select().from(calendarFeeds).where(eq(calendarFeeds.userId, userId));
  return feed?.token ?? null;
}

// Long and random, so the link can't be guessed.
export async function startFeed(userId: string) {
  await db.insert(calendarFeeds).values({ userId, token: randomBytes(18).toString("base64url") }).onConflictDoNothing();
}

export async function stopFeed(userId: string) {
  await db.delete(calendarFeeds).where(eq(calendarFeeds.userId, userId));
}

// The feed only ever contains the token owner's people.
export async function getFeedBirthdays(token: string) {
  const [feed] = await db.select().from(calendarFeeds).where(eq(calendarFeeds.token, token));
  if (!feed) return null;
  const rows = await db
    .select({ id: people.id, name: people.name, birthday: people.birthday })
    .from(people)
    .where(and(eq(people.userId, feed.userId), isNotNull(people.birthday)));
  return rows.map((row) => ({ ...row, birthday: row.birthday! }));
}

export type ImportSummary = { added: number; updated: number; skipped: number };

// New names become people. Existing people get a birthday only if they don't have one,
// so an import never overwrites anything.
export async function importBirthdays(userId: string, entries: ImportedBirthday[]): Promise<ImportSummary> {
  const existing = await db.select().from(people).where(eq(people.userId, userId));
  const byName = new Map(existing.map((person) => [person.name.trim().toLowerCase(), person]));
  const summary: ImportSummary = { added: 0, updated: 0, skipped: 0 };

  for (const entry of entries) {
    const match = byName.get(entry.name.trim().toLowerCase());
    if (!match) {
      const [person] = await db.insert(people).values({ userId, name: entry.name, birthday: entry.birthday }).returning();
      byName.set(entry.name.trim().toLowerCase(), person);
      summary.added++;
    } else if (!match.birthday) {
      await db.update(people).set({ birthday: entry.birthday }).where(and(eq(people.id, match.id), eq(people.userId, userId)));
      summary.updated++;
    } else {
      summary.skipped++;
    }
  }
  return summary;
}
