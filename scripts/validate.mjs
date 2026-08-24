#!/usr/bin/env node
// The robot at the door. Checks every lexicon and phrase entry against its
// schema, that its region is a city we actually speak (data/regions.yml) and
// that it's filed in the matching folder, and — the rule we won't bend — that
// it cites a source.
// Run: npm test    (or: node scripts/validate.mjs)
//
// Deps: js-yaml, ajv. If they're missing, `npm install` first.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import Ajv from "ajv";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ajv = new Ajv({ allErrors: true });

const lexiconSchema = JSON.parse(readFileSync(join(root, "schema/lexicon.schema.json")));
const phraseSchema = JSON.parse(readFileSync(join(root, "schema/phrase.schema.json")));
const validateLexicon = ajv.compile(lexiconSchema);
const validatePhrase = ajv.compile(phraseSchema);
const curriculumSchema = JSON.parse(readFileSync(join(root, "schema/curriculum.schema.json")));
const validateCurriculum = ajv.compile(curriculumSchema);

// Region slugs and the region: field in both schemas agree on this shape.
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

let errors = 0;
let checked = 0;

function fail(file, msg) {
  console.error(`  ✗ ${file.replace(root + "/", "")}\n      ${msg}`);
  errors++;
}

let regionsBySlug = new Map();

const REGISTRY = "data/regions.yml";
const failRegistry = (msg) => fail(join(root, REGISTRY), msg);

// The cities we speak. Adding one is a line in data/regions.yml — not a schema
// edit. Since that's the file a newcomer edits first, check it thoroughly and
// complain in English rather than throwing a stack trace at them. Like the rest
// of this script it collects every problem rather than stopping at the first.
function loadRegions() {
  let doc;
  try {
    doc = yaml.load(readFileSync(join(root, REGISTRY), "utf8"));
  } catch (e) {
    failRegistry(`not valid YAML: ${e.message}`);
    return new Set();
  }
  if (!Array.isArray(doc) || doc.length === 0) {
    failRegistry("should be a non-empty list of regions, each with a slug.");
    return new Set();
  }

  const bySlug = new Map();
  for (const r of doc) {
    if (!r || typeof r.slug !== "string" || !SLUG.test(r.slug)) {
      failRegistry(`every region needs a lowercase-with-dashes slug (got ${JSON.stringify(r?.slug)}).`);
      continue;
    }
    if (bySlug.has(r.slug)) {
      failRegistry(`"${r.slug}" is listed twice.`);
      continue;
    }
    bySlug.set(r.slug, r);
  }

  // inherits/accent can only be checked once every slug is known.
  for (const r of bySlug.values()) {
    if (r.inherits !== undefined && !bySlug.has(r.inherits)) {
      failRegistry(`"${r.slug}" inherits "${r.inherits}", which isn't a region here.`);
    }
    if (r.accent !== undefined && !existsSync(join(root, "data/pronunciation", r.accent))) {
      failRegistry(`"${r.slug}" points at accent file "${r.accent}", which doesn't exist in data/pronunciation/.`);
    }
  }

  // Every region inherits at most one parent, so the graph should be a forest.
  // A loop would send anything walking the chain round forever — including a
  // human reading it. Catches "inherits itself" as the one-link case.
  const inLoop = new Set();
  for (const slug of bySlug.keys()) {
    if (inLoop.has(slug)) continue;
    const chain = [slug];
    let cur = bySlug.get(slug).inherits;
    while (cur !== undefined && bySlug.has(cur)) {
      if (chain.includes(cur)) {
        chain.push(cur);
        chain.forEach((s) => inLoop.add(s));
        failRegistry(`inheritance loop: ${chain.join(" → ")}. Somebody has to be the parent.`);
        break;
      }
      chain.push(cur);
      cur = bySlug.get(cur).inherits;
    }
  }

  // Curricula need the whole record, not just the slug — they have to find
  // the accent file a region points at.
  regionsBySlug = bySlug;
  return new Set(bySlug.keys());
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".yml") && !name.startsWith("_")) yield_file(p);
  }
}

function yield_file(file) {
  checked++;
  const isPhrase = file.includes(`${join("data", "phrases")}`) || file.includes("/data/phrases/");
  let doc;
  try {
    doc = yaml.load(readFileSync(file, "utf8"));
  } catch (e) {
    return fail(file, `not valid YAML: ${e.message}`);
  }
  const validate = isPhrase ? validatePhrase : validateLexicon;
  if (!validate(doc)) {
    const msg = validate.errors.map((e) => `${e.instancePath || "(root)"} ${e.message}`).join("; ");
    return fail(file, msg);
  }
  // Belt-and-suspenders on the one rule we care most about.
  if (!Array.isArray(doc.sources) || doc.sources.length === 0) {
    return fail(file, "no source cited — this is a dictionary, not a bathroom wall");
  }
  // The region has to be a city we actually speak, and the file has to live in it.
  if (!knownRegions.has(doc.region)) {
    return fail(
      file,
      `region "${doc.region}" isn't in data/regions.yml. Known: ${[...knownRegions].join(", ")}. ` +
        `New city? Add it there first — that's the whole plumbing.`
    );
  }
  const folder = basename(dirname(file));
  if (folder !== doc.region) {
    fail(file, `region "${doc.region}" but the file sits in "${folder}/" — move it or fix the region`);
  }
  // Filename should match the slug of the term (lexicon only), keeps diffs clean.
  if (!isPhrase && doc.term) {
    const slug = doc.term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const fileSlug = basename(file, ".yml");
    if (slug !== fileSlug) {
      fail(file, `filename "${fileSlug}.yml" should match the term slug "${slug}.yml"`);
    }
  }
}

// A curriculum is the first file that reads across TWO regions at once, so it
// can go wrong in ways a single-region entry can't: a rule id that was renamed
// in one engine, a destination with no accent file to teach. Check both ends
// and say which end broke. Same house style as the registry checker above —
// collect everything, one pass, plain English.
const accentCache = new Map();
function accentRuleIds(file) {
  if (accentCache.has(file)) return accentCache.get(file);
  let ids = null;
  try {
    const doc = yaml.load(readFileSync(join(root, "data/pronunciation", file), "utf8"));
    if (Array.isArray(doc)) ids = new Set(doc.map((r) => r && r.id).filter(Boolean));
  } catch {
    ids = null;
  }
  accentCache.set(file, ids);
  return ids;
}

// Which rules can this region actually be taught, or talked out of? The one
// its accent file defines. No accent file, no rules, nothing to teach.
function rulesFor(slug, file, endLabel) {
  const region = regionsBySlug.get(slug);
  if (!region) {
    fail(file, `${endLabel} region "${slug}" isn't in data/regions.yml. Known: ${[...knownRegions].join(", ")}.`);
    return null;
  }
  if (!region.accent) {
    fail(file, `${endLabel} region "${slug}" has no accent: file in data/regions.yml, so it has no rules. A curriculum needs an accent at both ends.`);
    return null;
  }
  const ids = accentRuleIds(region.accent);
  if (!ids) {
    fail(file, `couldn't read the rules out of data/pronunciation/${region.accent} — it should be a list of rules, each with an id.`);
    return null;
  }
  return { ids, accent: region.accent };
}

function checkCurriculum(file) {
  checked++;
  let doc;
  try {
    doc = yaml.load(readFileSync(file, "utf8"));
  } catch (e) {
    return fail(file, `not valid YAML: ${e.message}`);
  }
  if (!validateCurriculum(doc)) {
    const msg = validateCurriculum.errors.map((e) => `${e.instancePath || "(root)"} ${e.message}`).join("; ");
    return fail(file, msg);
  }

  const want = `${doc.from}-to-${doc.to}.yml`;
  if (basename(file) !== want) {
    fail(file, `filename "${basename(file)}" should be "${want}" — the convention is <from>-to-<to>.yml`);
  }

  const to = rulesFor(doc.to, file, "destination");
  const from = rulesFor(doc.from, file, "origin");

  const seen = new Map();
  for (const lesson of doc.lessons) {
    const label = `lesson ${lesson.order} ("${lesson.name}")`;
    if (seen.has(lesson.order)) {
      fail(file, `${label} and "${seen.get(lesson.order)}" are both order ${lesson.order}. Lessons run in sequence — give them different numbers.`);
    } else {
      seen.set(lesson.order, lesson.name);
    }
    const learn = lesson.learn || [];
    const unlearn = lesson.unlearn || [];
    if (learn.length === 0 && unlearn.length === 0) {
      fail(file, `${label} neither learns nor unlearns a rule. A lesson has to move something.`);
    }
    if (to) {
      for (const id of learn) {
        if (!to.ids.has(id)) {
          fail(file, `${label} teaches "${id}", which isn't a rule in data/pronunciation/${to.accent}. That file has: ${[...to.ids].join(", ")}.`);
        }
      }
    }
    if (from) {
      for (const id of unlearn) {
        if (!from.ids.has(id)) {
          fail(file, `${label} un-teaches "${id}", which isn't a rule in data/pronunciation/${from.accent}. That file has: ${[...from.ids].join(", ")}.`);
        }
      }
    }
  }
}

function walkCurriculum(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name.endsWith(".yml") && !name.startsWith("_")) checkCurriculum(join(dir, name));
  }
}

console.log("Checking entries…\n");

// The region list has to be right before any entry's region can be judged.
const knownRegions = loadRegions();
if (errors > 0) {
  console.error(`\n${errors} problem(s) in ${REGISTRY}. Fix the region list first — everything else is checked against it.`);
  process.exit(1);
}

walk(join(root, "data/lexicon"));
walk(join(root, "data/phrases"));
walkCurriculum(join(root, "data/curriculum"));

console.log(`\n${checked} entries checked, ${errors} problem(s).`);
if (errors > 0) {
  console.error("\nNot merge-ready. Fix the above and run again. (The back-and-forth is the tutorial.)");
  process.exit(1);
}
console.log("All good. Wicked clean. ✅");
