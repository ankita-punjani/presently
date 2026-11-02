import { eq } from "drizzle-orm";
import { db } from "@/db";
import { productCache } from "@/db/schema";
import type { Suggestion } from "./gift-finder";
import { fetchProducts, pickProduct, type Product } from "./product-search";
import { BUDGETS } from "./quiz-options";

const CACHE_MS = 7 * 86_400_000;

async function productsFor(searchTerms: string, apiKey: string) {
  const query = searchTerms.trim().toLowerCase();
  const [cached] = await db.select().from(productCache).where(eq(productCache.query, query));
  if (cached && Date.now() - cached.fetchedAt.getTime() < CACHE_MS) return cached.results as Product[];

  const results = await fetchProducts(searchTerms, apiKey);
  await db
    .insert(productCache)
    .values({ query, results })
    .onConflictDoUpdate({ target: productCache.query, set: { results, fetchedAt: new Date() } });
  return results;
}

// A failed lookup leaves the suggestion as it was, with its store search link.
export async function addProductPhotos(suggestions: Suggestion[], budgetId: string) {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return suggestions;
  const maxPrice = BUDGETS.find((budget) => budget.id === budgetId)?.max ?? Number.POSITIVE_INFINITY;

  return Promise.all(
    suggestions.map(async (suggestion) => {
      try {
        const product = pickProduct(await productsFor(suggestion.searchTerms, apiKey), maxPrice);
        if (!product) return suggestion;
        return {
          ...suggestion,
          store: product.store,
          price: product.price ?? suggestion.price,
          imageUrl: product.imageUrl,
          link: product.link,
        };
      } catch (error) {
        console.error("Product lookup failed:", error);
        return suggestion;
      }
    }),
  );
}
