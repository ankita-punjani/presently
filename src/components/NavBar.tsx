import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogOutButton } from "./LogOutButton";

export async function NavBar() {
  const session = await getSession();

  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
      <Link href={session ? "/dashboard" : "/"} className="font-display text-2xl font-extrabold tracking-tight">
        Presently <span aria-hidden>🎀</span>
      </Link>

      {session ? (
        <nav className="flex items-center gap-3 text-sm font-semibold">
          <Link href="/dashboard" className="hidden hover:text-pink sm:inline">
            Dashboard
          </Link>
          <Link href="/people" className="hover:text-pink">
            People
          </Link>
          <Link href="/ideas" className="hover:text-pink">
            Ideas
          </Link>
          <LogOutButton />
        </nav>
      ) : (
        <nav className="flex items-center gap-3 text-sm font-semibold">
          <Link href="/login" className="hover:text-pink">
            Log in
          </Link>
          <Link href="/signup" className="btn-pink py-2 text-sm">
            Sign up
          </Link>
        </nav>
      )}
    </header>
  );
}
