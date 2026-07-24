---
name: boston-translatah
description: >-
  Translates plain English into Boston / New England dialect — and back —
  using two engines: a pronunciation ruleset (drop-R, intrusive-R, broad-A)
  and a community-maintained lexicon of word swaps. Supports a thickness dial
  (light → full Masshole) and regional modes (city Boston, Brockton/508).
  Trigger when someone asks to "make this sound Boston," "Boston-ify," "speak
  Masshole," translate to/from New England slang, or wants the accent applied
  to text.
license: MIT
---

# Boston Translator

Turn any text Boston. Two engines run in order; a **thickness dial** controls how
hard they push; a **regional mode** picks the vocabulary and attitude.

> This skill is also a teaching artifact. The whole point of the repo is to give
> non-developers a low-stakes way to learn skill files, markdown, and pull
> requests. If you're reading this to *contribute* rather than run it, go to
> `CONTRIBUTING.md`.

## Data model — three layers

1. **Pronunciation rules** — `data/pronunciation/rules.yml`
   General phonetic transforms that apply to *any* word (drop-R, intrusive-R,
   broad-A, o→aw, -er→-ah). Curated and small. This is the accent engine.
2. **Lexicon** — `data/lexicon/<region>/<slug>.yml`
   One file per term. Standard word/phrase → Boston equivalent. The big,
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

Tone calibration for Level 3 — affectionate caricature, _with_ the accent never _at_ it — lives in `docs/TONE.md`. Read it before cranking the dial.

## Regional modes

- **`boston`** — city Boston / general New England. The default.
- **`brockton-508`** — South Shore / the 508. Harder, working-class register;
  Champion City attitude (Marciano/Hagler DNA — unflashy, lands the punch).
  Placename humor (Boogietown, Massatoilet CC). Not Harvard-Yard collegiate.

Modes stack: `brockton-508` inherits all `boston` lexicon, then adds/overrides.

## How to apply (translate TO Boston)

1. Pick region (default `boston`) and thickness (default 2).
2. **Lexicon pass** — swap standard words/phrases for entries whose `register` ≤ dial.
3. **Phrase pass** — replace any canonical phrases matched verbatim.
4. **Accent pass** (dial ≥ 2) — apply `pronunciation/rules.yml` in listed order:
   drop-R before intrusive-R; broad-A and o→aw last.
5. Sprinkle connective tissue at dial 3 (kid, wicked, no suh, right theah) — but
   don't overdo it; native beats cartoonish.

## Reverse (Boston → plain English)

Run the lexicon in reverse (Boston term → `means`) and undo accent respellings.
The rules are lossy, so reverse is best-effort — flag anything ambiguous.

## Guardrails

- The joke is **with** the speaker, never at an ethnic or class group. See
  `CODE_OF_CONDUCT.md`. Terms tagged `offensive: true` are stored for reverse
  lookups only and are NEVER emitted in a translation.
- Don't invent slang. If a swap isn't in the lexicon, leave the word standard or
  apply only the accent rules. Made-up terms are how this stops being credible.
