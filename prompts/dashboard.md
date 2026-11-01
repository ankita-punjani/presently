# Prompt log: Feature #7, dashboard

Agent: Claude Code. Branch: `feature/dashboard`. Issue: #19.

## Prompts
> **Me:** yes go ahead and dont ask again, make the whole web app ready as per assignment details requiremets (eg- align to # PRs required, other details, etc.)- be thorough

The brief for this feature was the user story in PLAN.md #7.

> **Me:** Right. Demo people: add actual details for those two people and be detailed, descriptive, and interesting in terms of showing examples of people. I think the site is still very underdeveloped. Make sure you have all the features and PRs as required. Also, overall, the site should look very attractive and catchy, nicely loaded with features.

The agent gave Maya and Leo full profiles and 8 example gift ideas on my account, and planned a separate design pass PR.

## What the agent did
- **Four stats:** total spent, average gift, gifts bought, ideas not bought yet.
- **Horizontal bar chart** of spending by category, built with Recharts, with a hover tooltip and a hidden table for screen readers.
- **`src/lib/stats.ts`:** the calculation is a pure function, so it can be tested on its own.
- **Big colorful stat cards**, inspired by Spotify Wrapped as in my plan.

## Decisions worth noting
- **Bar chart, one color:** there's one measure, so a legend or a color per category would add noise.
- **Whole cents:** money is added in cents, because `0.1 + 0.2` isn't exactly `0.3` in floating point.
- **For now "this season" means this calendar year.** Feature #10 replaces it with my real budget dates.
- A gift with no price counts in "gifts bought" but not in the average, so it can't drag the average down.

## How it was checked (browser + `dev` database, with 6 test ideas)
- By hand: $24 + $18.50 + $22 = $64.50 total, $21.50 average. The dashboard matched ✅
- The chart's bars are largest first, and the tooltip shows "Home & cozy: $24.00" ✅
- At 375px wide there's no sideways scrolling. The cards were too tall, so they now sit two across ✅
- Ideas (status idea) aren't counted as spending ✅
