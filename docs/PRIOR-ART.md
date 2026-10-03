# Prior art, shout-outs & thanks

Good open source is honest about what came before it. Here's who and what we're
standing on — the fun stuff, the source stuff, and the people who did versions of
this first.

## The inspiration

- **"Boston Accent"** — Seth Meyers' fake movie-trailer bit from *Late Night*
  (Jan 21, 2016). The tonal north star: over-the-top,
  accent-to-eleven, and made with obvious love for the place. It parodies the
  gritty-Boston-crime-movie *genre*, not the people — which is exactly the line
  this project walks. See [`TONE.md`](TONE.md).
  https://www.youtube.com/watch?v=rLwbzGyC6t4

## The translators that came before us (go play with them)

There are a bunch of "type English, get a Boston accent back" toys. They're fun,
and we're not pretending we invented the idea of dropping an R. What's different
here is the **purpose** — see the note below. Credit where due:

- **FunTranslations — Boston** — https://funtranslations.com/boston
- **LingoJam — Bostonian Translator** — https://lingojam.com/BostonianTranslator
- **Accenterator — Boston** — https://www.accenterator.com/boston.php
- **claudiar1/boston-accent-translator** — the one prior GitHub repo we found
  (a solo JavaScript tool, last touched 2020). Respect to whoever built it first.
  https://github.com/claudiar1/boston-accent-translator

## How this project is different (and why it still exists)

Every tool above is a **closed toy**: text in, accent out, nothing to contribute
to, nothing to learn. This repo is the opposite — the translation is the *bait*.
The point is to be **a real, community-maintained open-source project that a
non-developer can make their first-ever pull request to**, using a subject
(their own hometown slang) they can't get wrong. The dictionary is a teaching
instrument. That purpose is the thing none of the toys have.

## Data sources

The seed lexicon and pronunciation rules were compiled from public references —
each entry cites its own in its `sources:` block. The big ones:

- **Wiktionary — Glossary of Boston slang** —
  https://en.wiktionary.org/wiki/Appendix:Glossary_of_Boston_slang
- **Time Out Boston — 50 Boston slang words** —
  https://www.timeout.com/boston/news/50-boston-slang-words-and-sayings-you-should-know-083022
- **WBUR — Greater Boston slang field guide** —
  https://www.wbur.org/news/2023/11/03/massachusetts-bostonians-common-expressions-field-guide
- **New England Historical Society — the accent rules** —
  https://newenglandhistoricalsociety.com/how-to-talk-with-a-boston-accent-not-for-the-faint-of-haht/

For **St. Louis** (`stl-314`):

- **St. Louis Public Radio — How to speak STL** —
  https://www.stlpr.org/culture-history/2023-10-16/how-to-speak-stl-a-pronunciation-guide-for-new-st-louisans
- **Mental Floss — 13 St. Louis slang terms** —
  https://www.mentalfloss.com/language/slang/st-louis-slang-terms
- **St. Louis Magazine — "What's a Hoosier?"** —
  https://www.stlmag.com/news/what-s-a-hoosier/
- **Nine PBS — The history of hoosiers in St. Louis** —
  https://www.ninepbs.org/blogs/history/the-history-of-hoosiers-in-st-louis/

## Ordering sources (`data/orders/`)

Each order cites its own sources. The ones the first batch leans on:

For **Boston** and New England:

- **Time Out Boston, 40 Boston slang words and expressions** (regular,
  frappe, tonic):
  https://www.timeout.com/boston/news/40-boston-slang-words-and-expressions-you-should-know-090121
- **Yankee Magazine, New England slang** (grinder, tonic, bubbler):
  https://newengland.com/?p=98646
- **OC Weekly, Dunkin' ordering terms** (a regular by size: two and two,
  three and three, four and four): https://www.ocweekly.com/?p=121345
- **Tasting Table, how Dunkin' measures cream and sugar**:
  https://tastingtable.com/1763061/dunkin-measures-cream-sugar-drinks
- **America's Test Kitchen**, **Yankee Magazine** and **Boston.com** on
  milkshake vs frappe vs cabinet:
  https://www.americastestkitchen.com/articles/7087-what-is-a-milkshake-and-how-is-it-different-from-a-frappe-or-a-cabinet ,
  https://newengland.com/today/food/new-england-made/milk-shakes-frappes-cabinets/ ,
  https://www.boston.com/food/wickedpedia/2023/10/04/milkshake-frappe-new-england
- **Chowhound** and **Lobster Anywhere** on Maine vs Connecticut lobster rolls:
  https://chowhound.com/1666932/difference-between-maine-connecticut-lobster-roll ,
  https://lobsteranywhere.com/seafood-savvy/maine-vs-connecticut-lobster-rolls-the-4-big-differences/
- **Boston.com, where the Boston accent came from, and where it's going**
  (the dropped R fading in younger speakers):
  https://www.boston.com/news/wickedpedia/2023/03/27/boston-accent-origins-linguistics

For **St. Louis** (`stl-314`):

- **Christian Science Monitor, American speech mapped** (St. Louis as a soda
  island; tonic fading in Boston):
  https://www.csmonitor.com/The-Culture/Verbal-Energy/2016/1124/American-speech-mapped-in-vivid-color
- **AFAR, St. Louis food** (pizza, Provel, t-ravs, concrete, gooey butter
  cake, slinger): https://www.afar.com/magazine/st-louis-food
- **Explore St. Louis, five signature foods**:
  https://explorestlouis.com/top-five-st-louis-signature-foods
- **Everyday Wanderer, famous St. Louis foods**:
  https://everydaywanderer.com/famous-st-louis-foods
- **St. Louis Public Radio, "How do you say 40 here?"** (or-to-ar, warsh, and
  the accent fading in younger speakers):
  https://www.stlpr.org/show/st-louis-on-the-air/2016-12-21/how-do-you-say-40-here-and-wash-dissecting-the-particularities-of-the-st-louis-dialect

## The contributors

Everybody who's ever opened a PR here — especially the ones for whom it was their
first PR *anywhere*. That's the whole game. Thank you.
