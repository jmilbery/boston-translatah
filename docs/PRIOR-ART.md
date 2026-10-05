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

## The linguistics behind the new accent files

The Philadelphia, Pittsburgh and Chicago accent files only encode features
with an academic backbone. Each file names its sources in a header comment;
these are the big ones.

- **William Labov, University of Pennsylvania**: decades of recordings of
  native Philadelphians, published as "One Hundred Years of Sound Change in
  Philadelphia" (*Language*). Behind "wooder," "cawfee" and "boik," and the
  finding that the first two are fading while "boik" is growing. Reported by
  NBC Philadelphia, CBS Philadelphia and The Inquirer:
  https://www.nbcphiladelphia.com/news/local/philadelphia-accent-wooder-water/2087818/ ,
  https://www.cbsnews.com/philadelphia/news/upenn-researchers-tackle-evolution-of-philadelphia-accent/ ,
  https://inquirer.com/news/philadelphia/inq2/philadelphia-accent-water-wooder-linguistics-20230325.html
- **Barbara Johnstone, *Speaking Pittsburghese: The Story of a Dialect***
  (Oxford University Press, 2013): the "dahntahn" vowel, and why yinz and
  n'at became badges of pride. Via Pittsburgh Magazine and PBS's *Do You
  Speak American?*:
  https://www.pittsburghmagazine.com/speaking-in-pittsburghese/ ,
  https://www.pbs.org/speak/seatosea/americanvarieties/pittsburghese
- **The Atlas of North American English** (Labov, Ash and Boberg, 2006):
  the Northern Cities Shift that Chicago's file uses, lightly. Summarized at
  https://en.wikipedia.org/wiki/Northern_cities_vowel_shift , with WBEZ's
  Curious City on what Chicagoans actually sound like (and why "da Bears" is
  left out):
  https://www.wbez.org/shows/curious-city/chuh-kaw-go-what-do-you-really-sound-like/9054d7a4-f876-4c53-8ce1-08adae048d28
- **The Harvard Dialect Survey** (Bert Vaux), the soda/pop/hoagie/sub data
  that Josh Katz's later maps grew out of:
  https://news.harvard.edu/gazette/story/2002/12/standing-on-line-at-the-bubbler-with-a-hoagie-in-my-hand
- **The Dictionary of American Regional English (DARE)**, University of
  Wisconsin-Madison: the reference to check before calling a word local.
  Not cited by any entry yet: https://dare.wisc.edu/

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

For **Philadelphia** (`philly-215`):

- **The Inquirer, how to order a cheesesteak**, **Visit Philadelphia,
  Cheesesteak 101** and **The Takeout** (Whiz wit, witout, the three
  cheeses, have your order and money ready):
  https://inquirer.com/philly/food/how-to-order-philly-cheesesteak-wiz-wit-20180705.html ,
  https://www.visitphilly.com/media-center/press-releases/cheesesteak-101-a-primer-on-the-who-what-where-whiz-of-philly-cheesesteaks/ ,
  https://www.thetakeout.com/1672514/how-to-order-philly-cheesesteak/
- **The Inquirer, how the hoagie got its name** (contested origins; hoagie
  in Pittsburgh): https://www.inquirer.com/food/hoagie-philadelphia-history-sub-20240715.html
- **Visit Philadelphia, top spots for water ice** (water ice, gelati):
  https://www.visitphilly.com/media-center/press-releases/13-top-spots-for-water-ice-in-philly
- **Wikipedia, the Sheetz and Wawa rivalry** and **MEL Magazine** (Wawa vs
  Sheetz as east vs west; no territory agreement):
  https://en.wikipedia.org/wiki/Sheetz%E2%80%93Wawa_rivalry ,
  https://melmagazine.com/en-us/story/the-sheetz-vs-wawa-war-explained-by-a-real-pennsylvanian

For **Pittsburgh** (`pgh-412`):

- **Pittsburgh City Paper, Pittsburghese dictionary** (yinz, n'at, redd up,
  slippy, nebby, pop, chipped ham, ham barbecue, jumbo, dippy eggs):
  https://pghcitypaper.com/specials-guides/pittsburghese-dictionary-how-to-talk-like-a-yinzer-19623370
- **Pittsburgh Magazine, a Pittsburgh food primer** (Primanti Bros.,
  chipped ham): https://www.pittsburghmagazine.com/pittsburgh-food-primer/
- **Primanti Bros., our story** and **Wikipedia** (1933, the Strip District,
  fries on the sandwich for truck drivers): https://primantibros.com/story ,
  https://en.wikipedia.org/wiki/Primanti_Bros.

For **Chicago** (`chi-312`):

- **The Takeout, how to order an Italian beef** and **Islands** (sweet or
  hot, dry, wet or dipped, combo, gravy bread):
  https://thetakeout.com/how-to-order-an-italian-beef-in-chicago-1845889364 ,
  https://www.islands.com/2053723/chicago-locals-spot-tourist-italian-beef-question/
- **Tasting Table** and **Wikipedia** on the Chicago-style hot dog (dragged
  through the garden, no ketchup):
  https://www.tastingtable.com/2058306/martha-stewart-rule-chicago-style-hot-dogs ,
  https://en.wikipedia.org/wiki/Chicago-style_hot_dog
- **WBEZ Curious City** (Chicagoans know they say pop):
  https://www.wbez.org/shows/curious-city/chuh-kaw-go-what-do-you-really-sound-like/9054d7a4-f876-4c53-8ce1-08adae048d28

## The contributors

Everybody who's ever opened a PR here — especially the ones for whom it was their
first PR *anywhere*. That's the whole game. Thank you.
