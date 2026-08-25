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

// Which accent file does a region actually use? Its own if it names one, else
// the first one it can reach by walking up its parents in priority order. This
// is what makes a family more than a comment: a city inherits the sound.
function accentFor(slug, bySlug, seen) {
  if (seen.has(slug)) return undefined; // loops are reported elsewhere
  seen.add(slug);
  const r = bySlug.get(slug);
  if (!r) return undefined;
  if (r.accent !== undefined) return r.accent;
  for (const p of parentsBySlug.get(slug) || []) {
    const found = accentFor(p, bySlug, seen);
    if (found !== undefined) return found;
  }
  return undefined;
}

let regionsBySlug = new Map();
const parentsBySlug = new Map();
const termsByRegion = new Map();

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

    // `inherits:` takes one slug or a list of them. Normalise it here, once,
    // so nothing downstream has to care which form was written — and so a
    // malformed one is reported a single time instead of by every check.
    if (r.inherits === undefined) {
      parentsBySlug.set(r.slug, []);
    } else {
      const list = Array.isArray(r.inherits) ? r.inherits : [r.inherits];
      if (list.some((p) => typeof p !== "string")) {
        failRegistry(`"${r.slug}" has an inherits: that isn't a slug or a list of slugs.`);
        parentsBySlug.set(r.slug, []);
      } else {
        parentsBySlug.set(r.slug, list);
      }
    }
  }

  // inherits/accent can only be checked once every slug is known.
  for (const r of bySlug.values()) {
    const seenParent = new Set();
    for (const p of parentsBySlug.get(r.slug)) {
      if (seenParent.has(p)) {
        failRegistry(`"${r.slug}" lists "${p}" as a parent twice. Once is enough.`);
        continue;
      }
      seenParent.add(p);
      if (!bySlug.has(p)) {
        failRegistry(`"${r.slug}" inherits "${p}", which isn't a region here.`);
      }
    }
    if (r.kind !== undefined && r.kind !== "city" && r.kind !== "family") {
      failRegistry(`"${r.slug}" has kind: "${r.kind}". It's either a "city" or a "family" of them.`);
    }
    if (r.accent !== undefined && !existsSync(join(root, "data/pronunciation", r.accent))) {
      failRegistry(`"${r.slug}" points at accent file "${r.accent}", which doesn't exist in data/pronunciation/.`);
    }
    // A city in a family usually shares the family's accent, so it can leave
    // accent: off and pick one up from its parents. What a family is FOR.
    if (r.accent === undefined && r.kind !== "family" && accentFor(r.slug, bySlug, new Set()) === undefined) {
      failRegistry(`"${r.slug}" has no accent: of its own and inherits from nothing that has one. It'll get word swaps but no accent — say accent: outright if that's deliberate.`);
    }
  }

  // A family exists to be inherited from. One with no children is either a typo
  // or a leftover, and either way it's dead weight in the file a newcomer reads
  // first.
  const hasChildren = new Set();
  for (const kids of parentsBySlug.values()) for (const p of kids) hasChildren.add(p);
  for (const r of bySlug.values()) {
    if (r.kind === "family" && !hasChildren.has(r.slug)) {
      failRegistry(`"${r.slug}" is a family, but no region inherits from it. Either something should, or it shouldn't be here.`);
    }
  }

  // A region can name more than one parent now, so this is a DAG rather than
  // a forest and walking up one chain no longer proves anything: a loop can
  // hide behind a node's SECOND parent while its first is perfectly clean.
  // Depth-first with three states — untouched, on the current path, finished —
  // finds every loop and can name the exact way round it.
  const UNTOUCHED = 0, ON_PATH = 1, DONE = 2;
  const state = new Map([...bySlug.keys()].map((s) => [s, UNTOUCHED]));
  const alreadySaid = new Set();
  const path = [];

  function walkParents(slug) {
    state.set(slug, ON_PATH);
    path.push(slug);
    for (const p of parentsBySlug.get(slug)) {
      if (!bySlug.has(p)) continue; // already reported as unknown above
      if (state.get(p) === ON_PATH) {
        const loop = path.slice(path.indexOf(p)).concat(p);
        const key = [...new Set(loop)].sort().join(",");
        if (!alreadySaid.has(key)) {
          alreadySaid.add(key);
          failRegistry(`inheritance loop: ${loop.join(" → ")}. Somebody has to be the parent.`);
        }
      } else if (state.get(p) === UNTOUCHED) {
        walkParents(p);
      }
    }
    path.pop();
    state.set(slug, DONE);
  }

  for (const slug of bySlug.keys()) {
    if (state.get(slug) === UNTOUCHED) walkParents(slug);
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
  // Remember who defines what, so inherited collisions can be spotted below.
  if (!isPhrase && doc.term) {
    if (!termsByRegion.has(doc.region)) termsByRegion.set(doc.region, new Map());
    termsByRegion.get(doc.region).set(doc.term.toLowerCase(), doc.means);
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

// With one parent, "which region does this word come from" had one answer. With
// two it can have two, and the loser is decided by list order — quietly, unless
// somebody says so. Nobody learning git should lose an afternoon to a word they
// never saw get overruled, so say it out loud and name the fix.
const resolvedCache = new Map();
function resolvedTerms(slug) {
  if (resolvedCache.has(slug)) return resolvedCache.get(slug);
  const out = new Map(); // term -> the region that actually defines it
  for (const p of parentsBySlug.get(slug) || []) {
    if (!regionsBySlug.has(p)) continue;
    for (const [term, owner] of resolvedTerms(p)) if (!out.has(term)) out.set(term, owner);
  }
  for (const [term, means] of termsByRegion.get(slug) || []) out.set(term, { slug, means });
  resolvedCache.set(slug, out);
  return out;
}

function checkInheritedCollisions() {
  for (const slug of regionsBySlug.keys()) {
    const parents = (parentsBySlug.get(slug) || []).filter((p) => regionsBySlug.has(p));
    if (parents.length < 2) continue; // one parent can't disagree with itself
    const own = termsByRegion.get(slug) || new Map();
    const from = new Map();
    for (const p of parents) {
      for (const [term, def] of resolvedTerms(p)) {
        if (own.has(term)) continue; // the child already settled it
        const prior = from.get(term);
        if (!prior) {
          from.set(term, def);
        } else if (prior.slug !== def.slug && prior.means !== def.means) {
          // Two parents that agree on what a word means aren't in conflict —
          // that's just one word arriving by two roads. Only a genuine
          // disagreement is worth interrupting somebody over.
          failRegistry(
            `"${slug}" inherits "${term}" from both "${prior.slug}" (${prior.means}) and ` +
              `"${def.slug}" (${def.means}). Parents are listed in priority order, so ` +
              `"${prior.slug}" wins — if that's wrong, add "${term}" to data/lexicon/${slug}/ ` +
              `and settle it there.`
          );
          from.set(term, def); // said once; don't repeat it for a third parent
        }
      }
    }
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

// Needs every entry indexed first, so it runs last.
checkInheritedCollisions();

console.log(`\n${checked} entries checked, ${errors} problem(s).`);
if (errors > 0) {
  console.error("\nNot merge-ready. Fix the above and run again. (The back-and-forth is the tutorial.)");
  process.exit(1);
}
console.log("All good. Wicked clean. ✅");
