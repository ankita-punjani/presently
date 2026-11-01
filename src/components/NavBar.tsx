import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogOutButton } from "./LogOutButton";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/people", label: "People" },
  { href: "/ideas", label: "Ideas" },
  { href: "/starred", label: "Starred" },
  { href: "/budgets", label: "Budgets" },
];

export async function NavBar() {
  const session = await getSession();

  return (
    <header className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-5 sm:px-6">
      <Link href={session ? "/dashboard" : "/"} className="font-display text-2xl font-extrabold tracking-tight">
        Presently <span aria-hidden>🎀</span>
      </Link>

      {session ? (
        <>
          <nav className="order-last flex w-full gap-4 overflow-x-auto text-sm font-semibold md:order-none md:w-auto">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="whitespace-nowrap hover:text-pink">
                {link.label}
              </Link>
            ))}
          </nav>
          <LogOutButton />
        </>
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
