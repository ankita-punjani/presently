# Prompt log: Feature #6, find things

Agent: Claude Code. Branch: `feature/find-things`. Issue: #17.

## Prompt
> **Me:** yes go ahead and dont ask again, make the whole web app ready as per assignment details requiremets (eg- align to # PRs required, other details, etc.)- be thorough

The brief for this feature was the user story in PLAN.md #6.

## What the agent did
- **Search** across title, store and notes, not just title, so "target" finds gifts from Target.
- **Filters** for person, category and status, and **sort** by newest, price both ways, or soonest birthday.
- **Filters live in the URL**, so a reload or the back button keeps them.
- **Separate empty states:** "Nothing matches that" is different from having no ideas at all.
- **`src/lib/dates.ts`:** a shared "today" in Pacific time, plus birthday counting, used here and by the countdown in feature #9.

## Decisions worth noting
- Ideas with no price sort last in both directions, so unknown prices don't look like the cheapest.
- Typing waits 300ms for a pause, so each letter isn't a database query.

## Bugs caught
- **Wildcards:** in a database search, `%` means "anything", so searching `%` would have matched every idea. It's now escaped, so it's treated as plain text.
- **Timezone:** "today" was in UTC, so after 4pm Pacific a purchase would have been dated tomorrow. Dates now use Pacific time.

## How it was checked (browser + `dev` database, with 6 test ideas)
- `mat` → Matcha kit; `TARGET` → Ceramic mug (case-insensitive, store search) ✅
- `%` and `zzz` → "Nothing matches that" ✅
- Status and category filters, alone and combined with sort ✅
- Price low→high, high→low and soonest birthday all ordered correctly ✅
- Bad URL values (`person=abc&status=hack`) are ignored ✅
- Real controls: typing updates the URL, the dropdown sorts, Clear filters resets ✅
