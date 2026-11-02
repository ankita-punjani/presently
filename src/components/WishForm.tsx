"use client";

import { useActionState } from "react";
import { addWishAction } from "@/app/wishlist/actions";
import { EMPTY_FORM } from "@/lib/validation";
import { FieldError, FormSummary, fieldProps } from "./FormFeedback";
import { SubmitButton } from "./SubmitButton";

export function WishForm() {
  const [{ errors, values }, formAction] = useActionState(addWishAction, EMPTY_FORM);
  const field = (id: string) => fieldProps(id, errors);

  return (
    <form key={JSON.stringify(values)} action={formAction} noValidate className="sticker space-y-4 p-5 sm:p-6">
      <div>
        <label htmlFor="title" className="label">What do you want?</label>
        <input {...field("title")} placeholder="Noise-cancelling headphones" defaultValue={values.title} />
        <FieldError id="title" message={errors.title} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="link" className="label">Link</label>
          <input {...field("link")} placeholder="bestbuy.com/..." defaultValue={values.link} />
          <FieldError id="link" message={errors.link} />
        </div>
        <div>
          <label htmlFor="price" className="label">Price ($)</label>
          <input {...field("price")} type="number" min="0" step="0.01" placeholder="120" defaultValue={values.price} />
          <FieldError id="price" message={errors.price} />
        </div>
      </div>
      <div>
        <label htmlFor="notes" className="label">Notes</label>
        <input {...field("notes")} placeholder="Size M, in any color but beige" defaultValue={values.notes} />
        <FieldError id="notes" message={errors.notes} />
      </div>
      <FormSummary errors={errors} />
      <SubmitButton label="Add to my wishlist ✨" pendingLabel="Adding…" />
    </form>
  );
}
