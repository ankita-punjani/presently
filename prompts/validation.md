# Prompt log: Feature #4, validation

Agent: Claude Code. Branch: `feature/validation`. Issue: #13.

## Prompts
> **Me:** yes go ahead

The brief was the user story in PLAN.md #4.

> **Me:** add 2 dummy people data yourself then i'll add 5

The agent added Maya (demo) and Leo (demo) directly to my account. They're labeled "(demo)" so I can tell them apart from my 5 real entries.

## What the agent did
1. **Rules in one file** (`src/lib/validation.ts`): required fields, length limits, money must be 0 to under $1,000,000, no future birthdays, link check.
2. **Checks run on the server** through `useActionState`, so they still apply if someone bypasses the browser. The forms use `noValidate` so my friendly messages replace the browser's popups.
3. **Message next to each field**, plus a "3 things need fixing" banner by the button, because on a phone the errors can be far above it.
4. **A failed save keeps what you typed.**

## Bugs caught
- **Silent data loss from feature #3:** a bad link was dropped without telling me. It now shows a message and keeps what I typed.
- **Dropdowns lost their selection after a failed save.** React's form reset puts a dropdown back to its original default, even though the text fields kept their values. The fix is a `key` on the form, so it remounts with the submitted values.
- **Regression I noticed in a screenshot:** the shared field styling dropped `capitalize`, so "coworker" showed in lowercase. Restored.
- **Huge amounts:** the database column can't hold very large numbers, which would have crashed the save. The $1,000,000 limit gives a friendly message.

## How it was checked (browser + real Neon database, local test account)
- Blank name + future birthday + negative budget → 3 messages + banner ✅
- Typed values and the dropdown are kept after the failed save ✅
- Fix the mistakes → saves ✅
- Blank title, person and category + $5,000,000 + `javascript:` link → 5 messages ✅
- Blank name on the edit form → message, and the saved name doesn't change ✅
- **Two-account test:** logged in as the test user, tampered with the form to attach an idea to a person on my real account → refused with a friendly message, 0 ideas created ✅
- Lint, build, no server errors ✅
