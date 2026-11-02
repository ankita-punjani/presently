# Prompt log: One-tap status and confetti

Agent: Claude Code. Branch: `feature/quick-status`.

## Prompt
> **Me:** Also, overall, the site should look very attractive and catchy, nicely loaded with features.

PLAN.md Section 6 promised confetti when a gift is marked Given, using `canvas-confetti`.

## What the agent did
- Idea, Bought and Given buttons on each idea page, so changing status no longer means opening the edit form.
- Confetti in the app's colors when a gift is marked Given. It's skipped for people whose device asks for reduced motion.
- Reuses the same bought-date rule as the edit form, so the dashboard stays right.

## How it was checked
Browser and `dev` database: Bought sets the date, Given keeps that date, and back to Idea clears it.
