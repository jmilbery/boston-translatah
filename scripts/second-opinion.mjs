#!/usr/bin/env node
// The second opinion. validate.mjs checks that an entry is *shaped* right; this
// asks whether it *reads* right, the things CONTRIBUTING.md leaves to a human
// reviewer: does the example actually use the word, is it with people rather
// than at them, does it sound like real slang, and is it already in the
// dictionary under another spelling.
//
// It asks Jev (TypeSafe's judgment model, https://docs.typesafe.ai) a few narrow
// questions per entry and turns the answers into plain English.
// It is advisory. It always exits 0 and it can never block a merge. A human
// reviewer always has the last word.
//
// Run:  npm run second-opinion                  (entries changed on this branch)
//       npm run second-opinion -- --all         (the whole dictionary)
//       npm run second-opinion -- path/to/x.yml (specific files)
//       add --scores to see the raw numbers behind every entry
//
// Needs TYPESAFE_API_KEY in the environment. Without it, it says so and exits
// quietly. That's normal on forks, where GitHub doesn't hand out secrets.

import { readFileSync, readdirSync, statSync, existsSync, appendFileSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import yaml from "js-yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENDPOINT = process.env.TYPESAFE_BASE_URL
  ? `${process.env.TYPESAFE_BASE_URL.replace(/\/$/, "")}/v1/systemone`
  : "https://api.typesafe.ai/v1/systemone";
const MODEL = "jev-1.13.0"; // pinned so the thresholds below keep meaning what they meant

// Tuned against the real dictionary (should raise nothing) and the made-up bad
// entries in scripts/second-opinion.fixtures/ (should raise most). Re-tune with
// --scores if the model pin changes.
//
// (There's no register check. We tried one: Jev puts nearly every entry near a
// 2, so it couldn't tell a mislabeled register from a real one. The humans who
// know the street keep that job.)
const THRESHOLDS = {
  exampleUsesTerm: 0.2, // flag when the chance the example uses the term is below this
  localMatches: 0.2, // phrases: flag when the chance `local` says the same as `phrase` is below this
  atNotWith: 0.6, // flag when the chance it's punching down is above this
  realUsage: 0.4, // flag when the chance it's established slang is below this
  dupe: 0.9, // flag when Jev is this sure it's a respelling of an existing entry
};

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const paths = args.filter((a) => !a.startsWith("--"));

const key = process.env.TYPESAFE_API_KEY;
if (!key) {
  say("Second opinion skipped: no TypeSafe key here. That's normal on forks, nothing to fix.");
  process.exit(0);
}

// --- what to look at -------------------------------------------------------

function allEntries() {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith(".yml") && !name.startsWith("_")) out.push(p);
    }
  };
  walk(join(root, "data/lexicon"));
  walk(join(root, "data/phrases"));
  return out;
}

function changedEntries() {
  // On a fork, your own main can drift; compare against the real one if you've
  // added it as the "upstream" remote.
  const hasUpstream = () => {
    try {
      execSync("git rev-parse --verify -q upstream/main", { cwd: root, stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  };
  const base = process.env.GITHUB_BASE_REF
    ? `origin/${process.env.GITHUB_BASE_REF}`
    : hasUpstream() ? "upstream/main" : "origin/main";
  let out;
  try {
    out = execSync(`git diff --name-only --diff-filter=AM ${base}...HEAD -- data/lexicon data/phrases`, {
      cwd: root,
      encoding: "utf8",
    });
  } catch {
    say(`Couldn't diff against ${base}. Pass --all or some file paths instead.`);
    return [];
  }
  return out
    .split("\n")
    .filter((f) => f.endsWith(".yml") && !f.split("/").pop().startsWith("_"))
    .map((f) => join(root, f))
    .filter(existsSync);
}

const files = paths.length ? paths.map((p) => join(process.cwd(), p)) : flag("--all") ? allEntries() : changedEntries();

// The dictionary a new entry could be duplicating: its own region plus anything
// the region inherits (brockton-508 speaks all of boston).
const regions = new Map(yaml.load(readFileSync(join(root, "data/regions.yml"), "utf8")).map((r) => [r.slug, r]));
function lineage(slug) {
  const chain = [];
  for (let cur = slug; cur && regions.has(cur) && !chain.includes(cur); cur = regions.get(cur).inherits) chain.push(cur);
  return chain;
}
const lexicon = allEntries()
  .filter((f) => f.includes(`${join("data", "lexicon")}`))
  .map((f) => ({ file: f, doc: yaml.load(readFileSync(f, "utf8")) }));

// --- the questions ---------------------------------------------------------

function questionsFor(doc, isPhrase) {
  const q = {
    at_not_with: {
      type: "noul",
      instructions:
        "Does this dictionary entry mock or punch down at a group of people (their class, ethnicity, intelligence or looks), " +
        "rather than celebrating how people there talk? Affectionate ribbing of a city or its drivers is fine.",
    },
  };
  if (isPhrase) {
    q.local_matches = {
      type: "noul",
      instructions: "Is `local` a regional way of saying the same thing as `phrase`?",
    };
    return q;
  }
  q.example_uses_term = {
    type: "noul",
    instructions:
      "Does `example` actually use `term` (or one of `also`), in the sense given by `means`? " +
      "Accent respellings count: 'cruisah' is a use of 'cruiser', 'chowdah' of 'chowder'.",
  };
  q.real_usage = {
    type: "noul",
    instructions: "Is `term` established slang that people in `region` really use, rather than an invented word or an inside joke?",
  };
  const others = lexicon.filter(
    (e) => lineage(doc.region).includes(e.doc.region) && e.doc.term !== doc.term
  );
  if (others.length) {
    // Only respellings. Two different words for one thing (grinder, spuckie) is
    // a dictionary doing its job, not a duplicate.
    const criteria = { none: "Not a respelling of any other option; a genuinely different word" };
    for (const e of others.slice(0, 250)) criteria[e.doc.term] = [e.doc.term, ...(e.doc.also ?? [])].join(" / ");
    q.dupe_of = {
      type: "choice",
      instructions: "Is `term` just another spelling of one of these existing words? If so, which one?",
      criteria,
    };
  }
  return q;
}

async function ask(state, questions) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ state, model: MODEL, questions }),
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) return (await res.json()).answers;
      if (res.status !== 429 && res.status < 500) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    } catch (e) {
      if (attempt === 1 || !/timeout|fetch failed|HTTP 5|HTTP 429/i.test(String(e))) throw e;
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error("TypeSafe didn't answer after a retry");
}

// --- turning numbers into English -----------------------------------------

function notes(doc, a, isPhrase) {
  const out = [];
  const name = isPhrase ? `"${doc.local}"` : `"${doc.term}"`;
  if (a.at_not_with?.noul > THRESHOLDS.atNotWith) {
    out.push(`${name} might read as laughing *at* people rather than with them. Worth a look against docs/TONE.md.`);
  }
  if (isPhrase) {
    if (a.local_matches?.noul < THRESHOLDS.localMatches) {
      out.push(`The \`local\` line doesn't seem to say the same thing as \`phrase\`. Typo, or two different sayings?`);
    }
    return out;
  }
  if (a.example_uses_term?.noul < THRESHOLDS.exampleUsesTerm) {
    out.push(`The example sentence doesn't seem to use ${name} the way \`means\` says. A reviewer will probably ask about it.`);
  }
  if (a.real_usage?.noul < THRESHOLDS.realUsage) {
    out.push(
      `The robot hasn't heard ${name} before. That's fine if your source backs it up. Just make sure it's real usage, not the group chat.`
    );
  }
  const d = a.dupe_of;
  if (d && d.choice !== "none" && d.probabilities?.[d.choice] >= THRESHOLDS.dupe) {
    const twin = lexicon.find((e) => e.doc.term === d.choice);
    out.push(
      `This looks like another spelling of the existing "${d.choice}". If it's the same word, ` +
        `add it under \`also:\` in ${relative(root, twin.file)} instead of a new file.`
    );
  }
  return out;
}

function rawLine(a) {
  const n = (x) => (typeof x === "number" ? x.toFixed(2) : " -  ");
  const d = a.dupe_of;
  return (
    `at=${n(a.at_not_with?.noul)} ex=${n(a.example_uses_term?.noul ?? a.local_matches?.noul)} ` +
    `real=${n(a.real_usage?.noul)} ` +
    `dupe=${d ? `${d.choice}@${n(d.probabilities?.[d.choice])}` : "-"}`
  );
}

// --- go --------------------------------------------------------------------

function say(msg) {
  console.log(msg);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, msg + "\n");
}

if (!files.length) {
  say("Second opinion: no new or changed entries to look at.");
  process.exit(0);
}

say(`## Second opinion (advisory)\n\nLooked at ${files.length} entr${files.length === 1 ? "y" : "ies"}. Nothing here blocks a merge.\n`);

let flagged = 0;
for (const file of files) {
  const rel = relative(root, file);
  let doc;
  try {
    doc = yaml.load(readFileSync(file, "utf8"));
  } catch {
    continue; // not valid YAML; validate.mjs already said so, in English
  }
  if (!doc || typeof doc !== "object") continue;
  const isPhrase = "phrase" in doc;
  let a;
  try {
    a = await ask(doc, questionsFor(doc, isPhrase));
  } catch (e) {
    say(`- \`${rel}\`: couldn't get a second opinion (${e.message}). Skipping it.`);
    continue;
  }
  const found = notes(doc, a, isPhrase);
  if (flag("--scores")) console.log(`  ${found.length ? "!" : " "} ${rel.padEnd(48)} ${rawLine(a)}`);
  if (!found.length) continue;
  flagged++;
  say(`- \`${rel}\`\n${found.map((n) => `  - ${n}`).join("\n")}`);
  // Shows up right on the file in the PR's "Files changed" tab.
  if (process.env.GITHUB_ACTIONS) for (const n of found) console.log(`::warning file=${rel},title=Second opinion::${n.replace(/\n/g, " ")}`);
}

say(
  flagged
    ? `\n${flagged} entr${flagged === 1 ? "y" : "ies"} with a heads-up. These are hunches, not rules; a human decides.`
    : "\nNo notes. Wicked clean."
);
