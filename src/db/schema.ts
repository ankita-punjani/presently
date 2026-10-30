import { boolean, date, integer, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Login tables. Column names follow what Better Auth expects; table names are
// plural (see `usePlural` in src/lib/auth.ts) so `users` matches PLAN.md.

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// One row per logged-in browser. Deleted on log out.
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// How a user signs in: providerId "credential" holds the hashed password,
// providerId "google" (bonus feature #13) holds Google tokens.
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Short-lived tokens (e.g. Google sign-in state).
export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Everyone a user shops for. One user has many people.
export const people = pgTable("people", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  relationship: text("relationship").notNull().default("friend"),
  birthday: date("birthday"),
  giftFor: text("gift_for").notNull().default("no preference"),
  interests: text("interests"),
  budget: numeric("budget", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Shared, seeded list (see drizzle/0002_gift_ideas.sql). One category has many ideas.
export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  emoji: text("emoji").notNull(),
});

// The main item. One person has many ideas. userId is stored here too so every
// query can filter by owner directly.
export const giftIdeas = pgTable("gift_ideas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  personId: integer("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  title: text("title").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }),
  link: text("link"),
  imageUrl: text("image_url"),
  store: text("store"),
  status: text("status").notNull().default("idea"),
  occasion: text("occasion").notNull().default("birthday"),
  source: text("source").notNull().default("manual"),
  boughtOn: date("bought_on"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
