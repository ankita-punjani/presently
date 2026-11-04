# Prompt log: Getting started checklist

Agent: Claude Code. Branch: `feature/getting-started`.

## Prompt
> **Me:** please complete this app everything you need from assignment pov for a+ grade submission so comlete all of it before tomorrow

## Why this feature
The stranger test and the live sign-up at Solo Demo Day both start from an empty account. Without guidance, a new user sees a dashboard with one "add someone" card and has to guess what else the app does. A checklist shows the main features in order.

## What the agent did
- 5 steps on the dashboard: add a person, save an idea (or use the quiz), star one, set a budget, add a wish.
- Each step ticks off from real data in the database, and links to where you do it.
- A progress bar, and the whole card disappears when all 5 are done.

## How it was checked
Browser and `dev` database, with a brand-new local account: 0 of 5, then ticking off steps updates the count and progress bar.
