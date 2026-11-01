# Prompt log: Dashboard test

Agent: Claude Code. Branch: `test/dashboard`. Issue: #27.

## Prompt
> **Me:** yes go ahead and dont ask again, make the whole web app ready as per assignment details requiremets (eg- align to # PRs required, other details, etc.)- be thorough

The brief was the second Given/When/Then in PLAN.md Section 4.

## What the agent did
- Used the exact numbers from my plan: $20 bought, $30 given, $50 bought, and a $100 unbought idea, inside a real "Holidays 2026" budget.
- Ran the real dashboard query against the Neon `test` branch, with a fixed "today" of Nov 15 so the test doesn't start failing after December.

## Order change from my plan
My plan put the dashboard test with feature #7, but its Given needs a budget, which didn't exist until feature #10. So this test came after #10.

## Red, then green
The agent replaced the spending filter with `const spent = rows`, so every gift counted, even unbought ones. The test failed. It restored the code (`git diff` was empty) and the test passed.
