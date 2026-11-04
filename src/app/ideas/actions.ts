"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getCategory,
  createIdea,
  deleteIdea,
  getIdea,
  setIdeaStatus,
  setStar,
  updateIdea,
  type IdeaInput,
} from "@/db/queries/gift-ideas";
import { createPerson } from "@/db/queries/people";
import { requireUser } from "@/lib/auth";
import { todayString } from "@/lib/dates";
import { OCCASIONS, STATUSES } from "@/lib/idea-options";
import { cleanLink, readValues, validateIdea, type FormState } from "@/lib/validation";

const FIELDS = ["title", "personId", "newPersonName", "categoryId", "customCategory", "price", "occasion", "status", "store", "link", "notes"];

const NOT_YOUR_PERSON = "Who’s this gift for? Pick someone from your list.";

function toInput(values: FormState["values"], previousBoughtOn: string | null): IdeaInput {
  const status = STATUSES.includes(values.status) ? values.status : "idea";
  return {
    personId: Number(values.personId),
    categoryId: Number(values.categoryId),
    title: values.title,
    price: values.price || null,
    link: cleanLink(values.link),
    store: values.store || null,
    status,
    occasion: OCCASIONS.includes(values.occasion) ? values.occasion : "birthday",
    // Spending stats count from this date: set once on purchase, cleared if undone.
    boughtOn: status === "idea" ? null : (previousBoughtOn ?? todayString()),
    notes: values.notes || null,
  };
}

// "Someone new" in the dropdown: create the person first, then save the idea for them.
async function resolvePerson(userId: string, values: FormState["values"]) {
  if (values.personId !== "new") return values;
  const person = await createPerson(userId, { name: values.newPersonName });
  return { ...values, personId: String(person.id) };
}

async function validate(values: FormState["values"]) {
  const errors = validateIdea(values);
  const category = errors.categoryId ? null : await getCategory(Number(values.categoryId));
  if (!errors.categoryId && !category) errors.categoryId = "Pick a category so you can find it later.";
  // "Other" needs the user's own words for what kind of gift it is.
  const isOther = category?.name === "Other";
  if (isOther && !values.customCategory) errors.customCategory = "What kind of gift is it? For example: plants, music lessons.";
  return { errors, customCategory: isOther ? values.customCategory.slice(0, 60) : null };
}

export async function createIdeaAction(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const values = readValues(form, FIELDS);
  const { errors, customCategory } = await validate(values);
  if (Object.keys(errors).length) return { errors, values };

  const idea = await createIdea(user.id, { ...toInput(await resolvePerson(user.id, values), null), customCategory });
  if (!idea) return { errors: { personId: NOT_YOUR_PERSON }, values };
  revalidatePath("/", "layout");
  redirect(`/ideas/${idea.id}`);
}

export async function updateIdeaAction(id: number, _prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const existing = await getIdea(user.id, id);
  if (!existing) redirect("/ideas");

  const values = readValues(form, FIELDS);
  const { errors, customCategory } = await validate(values);
  if (Object.keys(errors).length) return { errors, values };

  const idea = await updateIdea(user.id, id, {
    ...toInput(await resolvePerson(user.id, values), existing.idea.boughtOn),
    customCategory,
  });
  if (!idea) return { errors: { personId: NOT_YOUR_PERSON }, values };
  revalidatePath("/", "layout");
  redirect(`/ideas/${id}`);
}

export async function deleteIdeaAction(id: number) {
  const user = await requireUser();
  await deleteIdea(user.id, id);
  revalidatePath("/", "layout");
  redirect("/ideas");
}

export async function setStarAction(id: number, starred: boolean) {
  const user = await requireUser();
  await setStar(user.id, id, starred);
  revalidatePath("/", "layout");
}

export async function setStatusAction(id: number, status: string) {
  const user = await requireUser();
  const existing = await getIdea(user.id, id);
  if (!existing || !STATUSES.includes(status)) return;

  const boughtOn = status === "idea" ? null : (existing.idea.boughtOn ?? todayString());
  await setIdeaStatus(user.id, id, status, boughtOn);
  revalidatePath("/", "layout");
}
