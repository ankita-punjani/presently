import { randomBytes } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { users, wishes, wishlistShares } from "@/db/schema";

export type WishInput = Pick<typeof wishes.$inferInsert, "title" | "link" | "price" | "notes">;

export function listWishes(userId: string) {
  return db.select().from(wishes).where(eq(wishes.userId, userId)).orderBy(desc(wishes.createdAt));
}

export async function addWish(userId: string, input: WishInput) {
  await db.insert(wishes).values({ ...input, userId });
}

export async function deleteWish(userId: string, id: number) {
  await db.delete(wishes).where(and(eq(wishes.id, id), eq(wishes.userId, userId)));
}

export async function getShareToken(userId: string) {
  const [share] = await db.select().from(wishlistShares).where(eq(wishlistShares.userId, userId));
  return share?.token ?? null;
}

// The token is long and random, so the link can't be guessed.
export async function startSharing(userId: string) {
  const token = randomBytes(16).toString("base64url");
  await db.insert(wishlistShares).values({ userId, token }).onConflictDoNothing();
}

export async function stopSharing(userId: string) {
  await db.delete(wishlistShares).where(eq(wishlistShares.userId, userId));
}

// Public page: returns only a first name and the wishes, never an email or user id.
export async function getSharedWishlist(token: string) {
  const [owner] = await db
    .select({ id: users.id, name: users.name })
    .from(wishlistShares)
    .innerJoin(users, eq(wishlistShares.userId, users.id))
    .where(eq(wishlistShares.token, token));
  if (!owner) return null;

  const items = await db
    .select({ id: wishes.id, title: wishes.title, link: wishes.link, price: wishes.price, notes: wishes.notes })
    .from(wishes)
    .where(eq(wishes.userId, owner.id))
    .orderBy(desc(wishes.createdAt));
  return { firstName: owner.name.split(" ")[0], items };
}
