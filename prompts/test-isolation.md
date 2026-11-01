# Prompt log: Feature #8, data isolation test

Agent: Claude Code. Branch: `test/data-isolation`. Issue: #21.

## Prompt
> **Me:** yes go ahead and dont ask again, make the whole web app ready as per assignment details requiremets (eg- align to # PRs required, other details, etc.)- be thorough

The brief was the Given/When/Then in PLAN.md Section 4, and the assignment's red-then-green requirement.

## What the agent did
- **Real sign-ups, real pages:** the test starts the actual app on port 3100, signs up two accounts through the real sign-up endpoint, and loads pages with each user's login cookie, as a browser would.
- **Went further than my plan:** besides lists and the 404, it also checks that User B can't edit, delete, star, or attach to User A's data.
- **A positive check first:** User A must see their own data, so a broken page can't pass by showing nothing at all.
- **Safety guard:** `tests/load-env.ts` refuses to run if `.env.test` points at the production database.

## Red, then green
The agent removed the `userId` filter from `listIdeas` and `getIdea` on purpose and ran the test: 2 of 4 failed. It restored the code (`git diff` was empty) and all 4 passed.

## Problems along the way
- **`vitest` wouldn't install:** it needs a newer `@types/node`, so that moved from 20 to 22.
- **The break didn't fail everything, which was expected:** "User B can't change..." still passed, because update and delete have their own filters. That's a good sign that the protection is layered.
- **Screenshots:** a local web server for rendering them was blocked by a permission rule, so the agent used headless Chrome on the file directly. The images are the real test output.
