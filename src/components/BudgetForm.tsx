"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Budget } from "@/db/queries/budgets";
import { EMPTY_FORM, type FormState } from "@/lib/validation";
import { FieldError, FormSummary, fieldProps } from "./FormFeedback";
import { SubmitButton } from "./SubmitButton";

type Props = {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  budget?: Budget;
  submitLabel: string;
};

export function BudgetForm({ action, budget, submitLabel }: Props) {
  const [{ errors, values }, formAction] = useActionState(action, EMPTY_FORM);
  const field = (id: string) => fieldProps(id, errors);

  return (
    <form key={JSON.stringify(values)} action={formAction} noValidate className="sticker space-y-4 p-6 sm:p-8">
      <div>
        <label htmlFor="name" className="label">Name</label>
        <input {...field("name")} placeholder="Holidays 2026" defaultValue={values.name ?? budget?.name} />
        <FieldError id="name" message={errors.name} />
      </div>
      <div>
        <label htmlFor="amount" className="label">Budget ($)</label>
        <input {...field("amount")} type="number" min="0" step="0.01" placeholder="300" defaultValue={values.amount ?? budget?.amount} />
        <FieldError id="amount" message={errors.amount} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="label">Starts</label>
          <input {...field("startDate")} type="date" defaultValue={values.startDate ?? budget?.startDate} />
          <FieldError id="startDate" message={errors.startDate} />
        </div>
        <div>
          <label htmlFor="endDate" className="label">Ends</label>
          <input {...field("endDate")} type="date" defaultValue={values.endDate ?? budget?.endDate} />
          <FieldError id="endDate" message={errors.endDate} />
        </div>
      </div>

      <FormSummary errors={errors} />

      <div className="flex flex-wrap gap-3 pt-2">
        <SubmitButton label={submitLabel} pendingLabel="Saving…" />
        <Link href="/budgets" className="btn-plain">Cancel</Link>
      </div>
    </form>
  );
}
