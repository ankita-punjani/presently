import { findStore, isTrustedUrl } from "./trusted-stores";

export type Product = { store: string; price: number | null; imageUrl: string; link: string };

const TIMEOUT_MS = 3000;

function parsePrice(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return null;
  const amount = Number(value.replace(/[^0-9.]/g, ""));
  return amount > 0 ? amount : null;
}

// Keeps only products from trusted stores that have a photo. A shopping result's
// link often goes through Google, so anything else becomes a search on that store.
export function parseProducts(data: unknown, searchTerms: string): Product[] {
  const results = (data as { shopping?: unknown } | null)?.shopping;
  if (!Array.isArray(results)) return [];

  return results.flatMap((result) => {
    const store = typeof result?.source === "string" ? findStore(result.source) : undefined;
    const imageUrl = result?.imageUrl;
    if (!store || typeof imageUrl !== "string" || !imageUrl.startsWith("https://")) return [];

    const link = typeof result?.link === "string" && isTrustedUrl(result.link) ? result.link : store.search(searchTerms);
    return [{ store: store.name, price: parsePrice(result?.price), imageUrl, link }];
  });
}

export async function fetchProducts(searchTerms: string, apiKey: string) {
  const response = await fetch("https://google.serper.dev/shopping", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({ q: searchTerms, gl: "us" }),
  });
  if (!response.ok) throw new Error(`Serper returned ${response.status}: ${(await response.text()).slice(0, 300)}`);
  return parseProducts(await response.json(), searchTerms);
}

// The closest match in budget wins. Never a product over budget.
export function pickProduct(products: Product[], maxPrice: number) {
  return products.find((product) => product.price === null || product.price <= maxPrice) ?? null;
}
