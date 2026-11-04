import { IdeaForm } from "@/components/IdeaForm";
import { listCategories } from "@/db/queries/gift-ideas";
import { listPeople } from "@/db/queries/people";
import { requireUser } from "@/lib/auth";
import { parseId } from "@/lib/params";
import { createIdeaAction } from "../actions";

export const metadata = { title: "Add an idea · Presently 🎀" };

type Props = { searchParams: Promise<{ person?: string }> };

export default async function NewIdeaPage({ searchParams }: Props) {
  const user = await requireUser();
  const [people, categories] = await Promise.all([listPeople(user.id), listCategories()]);
  const personId = parseId((await searchParams).person ?? "") ?? undefined;

  return (
    <div className="mx-auto max-w-2xl pt-6">
      <h1 className="mb-6 font-display text-4xl font-extrabold tracking-tight">Save that idea 💡</h1>
      <IdeaForm
        action={createIdeaAction}
        people={people}
        categories={categories}
        personId={personId}
        cancelHref={personId ? `/people/${personId}` : "/ideas"}
        submitLabel="Save idea"
      />
    </div>
  );
}
