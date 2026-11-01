import Link from "next/link";
import { IdeaCard } from "@/components/IdeaCard";
import { listStarred } from "@/db/queries/gift-ideas";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Starred · Presently 🎀" };

export default async function StarredPage() {
  const user = await requireUser();
  const ideas = await listStarred(user.id);

  return (
    <div className="pt-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Starred ⭐</h1>
      <p className="mt-2 text-ink/70">Your top picks, ready for when you’re actually shopping.</p>

      {ideas.length === 0 ? (
        <div className="sticker mt-8 -rotate-1 bg-lime/40 p-8 text-center">
          <p className="text-5xl" aria-hidden>⭐</p>
          <p className="mt-3 font-display text-2xl font-bold">No favorites yet.</p>
          <p className="mb-5 mt-1 text-ink/70">Tap the star on any gift idea to save it here.</p>
          <Link href="/ideas" className="btn-pink">Browse your ideas</Link>
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
