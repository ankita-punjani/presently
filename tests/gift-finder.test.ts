import { afterEach, describe, expect, it, vi } from "vitest";
import {
  backupSuggestions,
  buildPrompt,
  fetchAiIdeas,
  ideaToSuggestion,
  parseIdeas,
  type QuizAnswers,
} from "@/lib/gift-finder";
import { BACKUP_GIFTS } from "@/lib/backup-gifts";
import { BUDGETS } from "@/lib/quiz-options";
import { findStore, isTrustedUrl } from "@/lib/trusted-stores";

const answers: QuizAnswers = {
  giftFor: "her",
  categories: ["Home & cozy", "Food & drink"],
  budgetId: "25-50",
  occasion: "birthday",
  vibe: "sentimental",
  interests: ["matcha", "pottery"],
  alreadyShown: [],
};

const idea = {
  title: "Matcha whisk set",
  whyItFits: "You know she loves matcha.",
  price: 32,
  category: "Food & drink",
  searchTerms: "matcha whisk set",
};

const geminiReply = (ideas: unknown) =>
  new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(ideas) }] } }] }));

afterEach(() => vi.unstubAllGlobals());

describe("AI ideas", () => {
  it("only sends quiz answers to the AI", () => {
    const prompt = buildPrompt(answers);
    expect(prompt).toContain("matcha");
    expect(prompt).toContain("$25 to $50");
  });

  it("reads ideas from Gemini's reply format", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => geminiReply([idea])));
    expect(await fetchAiIdeas(answers, "test-key")).toEqual([idea]);
  });

  it("sends the key in a header, not the URL", async () => {
    const fetchMock = vi.fn<(url: string, options: RequestInit) => Promise<Response>>(async () => geminiReply([idea]));
    vi.stubGlobal("fetch", fetchMock);
    await fetchAiIdeas(answers, "test-key");
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).not.toContain("test-key");
    expect((options.headers as Record<string, string>)["x-goog-api-key"]).toBe("test-key");
  });

  it("throws on an API error, so the quiz can use the backup list", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("rate limited", { status: 429 })));
    await expect(fetchAiIdeas(answers, "test-key")).rejects.toThrow("429");
  });

  it("drops malformed ideas and categories that weren't picked", () => {
    const text = JSON.stringify([idea, { ...idea, category: "Weapons" }, { title: "no other fields" }]);
    expect(parseIdeas(text, answers.categories)).toEqual([idea]);
    expect(parseIdeas('{"not":"a list"}', answers.categories)).toEqual([]);
  });

  it("builds a shop link to a trusted store", () => {
    expect(isTrustedUrl(ideaToSuggestion(idea).link)).toBe(true);
  });
});

describe("backup list", () => {
  it.each(BUDGETS)("never goes over the $label budget", (budget) => {
    const gifts = backupSuggestions({ ...answers, budgetId: budget.id, categories: ["Home & cozy", "Gaming & tech", "Experiences"] });
    expect(gifts.length).toBeGreaterThan(0);
    for (const gift of gifts) expect(gift.price).toBeLessThanOrEqual(budget.max);
  });

  it("only uses the picked categories, and every link is trusted", () => {
    for (const gift of backupSuggestions(answers)) {
      expect(answers.categories).toContain(gift.category);
      expect(isTrustedUrl(gift.link)).toBe(true);
    }
  });

  it("doesn't repeat gifts already shown", () => {
    const first = backupSuggestions(answers).map((gift) => gift.title);
    const second = backupSuggestions({ ...answers, alreadyShown: first }).map((gift) => gift.title);
    expect(second.filter((title) => first.includes(title))).toEqual([]);
  });

  it("starts over rather than coming up empty", () => {
    const all = backupSuggestions({ ...answers, alreadyShown: Array.from({ length: 50 }, (_, i) => `x${i}`) });
    expect(all.length).toBe(8);
  });
});

describe("interests shape the results", () => {
  const titles = (interests: string[], categories: string[], budgetId: string) =>
    backupSuggestions({ ...answers, interests, categories, budgetId, vibe: "treat" }).map((gift) => gift.title).join();

  it("finds perfume from 'perfumes', and massage gifts from 'massages'", () => {
    expect(titles(["perfumes"], ["Skincare & beauty"], "100-300")).toMatch(/Tom Ford|Chanel/);
    expect(titles(["massages"], ["Experiences"], "100-300")).toMatch(/massage/i);
  });

  it("treats 'electronics' as tech, and 'business class' as luxury travel", () => {
    expect(titles(["electronics"], ["Gaming & tech"], "100-300")).toMatch(/AirPods|Sony|Kindle|Theragun/);
    expect(titles(["business class"], ["Experiences"], "25-50")).toMatch(/Business Class/);
  });

  it("finds Zara dresses and cooking gifts", () => {
    expect(titles(["Zara", "dresses"], ["Clothes & accessories"], "50-100")).toMatch(/Zara/);
    expect(titles(["cooking"], ["Food & drink"], "25-50")).toMatch(/spice|Masala|thermometer|Truffle/i);
  });
});

describe("shopping for him or her", () => {
  const titles = (giftFor: string) =>
    backupSuggestions({ ...answers, giftFor, interests: ["fashion", "luxury", "blazers"], categories: ["Clothes & accessories"], budgetId: "50-100" })
      .map((gift) => gift.title)
      .join();

  it("doesn't suggest cufflinks for her, or dresses for him", () => {
    expect(titles("her")).not.toMatch(/cufflinks|pocket square/i);
    expect(titles("him")).not.toMatch(/dress from Zara|earrings/i);
  });

  it("shows everything for 'them'", () => {
    expect(titles("them")).toMatch(/cufflinks|pocket square|dress/i);
  });
});

describe("every quiz combination gets a full set", () => {
  const categories = [...new Set(BACKUP_GIFTS.map((gift) => gift.category))];

  it.each(categories)("%s has a full set in every budget", (category) => {
    for (const budget of BUDGETS) {
      const gifts = backupSuggestions({ ...answers, categories: [category], budgetId: budget.id });
      expect(gifts.length, `${category} ${budget.label}`).toBeGreaterThanOrEqual(budget.max <= 25 ? 5 : 8);
    }
  });

  it("every backup gift names a trusted store", () => {
    for (const gift of BACKUP_GIFTS) expect(findStore(gift.store), gift.title).toBeDefined();
  });
});

describe("trusted links", () => {
  it.each([
    ["https://www.amazon.com/s?k=mug", true],
    ["https://www.etsy.com/search?q=mug", true],
    ["http://www.amazon.com/s?k=mug", false],
    ["https://amazon.com.evil.example/s", false],
    ["https://notamazon.com/", false],
    ["javascript:alert(1)", false],
  ])("%s → %s", (url, expected) => {
    expect(isTrustedUrl(url)).toBe(expected);
  });
});
