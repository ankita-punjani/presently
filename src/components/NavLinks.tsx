"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/people", label: "People" },
  { href: "/ideas", label: "Ideas" },
  { href: "/starred", label: "Starred" },
  { href: "/calendar", label: "Calendar" },
  { href: "/wishlist", label: "Wishlist" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="order-last flex w-full items-center gap-1 overflow-x-auto pb-1 text-sm font-semibold lg:order-none lg:w-auto">
      {LINKS.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-3 py-1 transition ${
              active ? "bg-ink text-cream" : "hover:bg-pink/15"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <Link href="/quiz" className="ml-1 whitespace-nowrap rounded-full border-2 border-ink bg-lime px-3 py-1 font-bold transition hover:-rotate-2">
        Find a gift 🔮
      </Link>
    </nav>
  );
}
