#!/usr/bin/env node
// Checks the checker. The order rules in validate.mjs only help a first-timer
// if they fail in English, so this runs the validator against a folder of
// orders that are broken on purpose (scripts/orders.fixtures/) and makes sure
// each one gets the message it should, and the one good file gets none.
// Run: npm test    (or: node scripts/check-order-messages.mjs)
//
// It builds a throwaway copy of the repo in your temp folder rather than
// pointing the real validator at the fixtures, so the real data/ and the real
// data/regions.yml are never touched.

import { mkdtempSync, mkdirSync, cpSync, symlinkSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixtures = join(root, "scripts/orders.fixtures");

// file (as the validator prints it) → a piece of the message it must contain.
const expected = {
  "data/orders/boston/missing-source.yml": "no source cited",
  "data/orders/boston/bad-mood.yml": "has to be love, gripe or shrug",
  "data/orders/boston/too-many-takes.yml": "takes needs one to three lines",
  "data/orders/boston/no-takes.yml": 'missing "takes"',
  "data/orders/boston/misspelled-field.yml": `"take" isn't a field orders have`,
  "data/orders/boston/filename-mismatch.yml": 'should match the order, "something-else-entirely.yml"',
  "data/orders/boston/wrong-folder.yml": 'the file sits in "boston/"',
  "data/orders/nowhere-000/unknown-region.yml": `region "nowhere-000" isn't in data/regions.yml`,
  "data/orders/plain-000/spoken-without-accent.yml": '"plain-000" has no accent file',
  "data/orders/boston/not-yaml.yml": "not valid YAML",
};
const mustPass = "data/orders/boston/good-order.yml";

const tmp = mkdtempSync(join(tmpdir(), "btx-orders-"));
let problems = 0;
try {
  for (const dir of ["scripts", "schema", "data/pronunciation"]) {
    mkdirSync(join(tmp, dir), { recursive: true });
  }
  cpSync(join(root, "scripts/validate.mjs"), join(tmp, "scripts/validate.mjs"));
  cpSync(join(root, "schema"), join(tmp, "schema"), { recursive: true });
  cpSync(join(root, "data/pronunciation"), join(tmp, "data/pronunciation"), { recursive: true });
  cpSync(join(fixtures, "regions.yml"), join(tmp, "data/regions.yml"));
  cpSync(join(fixtures, "orders"), join(tmp, "data/orders"), { recursive: true });
  // The lexicon and phrase walks expect their folders to exist.
  mkdirSync(join(tmp, "data/lexicon"));
  mkdirSync(join(tmp, "data/phrases"));
  symlinkSync(join(root, "node_modules"), join(tmp, "node_modules"), "dir");

  const run = spawnSync(process.execPath, [join(tmp, "scripts/validate.mjs")], { encoding: "utf8" });
  const out = run.stderr;

  // The validator prints "  ✗ <file>" then the message indented underneath.
  // Group the messages by file so a hit on one file can't satisfy another.
  const byFile = new Map();
  let current = null;
  for (const line of out.split("\n")) {
    const head = line.match(/^\s+✗ (\S+)/);
    if (head) {
      current = head[1];
      if (!byFile.has(current)) byFile.set(current, "");
    } else if (current && line.trim()) {
      byFile.set(current, byFile.get(current) + " " + line.trim());
    }
  }

  for (const [file, want] of Object.entries(expected)) {
    const got = byFile.get(file);
    if (got === undefined) {
      console.error(`  ✗ ${file} should have failed and didn't.`);
      problems++;
    } else if (!got.includes(want)) {
      console.error(`  ✗ ${file} failed, but not with the message we promise.\n      wanted: ${want}\n      got:   ${got.trim()}`);
      problems++;
    } else {
      console.log(`  ✓ ${file}`);
    }
  }
  if (byFile.has(mustPass)) {
    console.error(`  ✗ ${mustPass} is the good example and it failed: ${byFile.get(mustPass).trim()}`);
    problems++;
  } else {
    console.log(`  ✓ ${mustPass} passes`);
  }
  if (run.status === 0) {
    console.error("  ✗ the validator exited 0 on a folder full of broken orders.");
    problems++;
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (problems > 0) {
  console.error(`\n${problems} order message(s) went wrong. If you changed a message in validate.mjs on purpose, update it here too.`);
  process.exit(1);
}
console.log("\nOrder messages all say what they should.");
