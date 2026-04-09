'use strict';

// Unit tests for the pure helper functions in bin/ba-toolkit.js.
// Run with: node --test test/
// Uses Node's built-in node:test runner — zero deps, in line with
// the rest of the package.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  sanitiseSlug,
  parseArgs,
  resolveDomain,
  resolveAgent,
  stringFlag,
  levenshtein,
  closestMatch,
  parseSkillFrontmatter,
  readManifest,
  detectLegacyInstall,
  renderAgentsMd,
  mergeAgentsMd,
  menuStep,
  renderMenu,
  markdownToHtml,
  htmlEscape,
  slugifyHeading,
  rewriteLinks,
  stripManagedBlock,
  compareArtifactFilenames,
  ARTIFACT_FILE_RE,
  KNOWN_FLAGS,
  DOMAINS,
  AGENTS,
} = require('../bin/ba-toolkit.js');

// --------------------------------------------------------------------
// sanitiseSlug
// --------------------------------------------------------------------

test('sanitiseSlug: plain ASCII with spaces', () => {
  assert.equal(sanitiseSlug('My App'), 'my-app');
});

test('sanitiseSlug: uppercase folded to lowercase', () => {
  assert.equal(sanitiseSlug('ACME'), 'acme');
});

test('sanitiseSlug: mixed case multi-word', () => {
  assert.equal(sanitiseSlug('Acme Corp'), 'acme-corp');
});

test('sanitiseSlug: collapses runs of dashes', () => {
  assert.equal(sanitiseSlug('a---b'), 'a-b');
});

test('sanitiseSlug: trims leading and trailing dashes', () => {
  assert.equal(sanitiseSlug('-leading-trailing-'), 'leading-trailing');
});

test('sanitiseSlug: whitespace-only input → empty string', () => {
  assert.equal(sanitiseSlug('   '), '');
});

test('sanitiseSlug: empty string → empty string', () => {
  assert.equal(sanitiseSlug(''), '');
});

test('sanitiseSlug: null → empty string', () => {
  assert.equal(sanitiseSlug(null), '');
});

test('sanitiseSlug: undefined → empty string', () => {
  assert.equal(sanitiseSlug(undefined), '');
});

test('sanitiseSlug: Cyrillic only → empty string', () => {
  assert.equal(sanitiseSlug('Проект'), '');
});

test('sanitiseSlug: emoji only → empty string', () => {
  assert.equal(sanitiseSlug('🚀'), '');
});

test('sanitiseSlug: mixed ASCII + Cyrillic → ASCII portion only', () => {
  assert.equal(sanitiseSlug('Проект Acme 2026'), 'acme-2026');
});

test('sanitiseSlug: dots become dashes', () => {
  assert.equal(sanitiseSlug('a.b.c'), 'a-b-c');
});

test('sanitiseSlug: underscores become dashes', () => {
  assert.equal(sanitiseSlug('foo_bar'), 'foo-bar');
});

test('sanitiseSlug: digits preserved', () => {
  assert.equal(sanitiseSlug('app-2026'), 'app-2026');
});

test('sanitiseSlug: already-valid slug is idempotent', () => {
  assert.equal(sanitiseSlug('my-cool-app'), 'my-cool-app');
});

test('sanitiseSlug: special characters all become dashes (then collapsed)', () => {
  assert.equal(sanitiseSlug('foo!@#$%bar'), 'foo-bar');
});

// --------------------------------------------------------------------
// parseArgs
// --------------------------------------------------------------------

test('parseArgs: empty argv', () => {
  assert.deepEqual(parseArgs([]), { _: [], flags: {} });
});

test('parseArgs: single positional', () => {
  assert.deepEqual(parseArgs(['init']), { _: ['init'], flags: {} });
});

test('parseArgs: --key value form', () => {
  const r = parseArgs(['--name', 'foo']);
  assert.equal(r.flags.name, 'foo');
});

test('parseArgs: --key=value form', () => {
  const r = parseArgs(['--name=foo']);
  assert.equal(r.flags.name, 'foo');
});

test('parseArgs: --key=value with spaces in value (post-shell)', () => {
  const r = parseArgs(['--name=My App']);
  assert.equal(r.flags.name, 'My App');
});

test('parseArgs: --key=value with = in value, splits on first only', () => {
  const r = parseArgs(['--name=foo=bar']);
  assert.equal(r.flags.name, 'foo=bar');
});

test('parseArgs: boolean flag (no value)', () => {
  const r = parseArgs(['--dry-run']);
  assert.equal(r.flags['dry-run'], true);
});

test('parseArgs: --flag followed by another --flag → first is boolean', () => {
  const r = parseArgs(['--name', '--dry-run']);
  assert.equal(r.flags.name, true);
  assert.equal(r.flags['dry-run'], true);
});

test('parseArgs: command + --key value + --bool', () => {
  const r = parseArgs(['init', '--name', 'foo', '--dry-run']);
  assert.deepEqual(r._, ['init']);
  assert.equal(r.flags.name, 'foo');
  assert.equal(r.flags['dry-run'], true);
});

test('parseArgs: short flag', () => {
  const r = parseArgs(['-v']);
  assert.equal(r.flags.v, true);
});

test('parseArgs: short -h flag', () => {
  const r = parseArgs(['-h']);
  assert.equal(r.flags.h, true);
});

test('parseArgs: -- end-of-options separator', () => {
  const r = parseArgs(['--', '--name', 'foo']);
  assert.deepEqual(r._, ['--name', 'foo']);
  assert.deepEqual(r.flags, {});
});

test('parseArgs: multiple positionals', () => {
  const r = parseArgs(['cmd', 'arg1', 'arg2']);
  assert.deepEqual(r._, ['cmd', 'arg1', 'arg2']);
});

test('parseArgs: mixed --key value and --key=value', () => {
  const r = parseArgs(['init', '--name', 'foo', '--domain=saas', '--for', 'cursor']);
  assert.equal(r.flags.name, 'foo');
  assert.equal(r.flags.domain, 'saas');
  assert.equal(r.flags.for, 'cursor');
});

test('parseArgs: --key=  (empty value after =) → empty string', () => {
  const r = parseArgs(['--name=']);
  assert.equal(r.flags.name, '');
});

// --------------------------------------------------------------------
// resolveDomain
// --------------------------------------------------------------------

test('resolveDomain: digit "1" → first DOMAINS entry (saas)', () => {
  assert.equal(resolveDomain('1'), 'saas');
});

test('resolveDomain: digit equal to DOMAINS.length → last entry', () => {
  assert.equal(resolveDomain(String(DOMAINS.length)), DOMAINS[DOMAINS.length - 1].id);
});

test('resolveDomain: digit out of range (too high) → null', () => {
  assert.equal(resolveDomain(String(DOMAINS.length + 1)), null);
});

test('resolveDomain: digit "0" → null (1-based menu)', () => {
  assert.equal(resolveDomain('0'), null);
});

test('resolveDomain: lowercase id', () => {
  assert.equal(resolveDomain('saas'), 'saas');
});

test('resolveDomain: uppercase id (case-insensitive)', () => {
  assert.equal(resolveDomain('IGAMING'), 'igaming');
});

test('resolveDomain: id with surrounding whitespace', () => {
  assert.equal(resolveDomain('  fintech  '), 'fintech');
});

test('resolveDomain: unknown id → null', () => {
  assert.equal(resolveDomain('banana'), null);
});

test('resolveDomain: empty string → null', () => {
  assert.equal(resolveDomain(''), null);
});

test('resolveDomain: null → null', () => {
  assert.equal(resolveDomain(null), null);
});

test('resolveDomain: hyphenated id (on-demand)', () => {
  assert.equal(resolveDomain('on-demand'), 'on-demand');
});

// --------------------------------------------------------------------
// resolveAgent
// --------------------------------------------------------------------

test('resolveAgent: digit "1" → first AGENTS key (claude-code)', () => {
  const ids = Object.keys(AGENTS);
  assert.equal(resolveAgent('1'), ids[0]);
});

test('resolveAgent: id "claude-code"', () => {
  assert.equal(resolveAgent('claude-code'), 'claude-code');
});

test('resolveAgent: uppercase id', () => {
  assert.equal(resolveAgent('CURSOR'), 'cursor');
});

test('resolveAgent: digit out of range → null', () => {
  const ids = Object.keys(AGENTS);
  assert.equal(resolveAgent(String(ids.length + 1)), null);
});

test('resolveAgent: digit "0" → null', () => {
  assert.equal(resolveAgent('0'), null);
});

test('resolveAgent: unknown id → null', () => {
  assert.equal(resolveAgent('vim'), null);
});

test('resolveAgent: empty string → null', () => {
  assert.equal(resolveAgent(''), null);
});

test('resolveAgent: null → null', () => {
  assert.equal(resolveAgent(null), null);
});

// --------------------------------------------------------------------
// stringFlag
// --------------------------------------------------------------------

test('stringFlag: returns string value when present', () => {
  const args = parseArgs(['--name', 'foo']);
  assert.equal(stringFlag(args, 'name'), 'foo');
});

test('stringFlag: returns string value with --key=value form', () => {
  const args = parseArgs(['--name=foo']);
  assert.equal(stringFlag(args, 'name'), 'foo');
});

test('stringFlag: returns null when flag absent', () => {
  const args = parseArgs([]);
  assert.equal(stringFlag(args, 'name'), null);
});

test('stringFlag: returns null when flag is bare boolean', () => {
  // `--name` followed by another flag is parsed as boolean true.
  const args = parseArgs(['--name', '--dry-run']);
  assert.equal(stringFlag(args, 'name'), null);
});

test('stringFlag: returns null for empty string value (--key=)', () => {
  const args = parseArgs(['--name=']);
  assert.equal(stringFlag(args, 'name'), null);
});

test('stringFlag: returns null for boolean flag (--dry-run)', () => {
  const args = parseArgs(['--dry-run']);
  assert.equal(stringFlag(args, 'dry-run'), null);
});

// --------------------------------------------------------------------
// parseSkillFrontmatter
// --------------------------------------------------------------------

test('parseSkillFrontmatter: folded scalar (>) — the canonical SKILL.md form', () => {
  const input = `---
name: ba-brief
description: >
  Generate a high-level Project Brief for projects in any domain
  (SaaS, Fintech, E-commerce). First step of the BA Toolkit pipeline.
---

# /brief — Project Brief

Body content here.
`;
  const r = parseSkillFrontmatter(input);
  assert.equal(r.name, 'ba-brief');
  assert.equal(
    r.description,
    'Generate a high-level Project Brief for projects in any domain (SaaS, Fintech, E-commerce). First step of the BA Toolkit pipeline.',
  );
  // Body preserves the original spacing after the closing `---` line,
  // including any leading blank line. This matches the pre-refactor
  // regex behavior — skillToMdc concatenates `mdcFrontmatter + body`
  // verbatim, so trimming body would change the output of every .mdc.
  assert.match(r.body, /# \/brief — Project Brief/);
});

test('parseSkillFrontmatter: literal scalar (|) — also flattened to one line', () => {
  const input = `---
name: ba-foo
description: |
  Line one of the description.
  Line two of the description.
---

Body.
`;
  const r = parseSkillFrontmatter(input);
  assert.equal(r.name, 'ba-foo');
  assert.equal(r.description, 'Line one of the description. Line two of the description.');
});

test('parseSkillFrontmatter: inline scalar — single-line description on the same line as the key', () => {
  const input = `---
name: ba-foo
description: A one-line description without a block scalar marker.
---

Body.
`;
  const r = parseSkillFrontmatter(input);
  assert.equal(r.name, 'ba-foo');
  assert.equal(r.description, 'A one-line description without a block scalar marker.');
});

test('parseSkillFrontmatter: multi-paragraph block scalar with blank line — collapses to one line', () => {
  const input = `---
name: ba-foo
description: >
  First paragraph of the description.

  Second paragraph after a blank line.
---

Body.
`;
  const r = parseSkillFrontmatter(input);
  assert.equal(r.name, 'ba-foo');
  assert.equal(r.description, 'First paragraph of the description. Second paragraph after a blank line.');
});

test('parseSkillFrontmatter: chomping indicator (>+) is recognised as a block marker', () => {
  const input = `---
name: ba-foo
description: >+
  Block content.
---

Body.
`;
  const r = parseSkillFrontmatter(input);
  assert.equal(r.description, 'Block content.');
});

test('parseSkillFrontmatter: no frontmatter returns body unchanged', () => {
  const input = `# Just a markdown file with no frontmatter.

Some content.
`;
  const r = parseSkillFrontmatter(input);
  assert.equal(r.name, null);
  assert.equal(r.description, '');
  assert.equal(r.body, input);
});

test('parseSkillFrontmatter: extra fields are ignored without affecting name/description', () => {
  const input = `---
name: ba-foo
description: A description.
allowed-tools:
  - Read
  - Edit
license: MIT
---

Body.
`;
  const r = parseSkillFrontmatter(input);
  assert.equal(r.name, 'ba-foo');
  assert.equal(r.description, 'A description.');
});

test('parseSkillFrontmatter: description with embedded colons survives the line scan', () => {
  // The continuation lines are matched as continuations, not as new keys,
  // because they're indented. The walk-by-lines logic only treats
  // column-0 `key:` lines as new fields.
  const input = `---
name: ba-foo
description: >
  This description mentions ratios like 3:1 and times like 12:30:45.
  It should still be parsed as a single-line description.
---

Body.
`;
  const r = parseSkillFrontmatter(input);
  assert.equal(
    r.description,
    'This description mentions ratios like 3:1 and times like 12:30:45. It should still be parsed as a single-line description.',
  );
});

test('parseSkillFrontmatter: collapses arbitrary whitespace inside the value', () => {
  const input = `---
name: ba-foo
description: >
  Word1    Word2

      Word3
---

Body.
`;
  const r = parseSkillFrontmatter(input);
  assert.equal(r.description, 'Word1 Word2 Word3');
});

// --------------------------------------------------------------------
// levenshtein + closestMatch (typo suggestion)
// --------------------------------------------------------------------

test('levenshtein: identical strings → 0', () => {
  assert.equal(levenshtein('foo', 'foo'), 0);
});

test('levenshtein: empty vs non-empty → length of non-empty', () => {
  assert.equal(levenshtein('', 'foo'), 3);
  assert.equal(levenshtein('foo', ''), 3);
});

test('levenshtein: single insertion', () => {
  assert.equal(levenshtein('dry-run', 'drry-run'), 1);
});

test('levenshtein: transposition counts as 2 (plain Levenshtein)', () => {
  // domain → domian: i and a swapped. Plain Levenshtein scores this as
  // 2 substitutions; Damerau-Levenshtein would score 1. The threshold
  // in closestMatch is calibrated for this.
  assert.equal(levenshtein('domain', 'domian'), 2);
});

test('levenshtein: complete mismatch', () => {
  assert.equal(levenshtein('abc', 'xyz'), 3);
});

test('closestMatch: --drry-run finds dry-run', () => {
  assert.equal(closestMatch('drry-run', [...KNOWN_FLAGS]), 'dry-run');
});

test('closestMatch: --domian finds domain', () => {
  assert.equal(closestMatch('domian', [...KNOWN_FLAGS]), 'domain');
});

test('closestMatch: --foo finds for (single substitution, short input)', () => {
  assert.equal(closestMatch('foo', [...KNOWN_FLAGS]), 'for');
});

test('closestMatch: --gloabl finds global', () => {
  assert.equal(closestMatch('gloabl', [...KNOWN_FLAGS]), 'global');
});

test('closestMatch: --no-installl finds no-install (extra char)', () => {
  assert.equal(closestMatch('no-installl', [...KNOWN_FLAGS]), 'no-install');
});

test('closestMatch: --foobar finds nothing (too far from any flag)', () => {
  // Distance to "global" is 3, but threshold for input length 6 is
  // floor(6/3) = 2. The match is rejected — we'd rather say nothing
  // than suggest something wildly off.
  assert.equal(closestMatch('foobar', [...KNOWN_FLAGS]), null);
});

test('closestMatch: completely unrelated input → null', () => {
  assert.equal(closestMatch('xyzzy', [...KNOWN_FLAGS]), null);
});

test('closestMatch: empty input → null', () => {
  assert.equal(closestMatch('', [...KNOWN_FLAGS]), null);
});

test('closing message: every SKILL.md references the closing-message.md template', () => {
  // Regression guard for the "use the lookup table, do not hardcode
  // next-step" rule. Walks every shipped SKILL.md and asserts that it
  // points at references/closing-message.md (which holds the canonical
  // closing-block format and the pipeline next-step lookup table).
  // Catches a future skill that ships its own roll-your-own closing
  // block — that block would silently bypass the lookup table and
  // re-introduce the kind of next-step drift the table was meant to
  // eliminate.
  const skillsDir = path.join(__dirname, '..', 'skills');
  const closingPath = path.join(skillsDir, 'references', 'closing-message.md');
  assert.ok(fs.existsSync(closingPath), 'closing-message.md must exist in skills/references/');

  const skillFolders = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== 'references')
    .map((e) => e.name);
  const offenders = [];
  for (const folder of skillFolders) {
    const skillPath = path.join(skillsDir, folder, 'SKILL.md');
    if (!fs.existsSync(skillPath)) continue;
    const content = fs.readFileSync(skillPath, 'utf8');
    if (!content.includes('closing-message.md')) {
      offenders.push(folder);
    }
  }
  assert.deepEqual(offenders, [], `skills with no closing-message.md reference: ${offenders.join(', ')}`);
});

test('closing message: no SKILL.md hardcodes a next-step line', () => {
  // The pipeline next-step lookup table in closing-message.md is the
  // single source of truth for what comes after each skill. SKILL.md
  // files should NEVER ship a hardcoded `Next step: /xxx` line — that
  // would silently override the table and cause drift on pipeline
  // reorganisations. The closing-message.md template itself is allowed
  // to use the placeholder `Next step: /{next_command}` because that's
  // the documentation of the format, not an actual hardcoded value.
  const skillsDir = path.join(__dirname, '..', 'skills');
  const skillFolders = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== 'references')
    .map((e) => e.name);
  // Match `Next step:` followed by an actual slash command (not a
  // placeholder like `/{next_command}`). Allow `Next step: (none)`
  // for /handoff which has no next.
  const hardcodedRe = /^Next step: `?\/[a-z]/m;
  const offenders = [];
  for (const folder of skillFolders) {
    const skillPath = path.join(skillsDir, folder, 'SKILL.md');
    if (!fs.existsSync(skillPath)) continue;
    const content = fs.readFileSync(skillPath, 'utf8');
    if (hardcodedRe.test(content)) {
      offenders.push(folder);
    }
  }
  assert.deepEqual(offenders, [], `skills hardcoding a Next step line: ${offenders.join(', ')}`);
});

test('interview protocol: every SKILL.md with an Interview section references the protocol file', () => {
  // Regression guard for the "ask one question at a time + 3–5 options"
  // rule. Walks every shipped SKILL.md, checks whether it has an
  // Interview heading, and if so asserts it links to
  // ../references/interview-protocol.md. Catches a new skill shipping
  // a raw questionnaire dump instead of the conversational flow.
  const skillsDir = path.join(__dirname, '..', 'skills');
  const protocolPath = path.join(skillsDir, 'references', 'interview-protocol.md');
  assert.ok(fs.existsSync(protocolPath), 'interview-protocol.md must exist in skills/references/');

  const skillFolders = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== 'references')
    .map((e) => e.name);
  const interviewHeadingRe = /^(## |### \d+\. )Interview$/m;
  const offenders = [];
  for (const folder of skillFolders) {
    const skillPath = path.join(skillsDir, folder, 'SKILL.md');
    if (!fs.existsSync(skillPath)) continue;
    const content = fs.readFileSync(skillPath, 'utf8');
    if (interviewHeadingRe.test(content) && !content.includes('interview-protocol.md')) {
      offenders.push(folder);
    }
  }
  assert.deepEqual(offenders, [], `skills with an Interview section but no protocol link: ${offenders.join(', ')}`);
});

test('interview protocol: every Interview-section SKILL.md enforces the 5-rows-max cap', () => {
  // Regression guard for batch 3 item 2 — the hard cap of 5 rows total
  // (4 predefined + 1 free-text "Other"). Catches a future skill that
  // copies the old "3–5 domain-appropriate options" wording back in.
  const skillsDir = path.join(__dirname, '..', 'skills');
  const skillFolders = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== 'references')
    .map((e) => e.name);
  const interviewHeadingRe = /^(## |### \d+\. )Interview$/m;
  const legacyRe = /3[–-]5 domain-appropriate options/;
  const offenders = [];
  for (const folder of skillFolders) {
    const skillPath = path.join(skillsDir, folder, 'SKILL.md');
    if (!fs.existsSync(skillPath)) continue;
    const content = fs.readFileSync(skillPath, 'utf8');
    if (!interviewHeadingRe.test(content)) continue;
    if (legacyRe.test(content) || !content.includes('5 rows max')) {
      offenders.push(folder);
    }
  }
  assert.deepEqual(offenders, [], `skills missing "5 rows max" or carrying legacy "3–5 options" wording: ${offenders.join(', ')}`);
});

test('interview protocol: every Interview-section SKILL.md mentions the Recommended marker', () => {
  // Regression guard for batch 3 item 1 — exactly one row per question
  // is marked **Recommended**. Catches a future skill that drops the
  // marker reminder from its protocol summary.
  const skillsDir = path.join(__dirname, '..', 'skills');
  const skillFolders = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== 'references')
    .map((e) => e.name);
  const interviewHeadingRe = /^(## |### \d+\. )Interview$/m;
  const offenders = [];
  for (const folder of skillFolders) {
    const skillPath = path.join(skillsDir, folder, 'SKILL.md');
    if (!fs.existsSync(skillPath)) continue;
    const content = fs.readFileSync(skillPath, 'utf8');
    if (!interviewHeadingRe.test(content)) continue;
    if (!content.includes('**Recommended**')) {
      offenders.push(folder);
    }
  }
  assert.deepEqual(offenders, [], `skills missing the **Recommended** marker reminder: ${offenders.join(', ')}`);
});

test('interview-protocol.md: defines rules 10 (Recommended) and 11 (variant language) plus the 5-rows cap', () => {
  // Structural sanity check on the single source of truth. If any of
  // these markers go missing, the per-skill summaries will drift away
  // from the protocol they reference.
  const protocolPath = path.join(__dirname, '..', 'skills', 'references', 'interview-protocol.md');
  const content = fs.readFileSync(protocolPath, 'utf8');
  assert.ok(content.includes('5 rows total'), 'protocol must state the "5 rows total" cap');
  assert.ok(/^10\. \*\*Mark exactly one row as Recommended/m.test(content), 'protocol must define rule 10 (Recommended marker)');
  assert.ok(/^11\. \*\*Variant text in the user's language/m.test(content), 'protocol must define rule 11 (variant language)');
  assert.ok(!/3[–-]5 variants per question/.test(content), 'protocol must not carry the legacy "3–5 variants per question" wording');
});

test('parseSkillFrontmatter: parses every shipped SKILL.md without losing the description', () => {
  // Integration check: every skill in the package's skills/ directory
  // must produce a non-empty name and description through the parser.
  // Catches the class of regression where a future SKILL.md is added
  // with a frontmatter form the parser doesn't understand.
  const skillsDir = path.join(__dirname, '..', 'skills');
  const skillFolders = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== 'references')
    .map((e) => e.name);
  assert.ok(skillFolders.length >= 24, `expected at least 24 skill folders, found ${skillFolders.length}`);
  for (const folder of skillFolders) {
    const skillPath = path.join(skillsDir, folder, 'SKILL.md');
    if (!fs.existsSync(skillPath)) continue;
    const content = fs.readFileSync(skillPath, 'utf8');
    const r = parseSkillFrontmatter(content);
    assert.ok(r.name, `${folder}: expected non-empty name, got ${JSON.stringify(r.name)}`);
    assert.ok(r.description.length > 20, `${folder}: description too short (${r.description.length} chars)`);
    assert.ok(!r.description.includes('\n'), `${folder}: description should be flattened to one line`);
  }
});

// --------------------------------------------------------------------
// readManifest
// --------------------------------------------------------------------

test('readManifest: directory with valid manifest returns parsed JSON', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ba-manifest-'));
  try {
    const payload = {
      version: '2.0.0',
      installedAt: '2026-04-09T00:00:00.000Z',
      items: ['brief', 'srs', 'references'],
    };
    fs.writeFileSync(path.join(dir, '.ba-toolkit-manifest.json'), JSON.stringify(payload));
    assert.deepEqual(readManifest(dir), payload);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('readManifest: legacy manifest with format field still parses (forward-compat)', () => {
  // Older versions of the toolkit wrote `format: 'skill'` (or `'mdc'`).
  // The field is gone now, but read should still accept it so users
  // who installed before the cleanup don't see a broken status/uninstall.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ba-manifest-'));
  try {
    const legacy = {
      version: '2.0.0',
      installedAt: '2026-04-09T00:00:00.000Z',
      format: 'skill',
      items: ['brief', 'srs', 'references'],
    };
    fs.writeFileSync(path.join(dir, '.ba-toolkit-manifest.json'), JSON.stringify(legacy));
    const parsed = readManifest(dir);
    assert.equal(parsed.version, '2.0.0');
    assert.deepEqual(parsed.items, ['brief', 'srs', 'references']);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('readManifest: directory without manifest returns null', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ba-manifest-'));
  try {
    assert.equal(readManifest(dir), null);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('readManifest: malformed JSON returns null (no throw)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ba-manifest-'));
  try {
    fs.writeFileSync(path.join(dir, '.ba-toolkit-manifest.json'), 'not json {{{');
    assert.equal(readManifest(dir), null);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('readManifest: nonexistent directory returns null', () => {
  assert.equal(readManifest('/definitely/does/not/exist/anywhere'), null);
});

// --------------------------------------------------------------------
// detectLegacyInstall
// --------------------------------------------------------------------

test('detectLegacyInstall: returns empty list when no wrapper folder exists', () => {
  // Use an obviously fake agent so the candidate paths point at non-existent dirs.
  const agent = {
    projectPath: '/tmp/definitely-does-not-exist-' + Date.now(),
    globalPath: '/tmp/also-not-real-' + Date.now(),
  };
  assert.deepEqual(detectLegacyInstall(agent), []);
});

test('detectLegacyInstall: finds wrapper directory when it exists', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ba-legacy-'));
  try {
    // Simulate a v1.x install: dest/<wrapper>/ba-toolkit/ exists
    const fakeProject = path.join(root, 'project-skills');
    fs.mkdirSync(path.join(fakeProject, 'ba-toolkit'), { recursive: true });
    const agent = {
      projectPath: fakeProject,
      globalPath: null,
    };
    const found = detectLegacyInstall(agent);
    assert.equal(found.length, 1);
    assert.ok(found[0].endsWith('ba-toolkit'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------
// menuStep — pure state machine for arrow-key menu
// --------------------------------------------------------------------

const SAMPLE_ITEMS = [
  { id: 'saas', label: 'SaaS', desc: 'B2B' },
  { id: 'fintech', label: 'Fintech', desc: 'Payments' },
  { id: 'ecommerce', label: 'E-commerce', desc: 'Stores' },
];

function freshState() {
  return { items: SAMPLE_ITEMS, index: 0, done: false, choice: null };
}

test('menuStep: down moves index forward by one', () => {
  const r = menuStep(freshState(), 'down');
  assert.equal(r.index, 1);
  assert.equal(r.done, false);
});

test('menuStep: up from index 0 wraps to last item', () => {
  const r = menuStep(freshState(), 'up');
  assert.equal(r.index, SAMPLE_ITEMS.length - 1);
});

test('menuStep: down from last index wraps to 0', () => {
  const last = { ...freshState(), index: SAMPLE_ITEMS.length - 1 };
  const r = menuStep(last, 'down');
  assert.equal(r.index, 0);
});

test('menuStep: enter sets done=true and choice to current item', () => {
  const at1 = { ...freshState(), index: 1 };
  const r = menuStep(at1, 'enter');
  assert.equal(r.done, true);
  assert.deepEqual(r.choice, SAMPLE_ITEMS[1]);
});

test('menuStep: cancel sets done=true and choice=null', () => {
  const r = menuStep(freshState(), 'cancel');
  assert.equal(r.done, true);
  assert.equal(r.choice, null);
});

test('menuStep: letter "a" jumps to index 0', () => {
  const at2 = { ...freshState(), index: 2 };
  const r = menuStep(at2, 'a');
  assert.equal(r.index, 0);
});

test('menuStep: letter "c" jumps to index 2', () => {
  const r = menuStep(freshState(), 'c');
  assert.equal(r.index, 2);
});

test('menuStep: letter out of range is a no-op (sample has 3 items, "j" is index 9)', () => {
  const before = freshState();
  const r = menuStep(before, 'j');
  assert.equal(r.index, before.index);
  assert.equal(r.done, false);
});

test('menuStep: digit jump kept as backward-compat fallback ("3" → index 2)', () => {
  const r = menuStep(freshState(), '3');
  assert.equal(r.index, 2);
});

test('menuStep: digit out of range is a no-op', () => {
  const before = freshState();
  const r = menuStep(before, '9');
  assert.equal(r.index, before.index);
  assert.equal(r.done, false);
});

test('menuStep: digit "0" is a no-op (1-based menu)', () => {
  const r = menuStep(freshState(), '0');
  assert.equal(r.index, 0);
});

test('menuStep: unknown key is a no-op', () => {
  const before = freshState();
  const r = menuStep(before, 'left');
  assert.deepEqual(r, before);
});

test('menuStep: once done, further keys do nothing', () => {
  const finished = { ...freshState(), done: true, choice: SAMPLE_ITEMS[0] };
  const r = menuStep(finished, 'down');
  assert.deepEqual(r, finished);
});

test('menuStep: empty items list is a no-op for any key', () => {
  const empty = { items: [], index: 0, done: false, choice: null };
  assert.deepEqual(menuStep(empty, 'down'), empty);
  assert.deepEqual(menuStep(empty, 'enter'), empty);
});

// --------------------------------------------------------------------
// renderMenu — pure renderer
// --------------------------------------------------------------------

test('renderMenu: contains the title when provided', () => {
  const out = renderMenu(freshState(), { title: 'Pick a domain:' });
  assert.match(out, /Pick a domain:/);
});

test('renderMenu: lists every item with a letter ID', () => {
  const out = renderMenu(freshState(), { title: 'Pick:' });
  assert.match(out, / a\) SaaS/);
  assert.match(out, / b\) Fintech/);
  assert.match(out, / c\) E-commerce/);
});

test('renderMenu: marks the selected item with > and unselected with space', () => {
  const at1 = { ...freshState(), index: 1 };
  const out = renderMenu(at1, { title: 'Pick:' });
  // The format per item line is: 2-space prefix, marker (`>` for
  // selected or ` ` for unselected), 1-space gap, 1-char letter ID,
  // `)`, label, ...
  // Selected line — `>` followed by space + "b)".
  assert.match(out, /^ {2}> b\) Fintech/m);
  // Unselected lines — 4 leading spaces (2 prefix + 1 placeholder + 1 gap).
  assert.match(out, /^ {4}a\) SaaS/m);
  assert.match(out, /^ {4}c\) E-commerce/m);
});

test('renderMenu: includes item descriptions', () => {
  const out = renderMenu(freshState(), { title: 'Pick:' });
  assert.match(out, /B2B/);
  assert.match(out, /Payments/);
});

test('renderMenu: shows the keyboard help line', () => {
  const out = renderMenu(freshState(), { title: 'Pick:' });
  assert.match(out, /↑\/↓ navigate/);
  assert.match(out, /Enter select/);
  assert.match(out, /a-z jump/);
  assert.match(out, /Esc cancel/);
});

test('renderMenu: ends with a trailing newline', () => {
  const out = renderMenu(freshState(), { title: 'Pick:' });
  assert.equal(out[out.length - 1], '\n');
});

test('renderMenu: works without a title', () => {
  const out = renderMenu(freshState(), {});
  // No title section, but items still rendered.
  assert.match(out, / a\) SaaS/);
  // First non-empty content line is an item, not a title.
  const firstLine = out.split('\n').find((l) => l.trim().length > 0);
  assert.match(firstLine, /SaaS/);
});

// --------------------------------------------------------------------
// renderAgentsMd
// --------------------------------------------------------------------
//
// Reads the template from skills/references/templates/agents-template.md
// (resolved relative to the bin file's package root, not the test cwd)
// and substitutes [NAME], [SLUG], [DOMAIN], [DATE]. Not strictly pure —
// it does one synchronous file read — but the read target is a sibling
// file in the same package, so the test is deterministic.

test('renderAgentsMd: substitutes the project name', () => {
  const out = renderAgentsMd({ name: 'My App', slug: 'my-app', domain: 'saas' });
  assert.match(out, /\*\*Project:\*\* My App/);
});

test('renderAgentsMd: substitutes the slug (multiple occurrences)', () => {
  const out = renderAgentsMd({ name: 'My App', slug: 'my-app', domain: 'saas' });
  assert.match(out, /\*\*Slug:\*\* my-app/);
  assert.match(out, /output\/my-app\//);
});

test('renderAgentsMd: substitutes the domain (multiple occurrences)', () => {
  const out = renderAgentsMd({ name: 'My App', slug: 'my-app', domain: 'fintech' });
  assert.match(out, /\*\*Domain:\*\* fintech/);
  assert.match(out, /- Domain: fintech/);
});

test('renderAgentsMd: substitutes the date (ISO YYYY-MM-DD)', () => {
  const out = renderAgentsMd({ name: 'My App', slug: 'my-app', domain: 'saas' });
  assert.match(out, /Auto-generated by `ba-toolkit init` on \d{4}-\d{2}-\d{2}\./);
});

test('renderAgentsMd: includes Pipeline Status and Cross-cutting Tools sections', () => {
  const out = renderAgentsMd({ name: 'My App', slug: 'my-app', domain: 'saas' });
  assert.match(out, /## Pipeline Status/);
  assert.match(out, /## Cross-cutting Tools/);
});

test('renderAgentsMd: no leftover [NAME] [SLUG] [DOMAIN] [DATE] placeholders', () => {
  const out = renderAgentsMd({ name: 'My App', slug: 'my-app', domain: 'saas' });
  assert.doesNotMatch(out, /\[NAME\]/);
  assert.doesNotMatch(out, /\[SLUG\]/);
  assert.doesNotMatch(out, /\[DOMAIN\]/);
  assert.doesNotMatch(out, /\[DATE\]/);
});

// --------------------------------------------------------------------
// mergeAgentsMd
// --------------------------------------------------------------------

test('mergeAgentsMd: no existing file → returns fresh content with action "created"', () => {
  const result = mergeAgentsMd(null, { name: 'My App', slug: 'my-app', domain: 'saas' });
  assert.equal(result.action, 'created');
  assert.match(result.content, /\*\*Project:\*\* My App/);
  assert.match(result.content, /ba-toolkit:begin managed/);
  assert.match(result.content, /ba-toolkit:end managed/);
});

test('mergeAgentsMd: existing file with anchors → replaces only managed block, preserves the rest', () => {
  // Step 1: create an initial file (as if after a first `init`).
  const initial = mergeAgentsMd(null, { name: 'Old Name', slug: 'old-slug', domain: 'saas' }).content;
  // Step 2: simulate the user editing sections OUTSIDE the managed block
  // — mark the Pipeline Status row for /brief as done, and add a note
  // at the bottom.
  const userEdited = initial
    .replace('| 1 | /brief | ⬜ Not started | — |', '| 1 | /brief | ✅ Done | 01_brief_old-slug.md |')
    + '\n## User notes\n\nInterview with CEO scheduled for Monday.\n';
  // Step 3: run mergeAgentsMd with the user-edited content and a new
  // name/slug/domain (as if the user re-ran `ba-toolkit init`).
  const result = mergeAgentsMd(userEdited, { name: 'New Name', slug: 'new-slug', domain: 'fintech' });
  assert.equal(result.action, 'merged');
  // Managed block now reflects the NEW values.
  assert.match(result.content, /\*\*Project:\*\* New Name/);
  assert.match(result.content, /\*\*Slug:\*\* new-slug/);
  assert.match(result.content, /\*\*Domain:\*\* fintech/);
  assert.doesNotMatch(result.content, /\*\*Project:\*\* Old Name/);
  // User edits OUTSIDE the managed block are still present.
  assert.match(result.content, /\/brief \| ✅ Done \| 01_brief_old-slug\.md/);
  assert.match(result.content, /## User notes/);
  assert.match(result.content, /Interview with CEO scheduled for Monday/);
});

test('mergeAgentsMd: existing file without anchors → returns existing unchanged with action "preserved"', () => {
  const userFile = '# My custom AGENTS.md\n\nThis is a file I wrote by hand, no ba-toolkit here.\n';
  const result = mergeAgentsMd(userFile, { name: 'X', slug: 'x', domain: 'saas' });
  assert.equal(result.action, 'preserved');
  assert.equal(result.content, userFile);
});

test('mergeAgentsMd: existing file with begin anchor but no end anchor → preserved (malformed)', () => {
  const malformed = '# Header\n\n<!-- ba-toolkit:begin managed -->\n\nBut no end marker.\n';
  const result = mergeAgentsMd(malformed, { name: 'X', slug: 'x', domain: 'saas' });
  assert.equal(result.action, 'preserved');
  assert.equal(result.content, malformed);
});

test('mergeAgentsMd: existing file with end anchor before begin → preserved (malformed)', () => {
  const malformed = '# Header\n\n<!-- ba-toolkit:end managed -->\n\n<!-- ba-toolkit:begin managed -->\n';
  const result = mergeAgentsMd(malformed, { name: 'X', slug: 'x', domain: 'saas' });
  assert.equal(result.action, 'preserved');
});

test('mergeAgentsMd: rendered template always contains both anchor markers', () => {
  // Regression guard — if someone removes the anchors from
  // agents-template.md, the merge flow silently degrades to overwrite.
  // This test fails loudly if that ever happens.
  const rendered = renderAgentsMd({ name: 'X', slug: 'x', domain: 'saas' });
  assert.ok(rendered.includes('<!-- ba-toolkit:begin managed -->'));
  assert.ok(rendered.includes('<!-- ba-toolkit:end managed -->'));
});

test('renderAgentsMd: preserves [focus] and [format] in the cross-cutting table', () => {
  // These are literal command-syntax markers, not template placeholders.
  // The replace pass must not touch them.
  const out = renderAgentsMd({ name: 'My App', slug: 'my-app', domain: 'saas' });
  assert.match(out, /\/clarify \[focus\]/);
  assert.match(out, /\/export \[format\]/);
  assert.match(out, /\/publish \[format\]/);
});

// --- markdownToHtml + supporting helpers (cmdPublish) -----------------

test('htmlEscape: escapes the four html-significant characters', () => {
  assert.equal(htmlEscape('<a href="x">b & c</a>'), '&lt;a href=&quot;x&quot;&gt;b &amp; c&lt;/a&gt;');
});

test('slugifyHeading: produces github-style anchor ids', () => {
  assert.equal(slugifyHeading('FR-001 Login'), 'fr-001-login');
  assert.equal(slugifyHeading('1. Project Summary'), '1-project-summary');
  assert.equal(slugifyHeading('Table of contents!'), 'table-of-contents');
});

test('markdownToHtml: headings get id attributes from their text', () => {
  const html = markdownToHtml('# Project Brief\n\n## 1. Goals');
  assert.match(html, /<h1 id="project-brief">Project Brief<\/h1>/);
  assert.match(html, /<h2 id="1-goals">1\. Goals<\/h2>/);
});

test('markdownToHtml: paragraph + bold + italic + inline code', () => {
  const html = markdownToHtml('This is **bold** and *italic* and `code`.');
  assert.equal(html, '<p>This is <strong>bold</strong> and <em>italic</em> and <code>code</code>.</p>');
});

test('markdownToHtml: link gets href and label', () => {
  const html = markdownToHtml('See [FR-001](02_srs.md#fr-001) for details.');
  assert.match(html, /<a href="02_srs\.md#fr-001">FR-001<\/a>/);
});

test('markdownToHtml: unordered list', () => {
  const html = markdownToHtml('- alpha\n- beta\n- gamma');
  assert.equal(html, '<ul><li>alpha</li><li>beta</li><li>gamma</li></ul>');
});

test('markdownToHtml: ordered list', () => {
  const html = markdownToHtml('1. first\n2. second');
  assert.equal(html, '<ol><li>first</li><li>second</li></ol>');
});

test('markdownToHtml: GFM table with header + body', () => {
  const md = '| ID | Name |\n|----|------|\n| 1 | Alice |\n| 2 | Bob |';
  const html = markdownToHtml(md);
  assert.match(html, /<table><thead><tr><th>ID<\/th><th>Name<\/th><\/tr><\/thead>/);
  assert.match(html, /<tbody><tr><td>1<\/td><td>Alice<\/td><\/tr><tr><td>2<\/td><td>Bob<\/td><\/tr><\/tbody>/);
});

test('markdownToHtml: fenced code block preserves content and language', () => {
  const md = '```js\nconst x = 1;\n```';
  const html = markdownToHtml(md);
  assert.match(html, /<pre><code class="language-js">const x = 1;<\/code><\/pre>/);
});

test('markdownToHtml: blockquote and horizontal rule', () => {
  const html = markdownToHtml('> a quote\n\n---');
  assert.match(html, /<blockquote><p>a quote<\/p><\/blockquote>/);
  assert.match(html, /<hr>/);
});

test('markdownToHtml: html special chars in content are escaped', () => {
  const html = markdownToHtml('Use <script> tags & "quotes" carefully.');
  assert.match(html, /Use &lt;script&gt; tags &amp; &quot;quotes&quot; carefully\./);
});

test('rewriteLinks: notion mode prefixes intra-project markdown links with ./', () => {
  const out = rewriteLinks('See [FR-001](02_srs_x.md#fr-001) and [docs](https://example.com).', 'notion');
  assert.match(out, /\[FR-001\]\(\.\/02_srs_x\.md#fr-001\)/);
  assert.match(out, /\[docs\]\(https:\/\/example\.com\)/);
});

test('rewriteLinks: confluence mode swaps .md for .html in intra-project links', () => {
  const out = rewriteLinks('See [FR-001](02_srs_x.md#fr-001) and [docs](https://example.com).', 'confluence');
  assert.match(out, /\[FR-001\]\(02_srs_x\.html#fr-001\)/);
  assert.match(out, /\[docs\]\(https:\/\/example\.com\)/);
});

test('stripManagedBlock: removes the ba-toolkit managed marker block', () => {
  const input = '# Title\n\n<!-- ba-toolkit:begin managed -->\n## Active Project\n**Project:** X\n<!-- ba-toolkit:end managed -->\n\n## Pipeline Status';
  const out = stripManagedBlock(input);
  assert.ok(!out.includes('ba-toolkit:begin managed'));
  assert.ok(!out.includes('Active Project'));
  assert.ok(out.includes('# Title'));
  assert.ok(out.includes('## Pipeline Status'));
});

test('compareArtifactFilenames: orders 01 < 02 < 07 < 07a < 08 < 11', () => {
  const files = ['11_handoff_x.md', '07a_research_x.md', '02_srs_x.md', '01_brief_x.md', '07_datadict_x.md', '08_apicontract_x.md'];
  files.sort(compareArtifactFilenames);
  assert.deepEqual(files, [
    '01_brief_x.md',
    '02_srs_x.md',
    '07_datadict_x.md',
    '07a_research_x.md',
    '08_apicontract_x.md',
    '11_handoff_x.md',
  ]);
});

test('ARTIFACT_FILE_RE: matches every shipped artifact filename pattern', () => {
  assert.ok(ARTIFACT_FILE_RE.test('00_discovery_my-app.md'));
  assert.ok(ARTIFACT_FILE_RE.test('00_principles_my-app.md'));
  assert.ok(ARTIFACT_FILE_RE.test('01_brief_my-app.md'));
  assert.ok(ARTIFACT_FILE_RE.test('07a_research_my-app.md'));
  assert.ok(ARTIFACT_FILE_RE.test('11_handoff_my-app.md'));
  assert.ok(!ARTIFACT_FILE_RE.test('AGENTS.md'));
  assert.ok(!ARTIFACT_FILE_RE.test('README.md'));
  assert.ok(!ARTIFACT_FILE_RE.test('1_brief_x.md')); // single digit
});
