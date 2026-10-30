# Prompt log: README and schema

Agent: Claude Code. Branch: `docs/readme-schema`.

## Prompt
> **Me:** done check now before moving to next feature *(after connecting the GitHub repo to Vercel)*

The Vercel CLI reported the repo as connected, but that doesn't prove a merge triggers a deploy. The agent pointed out that `README.md` and `schema.md` were still missing, so it used them as the real test: both are required, and this PR exercises the whole path from branch to preview to production.

## What the agent did
- Wrote `README.md` with what the app does, the live URL, the tools, and how to run it.
- Wrote `schema.md` from the real tables, not the plan, and compared it with PLAN.md Section 3.
- Added `DATABASE_URL` and `BETTER_AUTH_SECRET` to Vercel's preview environment so branch builds don't fail.
