import { notFound } from "next/navigation";
import { IdeaForm } from "@/components/IdeaForm";
import { getIdea, listCategories } from "@/db/queries/gift-ideas";
import { listPeople } from "@/db/queries/people";
import { requireUser } from "@/lib/auth";
import { parseId } from "@/lib/params";
import { updateIdeaAction } from "../../actions";

export const metadata = { title: "Edit idea · Presently 🎀" };

export default async function EditIdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const id = parseId((await params).id);
  const row = id && (await getIdea(user.id, id));
  if (!row) notFound();

  const [people, categories] = await Promise.all([listPeople(user.id), listCategories()]);

  return (
    <div className="mx-auto max-w-2xl pt-6">
      <h1 className="mb-6 font-display text-4xl font-extrabold tracking-tight">Edit idea ✏️</h1>
      <IdeaForm
        action={updateIdeaAction.bind(null, row.idea.id)}
        people={people}
        categories={categories}
        idea={row.idea}
        cancelHref={`/ideas/${row.idea.id}`}
        submitLabel="Save changes"
      />
    </div>
  );
}
