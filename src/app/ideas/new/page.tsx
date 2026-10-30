import Link from "next/link";
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
      {people.length === 0 ? (
        <div className="sticker bg-lime/40 p-8 text-center">
          <p className="font-display text-2xl font-bold">First, who’s it for?</p>
          <p className="mb-5 mt-1 text-ink/70">Gift ideas belong to a person, so add someone first.</p>
          <Link href="/people/new" className="btn-pink">Add someone ➕</Link>
        </div>
      ) : (
        <IdeaForm
          action={createIdeaAction}
          people={people}
          categories={categories}
          personId={personId}
          cancelHref={personId ? `/people/${personId}` : "/ideas"}
          submitLabel="Save idea"
        />
      )}
    </div>
  );
}
