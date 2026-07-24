# Boston Translator 🦞

**Claude speaks fluent Masshole.** Feed it plain English, get it back with a
Boston accent and the right vocabulary — `liquor store` becomes `packie`, `soda`
becomes `tonic`, and everything loses its R.

But that's the bait. Here's the real deal:

## This is a git tutorial wearing a Halloween costume

Most business people — investors, operators, finance folks, anyone who lives in
spreadsheets instead of source code — now need to work with AI tools that run on
**skill files**, **markdown**, and **repos**. Nobody taught them git. Editing a
config file feels like defusing a bomb. Opening a pull request sounds like a
medical procedure.

So we built the lowest-stakes possible place to learn all of it: **a slang
dictionary.** You already know your hometown's slang cold — there's nothing to
get *wrong* about the subject. That leaves only the mechanics: fork a repo, edit
a file, open a PR, get it reviewed, watch it merge. The scary part, in isolation,
wrapped in something fun.

**You will feel dumb the first time. That's the point. Everybody does. Then you
won't.** → Start at [`CONTRIBUTING.md`](CONTRIBUTING.md).

## What's in here

| Path | What it is |
|---|---|
| `SKILL.md` | The Claude skill — how the translation actually works |
| `data/pronunciation/rules.yml` | The accent engine (drop-R, broad-A, etc.) |
| `data/lexicon/<region>/*.yml` | The dictionary — one word per file. **Add yours here.** |
| `data/phrases/<region>/*.yml` | Irregular phrases stored whole |
| `CONTRIBUTING.md` | Your first pull request, hand-held |
| `docs/TONE.md` | How to be funny without being mean — the tonal north star |
| `schema/` | The shape each entry must match (a robot checks this) |

## The rules that keep it real

1. **Every entry cites a source.** A link, or two locals who'll vouch. No source,
   no merge. This is a dictionary, not a bathroom wall.
2. **The joke is with people, never at them.** See [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
3. **Boston is just the first city.** The engine is region-agnostic — Yinzer,
   Philly, Baltimore, Minnesota, Cajun are all welcome as new data files. Boston
   is the reference implementation.

## License

MIT. Take it, fork it, teach your own team with it.
