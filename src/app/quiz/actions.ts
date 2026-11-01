"use server";

import { and, count, eq, gt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { createIdea, listCategories } from "@/db/queries/gift-ideas";
import { createPerson, getPerson } from "@/db/queries/people";
import { quizRuns } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { backupSuggestions, fetchAiIdeas, ideaToSuggestion, type QuizAnswers, type Suggestion } from "@/lib/gift-finder";
import { BUDGETS, QUIZ_OCCASIONS, VIBES } from "@/lib/quiz-options";
import { isTrustedUrl } from "@/lib/trusted-stores";
import { GIFT_FOR } from "@/lib/people-options";

const AI_RUNS_PER_DAY = 10;

async function hasAiRunsLeft(userId: string) {
  const dayAgo = new Date(Date.now() - 86_400_000);
  const [row] = await db
    .select({ total: count() })
    .from(quizRuns)
    .where(and(eq(quizRuns.userId, userId), gt(quizRuns.createdAt, dayAgo)));
  return row.total < AI_RUNS_PER_DAY;
}

export type QuizResult = { suggestions: Suggestion[]; source: "ai" | "backup" };

export async function findGiftsAction(input: QuizAnswers): Promise<QuizResult> {
  const user = await requireUser();
  const known = new Set((await listCategories()).map((category) => category.name));

  const answers: QuizAnswers = {
    giftFor: GIFT_FOR.includes(input.giftFor) ? input.giftFor : "no preference",
    categories: input.categories.filter((category) => known.has(category)).slice(0, 3),
    budgetId: BUDGETS.some((budget) => budget.id === input.budgetId) ? input.budgetId : "25-50",
    occasion: QUIZ_OCCASIONS.some((o) => o.id === input.occasion) ? input.occasion : "birthday",
    vibe: VIBES.some((v) => v.id === input.vibe) ? input.vibe : "fun",
    interests: input.interests.map((interest) => interest.trim().slice(0, 40)).filter(Boolean).slice(0, 8),
    alreadyShown: input.alreadyShown.map((title) => title.slice(0, 120)).slice(-30),
  };
  if (answers.categories.length === 0) return { suggestions: [], source: "backup" };

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && (await hasAiRunsLeft(user.id))) {
    try {
      await db.insert(quizRuns).values({ userId: user.id });
      const ideas = await fetchAiIdeas(answers, apiKey);
      return { suggestions: ideas.map(ideaToSuggestion), source: "ai" };
    } catch (error) {
      console.error("Gift finder fell back to the backup list:", error);
    }
  }
  return { suggestions: backupSuggestions(answers), source: "backup" };
}

export type SaveResult = { ideaId?: number; personId?: number; error?: string };

export async function saveSuggestionAction(input: {
  personId: number | null;
  newPersonName: string;
  interests: string[];
  giftFor: string;
  occasion: string;
  suggestion: Suggestion;
}): Promise<SaveResult> {
  const user = await requireUser();
  const { suggestion } = input;

  // The browser sends this back, so re-check it rather than trusting it.
  const category = (await listCategories()).find((c) => c.name === suggestion.category);
  if (!category || !suggestion.title.trim() || !isTrustedUrl(suggestion.link)) {
    return { error: "That suggestion couldn’t be saved. Try another one." };
  }

  let personId = input.personId;
  if (personId) {
    if (!(await getPerson(user.id, personId))) return { error: "Pick someone from your list." };
  } else {
    const name = input.newPersonName.trim().slice(0, 100);
    if (!name) return { error: "Who’s this for? Add a name first." };
    const person = await createPerson(user.id, {
      name,
      interests: input.interests.join(", ") || null,
      giftFor: GIFT_FOR.includes(input.giftFor) ? input.giftFor : "no preference",
    });
    personId = person.id;
  }

  const idea = await createIdea(user.id, {
    personId,
    categoryId: category.id,
    title: suggestion.title.trim().slice(0, 200),
    price: Number.isFinite(suggestion.price) && suggestion.price > 0 ? suggestion.price.toFixed(2) : null,
    link: suggestion.link,
    imageUrl: suggestion.imageUrl?.startsWith("https://") ? suggestion.imageUrl : null,
    store: suggestion.store.slice(0, 100),
    occasion: QUIZ_OCCASIONS.some((o) => o.id === input.occasion) ? input.occasion : "birthday",
    status: "idea",
    source: "suggested",
    notes: suggestion.whyItFits.slice(0, 500),
    boughtOn: null,
  });
  if (!idea) return { error: "Pick someone from your list." };

  revalidatePath("/", "layout");
  return { ideaId: idea.id, personId };
}
