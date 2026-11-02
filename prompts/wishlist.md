# Prompt log: Bonus #14, shareable wishlist

Agent: Claude Code. Branch: `feature/wishlist`. Issue: #41.

## Prompt
> **Me:** yes go ahead and dont ask again, make the whole web app ready as per assignment details requiremets (eg- align to # PRs required, other details, etc.)- be thorough

The brief was PLAN.md #14.

## What the agent did
- **My wishlist page:** add and remove things you want for yourself.
- **Share switch:** turning it on creates a long random link. Turning it off deletes the link, so the old URL stops working.
- **Public page at `/w/<token>`:** no login needed, and it shows only a first name and the wishes.
- **Two new tables:** `wishes` and `wishlist_shares`. My plan didn't list these, because I hadn't thought about where my own wishes would live.

## Decision worth noting
This is the only page in the app anyone can see without logging in, so its query selects just the fields it needs, and search engines are told not to index it.

## How it was checked (browser + `dev` database)
- Empty wish → friendly message ✅
- Public link with no cookies → 200, shows the wish ✅
- The page contains no email and no people ✅
- A made-up token → 404 ✅
- After "Stop sharing", the old link → 404 ✅
