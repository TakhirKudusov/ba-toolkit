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
  readSentinel,
  renderAgentsMd,
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
// readSentinel
// --------------------------------------------------------------------

test('readSentinel: directory with valid sentinel returns parsed JSON', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ba-sentinel-'));
  try {
    const payload = { version: '1.4.0', installedAt: '2026-04-08T19:00:00.000Z' };
    fs.writeFileSync(path.join(dir, '.ba-toolkit-version'), JSON.stringify(payload));
    assert.deepEqual(readSentinel(dir), payload);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('readSentinel: directory without sentinel returns null', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ba-sentinel-'));
  try {
    assert.equal(readSentinel(dir), null);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('readSentinel: malformed JSON returns null (no throw)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ba-sentinel-'));
  try {
    fs.writeFileSync(path.join(dir, '.ba-toolkit-version'), 'not json {{{');
    assert.equal(readSentinel(dir), null);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('readSentinel: nonexistent directory returns null', () => {
  assert.equal(readSentinel('/definitely/does/not/exist/anywhere'), null);
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

test('renderAgentsMd: preserves [focus] and [format] in the cross-cutting table', () => {
  // These are literal command-syntax markers, not template placeholders.
  // The replace pass must not touch them.
  const out = renderAgentsMd({ name: 'My App', slug: 'my-app', domain: 'saas' });
  assert.match(out, /\/clarify \[focus\]/);
  assert.match(out, /\/export \[format\]/);
});
