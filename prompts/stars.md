# Prompt log: Feature #5, stars

Agent: Claude Code. Branch: `feature/stars`. Issue: #15.

## Prompt
> **Me:** yes go ahead and dont ask again, make the whole web app ready as per assignment details requiremets (eg- align to # PRs required, other details, etc.)- be thorough

The brief for this feature was the user story in PLAN.md #5 and the `stars` table in Section 3.

## What the agent did
- **`stars` junction table** (`drizzle/0003_stars.sql`): each row is "this user starred this idea". The primary key is the pair (user, idea), so an idea can't be starred twice.
- **Star button** on every idea card and idea page, which updates instantly and then saves.
- **Starred page** at `/starred`.
- **Nav** now wraps to a second row on phones, since more links are coming.
- **Separate database branches:** the agent created Neon `dev` and `test` branches, so local testing no longer touches the real data on the live site.

## Bugs caught
- **Nested clickable elements:** the whole idea card was a link, and a button inside a link is invalid HTML. The star now sits beside the link, not inside it.
- **Hard-to-see star:** a yellow star on a lime circle was too low-contrast, so the lit state is pink.

## How it was checked (browser + `dev` database, local test account)
- Star two ideas → both show as starred ✅
- `/starred` lists exactly those two ✅
- Unstar one → it leaves the page, and one row remains in `stars` ✅
- Lint and types pass ✅
