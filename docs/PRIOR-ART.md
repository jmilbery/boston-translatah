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

## Where our own slugs came from

Worth saying out loud, because we've been quietly using somebody else's idea
since the first commit. The regions in this repo are named city-plus-area-code:
`brockton-508`, `stl-314`, and every one that follows. **That convention is
hip-hop's.** Naming a place by its area code — the 314, the 313, the 212 — is a
rap practice, and in St. Louis's case Nelly's *Country Grammar* (2000) is the
record that put the 314 into national circulation and, per STLPR, put the whole
Midwest on a map that had only ever had two coasts on it.

We didn't invent the naming scheme, we borrowed it, and it's a better scheme
than anything we'd have come up with. Credit where it's due.

- **STLPR — At 20, Nelly's "Country Grammar" still makes St. Louis proud** —
  https://www.stlpr.org/show/st-louis-on-the-air/2020-06-26/at-20-nellys-country-grammar-still-makes-st-louis-proud
- **Wikipedia — Country Grammar** — https://en.wikipedia.org/wiki/Country_Grammar
- **Wikipedia — The Ville, St. Louis** — https://en.wikipedia.org/wiki/The_Ville,_St._Louis

## The contributors

Everybody who's ever opened a PR here — especially the ones for whom it was their
first PR *anywhere*. That's the whole game. Thank you.
