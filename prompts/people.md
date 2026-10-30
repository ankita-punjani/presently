# Prompt log: Feature #2, People

Agent: Claude Code. Branch: `feature/people`. Issue: #7.

## Prompt
> **Me:** done *(after logging in to Vercel; the agent had already said it would move on to feature #2 next)*

The brief was the user story in PLAN.md #2 and the `people` table in Section 3.

## What the agent did
1. **`people` table** (migration `drizzle/0001_people.sql`): one user has many people. Deleting a user deletes their people.
2. **Queries in one file** (`src/db/queries/people.ts`): every function takes `userId` and filters on it, including update and delete. The data isolation test (#8) will exercise these.
3. **Pages:** `/people` list, `/people/new`, `/people/[id]` detail, `/people/[id]/edit`, plus a People link in the nav.
4. **Delete popup:** a native `<dialog>` asking "Delete Test Priya? Are you sure?". Esc closes it too.
5. **Dashboard** now shows how many people you're shopping for, or the empty state with an Add someone button.

## Decisions worth noting
- **Real validation waits for feature #4.** For now the name field uses the browser's built-in `required` check, so there are no friendly messages yet.
- **Different from my plan:** PLAN.md says the birthday year is optional, but the date picker needs a full date. If you don't know someone's birth year, pick any year: only the month and day are shown. This goes in Plan vs. Reality.

## Bugs caught
- **`"use server"` file exporting constants:** the agent first put `RELATIONSHIPS` and `GIFT_FOR` in `actions.ts`, but those files may only export async functions. Moved them to `src/lib/people-options.ts`.
- **Bad URLs:** without a check, `/people/abc` would reach the database as a non-number and error. `parseId()` turns those into a normal 404.
- **Birthdays shifting a day:** dates are formatted in UTC, so Nov 4 stays Nov 4 in any timezone.

## How it was checked (browser + real Neon database)
- Empty state appears with no people ✅
- Add a person → lands on their page, Nov 4 birthday and interests display correctly ✅
- Edit form is pre-filled; changing the budget to $75 saves ✅
- `/people/abc` and `/people/999` show 404 ✅
- Delete → popup appears; "Keep them" closes it and changes nothing ✅
- "Yes, delete" → back to the list, and 0 rows remain in Neon ✅
- Lint and build pass; no 500s in the server log ✅
