"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Person } from "@/db/queries/people";
import { GIFT_FOR, RELATIONSHIPS } from "@/lib/people-options";
import { EMPTY_FORM, type FormState } from "@/lib/validation";
import { FieldError, FormSummary, fieldProps } from "./FormFeedback";
import { SubmitButton } from "./SubmitButton";

type Props = {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  person?: Person;
  cancelHref: string;
  submitLabel: string;
};

export function PersonForm({ action, person, cancelHref, submitLabel }: Props) {
  const [{ errors, values }, formAction] = useActionState(action, EMPTY_FORM);
  const field = (id: string, extraClass?: string) => fieldProps(id, errors, extraClass);

  return (
    // key: remount after a failed save so selects show what was submitted too.
    <form key={JSON.stringify(values)} action={formAction} noValidate className="sticker space-y-4 p-6 sm:p-8">
      <div>
        <label htmlFor="name" className="label">Name</label>
        <input {...field("name")} placeholder="Priya" defaultValue={values.name ?? person?.name} />
        <FieldError id="name" message={errors.name} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="relationship" className="label">Relationship</label>
          <select {...field("relationship", "capitalize")} defaultValue={values.relationship ?? person?.relationship ?? "friend"}>
            {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="giftFor" className="label">Shopping for</label>
          <select {...field("giftFor", "capitalize")} defaultValue={values.giftFor ?? person?.giftFor ?? "no preference"}>
            {GIFT_FOR.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="birthday" className="label">Birthday</label>
          <input {...field("birthday")} type="date" defaultValue={values.birthday ?? person?.birthday ?? ""} />
          <FieldError id="birthday" message={errors.birthday} />
        </div>
        <div>
          <label htmlFor="budget" className="label">Budget ($)</label>
          <input {...field("budget")} type="number" min="0" step="0.01" placeholder="50" defaultValue={values.budget ?? person?.budget ?? ""} />
          <FieldError id="budget" message={errors.budget} />
        </div>
      </div>

      <div>
        <label htmlFor="interests" className="label">Interests</label>
        <input {...field("interests")} placeholder="matcha, pottery, plants" defaultValue={values.interests ?? person?.interests ?? ""} />
        <p className="mt-1 text-sm text-ink/60">Separate them with commas.</p>
        <FieldError id="interests" message={errors.interests} />
      </div>

      <div>
        <label htmlFor="notes" className="label">Notes</label>
        <textarea {...field("notes")} rows={3} placeholder="Allergic to lavender. Loves anything green." defaultValue={values.notes ?? person?.notes ?? ""} />
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
