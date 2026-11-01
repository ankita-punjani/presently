import { existsSync, readFileSync } from "node:fs";
import { config } from "dotenv";

// Tests sign up users and delete them afterwards, so they must never reach real data.
config({ path: ".env.test", override: true });

const databaseHost = (file: string) => {
  if (!existsSync(file)) return undefined;
  const match = readFileSync(file, "utf8").match(/^DATABASE_URL="postgresql:\/\/[^@]+@([^/]+)/m);
  return match?.[1];
};

if (!process.env.DATABASE_URL) throw new Error("Create .env.test with a test DATABASE_URL.");
if (databaseHost(".env.test") === databaseHost(".env.prod")) {
  throw new Error("Refusing to run: .env.test points at the production database.");
}
