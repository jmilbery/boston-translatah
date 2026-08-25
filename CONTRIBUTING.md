# How to add a word (your first pull request)

Read this the whole way through once before you start. It's written for someone
who has **never** used git, GitHub, or a code editor. If that's you, you're the
person we built this for. You'll feel a little dumb the first time. Everybody
does. Ten minutes from now you'll have done the thing every software engineer
does every day.

You don't need to install anything. You don't need a terminal. You do it all in
the web browser.

## What you're actually doing (the map)

Adding a word = **creating one small file** and asking us to include it. That
request is called a **pull request** (PR). That's the whole game.

- **Repo** = this project (a folder of files that lives on GitHub).
- **Fork** = your own personal copy of the repo. You can't break ours; you play
  in yours.
- **Commit** = saving a change with a note about what you did.
- **Pull request** = "hey, please pull my change into the real repo." A human
  reads it, and a robot checks it followed the rules.

That's the entire vocabulary. If any of those words scared you a paragraph ago,
notice that they don't anymore.

## The steps

1. **Get a GitHub account** (free) at github.com. Do this once.
2. **Fork this repo** — click **Fork**, top-right of the repo page. Now you have
   your own copy.
3. **Find where your word goes.** Open the folder `data/lexicon/boston/`
   (or `data/lexicon/brockton-508/` for South Shore words, or
   `data/lexicon/stl-314/` for St. Louis). The full list of cities we speak is
   in `data/regions.yml`.
4. **Copy the template.** Open `data/lexicon/_TEMPLATE.yml`, click the pencil ✏️,
   select all, copy.
5. **Make your file.** In the `boston` folder, click **Add file → Create new
   file**. Name it after your word, lowercase, with `.yml` on the end —
   e.g. `spuckie.yml`. Paste the template in and fill it out (next section).
6. **Save it** — GitHub calls this "Commit new file." Write a short note like
   "add spuckie" and click the green button.
7. **Open the pull request** — GitHub will show a **"Contribute → Open pull
   request"** button. Click it, write one line about your word, submit.
8. **Wait.** A robot checks your file's shape and that you cited a source. A human
   reads it. If something's off, they'll comment — that's normal, not failure.
   Fix it, and it merges.

That's it. You just contributed to open source.

## Filling out the file

```yaml
term: spuckie              # the local word
means: submarine sandwich  # what it means in plain English
also: [spukie]             # other spellings (optional)
region: boston             # any slug listed in data/regions.yml
register: 3                # 1 = everyone knows it (wicked) ... 3 = deep local (spuckie)
part_of_speech: noun
example: "Grab me a spuckie from the corner spa."
notes: mostly older / East Boston                        # optional
sources:                   # REQUIRED — at least one. No source, no merge.
  - type: url
    ref: https://en.wiktionary.org/wiki/Appendix:Glossary_of_Boston_slang
  # OR, if it's not written down anywhere:
  # - type: vouch
  #   ref: "two Dorchester natives, b. 1980s"
```

**The `sources` block is the one rule we won't bend.** This is a dictionary, not
a bathroom wall. A published link is best. If your word is real but nobody wrote
it down, `type: vouch` with who's vouching is fine — but "my buddy says it" for
something no one else has ever heard is how a dictionary turns into garbage.

## The bar

- Real usage by real people. Not an inside joke from your group chat.
- **With people, never at them.** No slurs, no punching down at any ethnic,
  racial, or class group. See `CODE_OF_CONDUCT.md`. We *reverse-map* offensive
  historical terms so the translator can understand them, but it will never
  *produce* one — and those get added by maintainers, not PRs.
- One word per file. One file per PR when you're learning. It keeps your first
  one clean and easy to review.

## Adding a whole new city

Your town isn't here at all? Good — that's the point of the project. It's four
steps, and none of them are code:

1. Add an entry to `data/regions.yml`: a `slug` (lowercase-with-dashes, we use
   city + area code, like `stl-314`), a human `name`, and optionally
   `inherits:` if your dialect is a variant of one that's already here.
2. Make the folder `data/lexicon/<your-slug>/` and put your word files in it,
   same format as everybody else's.
3. Pick an accent. If your town sounds like the group it belongs to, add
   `inherits:` pointing at that family (`inland-north`, `midland`) and you get
   its accent for free — no `accent:` line needed. If your town has phonetic
   rules of its own, add `data/pronunciation/<your-slug>.yml` and point
   `accent:` at it instead.
4. Add your mode to the "Regional modes" list in `SKILL.md` so the translator
   knows the attitude, not just the words.

`chicago-312` is the shortest worked example: three lines in `regions.yml`, no
accent file, because it inherits the Inland North sound. `stl-314` is the long
one, for a city that needed its own. You do **not** need to touch `schema/` or
`scripts/`; the robot reads `regions.yml` and figures it out.

**If your city sits in two dialect groups**, `inherits:` takes a list and the
first one wins: `inherits: [midland, inland-north]`. Most cities don't need
this. Read the note on St. Louis in `data/regions.yml` before you reach for it,
because the obvious case turned out not to be one.

## Stuck?

Open an **Issue** (the "Issues" tab, then "New issue" → "I'm stuck"). Describe
where you got lost. Getting stuck and asking is also a thing engineers do every
day. Welcome to the trade.
