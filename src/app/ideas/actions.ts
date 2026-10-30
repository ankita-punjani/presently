"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createIdea, deleteIdea, getIdea, updateIdea, type IdeaInput } from "@/db/queries/gift-ideas";
import { requireUser } from "@/lib/auth";
import { OCCASIONS, STATUSES } from "@/lib/idea-options";

// Links become clickable hrefs, so only allow web addresses. This blocks things
// like "javascript:..." and lets people paste "target.com/thing" without https.
function cleanLink(value: string) {
  if (!value) return null;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function readIdea(form: FormData, previousBoughtOn: string | null): IdeaInput {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const status = STATUSES.includes(text("status")) ? text("status") : "idea";
  return {
    personId: Number(text("personId")),
    categoryId: Number(text("categoryId")),
    title: text("title"),
    price: text("price") || null,
    link: cleanLink(text("link")),
    store: text("store") || null,
    status,
    occasion: OCCASIONS.includes(text("occasion")) ? text("occasion") : "birthday",
    // Spending stats count from this date: set once on purchase, cleared if undone.
    boughtOn: status === "idea" ? null : (previousBoughtOn ?? new Date().toISOString().slice(0, 10)),
    notes: text("notes") || null,
  };
}

export async function createIdeaAction(form: FormData) {
  const user = await requireUser();
  const idea = await createIdea(user.id, readIdea(form, null));
  revalidatePath("/ideas");
  redirect(idea ? `/ideas/${idea.id}` : "/ideas");
}

export async function updateIdeaAction(id: number, form: FormData) {
  const user = await requireUser();
  const existing = await getIdea(user.id, id);
  if (!existing) redirect("/ideas");
  await updateIdea(user.id, id, readIdea(form, existing.idea.boughtOn));
  revalidatePath("/ideas");
  redirect(`/ideas/${id}`);
}

export async function deleteIdeaAction(id: number) {
  const user = await requireUser();
  await deleteIdea(user.id, id);
  revalidatePath("/ideas");
  redirect("/ideas");
}
