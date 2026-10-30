# Prompt log: Feature #1, sign up / log in / log out

Agent: Claude Code. Branch: `feature/auth`. Issue: #3.

## Prompt
> **Me:** yes *(go ahead with feature #1: open the issue, create `feature/auth`, set up the app with the Presently theme, add email/password login)*

Context the agent already had from PLAN.md: Next.js + Neon + Drizzle + Better Auth, email + password (8+ chars), $0 rule, cream/pink/tangerine/lime sticker theme, Bricolage Grotesque + DM Sans.

## What the agent did
1. **New Neon project `presently`** (free tier), separate from my Assignment 1 project, so this app's users and data stay on their own.
2. **Scaffolded Next.js 15** (TypeScript, Tailwind v4, App Router) in a scratch folder and copied it in, because `create-next-app` refuses to run in a folder that already has PLAN.md.
3. **Login tables** in `src/db/schema.ts` → migration `drizzle/0000_auth_tables.sql`: `users`, plus Better Auth's `sessions`, `accounts` (holds the hashed password), `verifications`. Used `usePlural: true` so the table is called `users` like my plan, not Better Auth's default `user`.
4. **Better Auth** (`src/lib/auth.ts`): email + password, minimum 8 characters, signs you in right after sign-up. `requireUser()` helper for protected pages.
5. **Middleware**: no session cookie → `/dashboard`, `/people`, `/ideas`, `/starred` redirect to `/login`.
6. **Pages:** landing (`/`), `/signup`, `/login`, `/dashboard` (placeholder with "No one to shop for? Suspicious. 👀"), Log out button in the nav.
7. **Friendly errors:** blank name / bad email / short password are checked before sending, and Better Auth error codes become messages like "That email already has an account. Try logging in instead?"

## Bugs caught along the way
- **Tailwind v4 `@apply` error:** the agent first wrote `.btn-pink { @apply btn … }` inside `@layer components`. Tailwind v4 can only `@apply` real utilities, so it switched the sticker/button/field styles to `@utility` blocks before the first build.
- **Wrong branch pushed on repo creation:** `gh repo create --push` pushed `docs/plan` (the checked-out branch) instead of `main`. Caught by checking `git ls-remote`, fixed by pushing `main` and setting it as the default branch before opening PR #2.

## How it was checked (in the browser, against the real Neon database)
- Logged out → visiting `/dashboard` redirects to `/login` ✅
- Empty sign-up form → three friendly field errors ✅
- Sign up as a test user → lands on "Hey Test ✨" dashboard; a `users` row + `credential` account with a **hashed** password appears in Neon ✅
- Log out → back to `/`, and `/dashboard` redirects to `/login` again ✅
- Wrong password → "That email and password don't match. Try again?" ✅
- Right password → back on the dashboard ✅
