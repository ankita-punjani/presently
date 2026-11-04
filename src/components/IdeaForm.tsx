"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { IdeaRow } from "@/db/queries/gift-ideas";
import type { Person } from "@/db/queries/people";
import { OCCASIONS, STATUSES } from "@/lib/idea-options";
import { EMPTY_FORM, type FormState } from "@/lib/validation";
import { FieldError, FormSummary, fieldProps } from "./FormFeedback";
import { SubmitButton } from "./SubmitButton";

type Props = {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  people: Person[];
  categories: { id: number; name: string; emoji: string }[];
  idea?: IdeaRow["idea"];
  personId?: number;
  cancelHref: string;
  submitLabel: string;
};

export function IdeaForm({ action, people, categories, idea, personId, cancelHref, submitLabel }: Props) {
  const [{ errors, values }, formAction] = useActionState(action, EMPTY_FORM);
  const field = (id: string, extraClass?: string) => fieldProps(id, errors, extraClass);
  const startingPerson = String(values.personId ?? idea?.personId ?? personId ?? (people.length === 0 ? "new" : ""));
  const [addingPerson, setAddingPerson] = useState(startingPerson === "new");
  const otherId = String(categories.find((c) => c.name === "Other")?.id ?? "");
  const startingCategory = String(values.categoryId ?? idea?.categoryId ?? "");
  const [isOther, setIsOther] = useState(startingCategory !== "" && startingCategory === otherId);

  return (
    // key: remount after a failed save so selects show what was submitted too.
    <form key={JSON.stringify(values)} action={formAction} noValidate className="sticker space-y-4 p-6 sm:p-8">
      <div>
        <label htmlFor="title" className="label">What’s the gift?</label>
        <input {...field("title")} placeholder="Matcha starter kit" defaultValue={values.title ?? idea?.title} />
        <FieldError id="title" message={errors.title} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="personId" className="label">Who’s it for?</label>
          <select {...field("personId")} defaultValue={startingPerson} onChange={(e) => setAddingPerson(e.target.value === "new")}>
            <option value="" disabled>Pick someone</option>
            {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            <option value="new">➕ Someone new…</option>
          </select>
          <FieldError id="personId" message={errors.personId} />
          {addingPerson && (
            <div className="mt-2">
              <label htmlFor="newPersonName" className="sr-only">New person’s name</label>
              <input {...field("newPersonName")} placeholder="Their name" autoFocus defaultValue={values.newPersonName ?? ""} />
              <FieldError id="newPersonName" message={errors.newPersonName} />
              <p className="mt-1 text-sm text-ink/60">They’ll be added to your people. Fill in birthday and more later.</p>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="categoryId" className="label">Category</label>
          <select {...field("categoryId")} defaultValue={startingCategory} onChange={(e) => setIsOther(e.target.value === otherId)}>
            <option value="" disabled>Pick a category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
          <FieldError id="categoryId" message={errors.categoryId} />
          {isOther && (
            <div className="mt-2">
              <label htmlFor="customCategory" className="sr-only">What kind of gift?</label>
              <input {...field("customCategory")} placeholder="What kind of gift? e.g. plants, music lessons" defaultValue={values.customCategory ?? idea?.customCategory ?? ""} />
              <FieldError id="customCategory" message={errors.customCategory} />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="price" className="label">Price ($)</label>
          <input {...field("price")} type="number" min="0" step="0.01" placeholder="38" defaultValue={values.price ?? idea?.price ?? ""} />
          <FieldError id="price" message={errors.price} />
        </div>
        <div>
          <label htmlFor="occasion" className="label">Occasion</label>
          <select {...field("occasion", "capitalize")} defaultValue={values.occasion ?? idea?.occasion ?? "birthday"}>
            {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="label">Status</label>
          <select {...field("status", "capitalize")} defaultValue={values.status ?? idea?.status ?? "idea"}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="store" className="label">Store</label>
          <input {...field("store")} placeholder="Etsy" defaultValue={values.store ?? idea?.store ?? ""} />
          <FieldError id="store" message={errors.store} />
        </div>
      </div>

      <div>
        <label htmlFor="link" className="label">Link</label>
        <input {...field("link")} placeholder="etsy.com/listing/..." defaultValue={values.link ?? idea?.link ?? ""} />
        <FieldError id="link" message={errors.link} />
      </div>

      <div>
        <label htmlFor="notes" className="label">Notes</label>
        <textarea {...field("notes")} rows={3} placeholder="Mentioned this at brunch." defaultValue={values.notes ?? idea?.notes ?? ""} />
        <FieldError id="notes" message={errors.notes} />
      </div>

      <FormSummary errors={errors} />

      <div className="flex flex-wrap gap-3 pt-2">
        <SubmitButton label={submitLabel} pendingLabel="Saving…" />
        <Link href={cancelHref} className="btn-plain">Cancel</Link>
      </div>
    </form>
  );
}
