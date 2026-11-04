# Prompt log: Respect "shopping for" in the quiz

Agent: Claude Code. Branch: `fix/quiz-gift-for`.

## Prompts
> **Me:** maybe before asking for suggestions have a few filters- what category do they want (clothes, skincare, gaming, etc. segregated by gender first actually) - basically ask 3-5 prelim questions before making recommendations

> **Me:** please complete this app everything you need from assignment pov for a+ grade submission so comlete all of it before tomorrow

## Bug: what happened, how it was noticed, how it was fixed
**What happened:** the quiz asks "Shopping for: him / her / them / no preference", but only the AI used the answer. The hand-picked list ignored it.

**How it was noticed:** while the agent rehearsed the demo, a "her" profile into cooking, skincare and Zara was suggested gold monogram cufflinks.

**How it was fixed:** 13 clearly gendered gifts are labeled, like cufflinks or a Zara slip dress. They're skipped when the answer is the other one, and "them" and "no preference" still see everything. Most gifts have no label on purpose.

## How it was checked
New automated tests: no cufflinks or pocket squares for her, no Zara dresses or earrings for him, and everything shows for "them".
