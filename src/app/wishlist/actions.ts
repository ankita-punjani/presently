"use server";

import { revalidatePath } from "next/cache";
import { addWish, deleteWish, startSharing, stopSharing } from "@/db/queries/wishlist";
import { requireUser } from "@/lib/auth";
import { EMPTY_FORM, cleanLink, readValues, validateWish, type FormState } from "@/lib/validation";

export async function addWishAction(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const values = readValues(form, ["title", "link", "price", "notes"]);
  const errors = validateWish(values);
  if (Object.keys(errors).length) return { errors, values };

  await addWish(user.id, {
    title: values.title,
    link: cleanLink(values.link),
    price: values.price || null,
    notes: values.notes || null,
  });
  revalidatePath("/wishlist");
  return EMPTY_FORM;
}

export async function deleteWishAction(id: number) {
  const user = await requireUser();
  await deleteWish(user.id, id);
  revalidatePath("/wishlist");
}

export async function setSharingAction(on: boolean) {
  const user = await requireUser();
  if (on) await startSharing(user.id);
  else await stopSharing(user.id);
  revalidatePath("/wishlist");
}
