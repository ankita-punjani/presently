# Prompt log: Feature #9, birthday countdown

Agent: Claude Code. Branch: `feature/birthdays`. Issue: #23.

## Prompt
> **Me:** yes go ahead and dont ask again, make the whole web app ready as per assignment details requiremets (eg- align to # PRs required, other details, etc.)- be thorough

The brief for this feature was my first custom feature, PLAN.md #9.

## What the agent did
- **Countdown chip** on the people list and each person's page. It turns orange inside 14 days.
- **Dashboard banner** for each birthday in the next 14 days, showing how many unbought ideas are saved.
- **"Coming up" list** of the next 5 birthdays on the dashboard, which wasn't in my plan.
- **People list** now shows the soonest birthday first, and people with no birthday go last.

## Decision worth noting
The plan called these "reminders", but they're in-app only. Emails or texts would need an email service, and an in-app banner is free.

## How it was checked (browser + `dev` database, with test people)
- Birthday today → "It's X's birthday today! 🎉" ✅
- Tomorrow → "tomorrow" ✅
- 11 days away → banner and the right count, "You have 1 idea saved" ✅
- Feb 29 birthday → 120 days, landing on Mar 1 in a non-leap year ✅
- A person with no birthday → no chip, listed last ✅
