import Link from "next/link";
import { IdeaCard } from "@/components/IdeaCard";
import { listIdeas } from "@/db/queries/gift-ideas";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Gift ideas · Presently 🎀" };

export default async function IdeasPage() {
  const user = await requireUser();
  const ideas = await listIdeas(user.id);

  return (
    <div className="pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Gift ideas</h1>
        <Link href="/ideas/new" className="btn-pink">Add an idea 💡</Link>
      </div>

      {ideas.length === 0 ? (
        <div className="sticker mt-8 rotate-1 bg-tangerine/30 p-8 text-center">
          <p className="text-5xl" aria-hidden>💡</p>
          <p className="mt-3 font-display text-2xl font-bold">Your idea stash is empty.</p>
          <p className="mt-1 text-ink/70">Next time someone drops a hint, save it here.</p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((row) => (
            <li key={row.idea.id}><IdeaCard row={row} showPerson /></li>
          ))}
        </ul>
      )}
    </div>
  );
}
