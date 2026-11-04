# Prompt log: Quiz relevance fix

Agent: Claude Code. Branch: `fix/quiz-relevance`. Issue: #61.

## Prompt
> **Me:** why am i getting "silk pajama set" recommendation for my guy friend rohan when i ran quiz. i put sneakers and i expected things like "onitsuka sneakers, nike shoes, etc." wtf..... please check your algorithm and gift reccs how it's running

## What the agent found (from the production logs)
1. **Both API keys were rejected.** Gemini returned `400` and Serper returned `403`, so the quiz fell back to the hand-picked list and art.
2. **The fallback had a real flaw.** The list had no sneaker gifts, so "sneakers" matched nothing. Scoring then picked the best "treat"-style gifts in the category by budget and vibe alone, which is how a sneaker fan got silk pajamas.

## Who decided
This was the agent's design, and it failed silently. It only came to light because I tested it for a real friend.

## What the agent did
- **15 sneaker gifts:** Onitsuka Tiger Mexico 66, Air Force 1, Dunk Low, Jordan 1 Low, Samba OG, New Balance 550, Chuck 70, plus sneaker care, laces and a display case.
- **Trusted stores:** Nike, Adidas, New Balance and Foot Locker.
- **Ranking:** gifts that match their interests always come first, and unrelated gifts only fill leftover slots.
- **Uncovered interests:** if nothing on the list covers an interest, the quiz shows a store search for exactly that interest, never a random gift in its place.
- **Error reasons:** API errors now log the service's message, and keys are trimmed of stray spaces.
- **Fewer wasted calls:** after the first rejection from the photo search, the remaining searches are skipped.

## How it was checked
New tests:
- A sneaker fan gets real sneakers in the top 3 and never pajamas.
- All matching gifts come before unrelated ones.
- An uncovered interest like "Formula 1" gets a trusted store search.

All 39 gift-finder checks pass.
