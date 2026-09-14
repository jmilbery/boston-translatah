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

For the **Midwest** families and cities:

- **Wikipedia — Northern cities vowel shift** — the chain shift that defines the
  Inland North, and the reason `inland-north.yml` is ordered rather than a list
  of quirks.
  https://en.wikipedia.org/wiki/Northern_cities_vowel_shift
- **Wikipedia — Inland Northern American English** —
  https://en.wikipedia.org/wiki/Inland_Northern_American_English
- **Wikipedia — Midland American English** — including the "St. Louis Corridor"
  up old Route 66, which is how a Midland city ended up with Northern vowels.
  https://en.wikipedia.org/wiki/Midland_American_English
- **Wikipedia — Midwestern American English** —
  https://en.wikipedia.org/wiki/Midwestern_American_English
- **Chicago Magazine — Where the Chicago accent comes from** —
  https://www.chicagomag.com/city-life/march-2012/where-the-chicago-accent-comes-from-and-how-politics-is-changing-it/
- **Mental Floss — 14 Chicago slang terms** —
  https://www.mentalfloss.com/language/slang/chicago-slang-terms
- **The Awesome Mitten — Michigan words, slang and pronunciations** —
  https://www.awesomemitten.com/michigan-words/

Standing on **William Labov**'s *Atlas of North American English* throughout the
Midwest work, by way of the summaries above. The families in `data/regions.yml`
are his dialect regions, not ours.

## The contributors

Everybody who's ever opened a PR here — especially the ones for whom it was their
first PR *anywhere*. That's the whole game. Thank you.
