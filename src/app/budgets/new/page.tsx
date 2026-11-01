import { BudgetForm } from "@/components/BudgetForm";
import { requireUser } from "@/lib/auth";
import { createBudgetAction } from "../actions";

export const metadata = { title: "New budget · Presently 🎀" };

export default async function NewBudgetPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-2xl pt-6">
      <h1 className="mb-6 font-display text-4xl font-extrabold tracking-tight">Set a budget 💸</h1>
      <BudgetForm action={createBudgetAction} submitLabel="Save budget" />
    </div>
  );
}
