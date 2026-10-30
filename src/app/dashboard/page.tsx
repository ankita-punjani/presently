import { requireUser } from "@/lib/auth";

export const metadata = { title: "Dashboard · Presently 🎀" };

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = user.name.split(" ")[0];

  return (
    <div className="pt-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Hey {firstName} <span aria-hidden>✨</span>
      </h1>
      <p className="mt-2 text-ink/70">Who are we shopping for?</p>

      <div className="sticker mt-8 -rotate-1 bg-lime/40 p-8 text-center">
        <p className="text-5xl" aria-hidden>👀</p>
        <p className="mt-3 font-display text-2xl font-bold">No one to shop for? Suspicious.</p>
        <p className="mt-1 text-ink/70">Adding people is coming in the next update.</p>
      </div>
    </div>
  );
}
