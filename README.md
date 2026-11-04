# Presently 🎀

**The right present, right on time.** Save gift ideas for your people all year, and never miss a birthday.

**Live app:** https://presently-sand.vercel.app

## What it does
Create a free account and build your own gift tracker:

- **People:** birthdays, budgets, interests and notes for everyone you shop for
- **Gift ideas:** save them by person and category, and track them from idea → bought → given, with confetti at the end 🎉
- **Gift-finder quiz:** 5 quick questions, 8 ideas that fit, each with its own sticker art and a link to a trusted store
- **Search, filter and sort** your ideas, and star your favorites
- **Dashboard:** spending stats, a chart by category, and birthday reminders
- **Calendar sync:** every birthday on a month view. Import birthdays from Google Contacts, Apple, Outlook or a calendar file, and subscribe from Google, Apple or Outlook Calendar so they show up there too.
- **Wishlist:** list what you want and share a private link
- **Gift roulette:** let fate pick when you can't decide
- **Dark mode** and a phone-friendly layout

Everything is private: you only ever see your own data.

## Tools
| Tool | What it's for |
|---|---|
| Next.js + TypeScript | Pages and server code |
| Tailwind CSS | Styling |
| Neon Postgres | Database |
| Drizzle ORM | Tables and queries in TypeScript |
| Better Auth | Sign up, log in, log out, and optional Google sign-in |
| Recharts | Dashboard chart |
| canvas-confetti | Confetti |
| Google Gemini (optional) | AI gift ideas |
| Vitest | Tests |
| Vercel | Hosting, with a new deploy on every merge to `main` |
| Claude Code | AI coding agent |

Everything runs on free tiers. See [schema.md](schema.md) for how the data is structured.

## How to run it
You'll need Node.js and a free [Neon](https://neon.tech) database.

1. Clone the repo and install:

   ```bash
   git clone https://github.com/ankita-punjani/presently.git
   cd presently
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in `DATABASE_URL` and `BETTER_AUTH_SECRET`.

3. Create the tables, including the seeded categories:

   ```bash
   npm run db:migrate
   ```

4. Start the app and open http://localhost:3000:

   ```bash
   npm run dev
   ```

**Optional keys:** without them the app still works fully. The quiz uses a hand-picked list of 316 gifts, and the Google button stays hidden. See `.env.example` for `GEMINI_API_KEY` and the Google keys.

## Tests
Tests start the real app and use a separate database, so they never touch real data. Put a test `DATABASE_URL`, `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL="http://localhost:3100"` in `.env.test`, stop any running dev server, then:

```bash
npm test
```

They cover data isolation between users, the dashboard stats, and the gift finder. Red and green screenshots are in [docs/tests](docs/tests).

## How it was built
Every change went through an Issue, a branch and a pull request. Nothing is committed directly to `main`. The plan is in [PLAN.md](PLAN.md), including Plan vs. Reality, and the key AI prompts are in [prompts/](prompts/).
