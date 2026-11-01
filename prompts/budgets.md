# Prompt log: Feature #10, budget tracker

Agent: Claude Code. Branch: `feature/budgets`. Issue: #25.

## Prompt
> **Me:** yes go ahead and dont ask again, make the whole web app ready as per assignment details requiremets (eg- align to # PRs required, other details, etc.)- be thorough

The brief for this feature was my third custom feature, PLAN.md #10, and the `budgets` table in Section 3.

## What the agent did
- **`budgets` table** (`drizzle/0004_budgets.sql`) and a Budgets page to add, edit and delete them.
- **Progress bars:** lime while under 80%, tangerine near the limit, pink when over, with "$6.00 over 😬".
- **Dashboard "this season"** now means the budget running today. With no active budget it falls back to the calendar year.
- **Person pages** show spending against that person's budget.

## Decision worth noting
A person's budget counts everything ever bought for them, not just this season. Their budget is a per-person limit with no dates of its own, so this was the simplest honest version.

## How it was checked (browser + `dev` database, local test account)
- Blank name, $0 and end before start → 3 friendly messages ✅
- $40 budget, Nov 1 – Dec 31 → $46.00 of $40.00, $6.00 over ✅
- The Oct 20 gift isn't counted, because it's before the budget starts ✅
- Dashboard shows "Holidays 2026", with total $46.00 and average $23.00 ✅
