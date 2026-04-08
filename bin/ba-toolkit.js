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
  { id: 'igaming', desc: 'iGaming — slots, betting, casino, Telegram Mini Apps' },
  { id: 'fintech', desc: 'Fintech — neobanks, payments, crypto, P2P lending' },
  { id: 'saas', desc: 'SaaS — B2B platforms, CRM, analytics, EdTech' },
  { id: 'ecommerce', desc: 'E-commerce — stores, marketplaces, D2C brands' },
  { id: 'healthcare', desc: 'Healthcare — telemedicine, EHR, patient portals' },
  { id: 'logistics', desc: 'Logistics — delivery, courier, WMS, fleet' },
  { id: 'on-demand', desc: 'On-demand — ride-hailing, home services, marketplace' },
  { id: 'social-media', desc: 'Social/Media — social networks, creator platforms' },
  { id: 'real-estate', desc: 'Real Estate — property portals, CRM, rental management' },
  { id: 'custom', desc: 'Custom — any other domain' },
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

  let slug = args.flags.slug;
  if (!slug) slug = await prompt('  Project slug (lowercase, hyphens only, e.g. dragon-fortune): ');
  slug = sanitiseSlug(slug);
  if (!slug) {
    logError('Invalid or empty slug.');
    process.exit(1);
  }

  let name = args.flags.name;
  if (!name) name = await prompt('  Project name (human-readable, e.g. Dragon Fortune): ');
  if (!name) {
    logError('Project name is required.');
    process.exit(1);
  }

  let domain = args.flags.domain;
  if (!domain) {
    log('');
    log('  ' + yellow('Available domains:'));
    for (const d of DOMAINS) {
      log(`    ${d.id.padEnd(14)} ${d.desc}`);
    }
    log('');
    domain = await prompt('  Domain: ');
  }
  domain = String(domain || '').toLowerCase().trim();
  if (!domain) domain = 'custom';

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

  log('');
  log('  ' + cyan(`Project '${name}' (${slug}) initialised.`));
  log('');
  log('  ' + yellow('Next steps:'));
  log('    1. Install skills for your agent:');
  log('         ' + gray('ba-toolkit install --for claude-code'));
  log('    2. Open your AI assistant (Claude, Cursor, etc.)');
  log('    3. Optional: run /principles to define project-wide conventions');
  log('    4. Run /brief to start the pipeline');
  log('');
  log('  ' + gray(`Artifacts will be saved to: ${outputDir}/`));
  log('');
}

async function cmdInstall(args) {
  const agentId = args.flags.for;
  if (!agentId || agentId === true) {
    logError('--for <agent> is required.');
    log('Supported agents: ' + Object.keys(AGENTS).join(', '));
    process.exit(1);
  }
  const agent = AGENTS[agentId];
  if (!agent) {
    logError(`Unknown agent: ${agentId}`);
    log('Supported: ' + Object.keys(AGENTS).join(', '));
    process.exit(1);
  }

  const requestedGlobal = !!args.flags.global;
  const requestedProject = !!args.flags.project;
  let isGlobal = requestedGlobal;
  if (!requestedGlobal && !requestedProject) {
    // Default: project-level if supported, otherwise global
    isGlobal = !agent.projectPath;
  }
  if (isGlobal && !agent.globalPath) {
    logError(`${agent.name} does not support --global install.`);
    process.exit(1);
  }
  if (!isGlobal && !agent.projectPath) {
    logError(`${agent.name} does not support project-level install. Use --global.`);
    process.exit(1);
  }

  const destDir = isGlobal ? agent.globalPath : path.resolve(process.cwd(), agent.projectPath);
  const dryRun = !!args.flags['dry-run'];

  log('');
  log('  ' + cyan(`BA Toolkit — Install for ${agent.name}`));
  log('  ' + cyan('================================'));
  log('');
  log(`  Source:       ${SKILLS_DIR}`);
  log(`  Destination:  ${destDir}`);
  log(`  Scope:        ${isGlobal ? 'global (user-wide)' : 'project-level'}`);
  log(`  Format:       ${agent.format === 'mdc' ? '.mdc (converted from SKILL.md)' : 'SKILL.md (native)'}`);
  if (dryRun) log('  ' + yellow('Mode:         dry-run (no files will be written)'));
  log('');

  if (fs.existsSync(destDir) && !dryRun) {
    const answer = await prompt(`  ${destDir} already exists. Overwrite? (y/N): `);
    if (answer.toLowerCase() !== 'y') {
      log('  Cancelled.');
      return;
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

  log('  ' + green(`${dryRun ? 'Would copy' : 'Copied'} ${copied.length} files.`));
  log('');
  if (!dryRun) {
    log('  ' + cyan('Install complete.'));
    if (agent.format === 'mdc') {
      log('  ' + gray('SKILL.md files converted to .mdc rule format.'));
    }
    log('  ' + yellow(agent.restartHint));
  }
  log('');
}

function cmdHelp() {
  log(`${bold('ba-toolkit')} v${PKG.version} — AI-powered Business Analyst pipeline

${bold('USAGE')}
  ba-toolkit <command> [options]

${bold('COMMANDS')}
  init                           Interactive project initialiser. Creates
                                 output/{slug}/ and a starter AGENTS.md.
  install --for <agent>          Install skills into an agent's directory.

${bold('INSTALL OPTIONS')}
  --for <agent>                  One of: ${Object.keys(AGENTS).join(', ')}
  --global                       User-wide install
  --project                      Project-level install (default when supported)
  --dry-run                      Preview without writing files

${bold('INIT OPTIONS')}
  --slug <slug>                  Skip the slug prompt
  --name <name>                  Skip the project name prompt
  --domain <domain>              Skip the domain prompt

${bold('GENERAL OPTIONS')}
  --version, -v                  Print version and exit
  --help, -h                     Print this help and exit

${bold('EXAMPLES')}
  ba-toolkit init
  ba-toolkit init --slug dragon-fortune --name "Dragon Fortune" --domain igaming
  ba-toolkit install --for claude-code
  ba-toolkit install --for claude-code --global
  ba-toolkit install --for cursor
  ba-toolkit install --for gemini --dry-run

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
