import Link from "next/link";
import { listPeople } from "@/db/queries/people";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Dashboard · Presently 🎀" };

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = user.name.split(" ")[0];
  const people = await listPeople(user.id);

  return (
    <div className="pt-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Hey {firstName} <span aria-hidden>✨</span>
      </h1>
      <p className="mt-2 text-ink/70">Who are we shopping for?</p>

      {people.length === 0 ? (
        <div className="sticker mt-8 -rotate-1 bg-lime/40 p-8 text-center">
          <p className="text-5xl" aria-hidden>👀</p>
          <p className="mt-3 font-display text-2xl font-bold">No one to shop for? Suspicious.</p>
          <p className="mb-5 mt-1 text-ink/70">Add your first person and start saving ideas.</p>
          <Link href="/people/new" className="btn-pink">Add someone ➕</Link>
        </div>
      ) : (
        <div className="sticker mt-8 bg-lilac/30 p-8">
          <p className="font-display text-2xl font-bold">
            You’re shopping for {people.length} {people.length === 1 ? "person" : "people"} 🎁
          </p>
          <Link href="/people" className="btn-pink mt-4">See your people</Link>
        </div>
      )}
    </div>
  );
}
