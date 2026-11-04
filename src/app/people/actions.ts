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
import { readValues, validatePerson, type FormState } from "@/lib/validation";

const FIELDS = ["name", "relationship", "birthday", "giftFor", "interests", "budget", "notes"];

function oneOf(value: string, allowed: string[], fallback: string) {
  return allowed.includes(value) ? value : fallback;
}

function toInput(values: FormState["values"]): PersonInput {
  return {
    name: values.name,
    relationship: oneOf(values.relationship, RELATIONSHIPS, "friend"),
    birthday: values.birthday || null,
    giftFor: oneOf(values.giftFor, GIFT_FOR, "no preference"),
    interests: values.interests || null,
    budget: values.budget || null,
    notes: values.notes || null,
  };
}

export async function createPersonAction(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const values = readValues(form, FIELDS);
  const errors = validatePerson(values);
  if (Object.keys(errors).length) return { errors, values };

  const person = await createPerson(user.id, toInput(values));
  revalidatePath("/", "layout");
  redirect(`/people/${person.id}`);
}

export async function updatePersonAction(id: number, _prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const values = readValues(form, FIELDS);
  const errors = validatePerson(values);
  if (Object.keys(errors).length) return { errors, values };

  await updatePerson(user.id, id, toInput(values));
  revalidatePath("/", "layout");
  redirect(`/people/${id}`);
}

export async function deletePersonAction(id: number) {
  const user = await requireUser();
  await deletePerson(user.id, id);
  revalidatePath("/", "layout");
  redirect("/people");
}
