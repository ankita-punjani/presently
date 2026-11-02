import Link from "next/link";
import { ShareLink } from "@/components/ShareLink";
import { SubmitButton } from "@/components/SubmitButton";
import { WishForm } from "@/components/WishForm";
import { getShareToken, listWishes } from "@/db/queries/wishlist";
import { requireUser } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import { deleteWishAction, setSharingAction } from "./actions";

export const metadata = { title: "My wishlist · Presently 🎀" };

export default async function WishlistPage() {
  const user = await requireUser();
  const [wishes, token] = await Promise.all([listWishes(user.id), getShareToken(user.id)]);

  return (
    <div className="pt-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">My wishlist ✨</h1>
      <p className="mt-2 text-ink/70">Your turn. Save what you want, then send people the link.</p>

      <section className="sticker mt-6 flex flex-wrap items-center justify-between gap-3 bg-lime/40 px-5 py-4">
        <div>
          <h2 className="font-display text-xl font-bold">{token ? "Sharing is on 🟢" : "Your list is private 🔒"}</h2>
          <p className="text-sm text-ink/70">
            {token ? "Anyone with the link can see your first name and wishes." : "Turn on sharing to get a link for friends and family."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {token && <ShareLink path={`/w/${token}`} />}
          {token && <Link href={`/w/${token}`} className="btn-plain">Preview</Link>}
          <form action={setSharingAction.bind(null, !token)}>
            <SubmitButton label={token ? "Stop sharing" : "Turn on sharing"} pendingLabel="One sec…" />
          </form>
        </div>
      </section>

      <div className="mt-6"><WishForm /></div>

      {wishes.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {wishes.map((wish) => (
            <li key={wish.id} className="sticker flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-display text-lg font-bold leading-tight">{wish.title}</p>
                <p className="text-sm text-ink/70">
                  {wish.price && formatMoney(wish.price)}
                  {wish.price && wish.notes && " · "}
                  {wish.notes}
                </p>
              </div>
              <form action={deleteWishAction.bind(null, wish.id)}>
                <button type="submit" aria-label={`Remove ${wish.title}`} className="rounded-full border-2 border-ink px-2 text-sm font-bold hover:bg-pink hover:text-white">✕</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
