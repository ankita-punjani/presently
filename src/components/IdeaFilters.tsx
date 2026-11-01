"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { STATUSES } from "@/lib/idea-options";

type Props = {
  people: { id: number; name: string }[];
  categories: { id: number; name: string; emoji: string }[];
};

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "birthday", label: "Soonest birthday" },
];

export function IdeaFilters({ people, categories }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/ideas?${next}`, { scroll: false });
  }

  // Wait for a pause in typing so each letter isn't a database query.
  useEffect(() => {
    if (search.trim() === (new URLSearchParams(window.location.search).get("q") ?? "")) return;
    const timer = setTimeout(() => setParam("q", search.trim()), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setParam reads the live URL
  }, [search]);

  const hasFilters = ["q", "person", "category", "status", "sort"].some((key) => params.has(key));

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="sticker mt-6 space-y-3 p-4">
      <div>
        <label htmlFor="q" className="sr-only">Search your ideas</label>
        <input
          id="q"
          type="search"
          className="field"
          placeholder="🔍 Search ideas, stores or notes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="person" className="label">Person</label>
          <select id="person" className="field" value={params.get("person") ?? ""} onChange={(e) => setParam("person", e.target.value)}>
            <option value="">Everyone</option>
            {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="category" className="label">Category</label>
          <select id="category" className="field" value={params.get("category") ?? ""} onChange={(e) => setParam("category", e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="label">Status</label>
          <select id="status" className="field capitalize" value={params.get("status") ?? ""} onChange={(e) => setParam("status", e.target.value)}>
            <option value="">Any status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="label">Sort by</label>
          <select id="sort" className="field" value={params.get("sort") ?? "newest"} onChange={(e) => setParam("sort", e.target.value)}>
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {hasFilters && (
        <Link href="/ideas" onClick={() => setSearch("")} className="inline-block text-sm font-semibold underline decoration-pink decoration-2 underline-offset-4">
          Clear filters
        </Link>
      )}
    </form>
  );
}
