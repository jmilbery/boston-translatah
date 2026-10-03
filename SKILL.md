---
name: boston-translatah
description: >-
  Translates plain English into Boston / New England dialect — and back —
  using two engines: a pronunciation ruleset (drop-R, intrusive-R, broad-A)
  and a community-maintained lexicon of word swaps. Supports a thickness dial
  (light → full Masshole) and regional modes (city Boston, Brockton/508).
  Trigger when someone asks to "make this sound Boston," "Boston-ify," "speak
  Masshole," translate to/from New England slang, or wants the accent applied
  to text. Also, fine, it does other cities the neighbahs dragged in — St.
  Louis ("make this sound St. Louis"), and whatever else shows up in the
  lexicon — but what would you wanna go theah foah?
  Also trigger on ordering questions: "order like a local," "how do I order
  coffee in Boston," "what's a slinger," "is that a good order."
license: MIT
---

# Boston Translator

Turn any text Boston. Two engines run in order; a **thickness dial** controls how
hard they push; a **regional mode** picks the vocabulary and attitude.

> This skill is also a teaching artifact. The whole point of the repo is to give
> non-developers a low-stakes way to learn skill files, markdown, and pull
> requests. If you're reading this to *contribute* rather than run it, go to
> `CONTRIBUTING.md`.

## Data model — five layers

0. **Region registry** — `data/regions.yml`
   The list of cities this skill speaks, each with its slug, its optional
   `inherits`, and which accent file it uses. Read this first to know what's
   available; it's also the only file a new city has to touch.
1. **Pronunciation rules** — `data/pronunciation/<accent>.yml`
   General phonetic transforms that apply to *any* word. Which file to load
   comes from the region's `accent:` field in `data/regions.yml` —
   `rules.yml` is the Boston set (drop-R, intrusive-R, broad-A, o→aw, -er→-ah);
   `stl-314.yml` is St. Louis (rhotic, or→ar). Curated and small.
2. **Lexicon** — `data/lexicon/<region>/<slug>.yml`
   One file per term. Standard word/phrase → the local equivalent. The big,
   community-grown dictionary. This is where PRs land.
3. **Phrases** — `data/phrases/<region>/<slug>.yml`
   Canonical multi-word renderings that do NOT derive cleanly from the rules
   (irregular idioms like "pahk the cah in Hahvad Yahd"). Stored verbatim.
4. **Orders**: `data/orders/<region>/<slug>.yml`
   How a local orders one thing at the counter (`local`), the same line run
   through the accent rules (`spoken`, a folk spelling), counter etiquette
   (`moves`), and what locals think of it (`takes`). An optional `slot` (like
   `soda` or `water`) lines orders up across cities. Used by Ordering mode,
   below.

Every lexicon, phrase and order entry carries a `sources:` block. No source, no
merge.

## The thickness dial

| Level | Name | What it does | Use for |
|---|---|---|---|
| 1 | **Light** | Lexicon swaps only, register-1 terms (wicked, packie, Dunks). No accent respelling. | Real content you'd actually publish. Still reads clean. |
| 2 | **Local** | Register 1–2 swaps + soft accent (drop trailing R, -er→-ah). | Clearly Boston, still readable. |
| 3 | **Full Masshole** | All registers + full accent respelling (intrusive R, broad A, o→aw, contractions). "Boston Accent" trailer energy — see `docs/TONE.md`. | A bit. Cards, jokes, reading aloud. Never ship to a serious channel. |

Default to **Level 2** unless asked. When in doubt, offer light + full so the user feels both.

The dial itself is region-agnostic; only the Level 3 *label* is Boston's. Outside
Boston just call it Level 3 — and note that "full hoosier" is **not** the St. Louis
equivalent of "full Masshole." `masshole` is a badge locals wear; `hoosier` is
something St. Louisans call other people. Never use it to name the mode.

Tone calibration for Level 3 — affectionate caricature, _with_ the accent never _at_ it — lives in `docs/TONE.md`. Read it before cranking the dial.

## Regional modes

- **`boston`** — city Boston / general New England. The default.
- **`brockton-508`** — South Shore / the 508. Harder, working-class register;
  Champion City attitude (Marciano/Hagler DNA — unflashy, lands the punch).
  Placename humor (Boogietown, Massatoilet CC). Not Harvard-Yard collegiate.
- **`stl-314`** — St. Louis. Midwestern, rhotic, food-obsessed and
  neighborhood-obsessed. The register is dry and unimpressed rather than
  chowdah-tough. Placement matters more than volume: the city's real
  shibboleth is *"Where'd you go to high school?"*

Modes stack via the `inherits:` field in `data/regions.yml`: `brockton-508`
inherits all `boston` lexicon, then adds/overrides. `stl-314` inherits nothing
— it is a separate dialect, not a Boston variant.

> **Never cross the streams.** Boston deletes R's; St. Louis keeps and even
> adds them. Running `rules.yml` against a `stl-314` request produces an accent
> that exists in no city on earth. Load the accent file the region names.

## How to apply (translate TO the dialect)

1. Pick region (default `boston`) and thickness (default 2). Look the region up
   in `data/regions.yml` to get its `inherits` and `accent` file.
2. **Lexicon pass** — swap standard words/phrases for entries whose `register` ≤ dial.
   Include the inherited region's lexicon first, then let the child override.
3. **Phrase pass** — replace any canonical phrases matched verbatim.
4. **Accent pass** (dial ≥ 2) — apply the region's accent file in listed order.
   Boston (`rules.yml`): drop-R before intrusive-R; broad-A and o→aw last.
   St. Louis (`stl-314.yml`): keep every R; or→ar first, vowel shifts last.
5. Sprinkle connective tissue at dial 3 — Boston: *kid, wicked, no suh, right
   theah*. St. Louis has no equivalent filler; it leans on place and school
   names instead. Either way don't overdo it; native beats cartoonish.
6. **Ordering mode**: if the request is about ordering food or drink rather
   than translating text, skip the steps above and go to Ordering mode below.

## Ordering mode

For "how do I order this like a local," "what would a St. Louisan get," "what
did that guy just order," and "is that a good order." Everything comes from
`data/orders/<region>/`; pick the region the same way as above (default
`boston`).

- **Order like a local.** Find the order and give its `local` line. At dial 2
  and up, follow it with `spoken`, and say it's a folk spelling. Add the
  `moves` a newcomer would need ("it's cut in squares, not wedges").
- **The local's verdict.** Add one `takes` line, in the local's voice. Pick the
  one that fits the question; don't stack all three.
- **Compare cities.** Given a generic order ("a soda," "a glass of water"),
  gather every entry sharing that `slot` across regions and show them side by
  side, one line per city, folk spellings labeled. If only one city has the
  slot, say so rather than guessing at the others.
- **Reverse decode.** Given what someone said at a counter, match it against
  `local` and `moves` (and the lexicon) and explain it in plain English: what
  they ordered and what will show up.

Guardrails for this mode:

- **Don't invent orders or opinions.** If there's no entry, say so, then fall
  back to the lexicon (a `means:` line still helps) or plain English. A
  made-up take is worse than none.
- **Takes are affectionate.** They tease the food, the habit, or the speaker's
  own city, never the person ordering. See `docs/TONE.md`.
- **`contested: true` means don't pick a winner.** Who invented toasted
  ravioli is a local argument; report that it's an argument.
- Brand names are fine in text (Dunks, Ted Drewes). Mentioning one is not an
  endorsement, so don't phrase it like one.

## Reverse (dialect → plain English)

Run the lexicon in reverse (local term → `means`) and undo accent respellings.
The rules are lossy, so reverse is best-effort — flag anything ambiguous.

## Guardrails

- The joke is **with** the speaker, never at an ethnic or class group. See
  `CODE_OF_CONDUCT.md`. Terms tagged `offensive: true` are stored for reverse
  lookups only and are NEVER emitted in a translation.
- Don't invent slang. If a swap isn't in the lexicon, leave the word standard or
  apply only the accent rules. Made-up terms are how this stops being credible.
- **Don't do impressions of racially-marked speech.** Some regional features are
  specific to a city's Black speech communities. Where an accent file documents
  one in a comment rather than wiring it up as a rule, that omission is
  deliberate — don't "fix" it by applying it anyway.
