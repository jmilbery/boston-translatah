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
4. **Curricula** — `data/curriculum/<from>-to-<to>.yml`
   A staged path from one region's accent to another's, naming rules by `id`
   in both engines. The only layer that reads across two regions at once.
   Optional; a region works fine without one.

Every lexicon and phrase entry carries a `sources:` block. No source, no merge.

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

## Reverse (dialect → plain English)

Run the lexicon in reverse (local term → `means`) and undo accent respellings.
The rules are lossy, so reverse is best-effort — flag anything ambiguous.

## Cross-region translation (city → city)

Two cities means a third operation the skill didn't used to have: not English
→ dialect, but **dialect → dialect**. It needs no new machinery, because the
plain-English fields are already a pivot:

- `means:` on every lexicon entry
- `phrase:` on every phrase entry

So a city-to-city translation is just the reverse pass followed by the forward
one, through plain English in the middle:

```
pahk the cah  →  [reverse boston] →  park the car  →  [forward stl-314] →  park the car
fahty-fowah   →  [reverse boston] →  forty-four    →  [forward stl-314] →  farty-far
```

1. Reverse out of the source region to plain English (lexicon by `means:`,
   phrases by `phrase:`, then undo the source's accent respellings).
2. Forward into the destination region as normal.
3. **Never skip the middle.** Transforming respellings directly from one
   accent to another is how you cross the streams. Boston's R's have to come
   off before St. Louis's go on, even where the result looks identical.

Expect it to be lossy in both directions, same caveat as the reverse pass, and
expect gaps: a source term whose `means:` has no destination equivalent stays
in plain English rather than getting invented.

### Teaching it to a person instead

`data/curriculum/boston-to-stl-314.yml` is the same journey staged for a human
who wants to make the noises themselves: six lessons, each naming the rules it
adds from the destination engine and the ones it retires from the origin.
`docs/ACCENT-REDUCTION.md` is its prose companion, and covers the one thing
that reliably goes wrong — both cities insert R's, on completely different
triggers, and merging them yields an accent spoken nowhere.

Note the framing, which is deliberate and sourced: this is **accent addition**,
never "accent reduction." An accent is not a disorder, nobody loses Boston, and
the profession that does this for real retired the other phrase on purpose.

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
