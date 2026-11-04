# Prompt log: AI store fix

Agent: Claude Code. Branch: `fix/ai-store`. Issue: #67.

## Prompt
> **Me:** works now *(screenshot: "Ideas for Rohan", "Picked just for them", and every pick linking to Nordstrom)*

## Bug: what happened, how it was noticed, how it was fixed
**What happened:** AI ideas took their store from the category, so every "Clothes & accessories" pick went to Nordstrom, even a sneaker book.

**How it was noticed:** the agent spotted it in my screenshot of the first working AI result.

**How it was fixed:** Gemini now picks a store for each gift, limited to the trusted list by the response schema. The app double-checks the pick, and falls back to the category's store if it's missing or not trusted.

## How it was checked
New test: a trusted store is used, while an untrusted or missing one falls back. All gift-finder checks pass.
