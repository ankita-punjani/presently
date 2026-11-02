import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogOutButton } from "./LogOutButton";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export async function NavBar() {
  const session = await getSession();

  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-5 sm:px-6">
      <Link href={session ? "/dashboard" : "/"} className="font-display text-2xl font-extrabold tracking-tight">
        Presently <span aria-hidden>🎀</span>
      </Link>

      {session ? (
        <>
          <NavLinks />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogOutButton />
          </div>
        </>
      ) : (
        <nav aria-label="Account" className="flex items-center gap-3 text-sm font-semibold">
          <ThemeToggle />
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
