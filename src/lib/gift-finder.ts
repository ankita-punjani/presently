import { BACKUP_GIFTS } from "./backup-gifts";
import { BUDGETS } from "./quiz-options";
import { findStore, storeForCategory } from "./trusted-stores";

export type QuizAnswers = {
  giftFor: string;
  categories: string[];
  budgetId: string;
  occasion: string;
  vibe: string;
  interests: string[];
  alreadyShown: string[];
};

export type Suggestion = {
  title: string;
  whyItFits: string;
  price: number;
  category: string;
  store: string;
  link: string;
  imageUrl: string | null;
  searchTerms: string;
};

export type RawIdea = { title: string; whyItFits: string; price: number; category: string; searchTerms: string };

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.6-flash";
const TIMEOUT_MS = 8000;

const budgetFor = (id: string) => BUDGETS.find((budget) => budget.id === id) ?? BUDGETS[1];

// Only the quiz answers go to the AI: never a person's name, birthday or notes.
export function buildPrompt(answers: QuizAnswers) {
  const budget = budgetFor(answers.budgetId);
  return [
    "You are a thoughtful, creative gift advisor.",
    "Suggest exactly 5 different, specific gifts someone could buy online in the USA.",
    "Avoid generic ideas like gift cards. Each one should feel chosen for this person.",
    `Shopping for: ${answers.giftFor}`,
    `Their interests: ${answers.interests.join(", ") || "not given"}`,
    `Use only these categories: ${answers.categories.join(", ")}`,
    `Price range: $${budget.min} to $${budget.max} USD`,
    `Occasion: ${answers.occasion}`,
    `Vibe: ${answers.vibe}`,
    ...(answers.alreadyShown.length ? [`Don't repeat these: ${answers.alreadyShown.join("; ")}`] : []),
    'For each gift give: title; whyItFits (one short warm sentence that speaks to the giver as "you"); price (a typical USD price, as a number); category (exactly one of the categories above); searchTerms (2 to 6 words to find it in an online store).',
  ].join("\n");
}

const RESPONSE_SCHEMA = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      title: { type: "STRING" },
      whyItFits: { type: "STRING" },
      price: { type: "NUMBER" },
      category: { type: "STRING" },
      searchTerms: { type: "STRING" },
    },
    required: ["title", "whyItFits", "price", "category", "searchTerms"],
  },
};

// Model output is untrusted, so keep only well-formed ideas in an allowed category.
export function parseIdeas(text: string, categories: string[]): RawIdea[] {
  const data: unknown = JSON.parse(text);
  if (!Array.isArray(data)) return [];
  return data
    .filter(
      (idea): idea is RawIdea =>
        typeof idea?.title === "string" &&
        typeof idea?.whyItFits === "string" &&
        typeof idea?.searchTerms === "string" &&
        typeof idea?.price === "number" &&
        idea.price > 0 &&
        categories.includes(idea?.category),
    )
    .map((idea) => ({
      ...idea,
      title: idea.title.slice(0, 120),
      whyItFits: idea.whyItFits.slice(0, 240),
      searchTerms: idea.searchTerms.slice(0, 80),
    }))
    .slice(0, 5);
}

export async function fetchAiIdeas(answers: QuizAnswers, apiKey: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(answers) }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: RESPONSE_SCHEMA },
      }),
    },
  );
  if (!response.ok) throw new Error(`Gemini returned ${response.status}`);

  const body = await response.json();
  const text: string | undefined = body?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no text");

  const ideas = parseIdeas(text, answers.categories);
  if (ideas.length === 0) throw new Error("Gemini returned no usable ideas");
  return ideas;
}

export function ideaToSuggestion(idea: RawIdea): Suggestion {
  const store = storeForCategory(idea.category);
  return {
    title: idea.title,
    whyItFits: idea.whyItFits,
    price: idea.price,
    category: idea.category,
    store: store.name,
    link: store.search(idea.searchTerms),
    imageUrl: null,
    searchTerms: idea.searchTerms,
  };
}

const VIBE_WORDS: Record<string, string> = {
  practical: "something they’ll actually use",
  sentimental: "a gift with real meaning",
  fun: "a guaranteed smile",
  treat: "a little luxury",
};

function matchingTag(tags: string[], interests: string[]) {
  const wanted = interests.map((interest) => interest.toLowerCase());
  return tags.find((tag) => wanted.some((interest) => interest.includes(tag) || tag.includes(interest)));
}

export function backupSuggestions(answers: QuizAnswers, random = Math.random): Suggestion[] {
  const budget = budgetFor(answers.budgetId);
  const inCategories = BACKUP_GIFTS.filter(
    (gift) => answers.categories.includes(gift.category) && gift.price <= budget.max,
  );
  const unseen = inCategories.filter((gift) => !answers.alreadyShown.includes(gift.title));
  // Once everything's been shown, start over rather than coming up empty.
  const pool = unseen.length > 0 ? unseen : inCategories;

  const scored = pool
    .map((gift) => {
      const tag = matchingTag(gift.tags, answers.interests);
      const fitsBudget = gift.price >= budget.min && gift.price <= budget.max;
      const fitsVibe = gift.vibes.includes(answers.vibe);
      const score = (tag ? 4 : 0) + (fitsVibe ? 2 : 0) + (fitsBudget ? 5 : 0) + random();
      return { gift, tag, score };
    })
    .sort((a, b) => b.score - a.score);

  // Gifts in the budget range come first, and cheaper ones fill the list. Never pricier.
  return scored.slice(0, 5).map(({ gift, tag }) => {
    const store = findStore(gift.store)!;
    return {
      title: gift.title,
      whyItFits: tag
        ? `Perfect for someone into ${tag}, and ${VIBE_WORDS[answers.vibe] ?? "a great pick"}.`
        : `${(VIBE_WORDS[answers.vibe] ?? "A great pick").replace(/^./, (c) => c.toUpperCase())}, right in your budget.`,
      price: gift.price,
      category: gift.category,
      store: store.name,
      link: store.search(gift.title),
      imageUrl: null,
      searchTerms: gift.title,
    };
  });
}
