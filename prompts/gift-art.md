# Prompt log: Gift art and no product photos

Agent: Claude Code. Branch: `feature/gift-art`. Issue: #63.

## Prompt
> **Me:** i also dont like product images coming up. make emojis/bitmojis better

## Decision: my call
I chose illustrated art over store photos. Store photos would look mismatched across stores, and the sticker style fits the app. This also removed the Serper search, so the app no longer depends on a key that was being rejected.

## What the agent did
- **Removed product photos**, including the photo search code and its tests.
- **New `GiftArt` sticker:** the gift's own emoji in a white circle with a thick outline and offset shadow, on a polka-dot card tinted by category, with ✨ 🎀 and dot decorations. It wiggles on hover.
- **Everywhere gifts appear:** a large version on quiz results and idea pages, a small sticker badge on idea cards and the public wishlist.
- **Every gift has its own emoji:** 11 of the 207 only had their category's emoji, so they got their own, like 🧳 for the weekender bag. A new test fails if any hand-picked gift lacks one.
- **Docs:** Plan vs. Reality row #12, README, schema notes and `.env.example`.

## How it was checked
- Browser: idea cards, the idea page, and quiz results for "Rohan" (him, sneakers, $100–300) all show the new art.
- The Rohan quiz returned 8 sneakers: Air Force 1, Samba OG, New Balance 550, Jordan 1 Low, Onitsuka Tiger Mexico 66, Dunk Low, Pegasus and Chuck 70.
- Full test suite passes.
