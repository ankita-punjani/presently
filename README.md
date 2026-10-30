# Presently 🎀

**The right present, right on time.** Save gift ideas for your people all year, and never miss a birthday.

**Live app:** https://presently-sand.vercel.app

## What it does
Create a free account and build your own gift tracker:
- Add the people you shop for, with their birthday, budget and interests
- Save gift ideas for each person, sorted into categories, and track them from idea → bought → given
- Everything is private: you only ever see your own data

More features are on the way. See the numbered list in [PLAN.md](PLAN.md).

## Tools
| Tool | What it's for |
|---|---|
| Next.js + TypeScript | Pages and server code |
| Tailwind CSS | Styling |
| Neon Postgres | Database |
| Drizzle ORM | Tables and queries in TypeScript |
| Better Auth | Sign up, log in, log out |
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

## How it was built
Every change went through an Issue, a branch and a pull request. Nothing is committed directly to `main`. The plan is in [PLAN.md](PLAN.md) and the key AI prompts are in [prompts/](prompts/).
