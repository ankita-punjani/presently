# Prompt log: Design pass

Agent: Claude Code. Branch: `feature/design-pass`. Issue: #47.

## Prompt
> **Me:** I think the site is still very underdeveloped. Make sure you have all the features and PRs as required. Also, overall, the site should look very attractive and catchy, nicely loaded with features.

## What the agent did
- **Landing page:** floating gift stickers, example gift cards, a scrolling ticker, How it works, a feature grid and a closing call to action.
- **Header:** the current page is highlighted, "Find a gift 🔮" stands out, and links scroll sideways on phones.
- **Dashboard:** quick action buttons at the top.
- **People cards:** colorful initial bubbles.
- **Extras:** polka-dot background, a gift favicon, a footer, and a custom "Nothing in this box" 404 page.
- **Animations** switch off for people whose device asks for reduced motion.

## Decision worth noting
The agent didn't add fake testimonials or user counts. The example cards use my real demo gifts instead.

## How it was checked
Landing page on desktop and at 500px wide with headless Chrome, people page at 390px wide with no sideways scrolling, and the 404 page in the browser.
