"use server";

import { revalidatePath } from "next/cache";
import { importBirthdays, startFeed, stopFeed, type ImportSummary } from "@/db/queries/calendar";
import { requireUser } from "@/lib/auth";
import { parseBirthdayFile } from "@/lib/birthday-import";

const MAX_FILE_CHARS = 2_000_000;

export type ImportResult = (ImportSummary & { found: number }) | { error: string };

export async function importBirthdaysAction(fileText: string): Promise<ImportResult> {
  const user = await requireUser();
  if (typeof fileText !== "string" || fileText.length > MAX_FILE_CHARS) {
    return { error: "That file is too big. Try exporting just your contacts." };
  }
  const entries = parseBirthdayFile(fileText);
  if (entries.length === 0) {
    return { error: "No birthdays found in that file. Use a contacts file (.vcf) or a calendar file (.ics)." };
  }
  const summary = await importBirthdays(user.id, entries);
  revalidatePath("/", "layout");
  return { ...summary, found: entries.length };
}

export async function setFeedAction(on: boolean) {
  const user = await requireUser();
  if (on) await startFeed(user.id);
  else await stopFeed(user.id);
  revalidatePath("/calendar");
}
