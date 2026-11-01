# Prompt log: Feature #11, gift-finder quiz

Agent: Claude Code. Branch: `feature/gift-finder`. Issue: #29.

## Prompts
> **Me:** yes go ahead and dont ask again, make the whole web app ready as per assignment details requiremets (eg- align to # PRs required, other details, etc.)- be thorough

The brief was PLAN.md #11 and my earlier asks: 3 to 5 questions before recommending, categories, him / her, and credible links.

## What the agent did
- **5-step quiz** with big tappable cards, a progress bar and a "Shaking the gift box…" loading screen.
- **Starts from a person:** "Find a gift 🔮" on their page skips question 1 and pre-fills their budget and preference.
- **"Someone new":** saving a gift creates the person too.
- **AI ideas** from Gemini's free tier when `GEMINI_API_KEY` is set, limited to 10 runs per user per day.
- **86 hand-picked backup gifts** for when there's no key, the API fails, or the limit is reached, so the quiz always works.

## Decisions worth noting
- **Different from my plan:** PLAN.md named `gemini-2.5-flash`. The current pricing page lists newer free models, so the default is `gemini-3.6-flash`, changeable with `GEMINI_MODEL`.
- **New table:** `quiz_runs` counts AI runs for the daily limit. It wasn't in my plan.
- **Privacy:** only quiz answers and interests go to the AI, never names, birthdays or notes. On Google's free tier, prompts may be used to improve their products.

## Bugs caught
- **"Show me more" repeated the same five gifts**, because the score differences outweighed the random shuffle. The quiz now tracks what's been shown and skips it.
- **Thin results:** "Under $25" with one category returned just 1 gift, which would look broken in a demo. The list grew from 42 to 86, and a test now checks every category and budget gets 5.
- **Tampered saves:** the browser sends the suggestion back when saving, so the server re-checks the category and that the link is a trusted store.

## How it was checked
- Browser: all 5 steps, the "pick something" errors, the 3-category limit, pre-filled budget, Save, Show me more, and "someone new" creating a person.
- 28 automated checks in `tests/gift-finder.test.ts`.

**Not tested:** the real Gemini API, because there's no key yet. Those checks use a fake Gemini reply built from Google's docs, so the first real run still needs checking.
