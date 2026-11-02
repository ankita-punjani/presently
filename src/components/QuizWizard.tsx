"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { findGiftsAction, saveSuggestionAction, type QuizResult } from "@/app/quiz/actions";
import type { Suggestion } from "@/lib/gift-finder";
import { splitInterests } from "@/lib/format";
import { GIFT_FOR } from "@/lib/people-options";
import { BUDGETS, QUIZ_OCCASIONS, VIBES } from "@/lib/quiz-options";
import { SuggestionCard } from "./SuggestionCard";

type QuizPerson = { id: number; name: string; interests: string | null; giftFor: string; budget: string | null };
type QuizCategory = { name: string; emoji: string };

type Props = { people: QuizPerson[]; categories: QuizCategory[]; startPersonId?: number };

const STEPS = 5;
const MAX_CATEGORIES = 3;

function budgetIdFor(amount: string | null) {
  if (!amount) return "";
  return BUDGETS.find((budget) => Number(amount) <= budget.max)?.id ?? "300-plus";
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`sticker px-4 py-4 text-left font-semibold capitalize transition hover:-rotate-1 ${selected ? "bg-lime" : ""}`}
    >
      {children}
    </button>
  );
}

export function QuizWizard({ people, categories, startPersonId }: Props) {
  const start = people.find((person) => person.id === startPersonId);
  const [step, setStep] = useState(start ? 1 : 0);
  const [personId, setPersonId] = useState<number | null>(start?.id ?? null);
  const [isNew, setIsNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [interestText, setInterestText] = useState(start?.interests ?? "");
  const [giftFor, setGiftFor] = useState(start?.giftFor ?? "no preference");
  const [picked, setPicked] = useState<string[]>([]);
  const [budgetId, setBudgetId] = useState(budgetIdFor(start?.budget ?? null));
  const [occasion, setOccasion] = useState("");
  const [vibe, setVibe] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<QuizResult | null>(null);
  const [shown, setShown] = useState<string[]>([]);
  const [isFinding, startFinding] = useTransition();

  const person = people.find((p) => p.id === personId);
  const interests = splitInterests(interestText);
  const displayName = isNew ? newName.trim() : person?.name;

  function choosePerson(id: number) {
    const chosen = people.find((p) => p.id === id)!;
    setPersonId(id);
    setIsNew(false);
    setGiftFor(chosen.giftFor);
    setBudgetId(budgetIdFor(chosen.budget));
    setInterestText(chosen.interests ?? "");
    setError("");
  }

  function toggleCategory(name: string) {
    setError("");
    setPicked((current) => {
      if (current.includes(name)) return current.filter((item) => item !== name);
      return current.length < MAX_CATEGORIES ? [...current, name] : current;
    });
  }

  const missing = [
    !personId && !newName.trim() ? "Pick someone, or type a name." : "",
    "",
    picked.length === 0 ? "Pick at least one category." : "",
    !budgetId ? "Pick a budget." : "",
    !occasion || !vibe ? "Pick an occasion and a vibe." : "",
  ][step];

  function find() {
    startFinding(async () => {
      const found = await findGiftsAction({
        giftFor,
        categories: picked,
        budgetId,
        occasion,
        vibe,
        interests,
        alreadyShown: shown,
      });
      setResult(found);
      setShown([...shown, ...found.suggestions.map((suggestion) => suggestion.title)]);
    });
  }

  function next() {
    if (missing) return setError(missing);
    setError("");
    if (step === STEPS - 1) find();
    else setStep(step + 1);
  }

  async function save(suggestion: Suggestion) {
    const saved = await saveSuggestionAction({
      personId,
      newPersonName: newName,
      interests,
      giftFor,
      occasion,
      suggestion,
    });
    // A new person now exists, so later saves attach to them.
    if (saved.personId && !personId) {
      setPersonId(saved.personId);
      setIsNew(false);
    }
    return saved;
  }

  if (isFinding) {
    return (
      <div className="sticker mx-auto mt-10 max-w-md bg-lilac/40 p-10 text-center" role="status">
        <p className="animate-bounce text-6xl" aria-hidden>🎁</p>
        <p className="mt-4 font-display text-2xl font-bold">Shaking the gift box…</p>
        <p className="mt-1 text-ink/70">Finding things {displayName} will love.</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="pt-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Ideas for {displayName} 🔮
        </h1>
        <p className="mt-2 text-ink/70">
          {result.source === "ai" ? "Picked just for them." : "Hand-picked from the Presently gift list."}
          {" "}Every link goes to a store you can trust.
        </p>

        {result.suggestions.length === 0 ? (
          <div className="sticker mt-8 p-8 text-center">
            <p className="font-display text-2xl font-bold">Nothing fits that budget yet.</p>
            <p className="mt-1 text-ink/70">Try a bigger budget or another category.</p>
          </div>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.suggestions.map((suggestion) => (
              <li key={suggestion.title}>
                <SuggestionCard
                  suggestion={suggestion}
                  emoji={categories.find((c) => c.name === suggestion.category)?.emoji ?? "🎁"}
                  onSave={save}
                />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={find} className="btn-pink">Show me more 🎲</button>
          <button type="button" onClick={() => { setResult(null); setShown([]); }} className="btn-plain">Change my answers</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl pt-6">
      <p className="text-sm font-bold">Question {step + 1} of {STEPS}</p>
      <div
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={1}
        aria-valuemax={STEPS}
        aria-valuenow={step + 1}
        className="mt-2 h-4 overflow-hidden rounded-full border-2 border-ink bg-white"
      >
        <div className="h-full bg-pink transition-all" style={{ width: `${((step + 1) / STEPS) * 100}%` }} />
      </div>

      {step === 0 && (
        <section className="mt-6">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">Who’s the gift for? 🎁</h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {people.map((p) => (
              <Choice key={p.id} selected={personId === p.id && !isNew} onClick={() => choosePerson(p.id)}>
                <span className="normal-case">{p.name}</span>
              </Choice>
            ))}
            <Choice selected={isNew} onClick={() => { setIsNew(true); setPersonId(null); setInterestText(""); setError(""); }}>
              ✨ Someone new
            </Choice>
          </div>
          {isNew && (
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="new-name" className="label">Their name</label>
                <input id="new-name" className="field" placeholder="Priya" value={newName} onChange={(e) => { setNewName(e.target.value); setError(""); }} />
              </div>
            </div>
          )}
        </section>
      )}

      {step === 1 && (
        <section className="mt-6">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">Shopping for…</h1>
          <p className="mt-2 text-ink/70">This one’s optional. It only helps narrow things down.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {GIFT_FOR.map((option) => (
              <Choice key={option} selected={giftFor === option} onClick={() => setGiftFor(option)}>{option}</Choice>
            ))}
          </div>
          <div className="mt-6">
            <label htmlFor="interests" className="label">What are they into right now?</label>
            <input
              id="interests"
              className="field"
              placeholder="perfume, cooking, Zara, gadgets, spa days"
              value={interestText}
              onChange={(e) => setInterestText(e.target.value)}
            />
            <p className="mt-1 text-sm text-ink/60">The more specific you are, the better the ideas. Separate with commas.</p>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="mt-6">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">What kind of gift?</h1>
          <p className="mt-2 text-ink/70">Pick up to {MAX_CATEGORIES}.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {categories.map((category) => (
              <Choice key={category.name} selected={picked.includes(category.name)} onClick={() => toggleCategory(category.name)}>
                <span className="normal-case">{category.emoji} {category.name}</span>
              </Choice>
            ))}
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="mt-6">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">What’s the budget? 💸</h1>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {BUDGETS.map((budget) => (
              <Choice key={budget.id} selected={budgetId === budget.id} onClick={() => { setBudgetId(budget.id); setError(""); }}>
                {budget.label}
              </Choice>
            ))}
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="mt-6">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">What’s the occasion?</h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {QUIZ_OCCASIONS.map((option) => (
              <Choice key={option.id} selected={occasion === option.id} onClick={() => { setOccasion(option.id); setError(""); }}>
                {option.emoji} {option.id}
              </Choice>
            ))}
          </div>
          <h2 className="mt-8 font-display text-3xl font-extrabold tracking-tight">And the vibe?</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {VIBES.map((option) => (
              <Choice key={option.id} selected={vibe === option.id} onClick={() => { setVibe(option.id); setError(""); }}>
                {option.emoji} {option.label}
              </Choice>
            ))}
          </div>
        </section>
      )}

      {error && <p role="alert" className="mt-5 font-semibold text-pink">{error}</p>}

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={next} className="btn-pink">
          {step === STEPS - 1 ? "Find gifts 🔮" : "Next →"}
        </button>
        {step > 0 && (
          <button type="button" onClick={() => { setError(""); setStep(step - 1); }} className="btn-plain">← Back</button>
        )}
        {step === 0 && people.length === 0 && (
          <Link href="/people/new" className="btn-plain">Add a person instead</Link>
        )}
      </div>
    </div>
  );
}
