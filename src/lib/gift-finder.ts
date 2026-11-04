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
const RESULT_COUNT = 8;

const budgetFor = (id: string) => BUDGETS.find((budget) => budget.id === id) ?? BUDGETS[1];

// Only the quiz answers go to the AI: never a person's name, birthday or notes.
export function buildPrompt(answers: QuizAnswers) {
  const budget = budgetFor(answers.budgetId);
  return [
    "You are a thoughtful, creative gift advisor.",
    "Suggest exactly 8 different, specific gifts someone could buy online in the USA.",
    "Be specific and surprising: name real brands and products where you can, and lean hard into their interests. Avoid generic ideas. Each one should feel chosen for this person, and a little humor is welcome.",
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
    .slice(0, RESULT_COUNT);
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
  // The reason helps tell a bad key from a bad request. It never contains the key.
  if (!response.ok) throw new Error(`Gemini returned ${response.status}: ${(await response.text()).slice(0, 300)}`);

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

// People type interests in many ways, so "perfumes" and "gadgets" should both land.
const SYNONYMS: Record<string, string[]> = {
  luxury: ["luxury"], luxurious: ["luxury"], fancy: ["luxury"], designer: ["luxury", "fashion"], expensive: ["luxury"],
  perfume: ["perfume"], fragrance: ["perfume"], cologne: ["perfume"], scent: ["perfume"],
  massage: ["massage", "spa"], spa: ["spa", "massage", "self care"], relaxing: ["spa", "self care"],
  electronic: ["tech"], tech: ["tech"], apple: ["tech"], phone: ["tech"],
  blazer: ["blazer", "fashion"], suit: ["blazer", "fashion"], formal: ["blazer", "fashion"],
  clothe: ["fashion"], clothing: ["fashion"], fashion: ["fashion"], style: ["fashion"], outfit: ["fashion"],
  dress: ["dress", "fashion"], zara: ["zara", "dress", "fashion"], shopping: ["fashion"],
  cooking: ["cooking"], cook: ["cooking"], baking: ["baking", "cooking"], chef: ["cooking"], food: ["cooking"], foodie: ["cooking"],
  kitchen: ["cooking"], spice: ["spices", "cooking"], indian: ["spices", "cooking"],
  skincare: ["skincare"], skin: ["skincare"], beauty: ["beauty", "skincare"], makeup: ["makeup", "beauty"], korean: ["skincare"],
  business: ["travel", "luxury"], flight: ["travel"], flying: ["travel"], travel: ["travel"], traveling: ["travel"], trip: ["travel"], airport: ["travel"],
  gym: ["fitness"], fitness: ["fitness"], workout: ["fitness"], running: ["running", "fitness"], yoga: ["fitness", "self care"],
  tea: ["tea"], matcha: ["matcha", "tea"], coffee: ["coffee"], wine: ["wine"], gaming: ["gaming"], game: ["gaming", "games"],
  wedding: ["wedding"], married: ["wedding"], marriage: ["wedding"], newlywed: ["wedding"], bride: ["wedding"], honeymoon: ["wedding", "travel"],
  dessert: ["sweets", "baking"], sweet: ["sweets"], cake: ["baking", "sweets"], bake: ["baking"], baker: ["baking"], pastry: ["baking", "sweets"], chocolate: ["chocolate", "sweets"],
  crochet: ["crochet", "crafts"], knit: ["crochet", "crafts"], knitting: ["crochet", "crafts"], yarn: ["crochet", "crafts"], craft: ["crafts"],
  accessory: ["accessories", "jewelry"], accessorie: ["accessories", "jewelry"], jewelry: ["jewelry", "accessories"], jewellery: ["jewelry", "accessories"], bag: ["accessories"],
  watch: ["watch"], wallet: ["wallet"], jacket: ["jacket"], coat: ["jacket"],
  gadget: ["tech", "home gadget"], smart: ["home gadget", "tech"], home: ["home", "home gadget"],
  sneaker: ["sneakers"], sneakers: ["sneakers"], shoe: ["sneakers"], shoes: ["sneakers"], footwear: ["sneakers"], kicks: ["sneakers"],
  nike: ["sneakers"], jordan: ["sneakers"], jordans: ["sneakers"], adidas: ["sneakers"], onitsuka: ["sneakers"], balance: ["sneakers"],
  music: ["music"], vinyl: ["vinyl", "music"], reading: ["books"], book: ["books"], art: ["art"], plant: ["plants"], houseplant: ["plants"],
};

function interestTags(interests: string[]) {
  const tags = new Set<string>();
  for (const interest of interests) {
    tags.add(interest.toLowerCase());
    for (const word of interest.toLowerCase().split(/\s+/)) {
      const stem = word.replace(/(es|s)$/, "");
      for (const key of [word, stem, word.replace(/s$/, "")]) {
        tags.add(key);
        for (const tag of SYNONYMS[key] ?? []) tags.add(tag);
      }
    }
  }
  return tags;
}

export function backupSuggestions(answers: QuizAnswers, random = Math.random): Suggestion[] {
  const budget = budgetFor(answers.budgetId);
  const inCategories = BACKUP_GIFTS.filter(
    (gift) =>
      answers.categories.includes(gift.category) &&
      gift.price <= budget.max &&
      // "them" and "no preference" see everything. Otherwise skip gifts clearly for the other.
      (!gift.for || !["him", "her"].includes(answers.giftFor) || gift.for === answers.giftFor),
  );
  const unseen = inCategories.filter((gift) => !answers.alreadyShown.includes(gift.title));
  // Once everything's been shown, start over rather than coming up empty.
  const pool = unseen.length > 0 ? unseen : inCategories;

  const wanted = interestTags(answers.interests);

  const scored = pool
    .map((gift) => {
      const matches = gift.tags.filter((tag) => wanted.has(tag));
      const fitsBudget = gift.price >= budget.min && gift.price <= budget.max;
      const fitsVibe = gift.vibes.includes(answers.vibe);
      // The random part keeps results from feeling repetitive.
      const score = (fitsBudget ? 5 : 0) + (fitsVibe ? 2 : 0) + random() * 3;
      return { gift, tag: matches[0], matches: matches.length, score };
    })
    // Gifts matching more of their interests always come first.
    .sort((a, b) => b.matches - a.matches || b.score - a.score);

  const matching = scored.filter((entry) => entry.matches > 0).map(toSuggestion);
  const others = scored.filter((entry) => entry.matches === 0).map(toSuggestion);

  // An interest nothing on the list covers gets a store search for exactly that,
  // never a random gift that just happens to score well.
  const known = new Set(BACKUP_GIFTS.flatMap((gift) => gift.tags));
  const searches = answers.interests
    .filter((interest) => ![...interestTags([interest])].some((tag) => known.has(tag)))
    .slice(0, 3)
    .map((interest) => searchSuggestion(interest, answers.categories[0]))
    .filter((search) => !answers.alreadyShown.includes(search.title));

  return [...matching, ...searches, ...others].slice(0, RESULT_COUNT);

  function toSuggestion({ gift, tag }: { gift: (typeof BACKUP_GIFTS)[number]; tag?: string }): Suggestion {
    const store = findStore(gift.store)!;
    const vibeWords = VIBE_WORDS[answers.vibe] ?? "a great pick";
    return {
      title: gift.title,
      whyItFits:
        gift.why ??
        (tag
          ? `Perfect for someone into ${tag}, and ${vibeWords}.`
          : `${vibeWords.replace(/^./, (c) => c.toUpperCase())}, right in your budget.`),
      price: gift.price,
      category: gift.category,
      store: store.name,
      link: store.search(gift.title),
      imageUrl: null,
      searchTerms: gift.title,
    };
  }
}

function searchSuggestion(interest: string, category: string): Suggestion {
  const store = storeForCategory(category);
  const name = interest.trim().replace(/^./, (c) => c.toUpperCase());
  return {
    title: `${name} gift finds at ${store.name}`,
    whyItFits: `They’re into ${interest.trim()}, so this opens a ${store.name} search for exactly that.`,
    price: 0,
    category,
    store: store.name,
    link: store.search(`${interest.trim()} gift`),
    imageUrl: null,
    searchTerms: `${interest.trim()} gift`,
  };
}
