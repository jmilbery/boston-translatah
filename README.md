# boston-translatah 🦞

Yes, that's how it's spelled. Rule #3 is `-er → -ah`, and we apply our own rules
to ourselves. (If you searched for "boston-translator," you're in the right
place — welcome.)

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
| `data/regions.yml` | The region registry — every city we speak. **Adding a city starts here.** |
| `data/pronunciation/*.yml` | The accent engines — `rules.yml` is Boston, `stl-314.yml` is St. Louis |
| `data/lexicon/<region>/*.yml` | The dictionary — one word per file. **Add yours here.** |
| `data/phrases/<region>/*.yml` | Irregular phrases stored whole |
| `data/curriculum/*.yml` | Staged paths from one city's accent to another's |
| `MANIFESTO.md` | **What this actually is** — read this if you're confused why a slang repo exists |
| `CONTRIBUTING.md` | Your first pull request, hand-held |
| `docs/TONE.md` | How to be funny without being mean — the tonal north star |
| `docs/ACCENT-REDUCTION.md` | The Boston → St. Louis clinic, and why it's *addition*, not reduction |
| `docs/PRIOR-ART.md` | Shout-outs to the toys that came before, and our data sources |
| `schema/` | The shape each entry must match (a robot checks this) |

## Use it yourself (install the skill)

This whole repo **is** a Claude skill — a `SKILL.md` plus its data files. Installing
it is itself a small lesson in how skill files work, which is very much the point.

**In Claude Code** — clone it into your personal skills folder:

```bash
git clone https://github.com/jmilbery/boston-translatah ~/.claude/skills/boston-translatah
```

Start a new session and just ask, in plain English:

- "Make this email sound Boston."
- "Boston-ify this, light touch." *(the readable, still-professional setting)*
- "Give me the full Masshole version." *(the bit — accent cranked to eleven)*
- "Translate this to Brockton / South Shore." *(the 508 mode)*
- "Make this sound St. Louis." *(the 314 mode — where the R's go back in)*

The skill triggers on phrasing like *make this sound Boston, Boston-ify, speak
Masshole, make this sound St. Louis,* or *translate to/from Boston slang.* No
restart needed beyond opening a new conversation — skills are auto-detected.

**Update it later** as the dictionary grows:

```bash
cd ~/.claude/skills/boston-translatah && git pull
```

**No install, just a quick try** — paste the contents of [`SKILL.md`](SKILL.md) and
[`data/pronunciation/rules.yml`](data/pronunciation/rules.yml) into any Claude chat
and ask it to translate your text. Less slick, works anywhere.

> The **thickness dial** (light → local → full Masshole) and the regional modes are
> described in [`SKILL.md`](SKILL.md). Ask for the level you want; default is a
> readable middle.

## The rules that keep it real

1. **Every entry cites a source.** A link, or two locals who'll vouch. No source,
   no merge. This is a dictionary, not a bathroom wall.
2. **The joke is with people, never at them.** See [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
3. **Boston is just the first city.** The engine is region-agnostic — Yinzer,
   Philly, Baltimore, Minnesota, Cajun are all welcome as new data files. Boston
   is the reference implementation; **St. Louis (`stl-314`) is the proof.**
   Adding a city is one entry in [`data/regions.yml`](data/regions.yml) plus your
   word files. No schema editing, no JavaScript.

## License

MIT. Take it, fork it, teach your own team with it.
