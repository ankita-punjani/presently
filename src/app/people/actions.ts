"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createPerson,
  deletePerson,
  updatePerson,
  type PersonInput,
} from "@/db/queries/people";
import { requireUser } from "@/lib/auth";
import { GIFT_FOR, RELATIONSHIPS } from "@/lib/people-options";

function oneOf(value: string, allowed: string[], fallback: string) {
  return allowed.includes(value) ? value : fallback;
}

function readPerson(form: FormData): PersonInput {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  return {
    name: text("name"),
    relationship: oneOf(text("relationship"), RELATIONSHIPS, "friend"),
    birthday: text("birthday") || null,
    giftFor: oneOf(text("giftFor"), GIFT_FOR, "no preference"),
    interests: text("interests") || null,
    budget: text("budget") || null,
    notes: text("notes") || null,
  };
}

export async function createPersonAction(form: FormData) {
  const user = await requireUser();
  const person = await createPerson(user.id, readPerson(form));
  revalidatePath("/people");
  redirect(`/people/${person.id}`);
}

export async function updatePersonAction(id: number, form: FormData) {
  const user = await requireUser();
  await updatePerson(user.id, id, readPerson(form));
  revalidatePath("/people");
  redirect(`/people/${id}`);
}

export async function deletePersonAction(id: number) {
  const user = await requireUser();
  await deletePerson(user.id, id);
  revalidatePath("/people");
  redirect("/people");
}
