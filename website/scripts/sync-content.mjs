#!/usr/bin/env node
// sync-content.mjs — copy markdown files from the repo root into
// website/src/content/docs/ and prepend a Starlight frontmatter block.
//
// This is the single point that keeps the website in sync with the repo.
// The repo's README.md, ROADMAP.md, COMMANDS.md, CHANGELOG.md, and the
// docs/ folder remain the canonical source of truth — never edit files
// under website/src/content/docs/ by hand. They are regenerated on every
// build.
//
// Zero deps — only Node built-ins (fs, path, url). The website's runtime
// deps (Astro, Starlight) live in website/package.json and never affect
// the published npm package, but this script is intentionally Node-only
// so it can run anywhere without an extra install.

import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..', '..');
const DOCS_OUT = resolve(__dirname, '..', 'src', 'content', 'docs');

// Per-source mapping. Each entry: { from, to, title, description }.
// `from` is relative to REPO_ROOT. `to` is relative to DOCS_OUT.
// NOTE: index.mdx is hand-written (hero + feature cards) and committed
// directly under website/src/content/docs/. It is NOT synced from
// README.md. The README is GitHub-optimised (centered HTML badges, raw
// <div> wrappers) and doesn't render well in Starlight. The website
// landing page is a purpose-built product landing instead.
const SOURCES = [
  {
    from: 'docs/USAGE.md',
    to: 'usage.md',
    title: 'Usage guide',
    description: 'Day-to-day use of the BA Toolkit pipeline.',
  },
  {
    from: 'COMMANDS.md',
    to: 'commands.md',
    title: 'Command reference',
    description: 'Quick reference for every shipped skill and subcommand.',
  },
  {
    from: 'docs/FAQ.md',
    to: 'faq.md',
    title: 'FAQ',
    description: 'Common questions about BA Toolkit.',
  },
  {
    from: 'docs/DOMAINS.md',
    to: 'domains.md',
    title: 'Domain references',
    description: 'How domain references work and how to add a new one.',
  },
  {
    from: 'docs/TROUBLESHOOTING.md',
    to: 'troubleshooting.md',
    title: 'Troubleshooting',
    description: 'Common issues and fixes.',
  },
  {
    from: 'ROADMAP.md',
    to: 'roadmap.md',
    title: 'Roadmap',
    description:
      'What is in flight, what is planned next, what is explicitly out of scope.',
  },
  {
    from: 'CHANGELOG.md',
    to: 'changelog.md',
    title: 'Changelog',
    description: 'Release history for the npm package.',
  },
];

// Hand-written pages that live in the website but are not synced from the
// repo root. These are not touched by this script — they are committed
// directly under website/src/content/docs/ and survive the wipe.
const HAND_WRITTEN = new Set(['getting-started.md', 'index.mdx']);

function escapeYaml(value) {
  // Single-line YAML scalar with double quotes. Escape backslashes and
  // double quotes; collapse newlines to spaces.
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildFrontmatter({ title, description }) {
  return [
    '---',
    `title: "${escapeYaml(title)}"`,
    `description: "${escapeYaml(description)}"`,
    '---',
    '',
    '',
  ].join('\n');
}

// Strip the leading H1 from the source markdown if it exists. Starlight
// renders the title from the frontmatter, so a duplicate H1 in the body
// would render twice.
function stripLeadingH1(body) {
  const lines = body.split('\n');
  let i = 0;
  // Skip leading blank lines and HTML comment blocks (used for div-align
  // wrappers in README hero blocks).
  while (i < lines.length && (/^\s*$/.test(lines[i]) || /^<\/?div/.test(lines[i]))) {
    i++;
  }
  if (i < lines.length && /^# /.test(lines[i])) {
    lines.splice(i, 1);
    // Skip a single blank line that often follows the H1.
    if (i < lines.length && /^\s*$/.test(lines[i])) {
      lines.splice(i, 1);
    }
  }
  return lines.join('\n');
}

// Rewrite intra-repo markdown links so they resolve under the website's
// base path. README links like `docs/USAGE.md` need to become `/usage/`,
// and similar for the other synced files.
const LINK_REWRITES = new Map([
  ['README.md', '/'],
  ['./README.md', '/'],
  ['docs/USAGE.md', '/usage/'],
  ['./docs/USAGE.md', '/usage/'],
  ['COMMANDS.md', '/commands/'],
  ['./COMMANDS.md', '/commands/'],
  ['docs/FAQ.md', '/faq/'],
  ['./docs/FAQ.md', '/faq/'],
  ['docs/DOMAINS.md', '/domains/'],
  ['./docs/DOMAINS.md', '/domains/'],
  ['docs/TROUBLESHOOTING.md', '/troubleshooting/'],
  ['./docs/TROUBLESHOOTING.md', '/troubleshooting/'],
  ['ROADMAP.md', '/roadmap/'],
  ['./ROADMAP.md', '/roadmap/'],
  ['CHANGELOG.md', '/changelog/'],
  ['./CHANGELOG.md', '/changelog/'],
]);

function rewriteLinks(body) {
  return body.replace(/\]\(([^)]+)\)/g, (full, target) => {
    // Drop fragment for the lookup; preserve it in the output.
    const hashIdx = target.indexOf('#');
    const path = hashIdx === -1 ? target : target.slice(0, hashIdx);
    const fragment = hashIdx === -1 ? '' : target.slice(hashIdx);
    if (LINK_REWRITES.has(path)) {
      return `](${LINK_REWRITES.get(path)}${fragment})`;
    }
    return full;
  });
}

function syncOne({ from, to, title, description }) {
  const sourcePath = join(REPO_ROOT, from);
  if (!existsSync(sourcePath)) {
    console.warn(`  skip — source missing: ${from}`);
    return;
  }
  const raw = readFileSync(sourcePath, 'utf8');
  const stripped = stripLeadingH1(raw);
  const rewritten = rewriteLinks(stripped);
  const frontmatter = buildFrontmatter({ title, description });
  const out = frontmatter + rewritten;
  const targetPath = join(DOCS_OUT, to);
  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, out);
  console.log(`  ✓ ${from}  →  src/content/docs/${to}`);
}

function main() {
  console.log('sync-content.mjs — wiping generated content');
  // Wipe generated files but preserve the hand-written ones listed in
  // HAND_WRITTEN. Snapshot first, wipe, restore protected files, then
  // sync from the repo root.
  const protectedSnapshots = new Map();
  if (existsSync(DOCS_OUT)) {
    for (const filename of HAND_WRITTEN) {
      const p = join(DOCS_OUT, filename);
      if (existsSync(p)) {
        protectedSnapshots.set(filename, readFileSync(p, 'utf8'));
      }
    }
    rmSync(DOCS_OUT, { recursive: true, force: true });
  }
  mkdirSync(DOCS_OUT, { recursive: true });
  for (const [filename, body] of protectedSnapshots) {
    writeFileSync(join(DOCS_OUT, filename), body);
  }

  console.log('sync-content.mjs — copying repo content');
  for (const source of SOURCES) {
    syncOne(source);
  }
  console.log(`sync-content.mjs — done (${SOURCES.length} files synced)`);
}

main();
