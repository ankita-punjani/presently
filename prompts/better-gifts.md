# Prompt log: Better gift ideas

Agent: Claude Code. Branch: `feature/better-gifts`. Issue: #33.

## Prompt
> **Me:** I need more gift options. I tried it for one of my friends, and it's not coming. It's not the best curation of gift ideas. I have more interesting ideas. Also, for the demo names that you've put, can you put Indian names so that it looks real? I can give you a few profiles. For example: For Adi, he loves luxury things, like massages, perfumes, electronics, expensive blazers, and business class tickets, which is funny, obviously, but still, that is one. The other I can think of is a girl called Bhavya. She's a lot into cooking and skincare. She loves nice dresses from Zara, so all of that.

## What I noticed
This came from actually using the app. The list was built for "nice generic gift", and it had nothing for someone with expensive taste. Interests also barely mattered: typing "perfumes" didn't match the tag "perfume".

## What the agent did
- **Replaced the demo people** with Adi and Bhavya on my account, and swapped their 8 example ideas for ones that fit.
- **Gift list up from 87 to 143**, adding specific picks: Tom Ford, Theragun, Tatcha, Le Creuset, a masala dabba, Zara dresses, and joke gifts like a "Business Class Fund" piggy bank.
- **Hand-written "why this fits" lines** on all the new gifts, rather than a template.
- **Smarter matching:** "perfumes" finds perfume, "electronics" finds tech, "business class" finds luxury travel. Interests now outweigh everything else.
- **8 results at a time**, up from 5.
- **New "Go big 💎 $300+" budget**, and the old $100+ became $100–300.
- **Interests can be typed in the quiz for anyone**, not just new people, because a friend with no interests saved got generic results.
- **New trusted stores:** Zara, Williams Sonoma, Bloomingdale's, Spafinder, Priority Pass, Cozymeal.

## Bug caught
After the new gifts, the art fell back to the category, so a massage gun showed a game controller. Added art for the new items.

## How it was checked
- Ran the quiz with Adi's interests, $100–300, "treat yourself": Theragun, a massage gift card, Bleu de Chanel, AirPods, Kindle, lounge pass, Tom Ford, Margiela.
- 31 automated checks pass, including interest matching for these exact words.

**Not tested:** store search links open from here for the 6 new stores. Prices are typical estimates, shown with a "~", so check before relying on them.
