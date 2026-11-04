# Prompt log: Gemini fallback models

Agent: Claude Code. Branch: `fix/gemini-fallback-models`. Issue: #65.

## How we got here
- First quiz run: the key was rejected (`400`). A checker script showed I'd pasted a sign-in token, not the API key.
- With the right key re-added and redeployed, the next run hit `503: This model is currently experiencing high demand`. That's Google's free model being busy, not a bug in the app.

> **Me:** *(screenshot of the quiz still saying "Hand-picked from the Presently gift list")*

## What the agent did
- The quiz now tries Google's free models in order: `gemini-3.6-flash`, then `gemini-3.5-flash-lite`, then `gemini-3.1-flash-lite`. It moves on when a model is busy (503), rate-limited (429), errors (500), unavailable (404) or times out.
- A bad key (400) stops immediately, rather than trying every model with it.
- Each model gets 7 seconds.
- Falling back to the hand-picked list is logged as a warning, not an error, because the user still gets good results.

## How it was checked
New tests: a busy model hands off to the next one, and a bad key stops after one call. All 43 gift-finder checks pass.

**Not tested:** the model chain against the real API. Needs one quiz run on the live site after deploy.
