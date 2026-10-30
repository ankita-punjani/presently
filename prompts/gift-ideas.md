# Prompt log: Feature #3, gift ideas + categories

Agent: Claude Code. Branch: `feature/gift-ideas`. Issue: #9.

## Prompt
> **Me:** i just logged in check

The agent checked Neon, confirmed my live sign-up had worked, and then moved on to feature #3 as we'd agreed. The brief was the user story in PLAN.md #3 and the `categories` and `gift_ideas` tables in Section 3.

## What the agent did
1. **Two tables** (migration `drizzle/0002_gift_ideas.sql`): `categories`, seeded with my 7 categories in the migration itself, and `gift_ideas`, linked to users, people and categories.
2. **Queries** (`src/db/queries/gift-ideas.ts`): every query is limited to the logged-in user.
3. **Pages:** `/ideas` list, `/ideas/new`, `/ideas/[id]` detail, `/ideas/[id]/edit`, plus an Ideas link in the nav.
4. **Person page** now lists their gift ideas, with an "Add an idea" button that pre-selects that person.
5. **Delete popup** is now one shared `DeleteButton` for people and ideas.

## Decisions worth noting
- **`bought_on` is set automatically** the first time an idea moves to bought or given, and cleared if it goes back to idea. The dashboard's spending stats will count from this date.
- **Deleting a person also deletes their ideas** (as in my plan), so the popup now warns "Their gift ideas will go too." I hadn't thought about the warning when planning.
- **Categories can't be deleted while ideas use them**, and users can't add their own. It's a shared list.
- **`image_url` isn't on the form.** Feature #12 fills it from real product results.

## Bugs and risks caught
- **Someone else's person:** the form sends `personId`, and a tampered form could name another user's person. `createIdea` and `updateIdea` now check ownership first.
- **Dangerous links:** the link becomes a clickable button, so `javascript:alert(1)` would be a security hole. `cleanLink()` only allows http/https, and adds `https://` to links like `target.com/thing`.

## How it was checked (browser + real Neon database, with a local test account)
- No people yet → the add form asks you to add someone first ✅
- 7 categories are in the database ✅
- Add an idea from a person's page → person pre-selected, saved, detail page shows everything ✅
- `target.com/p/matcha` → saved as `https://target.com/p/matcha` ✅
- Status bought → `bought_on` set; back to idea → badge updates ✅
- `javascript:alert(1)` as a link → dropped, no Shop button ✅
- `/ideas/999` → 404 ✅
- Delete an idea through the popup → list shows the empty state ✅
- Delete a person who has an idea → the idea is gone too (0 ideas, 0 people left) ✅
- Lint, build, no server errors ✅

**Not yet tested:** the tampered-form check needs two accounts, so it goes in the data isolation test (#8).
