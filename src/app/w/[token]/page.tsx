import Link from "next/link";
import { notFound } from "next/navigation";
import { getSharedWishlist } from "@/db/queries/wishlist";
import { formatMoney } from "@/lib/format";
import { giftEmoji } from "@/lib/gift-emoji";

type Props = { params: Promise<{ token: string }> };

export const metadata = {
  title: "A wishlist · Presently 🎀",
  robots: { index: false },
};

export default async function SharedWishlistPage({ params }: Props) {
  const wishlist = await getSharedWishlist((await params).token);
  if (!wishlist) notFound();

  return (
    <div className="pt-6">
      <p className="inline-block -rotate-2 rounded-full border-2 border-ink bg-lime px-4 py-1 text-sm font-bold">
        psst, gift hints inside 🤫
      </p>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
        {wishlist.firstName}’s wishlist 🎁
      </h1>

      {wishlist.items.length === 0 ? (
        <p className="sticker mt-8 p-8 text-center font-display text-2xl font-bold">Nothing here yet. Check back soon!</p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.items.map((wish) => (
            <li key={wish.id} className="sticker flex flex-col p-5 transition hover:-rotate-1">
              <p className="text-4xl" aria-hidden>{giftEmoji(wish.title, "🎁")}</p>
              <h2 className="mt-2 font-display text-xl font-bold leading-tight">{wish.title}</h2>
              {wish.price && <p className="mt-1 text-sm font-semibold">{formatMoney(wish.price)}</p>}
              {wish.notes && <p className="mt-1 flex-1 text-sm text-ink/70">{wish.notes}</p>}
              {wish.link && (
                <a href={wish.link} target="_blank" rel="noopener noreferrer nofollow" className="btn-pink mt-3 self-start px-4 py-2 text-sm">
                  Shop 🛍️
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 text-center text-sm text-ink/70">
        Made with <Link href="/" className="font-semibold underline decoration-pink decoration-2 underline-offset-4">Presently</Link>. Want your own list?
      </p>
    </div>
  );
}
