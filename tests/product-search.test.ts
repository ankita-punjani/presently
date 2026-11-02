import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchProducts, parseProducts, pickProduct, type Product } from "@/lib/product-search";
import { isTrustedUrl } from "@/lib/trusted-stores";
import { giftEmoji } from "@/lib/gift-emoji";

const image = "https://images.example/mug.jpg";
const reply = {
  shopping: [
    { title: "Mug", source: "Target", link: "https://www.google.com/shopping/product/1", price: "$24.99", imageUrl: image },
    { title: "Mug", source: "Etsy", link: "https://www.etsy.com/listing/1/mug", price: "$30.00", imageUrl: image },
    { title: "Mug", source: "Sketchy Deals", link: "https://sketchy.example/mug", price: "$5.00", imageUrl: image },
    { title: "Mug", source: "Amazon.com", link: "https://www.amazon.com/dp/1", price: "$1,020.00", imageUrl: image },
    { title: "No photo", source: "Target", link: "https://www.target.com/p/2", price: "$9.00" },
  ],
};

afterEach(() => vi.unstubAllGlobals());

describe("product search", () => {
  it("keeps only trusted stores with a photo", () => {
    const products = parseProducts(reply, "ceramic mug");
    expect(products.map((product) => product.store)).toEqual(["Target", "Etsy", "Amazon"]);
  });

  it("swaps a Google redirect for a search on the trusted store", () => {
    const [target, etsy] = parseProducts(reply, "ceramic mug");
    expect(target.link).toBe("https://www.target.com/s?searchTerm=ceramic%20mug");
    expect(etsy.link).toBe("https://www.etsy.com/listing/1/mug");
    expect(isTrustedUrl(target.link)).toBe(true);
  });

  it("reads prices like $1,020.00", () => {
    expect(parseProducts(reply, "mug").map((product) => product.price)).toEqual([24.99, 30, 1020]);
  });

  it("survives an unexpected reply", () => {
    expect(parseProducts(null, "mug")).toEqual([]);
    expect(parseProducts({ shopping: "nope" }, "mug")).toEqual([]);
    expect(parseProducts({ shopping: [null, 3, {}] }, "mug")).toEqual([]);
  });

  it("never picks a product over budget", () => {
    const products: Product[] = parseProducts(reply, "mug");
    expect(pickProduct(products, 28)?.store).toBe("Target");
    expect(pickProduct(products, 10)).toBeNull();
  });

  it("sends the key in a header and fails on an API error", async () => {
    const fetchMock = vi.fn<(url: string, options: RequestInit) => Promise<Response>>(
      async () => new Response("nope", { status: 403 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchProducts("mug", "test-key")).rejects.toThrow("403");
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).not.toContain("test-key");
    expect((options.headers as Record<string, string>)["X-API-KEY"]).toBe("test-key");
  });
});

describe("gift art", () => {
  it("matches a gift's title, or falls back to the category", () => {
    expect(giftEmoji("Ceremonial matcha starter kit", "🍫")).toBe("🍵");
    expect(giftEmoji("Something unusual", "🎁")).toBe("🎁");
  });
});
