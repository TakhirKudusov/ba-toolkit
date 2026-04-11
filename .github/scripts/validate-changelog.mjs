#!/usr/bin/env node
// validate-changelog.mjs — CHANGELOG.md hygiene check.
// Zero dependencies (node:fs only). Runs in CI (validate.yml) and
// locally via `npm test`. Exits 0 on success, 1 on failure with
// GitHub Actions ::error annotations.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CHANGELOG_PATH = resolve('CHANGELOG.md');
const REPO_URL = 'https://github.com/TakhirKudusov/ba-toolkit';

let content;
try {
  content = readFileSync(CHANGELOG_PATH, 'utf8');
} catch {
  console.error('::error::CHANGELOG.md not found in the working directory.');
  process.exit(1);
}

const lines = content.split('\n');
let errors = 0;

function fail(msg) {
  console.error(`::error file=CHANGELOG.md::${msg}`);
  errors++;
}

// --- 1. Extract version headings ---

const HEADING_RE = /^## \[(.+?)\](.*)/;
const headings = [];

for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(HEADING_RE);
  if (m) {
    headings.push({ version: m[1], rest: m[2].trim(), line: i + 1 });
  }
}

if (headings.length === 0) {
  fail('No version headings found (expected ## [X.Y.Z] — YYYY-MM-DD).');
  process.exit(1);
}

// --- 2. [Unreleased] must be first ---

if (headings[0].version !== 'Unreleased') {
  fail(`First version heading is [${headings[0].version}], expected [Unreleased].`);
}

// --- 3. Version format: ## [X.Y.Z] — YYYY-MM-DD ---

// Date must start with "— YYYY-MM-DD"; optional trailing text is allowed
// (e.g., historical entries like "— 2026-04-08 _(GitHub Release only)_").
const DATE_RE = /^— \d{4}-\d{2}-\d{2}(\s|$)/;
const released = headings.filter((h) => h.version !== 'Unreleased');

for (const h of released) {
  if (!DATE_RE.test(h.rest)) {
    fail(
      `Line ${h.line}: [${h.version}] has invalid date format "${h.rest}" (expected "— YYYY-MM-DD").`
    );
  }
}

// --- 4. Semver format ---

const SEMVER_RE = /^\d+\.\d+\.\d+$/;
for (const h of released) {
  if (!SEMVER_RE.test(h.version)) {
    fail(`Line ${h.line}: [${h.version}] is not a valid semver (expected X.Y.Z).`);
  }
}

// --- 5. No duplicate versions ---

const seen = new Set();
for (const h of released) {
  if (seen.has(h.version)) {
    fail(`Line ${h.line}: Duplicate version [${h.version}].`);
  }
  seen.add(h.version);
}

// --- 6. Version monotonicity (newest first) ---

function parseSemver(v) {
  const [major, minor, patch] = v.split('.').map(Number);
  return { major, minor, patch };
}

function semverGt(a, b) {
  if (a.major !== b.major) return a.major > b.major;
  if (a.minor !== b.minor) return a.minor > b.minor;
  return a.patch > b.patch;
}

const validReleased = released.filter((h) => SEMVER_RE.test(h.version));
for (let i = 0; i < validReleased.length - 1; i++) {
  const current = parseSemver(validReleased[i].version);
  const next = parseSemver(validReleased[i + 1].version);
  if (!semverGt(current, next)) {
    fail(
      `Line ${validReleased[i + 1].line}: [${validReleased[i + 1].version}] is not lower than [${validReleased[i].version}] — versions must decrease top-to-bottom.`
    );
  }
}

// --- 7. Compare links ---

const LINK_RE = /^\[(.+?)\]:\s+https?:\/\/.+/;
const links = new Map();

for (const line of lines) {
  const m = line.match(LINK_RE);
  if (m) {
    links.set(m[1], line);
  }
}

// Every released version must have a compare link
for (const h of released) {
  if (!links.has(h.version)) {
    fail(`Missing compare link for [${h.version}] at the bottom of CHANGELOG.md.`);
  }
}

// --- 8. No orphan compare links ---

const headingVersions = new Set(headings.map((h) => h.version));
for (const [linkVersion] of links) {
  if (!headingVersions.has(linkVersion)) {
    fail(`Orphan compare link [${linkVersion}] has no matching ## heading.`);
  }
}

// --- Result ---

if (errors > 0) {
  console.error(`\nCHANGELOG validation failed with ${errors} error(s).`);
  process.exit(1);
}

console.log(`CHANGELOG.md valid — ${released.length} released versions, ${links.size} compare links.`);
