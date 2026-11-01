import Link from "next/link";
import { IdeaCard } from "@/components/IdeaCard";
import { IdeaFilters } from "@/components/IdeaFilters";
import { listCategories, listIdeas } from "@/db/queries/gift-ideas";
import { listPeople } from "@/db/queries/people";
import { requireUser } from "@/lib/auth";
import { STATUSES } from "@/lib/idea-options";
import { parseId } from "@/lib/params";

export const metadata = { title: "Gift ideas · Presently 🎀" };

type Search = { q?: string; person?: string; category?: string; status?: string; sort?: string };

export default async function IdeasPage({ searchParams }: { searchParams: Promise<Search> }) {
  const user = await requireUser();
  const { q, person, category, status, sort } = await searchParams;
  const filters = {
    q: typeof q === "string" ? q.trim().slice(0, 100) : undefined,
    personId: parseId(person ?? "") ?? undefined,
    categoryId: parseId(category ?? "") ?? undefined,
    status: status && STATUSES.includes(status) ? status : undefined,
    sort,
  };
  const isFiltering = Boolean(filters.q || filters.personId || filters.categoryId || filters.status);

  const [ideas, people, categories] = await Promise.all([
    listIdeas(user.id, filters),
    listPeople(user.id),
    listCategories(),
  ]);

  return (
    <div className="pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Gift ideas</h1>
        <Link href="/ideas/new" className="btn-pink">Add an idea 💡</Link>
      </div>

      {(ideas.length > 0 || isFiltering) && <IdeaFilters people={people} categories={categories} />}

      {ideas.length === 0 ? (
        isFiltering ? (
          <div className="sticker mt-8 bg-lilac/30 p-8 text-center">
            <p className="text-5xl" aria-hidden>🔍</p>
            <p className="mt-3 font-display text-2xl font-bold">Nothing matches that.</p>
            <p className="mt-1 text-ink/70">Try a different word or fewer filters.</p>
          </div>
        ) : (
          <div className="sticker mt-8 rotate-1 bg-tangerine/30 p-8 text-center">
            <p className="text-5xl" aria-hidden>💡</p>
            <p className="mt-3 font-display text-2xl font-bold">Your idea stash is empty.</p>
            <p className="mt-1 text-ink/70">Next time someone drops a hint, save it here.</p>
          </div>
        )
      ) : (
        <>
          <p className="mt-6 text-sm font-semibold text-ink/70">
            {ideas.length} {ideas.length === 1 ? "idea" : "ideas"}
          </p>
          <ul className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map((row) => (
              <li key={row.idea.id}><IdeaCard row={row} showPerson /></li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
