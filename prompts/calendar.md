# Prompt log: Bonus #15, birthday calendar

Agent: Claude Code. Branch: `feature/calendar`. Issue: #37.

## Prompt
> **Me:** yes go ahead and dont ask again, make the whole web app ready as per assignment details requiremets (eg- align to # PRs required, other details, etc.)- be thorough

The brief was PLAN.md #15.

## What the agent did
- Month grid at `/calendar` with birthdays on the right days and today highlighted.
- Previous, next and Today buttons. The month is in the URL.
- On phones the grid shows 🎂 markers, and names are in the list underneath.

## How it was checked (browser + `dev` database)
- Nov 1, 2026 lands on a Sunday ✅
- Feb 29 birthday: Mar 1 in 2027, Feb 29 in 2028 ✅
- `month=garbage` and `month=2026-13` fall back to this month ✅
