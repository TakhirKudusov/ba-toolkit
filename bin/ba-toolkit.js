#!/usr/bin/env node
/*
 * BA Toolkit CLI
 *
 * Zero runtime dependencies — only Node.js built-ins.
 * Cross-platform: tested on macOS, Linux, and Windows.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// --- Constants ---------------------------------------------------------

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PACKAGE_ROOT, 'skills');
const PKG = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'));

// In v2.0 the install paths dropped the previous `ba-toolkit/` wrapper
// directory. Claude Code, Codex CLI, and Gemini CLI all expect skills
// to be discoverable as direct subfolders of their skills root —
// `.claude/skills/<skill-name>/SKILL.md`, not nested one level deeper.
// The wrapper made all 21 skills invisible to every agent.
//
// Cursor and Windsurf load `.mdc` rule files directly from their rules
// root, so v2.0 also flattens that layout: the per-skill subfolders
// produced by the previous version are gone, and rules sit at
// `.cursor/rules/<skill-name>.mdc`.
//
// To stay safe sharing the skills root with the user's other skills /
// rules, every install also drops a `.ba-toolkit-manifest.json` next to
// the installed items. uninstall and upgrade read this manifest to
// remove only what the toolkit owns; without it they refuse to touch
// anything.
const AGENTS = {
  'claude-code': {
    name: 'Claude Code',
    projectPath: '.claude/skills',
    globalPath: path.join(os.homedir(), '.claude', 'skills'),
    format: 'skill',
    restartHint: 'Restart Claude Code to load the new skills.',
  },
  codex: {
    name: 'OpenAI Codex CLI',
    projectPath: null, // Codex uses only global
    globalPath: path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'skills'),
    format: 'skill',
    restartHint: 'Restart the Codex CLI to load the new skills.',
  },
  gemini: {
    name: 'Google Gemini CLI',
    projectPath: '.gemini/skills',
    globalPath: path.join(os.homedir(), '.gemini', 'skills'),
    format: 'skill',
    restartHint: 'Reload Gemini CLI to pick up the new skills.',
  },
  cursor: {
    name: 'Cursor',
    projectPath: '.cursor/rules',
    globalPath: null, // Cursor rules are project-scoped
    format: 'mdc',
    restartHint: 'Reload the Cursor window to apply new rules.',
  },
  windsurf: {
    name: 'Windsurf',
    projectPath: '.windsurf/rules',
    globalPath: null,
    format: 'mdc',
    restartHint: 'Reload the Windsurf window to apply new rules.',
  },
};

const DOMAINS = [
  { id: 'saas',         name: 'SaaS',         desc: 'B2B platforms, CRM, analytics, EdTech, HRTech' },
  { id: 'fintech',      name: 'Fintech',      desc: 'Neobanks, payments, crypto, P2P lending' },
  { id: 'ecommerce',    name: 'E-commerce',   desc: 'Stores, marketplaces, D2C brands, digital goods' },
  { id: 'healthcare',   name: 'Healthcare',   desc: 'Telemedicine, EHR, patient portals, clinic management' },
  { id: 'logistics',    name: 'Logistics',    desc: 'Delivery, courier, WMS, fleet management' },
  { id: 'on-demand',    name: 'On-demand',    desc: 'Ride-hailing, home services, task marketplaces' },
  { id: 'social-media', name: 'Social/Media', desc: 'Social networks, creator platforms, community forums' },
  { id: 'real-estate',  name: 'Real Estate',  desc: 'Property portals, agency CRM, rental management' },
  { id: 'igaming',      name: 'iGaming',      desc: 'Slots, betting, casino, Telegram Mini Apps' },
  { id: 'custom',       name: 'Custom',       desc: 'Any other domain — general interview questions' },
];

// --- Terminal helpers --------------------------------------------------

const NO_COLOR = !!process.env.NO_COLOR || !process.stdout.isTTY;
const colour = (code) => (str) => NO_COLOR ? String(str) : `\x1b[${code}m${str}\x1b[0m`;
const cyan = colour(36);
const green = colour(32);
const yellow = colour(33);
const red = colour(31);
const gray = colour(90);
const bold = colour(1);

function log(...args) { console.log(...args); }
function logError(...args) { console.error(red('error:'), ...args); }

// --- Arg parsing -------------------------------------------------------

function parseArgs(argv) {
  const args = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--') {
      args._.push(...argv.slice(i + 1));
      break;
    }
    if (a.startsWith('--')) {
      // Support --key=value form (in addition to --key value). The `=` must
      // come after at least one character of key, so `--=value` and `--`
      // alone fall through. Splits on the FIRST `=` only — values may
      // contain further `=` characters.
      const eqIdx = a.indexOf('=');
      if (eqIdx > 2) {
        args.flags[a.slice(2, eqIdx)] = a.slice(eqIdx + 1);
        continue;
      }
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('-')) {
        args.flags[key] = next;
        i++;
      } else {
        args.flags[key] = true;
      }
    } else if (a.startsWith('-') && a.length > 1) {
      const key = a.slice(1);
      args.flags[key] = true;
    } else {
      args._.push(a);
    }
  }
  return args;
}

// --- Prompt helper -----------------------------------------------------

// Shared across all prompts in a single CLI invocation. Creating a new
// readline.Interface for every question (the previous approach) made Ctrl+C
// handling unreliable, leaked listeners on stdin, and broke when stdin was
// piped (EOF on the second create). One interface per process, closed by
// closeReadline() once main() finishes (or by the SIGINT handler).
let sharedRl = null;

function prompt(question) {
  if (!sharedRl) {
    sharedRl = readline.createInterface({ input: process.stdin, output: process.stdout });
  }
  return new Promise((resolve, reject) => {
    let answered = false;
    const onClose = () => {
      if (!answered) {
        const err = new Error('input stream closed before answer');
        err.code = 'INPUT_CLOSED';
        reject(err);
      }
    };
    sharedRl.once('close', onClose);
    sharedRl.question(question, (answer) => {
      answered = true;
      sharedRl.removeListener('close', onClose);
      resolve(answer.trim());
    });
  });
}

function closeReadline() {
  if (sharedRl) {
    sharedRl.close();
    sharedRl = null;
  }
}

// --- Utilities ---------------------------------------------------------

function sanitiseSlug(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Accepts a 1-based menu index ("3") or a domain id ("fintech"). Returns the
// resolved id or null if nothing matched.
function resolveDomain(raw) {
  const trimmed = String(raw || '').toLowerCase().trim();
  if (!trimmed) return null;
  if (/^\d+$/.test(trimmed)) {
    const n = parseInt(trimmed, 10);
    return n >= 1 && n <= DOMAINS.length ? DOMAINS[n - 1].id : null;
  }
  const match = DOMAINS.find((d) => d.id === trimmed);
  return match ? match.id : null;
}

// Accepts a 1-based menu index ("1") or an agent id ("claude-code"). Returns
// the resolved id or null if nothing matched.
function resolveAgent(raw) {
  const trimmed = String(raw || '').toLowerCase().trim();
  if (!trimmed) return null;
  const ids = Object.keys(AGENTS);
  if (/^\d+$/.test(trimmed)) {
    const n = parseInt(trimmed, 10);
    return n >= 1 && n <= ids.length ? ids[n - 1] : null;
  }
  return AGENTS[trimmed] ? trimmed : null;
}

// Returns the string value of a flag, or null if it's absent, was passed
// as a bare boolean (e.g. `--name` with no following value, which
// parseArgs stores as `true`), or has an empty value (e.g. `--name=`).
// Centralises the `flag && flag !== true` / `!flag || flag === true`
// pattern that was repeated across cmdInit, cmdInstall, cmdUninstall,
// cmdUpgrade.
function stringFlag(args, key) {
  const v = args.flags[key];
  return (typeof v === 'string' && v.length > 0) ? v : null;
}

// Every flag the CLI accepts. Typos that don't match anything in this
// set are rejected by validateFlags() with a "Did you mean ...?" hint.
// Single-letter aliases (-v, -h) are listed by their letter form.
const KNOWN_FLAGS = new Set([
  'name', 'slug', 'domain', 'for', 'no-install',
  'global', 'project', 'dry-run',
  'version', 'v', 'help', 'h',
]);

// Levenshtein distance with the standard two-row optimisation. Used by
// closestMatch() to suggest a fix for unknown flags. Pure, exported for
// tests.
function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,        // deletion
        curr[j - 1] + 1,    // insertion
        prev[j - 1] + cost, // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// Find the candidate with the lowest Levenshtein distance to `input`,
// but only if the distance is small enough to be a plausible typo.
// Threshold scales with the input length: ~1 edit per 3 input chars,
// minimum 1. This catches the common cases (transposition like
// `--domian` for `--domain`, single insertion like `--drry-run` for
// `--dry-run`) without producing absurd suggestions for things that
// happen to share a few letters (`--foobar` should NOT suggest
// `--global` even though they have distance 3).
function closestMatch(input, candidates) {
  if (!input) return null;
  const threshold = Math.max(1, Math.floor(input.length / 3));
  let best = null;
  let bestDist = Infinity;
  for (const c of candidates) {
    const d = levenshtein(input, c);
    if (d < bestDist && d <= threshold) {
      best = c;
      bestDist = d;
    }
  }
  return best;
}

// Reject unknown flags with a helpful "Did you mean ...?" suggestion
// when one is plausible. Called from main() after parseArgs.
//
// This catches typos like `--drry-run` or `--for-claude-code` (instead
// of `--for claude-code`) that the previous version of the CLI would
// silently store and then ignore. Both cases used to leave the user
// staring at an interactive prompt wondering why their flag did
// nothing.
function validateFlags(args) {
  const unknown = [];
  for (const key of Object.keys(args.flags)) {
    if (!KNOWN_FLAGS.has(key)) unknown.push(key);
  }
  if (unknown.length === 0) return;
  for (const flag of unknown) {
    const dashes = flag.length === 1 ? '-' : '--';
    logError(`Unknown option: ${dashes}${flag}`);
    const suggestion = closestMatch(flag, [...KNOWN_FLAGS]);
    if (suggestion) {
      const sugDashes = suggestion.length === 1 ? '-' : '--';
      log(`  Did you mean ${cyan(sugDashes + suggestion)}?`);
    }
  }
  log('Run ' + cyan('ba-toolkit --help') + ' for the full list of options.');
  process.exit(1);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// Generic recursive copy that mirrors src into dest. Used by copySkills
// for the references/ folder and for skill-format skill folders, where
// the source structure is preserved verbatim.
function copyDirRecursive(src, dest, { dryRun, copied }) {
  if (!dryRun) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const sp = path.join(src, entry.name);
    const dp = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(sp, dp, { dryRun, copied });
    } else {
      if (!dryRun) fs.copyFileSync(sp, dp);
      copied.push(dp);
    }
  }
}

// Minimal YAML frontmatter parser for SKILL.md files.
//
// Replaces the previous regex-based extraction, which used a fragile
// lookahead (`description:\s*>\s*\r?\n([\s\S]*?)(?:\r?\n\w|$)`) that
// didn't handle blank lines inside descriptions, didn't recognise the
// `|` literal block scalar form, and silently produced wrong output
// if the description happened to contain a line whose first character
// wasn't a word character.
//
// This is NOT a general YAML parser. It only handles the subset that
// SKILL.md files actually use:
//   - Top-level keys at column 0: `key: value`
//   - Inline scalar values: `name: foo`
//   - Folded block scalars: `description: >` followed by indented text
//   - Literal block scalars: `description: |` followed by indented text
//   - Block chomping indicators (>+, >-, |+, |-)
//   - Multi-paragraph block scalars with blank lines between paragraphs
//
// Unsupported (not used by any SKILL.md and YAGNI for the toolkit):
//   - Nested mappings, sequences, anchors, aliases, tags
//   - Quoted scalars (single or double quoted) — names would keep quotes
//
// Returns { name, description, body }. `description` is always
// flattened to a single line (whitespace collapsed) because the .mdc
// rule format expects a one-line description.
function parseSkillFrontmatter(content) {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) {
    return { name: null, description: '', body: content };
  }
  const frontmatter = fmMatch[1];
  const body = fmMatch[2];
  const lines = frontmatter.split(/\r?\n/);

  const fields = {};
  let currentKey = null;
  let buffer = [];

  const flush = () => {
    if (currentKey !== null) {
      fields[currentKey] = buffer.join(' ').replace(/\s+/g, ' ').trim();
    }
    currentKey = null;
    buffer = [];
  };

  for (const line of lines) {
    // A top-level YAML key starts at column 0 with `name:` style.
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/);
    if (m) {
      flush();
      currentKey = m[1];
      const inlineValue = m[2].trim();
      // Block scalar markers (>, |, >+, >-, |+, |-) introduce a block
      // — they aren't part of the value themselves, so don't push them.
      if (inlineValue && !/^[>|][+-]?$/.test(inlineValue)) {
        buffer.push(inlineValue);
      }
    } else if (currentKey) {
      // Continuation line for the active block scalar. Indentation and
      // blank lines are folded into a single space by `flush()`.
      buffer.push(line.trim());
    }
  }
  flush();

  return {
    name: fields.name || null,
    description: fields.description || '',
    body,
  };
}

// Transform a SKILL.md file's contents to the Cursor/Windsurf .mdc rule
// format: replace the YAML frontmatter with the two fields the rule
// loader expects (description, alwaysApply), keep the body unchanged.
function skillToMdcContent(content) {
  const { description, body } = parseSkillFrontmatter(content);
  return `---\ndescription: ${description}\nalwaysApply: false\n---\n\n` + body;
}

// Install the package's skills/ tree into the given destination, picking
// the layout the target agent expects.
//
// For 'skill' format (Claude Code, Codex, Gemini): each source skill
// folder lands as `<destRoot>/<skillName>/SKILL.md`. The references/
// folder is copied as-is to `<destRoot>/references/`.
//
// For 'mdc' format (Cursor, Windsurf): each source skill folder is
// flattened to a single `<destRoot>/<skillName>.mdc` file containing
// the transformed content. References still go to `<destRoot>/references/`
// — non-.mdc files there are ignored by the rule loaders, but the LLM
// can still find them at runtime via the Read tool.
//
// Skill names come from the SKILL.md `name:` frontmatter field, falling
// back to the source folder name. Returns:
//   { copied, items }
// where `copied` is the list of absolute file paths written and `items`
// is the list of top-level entries in destRoot that the toolkit owns
// (used to write the manifest).
function copySkills(srcRoot, destRoot, { format, dryRun = false }) {
  if (!fs.existsSync(srcRoot)) {
    throw new Error(`Source directory not found: ${srcRoot}`);
  }
  const copied = [];
  const items = [];

  if (!dryRun) fs.mkdirSync(destRoot, { recursive: true });

  for (const entry of fs.readdirSync(srcRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const srcPath = path.join(srcRoot, entry.name);

    if (entry.name === 'references') {
      const refDest = path.join(destRoot, 'references');
      copyDirRecursive(srcPath, refDest, { dryRun, copied });
      items.push('references');
      continue;
    }

    // Skill folder. Read its SKILL.md to get the canonical name.
    const skillMdSrc = path.join(srcPath, 'SKILL.md');
    if (!fs.existsSync(skillMdSrc)) continue; // not a skill folder
    const content = fs.readFileSync(skillMdSrc, 'utf8');
    const { name } = parseSkillFrontmatter(content);
    const skillName = name || entry.name;

    if (format === 'mdc') {
      const transformed = skillToMdcContent(content);
      const destFile = path.join(destRoot, `${skillName}.mdc`);
      if (!dryRun) fs.writeFileSync(destFile, transformed);
      copied.push(destFile);
      items.push(`${skillName}.mdc`);
    } else {
      const skillDestDir = path.join(destRoot, skillName);
      copyDirRecursive(srcPath, skillDestDir, { dryRun, copied });
      items.push(skillName);
    }
  }

  return { copied, items };
}

// Path to the AGENTS.md template file. Lives next to the rest of the
// reference templates so the convention stays uniform: anything that
// looks like generated artifact content lives in
// skills/references/templates/, not embedded as a string in the CLI.
//
// MAINTENANCE: when adding a new skill, update both tables in
// agents-template.md:
// - Sequential pipeline stages (numbered 0-11 + 7a sub-step) go in
//   "Pipeline Status" — they have a per-project status that progresses.
// - Cross-cutting utilities (no fixed stage) go in "Cross-cutting Tools".
// The README.md pipeline table is the canonical source of truth for the
// 21-skill list and ordering; keep that template in sync with it.
const AGENTS_TEMPLATE_PATH = path.join(SKILLS_DIR, 'references', 'templates', 'agents-template.md');

function renderAgentsMd({ name, slug, domain }) {
  let template;
  try {
    template = fs.readFileSync(AGENTS_TEMPLATE_PATH, 'utf8');
  } catch (err) {
    throw new Error(`Failed to read AGENTS.md template at ${AGENTS_TEMPLATE_PATH}: ${err.message}`);
  }
  return template
    .replace(/\[NAME\]/g, name)
    .replace(/\[SLUG\]/g, slug)
    .replace(/\[DOMAIN\]/g, domain)
    .replace(/\[DATE\]/g, today());
}

// --- Commands ----------------------------------------------------------

async function cmdInit(args) {
  log('');
  log('  ' + cyan('BA Toolkit — New Project Setup'));
  log('  ' + cyan('================================'));
  log('');

  // --- 1. Project name (slug derives from it) ---
  const nameFlag = stringFlag(args, 'name');
  let name = nameFlag;
  if (!name) name = await prompt('  Project name (e.g. My App): ');
  name = String(name || '').trim();
  if (!name) {
    logError('Project name is required.');
    process.exit(1);
  }

  // --- 2. Slug (auto-derived from name; confirmed interactively unless
  //     both --name and --slug were passed on the command line) ---
  const slugFlag = stringFlag(args, 'slug');
  let slug = slugFlag;
  if (!slug) {
    const derived = sanitiseSlug(name);
    if (nameFlag) {
      // Non-interactive path. Either accept the derived slug, or fail
      // loudly with a hint when the name has no ASCII letters/digits to
      // derive from (e.g. `--name "Проект"` or `--name "🚀"`). Without
      // this branch the user got an opaque "Invalid or empty slug" with
      // no clue why.
      if (!derived) {
        logError(`Cannot derive a slug from "${name}" — it contains no ASCII letters or digits.`);
        log('Pass an explicit slug with --slug, e.g. --slug my-project');
        process.exit(1);
      }
      slug = derived;
    } else if (derived) {
      const custom = await prompt(`  Project slug [${cyan(derived)}]: `);
      slug = custom || derived;
    } else {
      log('  ' + gray(`(could not derive a slug from "${name}" — please type one manually)`));
      slug = await prompt('  Project slug (lowercase, hyphens only): ');
    }
  }
  slug = sanitiseSlug(slug);
  if (!slug) {
    logError('Invalid or empty slug.');
    process.exit(1);
  }

  // --- 3. Domain (numbered menu) ---
  const domainFlag = stringFlag(args, 'domain');
  let domain;
  if (domainFlag) {
    domain = resolveDomain(domainFlag);
    if (!domain) {
      logError(`Unknown domain: ${domainFlag}`);
      log('Valid ids: ' + DOMAINS.map((d) => d.id).join(', '));
      process.exit(1);
    }
  } else {
    log('');
    log('  ' + yellow('Pick a domain:'));
    const domainNameWidth = Math.max(...DOMAINS.map((d) => d.name.length));
    DOMAINS.forEach((d, i) => {
      const idx = String(i + 1).padStart(2);
      log(`    ${idx}) ${bold(d.name.padEnd(domainNameWidth))} ${gray('— ' + d.desc)}`);
    });
    log('');
    const raw = await prompt(`  Select [1-${DOMAINS.length}]: `);
    domain = resolveDomain(raw);
    if (!domain) {
      logError(`Invalid selection: ${raw || '(empty)'}`);
      process.exit(1);
    }
  }

  // --- 4. Agent (numbered menu), unless --no-install ---
  const skipInstall = !!args.flags['no-install'];
  const forFlag = stringFlag(args, 'for');
  let agentId = null;
  if (!skipInstall) {
    if (forFlag) {
      agentId = resolveAgent(forFlag);
      if (!agentId) {
        logError(`Unknown agent: ${forFlag}`);
        log('Supported: ' + Object.keys(AGENTS).join(', '));
        process.exit(1);
      }
    } else {
      log('');
      log('  ' + yellow('Pick your AI agent:'));
      const agentEntries = Object.entries(AGENTS);
      const agentNameWidth = Math.max(...agentEntries.map(([, a]) => a.name.length));
      agentEntries.forEach(([id, a], i) => {
        const idx = String(i + 1).padStart(2);
        log(`    ${idx}) ${bold(a.name.padEnd(agentNameWidth))} ${gray('(' + id + ')')}`);
      });
      log('');
      const raw = await prompt(`  Select [1-${agentEntries.length}]: `);
      agentId = resolveAgent(raw);
      if (!agentId) {
        logError(`Invalid selection: ${raw || '(empty)'}`);
        process.exit(1);
      }
    }
  }

  // --- 5. Create project structure ---
  log('');
  log('  ' + green('Creating project structure...'));

  const outputDir = path.join('output', slug);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    log(`    created  ${outputDir}`);
  } else {
    log(`    exists   ${outputDir}`);
  }

  const agentsPath = 'AGENTS.md';
  let writeAgents = true;
  if (fs.existsSync(agentsPath)) {
    const answer = await prompt('  AGENTS.md already exists. Overwrite? (y/N): ');
    if (answer.toLowerCase() !== 'y') {
      writeAgents = false;
      log('    skipped  AGENTS.md');
    }
  }
  if (writeAgents) {
    fs.writeFileSync(agentsPath, renderAgentsMd({ name, slug, domain }));
    log('    created  AGENTS.md');
  }

  // --- 6. Install skills for the selected agent ---
  // installed: null = no install attempted (--no-install or no agentId),
  //            true = install succeeded,
  //            false = install was cancelled (e.g. user declined overwrite).
  let installed = null;
  if (!skipInstall && agentId) {
    log('');
    installed = await runInstall({
      agentId,
      isGlobal: !!args.flags.global,
      isProject: !!args.flags.project,
      dryRun: !!args.flags['dry-run'],
      showHeader: false,
    });
  }

  // --- 7. Final message ---
  log('');
  log('  ' + cyan(`Project '${name}' (${slug}) is ready.`));
  log('');
  log('  ' + yellow('Next steps:'));
  if (installed === true) {
    log('    1. ' + AGENTS[agentId].restartHint);
    log('    2. Optional: run /principles to define project-wide conventions');
    log('    3. Run /brief to start the BA pipeline');
  } else if (installed === false) {
    log('    1. Skill install was cancelled. To install later, run:');
    log('         ' + gray(`ba-toolkit install --for ${agentId}`));
    log('    2. Open your AI assistant (Claude, Cursor, etc.)');
    log('    3. Optional: run /principles to define project-wide conventions');
    log('    4. Run /brief to start the BA pipeline');
  } else {
    log('    1. Install skills for your agent:');
    log('         ' + gray('ba-toolkit install --for claude-code'));
    log('    2. Open your AI assistant (Claude, Cursor, etc.)');
    log('    3. Optional: run /principles to define project-wide conventions');
    log('    4. Run /brief to start the BA pipeline');
  }
  log('');
  log('  ' + gray(`Artifacts will be saved to: ${outputDir}/`));
  log('');
}

// Manifest written into the install destination after a successful copy.
// Replaces the v1.x version sentinel — now also tracks WHICH items
// belong to BA Toolkit, so uninstall/upgrade can selectively remove
// only what we own without touching the user's other skills sitting in
// the same directory.
//
// Hidden filename with no `.md` / `.mdc` extension so the skill loader
// of every supported agent ignores it.
const MANIFEST_FILENAME = '.ba-toolkit-manifest.json';

function readManifest(destDir) {
  const p = path.join(destDir, MANIFEST_FILENAME);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function writeManifest(destDir, format, items) {
  const payload = {
    version: PKG.version,
    installedAt: new Date().toISOString(),
    format,
    items,
  };
  fs.writeFileSync(
    path.join(destDir, MANIFEST_FILENAME),
    JSON.stringify(payload, null, 2) + '\n',
  );
}

// Detect the v1.x install layout: every previous install path nested
// our 21 skills under an extra `ba-toolkit/` folder, which made them
// invisible to every agent's skill loader. Returns the absolute paths
// of any legacy folders that still exist for the given agent, so the
// caller can warn the user to clean them up before installing v2.0.
function detectLegacyInstall(agent) {
  const candidates = [];
  if (agent.projectPath) {
    candidates.push(path.resolve(process.cwd(), agent.projectPath, 'ba-toolkit'));
  }
  if (agent.globalPath) {
    candidates.push(path.join(agent.globalPath, 'ba-toolkit'));
  }
  return candidates.filter((p) => fs.existsSync(p));
}

// Core install logic. Shared between `cmdInstall` (standalone), `cmdInit`
// (full setup), and `cmdUpgrade`. Returns true on success, false if the
// user declined to overwrite an existing install. Pass `force: true` to
// skip the overwrite prompt — cmdUpgrade uses this because it has
// already removed the previous install via the manifest.
//
// v2.0 model: the destination directory is shared with the user's other
// skills. We never wipe destDir wholesale. Before copying we read the
// manifest (if any) and remove only the items the previous v2.0 install
// owned, then copy the new tree and write a fresh manifest. Items that
// don't appear in the manifest are not ours and never get touched.
async function runInstall({ agentId, isGlobal, isProject, dryRun, showHeader = true, force = false }) {
  const { agent, destDir, effectiveGlobal } = resolveAgentDestination({
    agentId,
    isGlobal,
    isProject,
  });

  if (showHeader) {
    log('');
    log('  ' + cyan(`BA Toolkit — Install for ${agent.name}`));
    log('  ' + cyan('================================'));
    log('');
  } else {
    log('  ' + green(`Installing skills for ${agent.name}...`));
  }
  log(`    source:       ${SKILLS_DIR}`);
  log(`    destination:  ${destDir}`);
  log(`    scope:        ${effectiveGlobal ? 'global (user-wide)' : 'project-level'}`);
  log(`    format:       ${agent.format === 'mdc' ? '.mdc (converted from SKILL.md)' : 'SKILL.md (native)'}`);
  if (dryRun) log('    ' + yellow('mode:         dry-run (no files will be written)'));

  // Warn about a v1.x wrapper folder if one is sitting in the same
  // location. Don't auto-delete — could be the user's working state.
  warnLegacyInstall(agent);

  // If a previous v2.0 install lives here, ask before replacing it.
  // The manifest is the only signal that the directory contains our
  // files; without it we treat the install as fresh and let copySkills
  // happily add to whatever's already there.
  const existingManifest = readManifest(destDir);
  if (existingManifest && !dryRun && !force) {
    log(`    existing:     v${existingManifest.version} (${existingManifest.items.length} items)`);
    const answer = await prompt('    Replace existing BA Toolkit install? (y/N): ');
    if (answer.toLowerCase() !== 'y') {
      log('    cancelled.');
      return false;
    }
  }

  // Selectively remove the previous install's items (and only those)
  // before copying the new tree. Sentinel-style file is removed too.
  if (existingManifest && !dryRun) {
    removeManifestItems(destDir, existingManifest);
  }

  let result;
  try {
    result = copySkills(SKILLS_DIR, destDir, { format: agent.format, dryRun });
  } catch (err) {
    logError(err.message);
    process.exit(1);
  }

  if (!dryRun) {
    writeManifest(destDir, agent.format, result.items);
  }

  log('    ' + green(`${dryRun ? 'would copy' : 'copied'} ${result.copied.length} files (${result.items.length} items).`));
  if (!dryRun && agent.format === 'mdc') {
    log('    ' + gray('SKILL.md files converted to .mdc rule format.'));
  }
  return true;
}

// Remove every item listed in the given manifest from destDir, then
// remove the manifest file itself. Items are paths relative to destDir
// — for 'skill' format they're folder names (`brief`, `srs`, ...,
// `references`), for 'mdc' they're file names (`brief.mdc`, ...,
// plus the `references` folder). Anything not in the manifest is left
// alone, including the user's other skills/rules in the same directory.
function removeManifestItems(destDir, manifest) {
  for (const item of manifest.items) {
    const p = path.join(destDir, item);
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
    }
  }
  const manifestPath = path.join(destDir, MANIFEST_FILENAME);
  if (fs.existsSync(manifestPath)) {
    fs.rmSync(manifestPath, { force: true });
  }
}

// Print a yellow warning if the v1.x wrapper directory is still around
// in the same skills root. The wrapper made every shipped skill
// invisible to the agent, so any user upgrading from v1 needs to
// remove it manually before v2.0 can install correctly.
function warnLegacyInstall(agent) {
  const legacy = detectLegacyInstall(agent);
  if (legacy.length === 0) return;
  log('');
  log('  ' + yellow('! Legacy v1.x install detected — must be removed before v2.0 will work:'));
  for (const p of legacy) {
    log('  ' + yellow(`    ${p}`));
  }
  log('  ' + yellow('  v2.0 dropped the ba-toolkit/ wrapper folder; the agent ignored every skill nested under it.'));
  log('  ' + yellow('  Remove the legacy folder manually:'));
  for (const p of legacy) {
    log('  ' + gray(`    rm -rf "${p}"`));
  }
  log('');
}

async function cmdInstall(args) {
  const agentId = stringFlag(args, 'for');
  if (!agentId) {
    logError('--for <agent> is required.');
    log('Supported agents: ' + Object.keys(AGENTS).join(', '));
    process.exit(1);
  }
  const ok = await runInstall({
    agentId,
    isGlobal: !!args.flags.global,
    isProject: !!args.flags.project,
    dryRun: !!args.flags['dry-run'],
    showHeader: true,
  });
  log('');
  if (ok && !args.flags['dry-run']) {
    log('  ' + cyan('Install complete.'));
    log('  ' + yellow(AGENTS[agentId].restartHint));
  }
  log('');
}

// Resolve agent + scope (project vs global) into the target directory
// path. Shared validation for cmdUninstall — `runInstall` does its own
// version of this inline; both could be unified later.
function resolveAgentDestination({ agentId, isGlobal, isProject }) {
  const agent = AGENTS[agentId];
  if (!agent) {
    logError(`Unknown agent: ${agentId}`);
    log('Supported: ' + Object.keys(AGENTS).join(', '));
    process.exit(1);
  }
  let effectiveGlobal = !!isGlobal;
  if (!isGlobal && !isProject) {
    effectiveGlobal = !agent.projectPath;
  }
  if (effectiveGlobal && !agent.globalPath) {
    logError(`${agent.name} does not support --global install.`);
    process.exit(1);
  }
  if (!effectiveGlobal && !agent.projectPath) {
    logError(`${agent.name} does not support project-level install. Use --global.`);
    process.exit(1);
  }
  const destDir = effectiveGlobal ? agent.globalPath : path.resolve(process.cwd(), agent.projectPath);
  return { agent, destDir, effectiveGlobal };
}

function cmdStatus() {
  log('');
  log('  ' + cyan('BA Toolkit — Installation Status'));
  log('  ' + cyan('================================'));
  log('');
  log(`  package version:  ${PKG.version}`);
  log(`  scanning from:    ${process.cwd()}`);
  log('');

  // Walk every (agent × scope) combination and collect the ones that
  // have a v2.0 manifest. Project-scope paths resolve against the
  // current working directory; global paths are absolute.
  const rows = [];
  const legacyRows = [];

  const checkLocation = (agent, agentId, scope, dir) => {
    if (!fs.existsSync(dir)) return;
    const manifest = readManifest(dir);
    if (manifest) {
      rows.push({
        agentName: agent.name,
        agentId,
        scope,
        path: dir,
        version: manifest.version,
        installedAt: manifest.installedAt,
        itemCount: manifest.items.length,
      });
    }
  };

  for (const [agentId, agent] of Object.entries(AGENTS)) {
    if (agent.projectPath) {
      const projectDir = path.resolve(process.cwd(), agent.projectPath);
      checkLocation(agent, agentId, 'project', projectDir);
    }
    if (agent.globalPath) {
      checkLocation(agent, agentId, 'global', agent.globalPath);
    }
    // Surface any v1.x wrapper folders as a separate "legacy" row.
    for (const legacyPath of detectLegacyInstall(agent)) {
      legacyRows.push({ agentName: agent.name, agentId, path: legacyPath });
    }
  }

  if (rows.length === 0 && legacyRows.length === 0) {
    log('  ' + gray('No BA Toolkit installations found in any known location.'));
    log('  ' + gray("Run 'ba-toolkit install --for <agent>' to install one."));
    log('');
    return;
  }

  if (rows.length > 0) {
    log(`  Found ${bold(rows.length)} installation${rows.length === 1 ? '' : 's'}:`);
    log('');
    for (const row of rows) {
      const versionLabel = row.version === PKG.version
        ? green(row.version + ' (current)')
        : yellow(row.version + ' (outdated)');
      log(`  ${bold(row.agentName)} ${gray('(' + row.agentId + ', ' + row.scope + ')')}`);
      log(`    path:      ${row.path}`);
      log(`    version:   ${versionLabel}`);
      log(`    items:     ${row.itemCount}`);
      log(`    installed: ${gray(row.installedAt)}`);
      log('');
    }
  }

  if (legacyRows.length > 0) {
    log('  ' + yellow(`Found ${legacyRows.length} legacy v1.x install${legacyRows.length === 1 ? '' : 's'} (broken — invisible to the agent):`));
    log('');
    for (const row of legacyRows) {
      log(`  ${bold(row.agentName)} ${gray('(' + row.agentId + ', legacy wrapper)')}`);
      log(`    path:      ${row.path}`);
      log(`    fix:       ` + gray(`rm -rf "${row.path}" && ba-toolkit install --for ${row.agentId}`));
      log('');
    }
  }

  const stale = rows.filter((r) => r.version !== PKG.version);
  if (stale.length > 0) {
    log('  ' + yellow(`${stale.length} installation${stale.length === 1 ? '' : 's'} not at version ${PKG.version}.`));
    log('  ' + gray("Run 'ba-toolkit upgrade --for <agent>' to refresh."));
    log('');
  } else if (rows.length > 0) {
    log('  ' + green('All installations are up to date.'));
    log('');
  }
}

async function cmdUpgrade(args) {
  const agentId = stringFlag(args, 'for');
  if (!agentId) {
    logError('--for <agent> is required.');
    log('Supported agents: ' + Object.keys(AGENTS).join(', '));
    process.exit(1);
  }
  const { agent, destDir, effectiveGlobal } = resolveAgentDestination({
    agentId,
    isGlobal: !!args.flags.global,
    isProject: !!args.flags.project,
  });
  const dryRun = !!args.flags['dry-run'];

  log('');
  log('  ' + cyan(`BA Toolkit — Upgrade for ${agent.name}`));
  log('  ' + cyan('================================'));
  log('');
  log(`  destination:  ${destDir}`);
  log(`  scope:        ${effectiveGlobal ? 'global (user-wide)' : 'project-level'}`);

  warnLegacyInstall(agent);

  if (!fs.existsSync(destDir)) {
    log('');
    log('  ' + gray(`No installation found at ${destDir}.`));
    log('  ' + gray(`Run 'ba-toolkit install --for ${agentId}' first.`));
    log('');
    return;
  }

  const manifest = readManifest(destDir);
  if (!manifest) {
    log('');
    log('  ' + gray('No BA Toolkit manifest found in this destination.'));
    log('  ' + gray(`Run 'ba-toolkit install --for ${agentId}' to install fresh.`));
    log('');
    return;
  }

  const currentVersion = PKG.version;
  if (manifest.version === currentVersion) {
    log(`  installed:    ${manifest.version} (current)`);
    log(`  package:      ${currentVersion}`);
    log('');
    log('  ' + green('Already up to date.'));
    log('  ' + gray(`To force a clean reinstall, run 'ba-toolkit install --for ${agentId}'.`));
    log('');
    return;
  }

  log(`  installed:    ${manifest.version}`);
  log(`  package:      ${currentVersion}`);
  log(`  items:        ${manifest.items.length}`);
  if (dryRun) log('  ' + yellow('mode:         dry-run (no files will be written)'));
  log('');

  if (dryRun) {
    log('  ' + yellow(`would remove ${manifest.items.length} previously-installed items, then re-copy the new tree`));
  } else {
    log('  ' + green('Removing previous install (manifest-driven)...'));
    removeManifestItems(destDir, manifest);
  }

  const ok = await runInstall({
    agentId,
    isGlobal: effectiveGlobal,
    isProject: !effectiveGlobal,
    dryRun,
    showHeader: false,
    force: true,
  });
  log('');
  if (ok && !dryRun) {
    log('  ' + cyan(`Upgraded to ${currentVersion}.`));
    log('  ' + yellow(agent.restartHint));
  }
  log('');
}

async function cmdUninstall(args) {
  const agentId = stringFlag(args, 'for');
  if (!agentId) {
    logError('--for <agent> is required.');
    log('Supported agents: ' + Object.keys(AGENTS).join(', '));
    process.exit(1);
  }
  const { agent, destDir, effectiveGlobal } = resolveAgentDestination({
    agentId,
    isGlobal: !!args.flags.global,
    isProject: !!args.flags.project,
  });
  const dryRun = !!args.flags['dry-run'];

  log('');
  log('  ' + cyan(`BA Toolkit — Uninstall from ${agent.name}`));
  log('  ' + cyan('================================'));
  log('');
  log(`  destination:  ${destDir}`);
  log(`  scope:        ${effectiveGlobal ? 'global (user-wide)' : 'project-level'}`);
  if (dryRun) log('  ' + yellow('mode:         dry-run (no files will be removed)'));

  warnLegacyInstall(agent);

  if (!fs.existsSync(destDir)) {
    log('');
    log('  ' + gray(`Nothing to uninstall — ${destDir} does not exist.`));
    log('');
    return;
  }

  // The manifest is the proof we own anything in this directory. The
  // destination is shared with the user's other skills/rules, so we
  // can't just `rm -rf destDir` — we'd nuke unrelated files. Without
  // a manifest, refuse and tell the user.
  const manifest = readManifest(destDir);
  if (!manifest) {
    log('');
    log('  ' + gray('No BA Toolkit manifest found in this destination.'));
    log('  ' + gray('Either nothing was installed here, or the install pre-dates v2.0.'));
    log('  ' + gray('For a v1.x legacy wrapper, see the warning above (if any) for the path to remove manually.'));
    log('');
    return;
  }

  log('');
  log(`  installed:    ${manifest.version}`);
  log(`  items:        ${bold(manifest.items.length)} (${manifest.items.slice(0, 5).join(', ')}${manifest.items.length > 5 ? ', …' : ''})`);

  if (dryRun) {
    log('  ' + yellow(`would remove ${manifest.items.length} items + the manifest from ${destDir}`));
    log('');
    return;
  }

  log('');
  const answer = await prompt(`  Remove ${manifest.items.length} BA Toolkit items from ${destDir}? (y/N): `);
  if (answer.toLowerCase() !== 'y') {
    log('  Cancelled.');
    log('');
    return;
  }
  removeManifestItems(destDir, manifest);
  log('  ' + green(`Removed ${manifest.items.length} items.`));
  log('  ' + yellow(agent.restartHint));
  log('');
}

function cmdHelp() {
  log(`${bold('ba-toolkit')} v${PKG.version} — AI-powered Business Analyst pipeline

${bold('USAGE')}
  ba-toolkit <command> [options]

${bold('COMMANDS')}
  init                           One-command project setup: prompts for name,
                                 slug, domain, and AI agent, then creates
                                 output/{slug}/, AGENTS.md, and installs the
                                 skills into the chosen agent's directory.
  install --for <agent>          Install (or re-install) skills into an
                                 agent's directory without creating a project.
  uninstall --for <agent>        Remove BA Toolkit skills from an agent's
                                 directory. Asks for confirmation before
                                 deleting; supports --dry-run.
  upgrade --for <agent>          Refresh skills after a toolkit version bump.
                                 Compares the installed version sentinel
                                 against the package version, wipes the old
                                 install on mismatch, and re-runs install.
                                 Aliased as 'update'.
  status                         Scan all known install locations for every
                                 supported agent (project + global) and
                                 report which versions are installed where.
                                 Read-only; no flags.

${bold('OPTIONS')}
  --name <name>                  init only — skip the project name prompt
  --slug <slug>                  init only — skip the slug prompt (auto-derived
                                 from name)
  --domain <id>                  init only — skip the domain menu
                                 (e.g. saas, fintech)
  --no-install                   init only — create the project structure
                                 without installing skills (useful for CI)
  --for <agent>                  install/uninstall/upgrade — pick the target
                                 agent. One of: ${Object.keys(AGENTS).join(', ')}.
                                 init also accepts this to skip the agent menu.
  --global                       install/uninstall/upgrade — target the
                                 user-wide install
  --project                      install/uninstall/upgrade — target the
                                 project-level install (default when the
                                 agent supports it)
  --dry-run                      init/install/uninstall/upgrade — preview
                                 without writing or removing files

${bold('GENERAL OPTIONS')}
  --version, -v                  Print version and exit
  --help, -h                     Print this help and exit

${bold('EXAMPLES')}
  # Full interactive setup — one command does everything.
  ba-toolkit init

  # Non-interactive: all choices on the command line.
  ba-toolkit init --name "My App" --domain saas --for claude-code

  # Create the project structure now, pick the agent later.
  ba-toolkit init --name "My App" --domain saas --no-install

  # Re-install skills after a toolkit update (no project changes).
  ba-toolkit install --for claude-code
  ba-toolkit install --for cursor --dry-run

  # Remove skills from an agent (asks for confirmation).
  ba-toolkit uninstall --for claude-code
  ba-toolkit uninstall --for claude-code --global
  ba-toolkit uninstall --for cursor --dry-run

  # After 'npm update -g @kudusov.takhir/ba-toolkit', refresh the skills.
  ba-toolkit upgrade --for claude-code
  ba-toolkit upgrade --for cursor --dry-run

  # See where (and which version) BA Toolkit is installed.
  ba-toolkit status

${bold('LEARN MORE')}
  https://github.com/TakhirKudusov/ba-toolkit
`);
}

// --- Main --------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  validateFlags(args);

  if (args.flags.version || args.flags.v) {
    log(PKG.version);
    return;
  }

  if (args.flags.help || args.flags.h || args._.length === 0) {
    cmdHelp();
    return;
  }

  const command = args._[0];
  switch (command) {
    case 'init':
      await cmdInit(args);
      break;
    case 'install':
      await cmdInstall(args);
      break;
    case 'uninstall':
      await cmdUninstall(args);
      break;
    case 'upgrade':
    case 'update':
      await cmdUpgrade(args);
      break;
    case 'status':
      cmdStatus();
      break;
    case 'help':
      cmdHelp();
      break;
    default:
      logError(`Unknown command: ${command}`);
      log('Run ' + cyan('ba-toolkit --help') + ' for usage.');
      process.exit(1);
  }
}

// Exports for tests. Pure functions only — anything that prompts or
// touches the filesystem stays internal. The bin file is still
// runnable as a CLI; the `require.main === module` guard below
// prevents `main()` from firing when the file is loaded as a module
// from the test runner.
module.exports = {
  sanitiseSlug,
  parseArgs,
  resolveDomain,
  resolveAgent,
  stringFlag,
  levenshtein,
  closestMatch,
  parseSkillFrontmatter,
  skillToMdcContent,
  readManifest,
  detectLegacyInstall,
  renderAgentsMd,
  KNOWN_FLAGS,
  DOMAINS,
  AGENTS,
};

if (require.main === module) {
  // Clean exit on Ctrl+C: print on a fresh line so we don't append to a
  // half-typed prompt, close the readline interface so the terminal is
  // returned to a sane state, then exit with the conventional 130 code.
  process.on('SIGINT', () => {
    console.log('\n  ' + yellow('Cancelled.'));
    closeReadline();
    process.exit(130);
  });

  main()
    .then(() => {
      closeReadline();
    })
    .catch((err) => {
      closeReadline();
      if (err && err.code === 'INPUT_CLOSED') {
        logError('Input stream closed before all prompts could be answered.');
        log('Pass remaining values as flags (e.g. --name, --domain, --for) or run interactively.');
        process.exit(1);
      }
      logError(err && (err.stack || err.message) || String(err));
      process.exit(1);
    });
}
