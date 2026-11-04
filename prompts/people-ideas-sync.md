# Prompt log: People and ideas in sync

Agent: Claude Code. Branch: `fix/people-ideas-sync`.

## Prompt
> **Me:** ideas and people are not synced. for ideas page when it asks who is it for, it should give option to add someone

## What the agent found
The database itself was consistent: every idea belonged to the right person on the right account. The problem was what the pages showed:
1. Saving only refreshed one section of the app, so other pages, especially after pressing Back, could show an old list until a reload.
2. The People page didn't show anyone's ideas, so the two pages looked unrelated.

## What the agent did
- **"➕ Someone new…"** in the idea form's "Who's it for?" dropdown. It asks for a name, and saving creates the person and the idea together.
- **No people yet?** The form opens straight on "Someone new", rather than sending you away to add a person first.
- **People cards** show "💡 4 ideas · 🛍️ 1 bought".
- **Every save refreshes the whole app**, not just one section.

## How it was checked (browser + `dev` database)
- "Someone new" with a blank name → "Who's it for? Type their name.", and the title and category are kept ✅
- With a name → the idea saves under the new person ✅
- People page shows "💡 1 idea" for both people ✅
- All automated tests pass ✅
