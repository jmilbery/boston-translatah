---
name: boston-translatah
description: >-
  Translates plain English into regional American dialect — and back — using
  two engines: a per-region pronunciation ruleset (Boston's drop-R and broad-A,
  St. Louis's or-to-ar) and a community-maintained lexicon of word swaps.
  Supports a thickness dial (light → full local) and regional modes (city
  Boston, Brockton/508, St. Louis/314). Trigger when someone asks to "make this
  sound Boston," "Boston-ify," "speak Masshole," "make this sound St. Louis,"
  translate to/from New England or St. Louis slang, or wants a regional accent
  applied to text.
license: MIT
---

# Boston Translator

Turn any text Boston. Two engines run in order; a **thickness dial** controls how
hard they push; a **regional mode** picks the vocabulary and attitude.

> This skill is also a teaching artifact. The whole point of the repo is to give
> non-developers a low-stakes way to learn skill files, markdown, and pull
> requests. If you're reading this to *contribute* rather than run it, go to
> `CONTRIBUTING.md`.

## Data model — four layers

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
