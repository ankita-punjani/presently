import { randomBytes } from "node:crypto";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

const BASE_URL = "http://localhost:3100";

export type TestUser = { id: string; cookie: string };

// Signs up through the app's real sign-up endpoint and keeps the login cookie.
export async function signUp(name: string): Promise<TestUser> {
  const tag = randomBytes(6).toString("hex");
  const response = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL },
    body: JSON.stringify({
      name,
      email: `test-${tag}@presently.test`,
      password: randomBytes(12).toString("hex"),
    }),
  });
  if (!response.ok) throw new Error(`Sign up failed: ${response.status} ${await response.text()}`);

  const { user } = await response.json();
  const cookie = response.headers.getSetCookie().map((value) => value.split(";")[0]).join("; ");
  return { id: user.id, cookie };
}

export async function loadPage(user: TestUser, path: string) {
  const response = await fetch(`${BASE_URL}${path}`, { headers: { Cookie: user.cookie }, redirect: "manual" });
  return { status: response.status, html: await response.text() };
}

// Deleting a user removes their people, ideas and stars too.
export async function deleteUsers(...testUsers: TestUser[]) {
  await db.delete(users).where(inArray(users.id, testUsers.map((user) => user.id)));
}
