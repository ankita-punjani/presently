"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createBudget, deleteBudget, updateBudget, type BudgetInput } from "@/db/queries/budgets";
import { requireUser } from "@/lib/auth";
import { readValues, validateBudget, type FormState } from "@/lib/validation";

const FIELDS = ["name", "amount", "startDate", "endDate"];

export async function createBudgetAction(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const values = readValues(form, FIELDS);
  const errors = validateBudget(values);
  if (Object.keys(errors).length) return { errors, values };

  await createBudget(user.id, values as BudgetInput);
  revalidatePath("/", "layout");
  redirect("/budgets");
}

export async function updateBudgetAction(id: number, _prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const values = readValues(form, FIELDS);
  const errors = validateBudget(values);
  if (Object.keys(errors).length) return { errors, values };

  await updateBudget(user.id, id, values as BudgetInput);
  revalidatePath("/", "layout");
  redirect("/budgets");
}

export async function deleteBudgetAction(id: number) {
  const user = await requireUser();
  await deleteBudget(user.id, id);
  revalidatePath("/", "layout");
  redirect("/budgets");
}
