# Prompt log: Clothing, Shoes and Accessories, a full audit, and link fixes

Agent: Claude Code. Branch: `feature/category-split`. Issues: #69, #70.

## Prompts
> **Me:** are you sure it's covering the entire assortment as it should for the products it's showing? Make sure that your product recommendations are good. Also, for clothing and accessories, make clothing, shoes, and accessories.

> **Me:** Are all links directing me to Nordstrom? ... I think it's directing me to the same link. Can you please check it carefully? I don't want any fuckups.

> **Me:** for amazon and links dont work - add notes to find on amazon etc. but put it atleast as amazon is more credible

## Category split
- Migration `0008_split_clothing.sql`: "Clothes & accessories" becomes **Clothing 👕**, plus new **Shoes 👟** and **Accessories 💍**. Existing gift ideas are re-sorted by title, so necklaces, watches and pocket squares move to Accessories and sneakers to Shoes.
- All 56 clothing-type hand-picked gifts re-sorted. Added tees, sweatshirts, jeans, boots, clogs, loafers, flats and luxury women's picks, so each new category has a full set at every budget.

## The audit
The agent ran 12 profiles through the quiz: Adhi, Bhavya, Sama, Rosh, Jas, Amy, Rohan, Rohan with the wrong category, Nitin, Sam, no interests, and "go big". It read every result and found 5 real problems:
1. **One interest crowded out the rest:** Bhavya got 8 Zara items and nothing for cooking or skincare. Results now take turns across the picked categories.
2. **Wrong category hid the obvious answer:** a sneaker fan under "Clothing" got blazers. If the picked categories have fewer than 3 matches, the best matches from other categories are added.
3. **Board games** returned video-game gadgets. Added 7 board games.
4. **Yoga** returned hoodies. Added 7 yoga gifts.
5. **"Home gadgets" matched candles,** because "home" alone matched home decor. Describing words in a phrase ("home", "men", "cool") no longer match on their own.

## Link check (real browser, every store)
- **Broken:** Barnes & Noble's `/s/<query>` returned **404** on all 15 B&N gifts. Fixed to `/search?q=`, the format B&N's own search box uses.
- **Working:** Nordstrom, Target, Best Buy, Nike, Adidas, New Balance, Foot Locker, Zara, Williams Sonoma, Bloomingdale's, Ulta, Sephora, Uncommon Goods, Apple, Spafinder, Priority Pass and Cozymeal all opened search results for the exact product.
- **Nordstrom:** each gift links to its own search, for example "silk pocket square | Nordstrom". It isn't one shared link. It is common, with 40 of 230 gifts, because it carries many luxury brands.
- **Couldn't check:** Amazon and Etsy block AI browsers, and REI showed a blank page. The agent respected those blocks. All three use their standard search format.
- **New backup on every gift:** "Not there? Find it on Amazon →" on quiz results, saved ideas and the public wishlist. Saved ideas with no link get a Find it on Amazon button.

## How it was checked
- Browser on `dev`: the new categories appear in the quiz, results rotate across Shoes, Accessories and Clothing, and every card has its own store link plus the Amazon backup.
- Full test suite passes.
