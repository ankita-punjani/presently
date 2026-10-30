# Prompt log: PLAN.md

Agent: Claude Code. These are my key prompts while choosing the idea and writing the plan, with what the agent did in response.

## 1. Finding an idea
> **Me:** help me with this! first i need an idea. *(pasted the assignment brief)*

**Agent:** Suggested a VC "Deal Flow Journal", a recruiting tracker, and coffee/study spot rankings.

> **Me:** no tell something else non-work related, something like egg boiler time it's cute

**Agent:** Pointed out that a timer alone can't meet the spine (no CRUD, stars, dashboard), and reshaped it into an egg journal with a built-in timer. Also suggested a boba diary, plant tracker, bake book, and movie nights.

> **Me:** no suggest something else which is useful

**Agent:** Subscription tracker, Gift Keeper, fridge/pantry tracker, closet tracker, warranty keeper.

> **Me:** I think everyone would be doing a subscription tracker... I want my idea to be unique.

**Agent:** Friend-recommendation tracker, "Last time I…", "Where did I put it?", lent and borrowed. Then another round: skincare reaction detective, packing list, outfit repeat checker, price memory, caffeine vs. sleep.

> **Me:** 🎁 Gift Keeper... i like this. also want to add what would be good gift recommendations with a link to buy next to it

**My decision:** a gift tracker with recommendations.

## 2. Shaping the features
> **Me:** maybe before asking for suggestions have a few filters- what category do they want (clothes, skincare, gaming, etc. segregated by gender first actually) - basically ask 3-5 prelim questions before making recommendations

**Agent:** Designed a 5-question quiz. It suggested making the gender question optional ("him / her / them / no preference"), and I agreed. Quiz categories became the `categories` table.

> **Me:** i want theme to be cool fun, not formal. also add option where people can build their own trackers so like a login by email or phone page whichever is free... name something better than "gift keeper". for link recommendation: make sure links are from credible websites. also have images when you pop recommendations

**Agent:** Named it **Presently**. Explained that phone/SMS login costs money, so used email + password. Proposed a Google Shopping search API + a trusted-store whitelist for real photos and links, because an AI writing URLs directly tends to make up links that don't work.

## 3. Writing the plan
> **Me:** i like presently - have a 1 line sub title to justify what presently means. i dont want to spend any money so be careful. so add all features possible even optional ones like login via gmail but nothing which requires money. go ahead with the best plan.md now!

**Agent:** Wrote PLAN.md. Switched AI ideas from the Claude API (paid) to the Gemini free tier, and used Serper.dev's free credits for shopping results. Added Google sign-in and 5 free bonus features, with a cut order.

> **Me:** for [the $0 rule] say because i see people spending so much time so i wanna simplify and make this free for others to use. rest all is good

**Agent:** Rewrote that line in the pitch.
