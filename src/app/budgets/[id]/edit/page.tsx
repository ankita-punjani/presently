import { notFound } from "next/navigation";
import { BudgetForm } from "@/components/BudgetForm";
import { getBudget } from "@/db/queries/budgets";
import { requireUser } from "@/lib/auth";
import { parseId } from "@/lib/params";
import { updateBudgetAction } from "../../actions";

export const metadata = { title: "Edit budget · Presently 🎀" };

export default async function EditBudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const id = parseId((await params).id);
  const budget = id && (await getBudget(user.id, id));
  if (!budget) notFound();

  return (
    <div className="mx-auto max-w-2xl pt-6">
      <h1 className="mb-6 font-display text-4xl font-extrabold tracking-tight">Edit budget ✏️</h1>
      <BudgetForm action={updateBudgetAction.bind(null, budget.id)} budget={budget} submitLabel="Save changes" />
    </div>
  );
}
