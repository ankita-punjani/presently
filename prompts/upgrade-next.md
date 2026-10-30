# Prompt log: Upgrade Next.js

Agent: Claude Code. Branch: `fix/upgrade-next`. Issue: #5.

## Prompt
> **Me:** done *(I logged in to Vercel so the agent could deploy)*

## What went wrong
The agent's first production deploy failed: Vercel refused it with "Vulnerable version of Next.js detected, please update immediately."

**Cause:** the agent pinned `create-next-app@15.5.4` when it scaffolded the app in feature #1, without checking that this was an old, unpatched version. `npm audit` showed a **critical** vulnerability in it. `npm run build` passed locally, so nothing caught this until Vercel did.

## What the agent did
- Upgraded `next` and `eslint-config-next` to 15.5.28 and `react` / `react-dom` to 19.1.10 (patch updates, same major version).
- Ran `npm audit fix` (no `--force`), which also updated `sharp`.
- Critical: 1 → 0.

## What's left, and why it's OK for now
- `postcss` (high, inside Next.js) and `next` (moderate, because of that postcss). The only fix on offer is Next 16, a major upgrade. Next.js uses this copy of postcss to process CSS, and this app only feeds it its own CSS files, not anything users type.
- `drizzle-kit`, `esbuild` and `@esbuild-kit/*` (moderate). These are command-line tools used on my machine for database migrations and are not part of the deployed app.

## How it was checked
- `npm run lint` and `npm run build` pass.
- Restarted the dev server on the new version: logged-out `/dashboard` redirects to `/login`, wrong password returns 401, right password returns 200 and loads the dashboard.
