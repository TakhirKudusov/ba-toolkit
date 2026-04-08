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

const AGENTS = {
  'claude-code': {
    name: 'Claude Code',
    projectPath: '.claude/skills/ba-toolkit',
    globalPath: path.join(os.homedir(), '.claude', 'skills', 'ba-toolkit'),
    format: 'skill',
    restartHint: 'Restart Claude Code to load the new skills.',
  },
  codex: {
    name: 'OpenAI Codex CLI',
    projectPath: null, // Codex uses only global
    globalPath: path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'skills', 'ba-toolkit'),
    format: 'skill',
    restartHint: 'Restart the Codex CLI to load the new skills.',
  },
  gemini: {
    name: 'Google Gemini CLI',
    projectPath: '.gemini/skills/ba-toolkit',
    globalPath: path.join(os.homedir(), '.gemini', 'skills', 'ba-toolkit'),
    format: 'skill',
    restartHint: 'Reload Gemini CLI to pick up the new skills.',
  },
  cursor: {
    name: 'Cursor',
    projectPath: '.cursor/rules/ba-toolkit',
    globalPath: null, // Cursor rules are project-scoped
    format: 'mdc',
    restartHint: 'Reload the Cursor window to apply new rules.',
  },
  windsurf: {
    name: 'Windsurf',
    projectPath: '.windsurf/rules/ba-toolkit',
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

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
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

function today() {
  return new Date().toISOString().slice(0, 10);
}

function copyDir(src, dest, { dryRun = false, transform = null } = {}) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source directory not found: ${src}`);
  }
  const copied = [];
  (function walk(s, d) {
    if (!dryRun) fs.mkdirSync(d, { recursive: true });
    for (const entry of fs.readdirSync(s, { withFileTypes: true })) {
      const srcPath = path.join(s, entry.name);
      let destPath = path.join(d, entry.name);
      if (entry.isDirectory()) {
        walk(srcPath, destPath);
        continue;
      }
      if (transform) {
        const result = transform(srcPath, destPath);
        if (!result) continue;
        destPath = result.destPath;
        if (!dryRun) {
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          fs.writeFileSync(destPath, result.content);
        }
      } else {
        if (!dryRun) fs.copyFileSync(srcPath, destPath);
      }
      copied.push(destPath);
    }
  })(src, dest);
  return copied;
}

// Transform SKILL.md → .mdc for Cursor / Windsurf.
// Other files (references/, templates/) are copied as-is.
function skillToMdc(srcPath, destPath) {
  const base = path.basename(srcPath);
  if (base !== 'SKILL.md') {
    return { destPath, content: fs.readFileSync(srcPath) };
  }
  const content = fs.readFileSync(srcPath, 'utf8');
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  let frontmatter = '';
  let body = content;
  if (fmMatch) {
    frontmatter = fmMatch[1];
    body = fmMatch[2];
  }
  const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
  // description is usually a multi-line block with `description: >`
  const descMatch = frontmatter.match(/description:\s*>\s*\r?\n([\s\S]*?)(?:\r?\n\w|$)/);
  const descInlineMatch = frontmatter.match(/^description:\s*(.+)$/m);
  const ruleName = nameMatch ? nameMatch[1].trim() : path.basename(path.dirname(srcPath));
  const rawDesc = descMatch ? descMatch[1] : (descInlineMatch ? descInlineMatch[1] : '');
  const ruleDesc = rawDesc.replace(/\s+/g, ' ').trim();
  const mdcFrontmatter = `---\ndescription: ${ruleDesc}\nalwaysApply: false\n---\n\n`;
  const newDestPath = path.join(path.dirname(destPath), `${ruleName}.mdc`);
  return { destPath: newDestPath, content: mdcFrontmatter + body };
}

function renderAgentsMd({ name, slug, domain }) {
  return `# BA Toolkit — Project Context

> Auto-generated by \`ba-toolkit init\` on ${today()}. Updated automatically by /brief and /srs.

## Active Project

**Project:** ${name}
**Slug:** ${slug}
**Domain:** ${domain}
**Language:** English
**Output folder:** output/${slug}/

## Pipeline Status

| Stage | Skill | Status | File |
|-------|-------|--------|------|
| 0 | /principles | ⬜ Not started | — |
| 1 | /brief | ⬜ Not started | — |
| 2 | /srs | ⬜ Not started | — |
| 3 | /stories | ⬜ Not started | — |
| 4 | /usecases | ⬜ Not started | — |
| 5 | /ac | ⬜ Not started | — |
| 6 | /nfr | ⬜ Not started | — |
| 7 | /datadict | ⬜ Not started | — |
| 7a | /research | ⬜ Not started | — |
| 8 | /apicontract | ⬜ Not started | — |
| 9 | /wireframes | ⬜ Not started | — |
| 10 | /scenarios | ⬜ Not started | — |
| 11 | /handoff | ⬜ Not started | — |

## Key Constraints

- Domain: ${domain}
- (Add constraints after /brief completes)

## Key Stakeholder Roles

- (Populated after /srs completes)

## Open Questions

- (None yet)
`;
}

// --- Commands ----------------------------------------------------------

async function cmdInit(args) {
  log('');
  log('  ' + cyan('BA Toolkit — New Project Setup'));
  log('  ' + cyan('================================'));
  log('');

  // --- 1. Project name (slug derives from it) ---
  const nameFromFlag = !!(args.flags.name && args.flags.name !== true);
  let name = nameFromFlag ? args.flags.name : null;
  if (!name) name = await prompt('  Project name (e.g. My App): ');
  name = String(name || '').trim();
  if (!name) {
    logError('Project name is required.');
    process.exit(1);
  }

  // --- 2. Slug (auto-derived from name; confirmed interactively unless
  //     both --name and --slug were passed on the command line) ---
  const slugFromFlag = !!(args.flags.slug && args.flags.slug !== true);
  let slug = slugFromFlag ? args.flags.slug : null;
  if (!slug) {
    const derived = sanitiseSlug(name);
    if (nameFromFlag) {
      // Non-interactive path: silently accept the derived slug.
      slug = derived;
    } else if (derived) {
      const custom = await prompt(`  Project slug [${cyan(derived)}]: `);
      slug = custom || derived;
    } else {
      slug = await prompt('  Project slug (lowercase, hyphens only): ');
    }
  }
  slug = sanitiseSlug(slug);
  if (!slug) {
    logError('Invalid or empty slug.');
    process.exit(1);
  }

  // --- 3. Domain (numbered menu) ---
  let domain = args.flags.domain;
  if (domain && domain !== true) {
    domain = resolveDomain(String(domain));
    if (!domain) {
      logError(`Unknown domain: ${args.flags.domain}`);
      log('Valid ids: ' + DOMAINS.map((d) => d.id).join(', '));
      process.exit(1);
    }
  } else {
    log('');
    log('  ' + yellow('Pick a domain:'));
    DOMAINS.forEach((d, i) => {
      const idx = String(i + 1).padStart(2);
      log(`    ${idx}) ${bold(d.name.padEnd(13))} ${gray('— ' + d.desc)}`);
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
  let agentId = args.flags.for;
  if (!skipInstall) {
    if (agentId && agentId !== true) {
      agentId = resolveAgent(String(agentId));
      if (!agentId) {
        logError(`Unknown agent: ${args.flags.for}`);
        log('Supported: ' + Object.keys(AGENTS).join(', '));
        process.exit(1);
      }
    } else {
      log('');
      log('  ' + yellow('Pick your AI agent:'));
      const agentEntries = Object.entries(AGENTS);
      agentEntries.forEach(([id, a], i) => {
        const idx = String(i + 1).padStart(2);
        log(`    ${idx}) ${bold(a.name.padEnd(20))} ${gray('(' + id + ')')}`);
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

// Core install logic. Shared between `cmdInstall` (standalone) and `cmdInit`
// (full setup). Returns true on success, false if the user declined to
// overwrite an existing destination.
async function runInstall({ agentId, isGlobal, isProject, dryRun, showHeader = true }) {
  const agent = AGENTS[agentId];
  if (!agent) {
    logError(`Unknown agent: ${agentId}`);
    log('Supported: ' + Object.keys(AGENTS).join(', '));
    process.exit(1);
  }

  let effectiveGlobal = !!isGlobal;
  if (!isGlobal && !isProject) {
    // Default: project-level if supported, otherwise global
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

  if (fs.existsSync(destDir) && !dryRun) {
    const answer = await prompt(`    ${destDir} already exists. Overwrite? (y/N): `);
    if (answer.toLowerCase() !== 'y') {
      log('    cancelled.');
      return false;
    }
  }

  const transform = agent.format === 'mdc' ? skillToMdc : null;
  let copied;
  try {
    copied = copyDir(SKILLS_DIR, destDir, { dryRun, transform });
  } catch (err) {
    logError(err.message);
    process.exit(1);
  }

  log('    ' + green(`${dryRun ? 'would copy' : 'copied'} ${copied.length} files.`));
  if (!dryRun && agent.format === 'mdc') {
    log('    ' + gray('SKILL.md files converted to .mdc rule format.'));
  }
  return true;
}

async function cmdInstall(args) {
  const agentId = args.flags.for;
  if (!agentId || agentId === true) {
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

${bold('INIT OPTIONS')}
  --name <name>                  Skip the project name prompt
  --slug <slug>                  Skip the slug prompt (auto-derived from name)
  --domain <id>                  Skip the domain menu (e.g. saas, fintech)
  --for <agent>                  Skip the agent menu (e.g. claude-code)
  --no-install                   Create the project structure only; don't
                                 install skills. Useful for CI or when you
                                 want to pick the agent later.
  --global                       Install agent skills user-wide
  --project                      Install agent skills project-level (default
                                 when the agent supports it)
  --dry-run                      Preview the install step without writing

${bold('INSTALL OPTIONS')}
  --for <agent>                  One of: ${Object.keys(AGENTS).join(', ')}
  --global                       User-wide install
  --project                      Project-level install (default when supported)
  --dry-run                      Preview without writing files

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

${bold('LEARN MORE')}
  https://github.com/TakhirKudusov/ba-toolkit
`);
}

// --- Main --------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));

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
    case 'help':
      cmdHelp();
      break;
    default:
      logError(`Unknown command: ${command}`);
      log('Run ' + cyan('ba-toolkit --help') + ' for usage.');
      process.exit(1);
  }
}

main().catch((err) => {
  logError(err && (err.stack || err.message) || String(err));
  process.exit(1);
});
