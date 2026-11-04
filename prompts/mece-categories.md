# Prompt log: Categories that cover everything, plus Other (stranger test)

Agent: Claude Code. Branch: `stranger/mece-categories`. Issue: #78.

## Prompt
> **Me (stranger test feedback):** add more product assortment for "experiences" category and make buckets MECE (right now, only a few categories are being covered, but they're not covering everything. There should be more assortment in all, and also for experiences specifically. Overall, bruck buckets should be messy, so there should be an option of "others" and then defining the category in a text box, probably.)

## What the agent did
- **Migration `0009_mece_categories.sql`:** adds Sports & outdoors 🏃, Travel 🧳, Pets 🐾, Kids & baby 🧸 and ✨ Other, plus a `custom_category` column for Other.
- **Gift list: 249 → 316.** Moved 8 gifts into their proper new categories (yoga mat and camping kit to Sports, the weekender bag to Travel, and so on). Added Sports, Travel, Pets and Kids gifts at every budget, and 18 new Experiences: concerts, comedy, theater, sports games, food tours, sailing, pottery and candle classes, escape rooms, indoor skydiving, a race car, a hot air balloon and a helicopter tour.
- **New trusted stores, each opened in a real browser first:** Ticketmaster, Airbnb Experiences, Virgin Gifts (`virgingifts.com`; the old `virginexperiencegifts.com` redirects there), Fandango and MasterClass.
- **✨ Other** in the idea form and the quiz shows a text box ("What kind of gift?"). Cards show your words, like "vinyl and record players (Other)".

## Problems found and fixed while testing
- **"car accessories" matched earrings,** because "accessories" matched on its own. Multi-word interests now have to match every meaningful word, which also stops "board games" matching video games.
- **Synonyms outranked direct matches:** "golf" ranked a water bottle first (through "sports"), and "yoga" a hoodie (through "self care"). Direct matches now count double.
- **"Other" got crowded out:** a dog lover who also typed "hiking" got 8 pet gifts. Other now gets its own turn in the results, and its store searches always make the list.
- **Random filler:** "Other" alone with no matches showed random filler. It now shows store searches for exactly what was typed, at Amazon, Etsy and Target, first.
- **"Other" in the middle of the list:** it now sorts last.

## How it was checked
- Re-ran the 12-profile audit plus new ones (concerts and adventure, dog lover plus Other, new parent, Other only). All results reviewed.
- Browser on `dev`: 14 categories with Other last, the Other text box is required with a friendly message, it saves and displays, and the Other quiz leads with the exact searches.
- All 70 automated tests pass, including every category having a full set at every budget.
