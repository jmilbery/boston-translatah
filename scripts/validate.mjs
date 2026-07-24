#!/usr/bin/env node
// The robot at the door. Checks every lexicon and phrase entry against its
// schema and — the rule we won't bend — that it cites a source.
// Run: npm test    (or: node scripts/validate.mjs)
//
// Deps: js-yaml, ajv. If they're missing, `npm install` first.

import { readFileSync, readdirSync, statSync } from "node:fs";
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

let errors = 0;
let checked = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".yml") && !name.startsWith("_")) yield_file(p);
  }
}

function fail(file, msg) {
  console.error(`  ✗ ${file.replace(root + "/", "")}\n      ${msg}`);
  errors++;
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
  // Filename should match the slug of the term (lexicon only), keeps diffs clean.
  if (!isPhrase && doc.term) {
    const slug = doc.term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const fileSlug = basename(file, ".yml");
    if (slug !== fileSlug) {
      fail(file, `filename "${fileSlug}.yml" should match the term slug "${slug}.yml"`);
    }
  }
}

console.log("Checking entries…\n");
walk(join(root, "data/lexicon"));
walk(join(root, "data/phrases"));

console.log(`\n${checked} entries checked, ${errors} problem(s).`);
if (errors > 0) {
  console.error("\nNot merge-ready. Fix the above and run again. (The back-and-forth is the tutorial.)");
  process.exit(1);
}
console.log("All good. Wicked clean. ✅");
