# Prompt log: Remove the Budgets tab (stranger test)

Agent: Claude Code. Branch: `stranger/remove-budgets`. Issue: #76.

## Prompt
> **Me (stranger test feedback):** remove budget tab its not serving main purppose to icea of presently

## Decision: mine, from the stranger test
Presently is about remembering people and finding the right gift. Season budgets were a separate money tool, and my tester didn't see why they were there. A person's own budget stays, because the gift quiz uses it to pick a price range.

## What the agent did
- Removed the Budgets tab, its pages, the form and the queries. Visiting `/budgets` now shows the 404 page.
- The dashboard shows this calendar year's gifting, without the budget card.
- The getting-started checklist asks you to add a birthday rather than set a budget.
- The landing page shows "Birthday calendar" in place of "Budget tracker".
- **The `budgets` table is kept** rather than deleting data from the live database.

## The dashboard test had to change
The required dashboard test depended on a budget. Its Given is now: four gifts this year ($20 bought, $30 given, $50 bought, $100 still an idea) plus $75 bought **last year**. The expected total is still $100.00 and the average $33.33. The agent redid red/green: replacing the filter with `const spent = rows` gave **275 instead of 100**, and restoring it passed.

## How it was checked
Browser: no Budgets tab, `/budgets` is a 404, and the checklist and dashboard show correctly. All 60 automated tests pass.
