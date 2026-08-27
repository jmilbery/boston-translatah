# Boston Translatah — history

OSS teaching-vehicle skill (dialect translator; Claude speaks Masshole). Repo [jmilbery/boston-translatah](https://github.com/jmilbery/boston-translatah), local `/Users/jmilbery/BostonAccents`. The slang is bait; the payload is teaching non-devs git/forks/PRs. Shipped public 2026-07-24.

## 2026-08-26 — the cork came out

### PR #1 merged
- Merged as `787d1b4`, **a merge commit, not a squash — deliberately**. Kirby Montgomery's 3 commits are a request-and-answer sequence that reads as a teaching artifact, and PRs **#4/#5/#6 branch off that history**, so squashing would have orphaned them.
- Two cities now live, **56 entries validating**. `data/regions.yml` is the architectural decision that paid off: **adding a city is a line of data, not a schema change.**

### The CI gate was broken in two ways, not one
This is the expensive lesson.

1. PR #3 (2026-08-24) fixed the workflow's `paths:` filter — necessary, but **not sufficient**.
2. The deeper bug: branch protection required the status context **`Validate entries`** — that is the ***workflow*** name. **GitHub publishes the *job* name**, and the job was unnamed, so it reported as **`validate`**. The two strings never matched.

Consequence: **every PR had been unmergeable since branch protection went on 2026-08-20**, green CI or not. The required check simply never arrived under the name protection was waiting for.

Proved empirically on a single branch: **filter-fix alone → `BLOCKED`; naming the job → `CLEAN`.**

Fix: `c754d22` — **named the job**. The protection ruleset was left untouched.

> Rule to carry forward: a required status check context is the **job** name, not the workflow name. Verify by reading what GitHub actually published on a real run, not by reading the YAML's `name:` at the top.

### Dependabot: zero open alerts
- **#2** recreated and merged — `fast-uri` → **3.1.6**.
- **`js-yaml`** carried a **high-severity alert with no Dependabot PR ever filed** — it had to be found and fixed by hand, in **#7** (`b0ae65f`). Worth remembering that "no PR" ≠ "no alert."

### Content
- **Part 3 posted** as a comment on the LinkedIn article, tagging Kirby. The spine of the piece is **the CI failure, not the merge** — the article's own thesis about *claimed-vs-permitted* turned out to describe Jim's own branch protection exactly.

### Ball is on Kirby, not Jim
Priority dropped from high to medium for this reason: Jim is no longer the blocker.
- **#4** cross-region translation — greenlit; needs **rebase + undraft**.
- **Validator-message test PR** — Kirby offered, Jim greenlit, and it is sequenced ***ahead of* #5**. The rationale: those plain-English error strings **are the actual product**, and nothing tests them.
- **#6** the `scene:` / STL-rapper feature — independent, gets a real read.
- **#5** dialect families — **held**. 1,610 lines that decide whether this project is a Boston bit or a dialect-family framework. **Jim owes that decision** before the PR gets read.
