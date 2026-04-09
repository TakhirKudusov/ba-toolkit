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

// All five supported agents — Claude Code, Codex CLI, Gemini CLI,
// Cursor, and Windsurf — load Agent Skills as direct subfolders of
// their skills root: `<skills-root>/<skill-name>/SKILL.md`. The toolkit
// installs the 23 skills natively in this layout for every agent. No
// .mdc conversion. Confirmed against the Agent Skills documentation
// for each platform via ctx7 MCP / official docs.
//
// Earlier versions tried to install Cursor and Windsurf via `.mdc`
// rules under `.cursor/rules/` and `.windsurf/rules/` — but Rules and
// Agent Skills are two separate features in both editors, and the
// toolkit is a pipeline of skills, not rules. The wrong-feature install
// silently failed: skills loaded as rules never surfaced as `/brief`,
// `/srs`, … slash commands. v2.x corrects this for Cursor, and the
// Windsurf cleanup in this changelog entry finishes the job.
//
// To stay safe sharing the skills root with the user's other skills,
// every install also drops a `.ba-toolkit-manifest.json` next to the
// installed items. uninstall and upgrade read this manifest to remove
// only what the toolkit owns; without it they refuse to touch anything.
const AGENTS = {
  'claude-code': {
    name: 'Claude Code',
    projectPath: '.claude/skills',
    globalPath: path.join(os.homedir(), '.claude', 'skills'),
    restartHint: 'Restart Claude Code to load the new skills.',
  },
  codex: {
    name: 'OpenAI Codex CLI',
    projectPath: null, // Codex uses only global
    globalPath: path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'skills'),
    restartHint: 'Restart the Codex CLI to load the new skills.',
  },
  gemini: {
    name: 'Google Gemini CLI',
    projectPath: '.gemini/skills',
    globalPath: path.join(os.homedir(), '.gemini', 'skills'),
    restartHint: 'Reload Gemini CLI to pick up the new skills.',
  },
  cursor: {
    name: 'Cursor',
    projectPath: '.cursor/skills',
    globalPath: null, // Cursor skills are project-scoped for now
    restartHint: 'Reload the Cursor window to apply new skills.',
  },
  windsurf: {
    name: 'Windsurf',
    projectPath: '.windsurf/skills',
    globalPath: null, // Windsurf skills are project-scoped for now
    restartHint: 'Reload the Windsurf window to apply new skills.',
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

// ASCII banner shown at the top of `ba-toolkit init`. Suppressed on
// non-TTY stdout so it doesn't end up in CI logs or piped output.
// Stored as an array of literal lines (not a template literal) so the
// `$` characters stay out of any interpolation path.
const BANNER = [
  ' /$$                           /$$                         /$$ /$$       /$$   /$$    ',
  '| $$                          | $$                        | $$| $$      |__/  | $$    ',
  '| $$$$$$$   /$$$$$$          /$$$$$$    /$$$$$$   /$$$$$$ | $$| $$   /$$ /$$ /$$$$$$  ',
  '| $$__  $$ |____  $$ /$$$$$$|_  $$_/   /$$__  $$ /$$__  $$| $$| $$  /$$/| $$|_  $$_/  ',
  '| $$  \\ $$  /$$$$$$$|______/  | $$    | $$  \\ $$| $$  \\ $$| $$| $$$$$$/ | $$  | $$    ',
  '| $$  | $$ /$$__  $$          | $$ /$$| $$  | $$| $$  | $$| $$| $$_  $$ | $$  | $$ /$$',
  '| $$$$$$$/|  $$$$$$$          |  $$$$/|  $$$$$$/|  $$$$$$/| $$| $$ \\  $$| $$  |  $$$$/',
  '|_______/  \\_______/           \\___/   \\______/  \\______/ |__/|__/  \\__/|__/   \\___/  ',
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

// Print the BANNER to stdout if — and only if — stdout is a real TTY.
// Piped / redirected runs (CI, test spawn, `ba-toolkit init | tee ...`)
// get a clean log without the 8-line block. The banner is decorative,
// not load-bearing, so suppressing it in non-interactive contexts is
// the right default.
function printBanner() {
  if (!process.stdout.isTTY) return;
  for (const line of BANNER) log(cyan(line));
  log('');
}

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
// readline.Interface for every question (the earlier approach) made Ctrl+C
// handling unreliable, leaked listeners on stdin, and broke when stdin was
// piped. One interface per process, closed by closeReadline() once main()
// finishes (or by the SIGINT handler).
//
// prompt() does NOT use `rl.question(...)` — that method races with
// readline's internal line buffering when stdin is piped. If input arrives
// faster than prompts are issued (the common piped case: the user pipes a
// here-doc with multiple answers, or a test feeds the entire stdin buffer
// upfront), readline emits 'line' events before the question listener is
// attached and those lines are silently dropped. The second prompt then
// sees EOF and errors with INPUT_CLOSED despite the answer actually being
// in the buffer.
//
// Instead we own the 'line' event ourselves and keep a line queue: every
// line that arrives is pushed onto `lineQueue` if no one is waiting, or
// delivered directly to the oldest waiter. A prompt() call takes the head
// of the queue if non-empty, otherwise parks a waiter. The 'close' event
// drains all waiting waiters with INPUT_CLOSED.
let sharedRl = null;
const lineQueue = [];
const waiters = [];
let inputClosed = false;

function ensureReadline() {
  if (sharedRl) return;
  sharedRl = readline.createInterface({ input: process.stdin, output: process.stdout });
  sharedRl.on('line', (line) => {
    if (waiters.length > 0) {
      waiters.shift().resolve(line);
    } else {
      lineQueue.push(line);
    }
  });
  sharedRl.on('close', () => {
    inputClosed = true;
    while (waiters.length > 0) {
      const err = new Error('input stream closed before answer');
      err.code = 'INPUT_CLOSED';
      waiters.shift().reject(err);
    }
  });
}

function prompt(question) {
  ensureReadline();
  // Render the question ourselves — we're not using rl.question().
  process.stdout.write(question);
  if (lineQueue.length > 0) {
    return Promise.resolve(String(lineQueue.shift()).trim());
  }
  if (inputClosed) {
    const err = new Error('input stream closed before answer');
    err.code = 'INPUT_CLOSED';
    return Promise.reject(err);
  }
  return new Promise((resolve, reject) => {
    waiters.push({
      resolve: (line) => resolve(String(line).trim()),
      reject,
    });
  });
}

function closeReadline() {
  if (sharedRl) {
    sharedRl.close();
    sharedRl = null;
  }
}

// --- Arrow-key menus -----------------------------------------------------
//
// Three layers, separated for testability:
//
//   1. menuStep(state, key) — pure state machine. Given the current
//      menu state and a normalised key action, returns the new state.
//      Unit-tested directly. No dependencies, no I/O.
//
//   2. renderMenu(state, opts) — pure renderer. Returns the frame to
//      print as a string. Unit-tested too — uses the colour helpers,
//      which collapse to identity strings under NO_COLOR (i.e., in
//      tests), so the assertions are stable.
//
//   3. runMenuTty(items, opts) / selectMenu(items, opts) — the I/O
//      glue. Detects TTY, sets raw mode, listens for keypress events,
//      drives the loop, falls back to a numbered prompt under
//      promptUntilValid when the terminal is non-interactive (CI,
//      piped input, TERM=dumb). Not unit-tested — covered by manual
//      smoke and the existing fallback-path integration tests.
//
// Cross-platform note: Node's `readline.emitKeypressEvents` decodes
// arrow-key escape sequences uniformly across bash/zsh/fish on
// Linux/macOS, Windows Terminal (PowerShell, cmd, WSL), Git Bash /
// MSYS2, and VSCode's integrated terminal. Modern Node also enables VT
// mode automatically on Windows when raw mode is requested, so legacy
// cmd.exe on Win10+ works too. The only environment we explicitly bail
// out of is `TERM=dumb` (emacs M-x shell, some IDE shells) — keypress
// decoding is unreliable there.

function menuStep(state, key) {
  if (state.done) return state;
  const len = state.items.length;
  if (len === 0) return state;
  switch (key) {
    case 'up':
      return { ...state, index: (state.index - 1 + len) % len };
    case 'down':
      return { ...state, index: (state.index + 1) % len };
    case 'enter':
      return { ...state, done: true, choice: state.items[state.index] };
    case 'cancel':
      return { ...state, done: true, choice: null };
    default: {
      // Letter jump: 'a' → 0, 'b' → 1, …, 'i' → 8.
      if (/^[a-z]$/.test(key)) {
        const idx = key.charCodeAt(0) - 'a'.charCodeAt(0);
        if (idx < len) {
          return { ...state, index: idx };
        }
        return state;
      }
      // Digit jump kept as a backward-compat fallback so existing
      // CI scripts and muscle-memory keep working: '1' → 0, '9' → 8.
      if (/^[0-9]$/.test(key)) {
        const n = parseInt(key, 10);
        if (n >= 1 && n <= len) {
          return { ...state, index: n - 1 };
        }
      }
      return state;
    }
  }
}

function renderMenu(state, { title } = {}) {
  const lines = [];
  if (title) {
    lines.push('  ' + yellow(title));
    lines.push('');
  }
  const labelWidth = Math.max(...state.items.map((it) => it.label.length));
  state.items.forEach((item, i) => {
    const selected = i === state.index;
    const marker = selected ? cyan('>') : ' ';
    // Letter ID — `a`, `b`, `c`, … — matches the interview-protocol
    // table format and works for menus up to 26 items (we currently
    // ship 10 domains and 5 agents, so this is plenty).
    const id = String.fromCharCode('a'.charCodeAt(0) + i);
    const label = selected ? bold(item.label.padEnd(labelWidth)) : item.label.padEnd(labelWidth);
    const desc = item.desc ? '  ' + gray('— ' + item.desc) : '';
    lines.push(`  ${marker} ${id}) ${label}${desc}`);
  });
  lines.push('');
  lines.push('  ' + gray('↑/↓ navigate · Enter select · a-z jump · Esc cancel'));
  return lines.join('\n') + '\n';
}

// True when arrow-key menus are usable in this process. False under
// piped stdin/stdout, dumb terminals, or when raw mode is unavailable.
function isInteractiveTerminal() {
  if (!process.stdin.isTTY) return false;
  if (!process.stdout.isTTY) return false;
  if (process.env.TERM === 'dumb') return false;
  if (typeof process.stdin.setRawMode !== 'function') return false;
  return true;
}

// TTY runner: drive the menu state machine via raw-mode keypress
// events. Returns the chosen item or null if the user cancelled.
// The caller is responsible for not invoking this when
// isInteractiveTerminal() is false.
function runMenuTty(items, { title } = {}) {
  // The shared line-mode readline (used by `prompt()`) and a raw-mode
  // keypress reader can't both own stdin at the same time. Close any
  // line-mode interface before we take over; the next prompt() call
  // will lazily recreate it via ensureReadline().
  closeReadline();

  return new Promise((resolve) => {
    let state = { items, index: 0, done: false, choice: null };
    let lastFrameLineCount = 0;

    const render = () => {
      // Erase the previous frame in place: move the cursor up over its
      // line count, then clear from cursor to end of screen. First
      // render has nothing to erase.
      if (lastFrameLineCount > 0) {
        process.stdout.write(`\x1b[${lastFrameLineCount}A\x1b[J`);
      }
      const frame = renderMenu(state, { title });
      process.stdout.write(frame);
      // Count lines actually printed (frame ends with a trailing \n).
      lastFrameLineCount = frame.split('\n').length - 1;
    };

    const cleanup = () => {
      process.stdin.removeListener('keypress', onKey);
      try {
        process.stdin.setRawMode(false);
      } catch { /* setRawMode can throw if stdin is not a TTY anymore */ }
      process.stdin.pause();
    };

    const onKey = (_str, key) => {
      if (!key) return;
      let action = null;
      if (key.ctrl && key.name === 'c') action = 'cancel';
      else if (key.name === 'escape') action = 'cancel';
      else if (key.name === 'up' || key.name === 'k') action = 'up';
      else if (key.name === 'down' || key.name === 'j') action = 'down';
      else if (key.name === 'return') action = 'enter';
      // Letter jump (a-z) is the new primary; digit (0-9) stays as a
      // backward-compat fallback for users who muscle-memory cipher
      // navigation. menuStep parses both — see its switch statement.
      // Note: 'j' and 'k' are intercepted above as down/up (vim-bindings),
      // so they never reach the letter-jump path.
      else if (key.sequence && /^[a-z]$/.test(key.sequence)) action = key.sequence;
      else if (key.sequence && /^[0-9]$/.test(key.sequence)) action = key.sequence;
      if (!action) return;
      state = menuStep(state, action);
      if (state.done) {
        cleanup();
        resolve(state.choice);
      } else {
        render();
      }
    };

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('keypress', onKey);
    render();
  });
}

// Top-level selector: interactive arrow-key menu in real terminals,
// numbered prompt fallback everywhere else (CI, piped input, dumb
// TERM, EditorIDE shells). Always returns either an item from `items`
// or null on cancel.
async function selectMenu(items, { title, fallbackPrompt }) {
  if (isInteractiveTerminal()) {
    return await runMenuTty(items, { title });
  }
  // Non-TTY fallback: print the lettered list once, then prompt with
  // promptUntilValid so a single typo doesn't kill the wizard.
  log('');
  if (title) log('  ' + yellow(title));
  const labelWidth = Math.max(...items.map((it) => it.label.length));
  items.forEach((item, i) => {
    const id = String.fromCharCode('a'.charCodeAt(0) + i);
    const desc = item.desc ? '  ' + gray('— ' + item.desc) : '';
    log(`    ${id}) ${bold(item.label.padEnd(labelWidth))}${desc}`);
  });
  log('');
  return await promptUntilValid(
    fallbackPrompt,
    (raw) => {
      const trimmed = String(raw || '').toLowerCase().trim();
      if (!trimmed) return null;
      // Letter ID is the primary input (a → 0, b → 1, …).
      if (/^[a-z]$/.test(trimmed)) {
        const idx = trimmed.charCodeAt(0) - 'a'.charCodeAt(0);
        return idx < items.length ? items[idx] : null;
      }
      // Digit ID stays as a fallback so legacy CI scripts and pasted
      // numbers still work (1 → 0, 2 → 1, …).
      if (/^\d+$/.test(trimmed)) {
        const n = parseInt(trimmed, 10);
        return n >= 1 && n <= items.length ? items[n - 1] : null;
      }
      // Verbatim id-string fallback (e.g., 'saas', 'claude-code').
      return items.find((it) => it.id === trimmed) || null;
    },
    { invalidMessage: `Invalid selection — pick a letter (a–${String.fromCharCode('a'.charCodeAt(0) + items.length - 1)}), a number, or an id.` },
  );
}

// Ask the user `question`, run `resolver` on the trimmed answer, and
// loop while the resolver returns null/undefined. Prints a yellow
// "try again" message between attempts. Aborts with process.exit(1)
// after `maxAttempts` consecutive invalid answers so a piped input
// can't infinite-loop us.
//
// Previously, cmdInit called `resolveDomain` / `resolveAgent` /
// `sanitiseSlug` once and hard-failed on the first typo — users who
// mistyped "saass" lost the whole wizard and had to start over. With
// the retry loop, they just read the error and try again.
async function promptUntilValid(question, resolver, {
  maxAttempts = 3,
  invalidMessage = 'Invalid selection — try again.',
} = {}) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const raw = await prompt(question);
    const result = resolver(raw);
    if (result != null && result !== '') return result;
    const remaining = maxAttempts - attempt;
    if (remaining > 0) {
      log('  ' + yellow(`${invalidMessage} (${remaining} attempt${remaining === 1 ? '' : 's'} left)`));
    }
  }
  logError(`Too many invalid attempts — aborting.`);
  process.exit(1);
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
  'format', 'out',
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
// flattened to a single line (whitespace collapsed) — keeps the
// downstream consumers (manifest summary, status output, agent skill
// loaders that expect a single-line description) free of multi-line
// surprises.
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

// Install the package's skills/ tree into the given destination. Every
// supported agent uses the same Agent Skills layout: each source skill
// folder lands as `<destRoot>/<skillName>/SKILL.md`. The `references/`
// folder is copied as-is to `<destRoot>/references/`.
//
// Skill names come from the SKILL.md `name:` frontmatter field, falling
// back to the source folder name. Returns:
//   { copied, items }
// where `copied` is the list of absolute file paths written and `items`
// is the list of top-level entries in destRoot that the toolkit owns
// (used to write the manifest).
function copySkills(srcRoot, destRoot, { dryRun = false } = {}) {
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

    const skillDestDir = path.join(destRoot, skillName);
    copyDirRecursive(srcPath, skillDestDir, { dryRun, copied });
    items.push(skillName);
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

// Anchor markers delimit the block inside AGENTS.md that `ba-toolkit
// init` owns and is allowed to rewrite on re-init. Everything outside
// the anchors (Pipeline Status, Key Constraints, Open Questions, user
// notes) is preserved untouched. See agents-template.md.
const AGENTS_MANAGED_BEGIN = '<!-- ba-toolkit:begin managed -->';
const AGENTS_MANAGED_END = '<!-- ba-toolkit:end managed -->';

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

// Merge the fresh AGENTS.md content into whatever already exists at
// the project root. Three branches:
//
//   1. No existing file (existing == null) — return the fresh template,
//      action 'created'.
//   2. Existing file has both anchor markers — replace only the managed
//      block content between the anchors, leave the rest of the file
//      (Pipeline Status, Key Constraints, user notes) untouched. Action
//      'merged'.
//   3. Existing file has no anchors — it's either a legacy AGENTS.md
//      from a pre-merge version of the toolkit or a fully user-authored
//      file. Leave it untouched and return { action: 'preserved' } so
//      the caller can print a note. We never silently overwrite
//      user content.
//
// Pure function for easy testing. Exported so test/cli.test.js can
// cover all three branches without spawning a process.
function mergeAgentsMd(existing, ctx) {
  const fresh = renderAgentsMd(ctx);
  if (existing == null) {
    return { content: fresh, action: 'created' };
  }
  const beginIdx = existing.indexOf(AGENTS_MANAGED_BEGIN);
  const endIdx = existing.indexOf(AGENTS_MANAGED_END);
  if (beginIdx === -1 || endIdx === -1 || endIdx < beginIdx) {
    return { content: existing, action: 'preserved' };
  }
  const freshBeginIdx = fresh.indexOf(AGENTS_MANAGED_BEGIN);
  const freshEndIdx = fresh.indexOf(AGENTS_MANAGED_END);
  if (freshBeginIdx === -1 || freshEndIdx === -1) {
    // Template is broken — fall back to returning fresh. Should be
    // caught in unit tests if the template file ever loses its anchors.
    return { content: fresh, action: 'created' };
  }
  const freshManaged = fresh.slice(freshBeginIdx, freshEndIdx + AGENTS_MANAGED_END.length);
  const before = existing.slice(0, beginIdx);
  const after = existing.slice(endIdx + AGENTS_MANAGED_END.length);
  return { content: before + freshManaged + after, action: 'merged' };
}

// --- Commands ----------------------------------------------------------

async function cmdInit(args) {
  printBanner();
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
      // Default branch: the derived slug is offered as the suggested
      // answer. Empty input accepts the suggestion; anything the user
      // types is run through sanitiseSlug and must produce something
      // non-empty — otherwise re-prompt.
      slug = await promptUntilValid(
        `  Project slug [${cyan(derived)}]: `,
        (raw) => {
          const typed = String(raw || '').trim();
          if (!typed) return derived;
          const cleaned = sanitiseSlug(typed);
          return cleaned || null;
        },
        { invalidMessage: 'Invalid slug — must produce at least one ASCII letter/digit after sanitisation.' },
      );
    } else {
      log('  ' + gray(`(could not derive a slug from "${name}" — please type one manually)`));
      slug = await promptUntilValid(
        '  Project slug (lowercase, hyphens only): ',
        (raw) => {
          const cleaned = sanitiseSlug(String(raw || '').trim());
          return cleaned || null;
        },
        { invalidMessage: 'Invalid slug — must contain at least one ASCII letter or digit.' },
      );
    }
  }
  // At this point `slug` is already a sanitised, non-empty string from
  // one of the branches above. The final sanitiseSlug call is a
  // defensive no-op for the flag path (--slug) where we haven't
  // cleaned it yet.
  slug = sanitiseSlug(slug);
  if (!slug) {
    logError('Invalid or empty slug.');
    process.exit(1);
  }

  // --- 3. Domain (arrow menu in TTY, numbered fallback elsewhere) ---
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
    const chosen = await selectMenu(
      DOMAINS.map((d) => ({ id: d.id, label: d.name, desc: d.desc })),
      {
        title: 'Pick a domain:',
        fallbackPrompt: `  Select [a-${String.fromCharCode('a'.charCodeAt(0) + DOMAINS.length - 1)}]: `,
      },
    );
    if (chosen == null) {
      log('  ' + yellow('Cancelled.'));
      process.exit(130);
    }
    domain = chosen.id;
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
      const agentEntries = Object.entries(AGENTS);
      const chosen = await selectMenu(
        agentEntries.map(([id, a]) => ({ id, label: a.name, desc: '(' + id + ')' })),
        {
          title: 'Pick your AI agent:',
          fallbackPrompt: `  Select [a-${String.fromCharCode('a'.charCodeAt(0) + agentEntries.length - 1)}]: `,
        },
      );
      if (chosen == null) {
        log('  ' + yellow('Cancelled.'));
        process.exit(130);
      }
      agentId = chosen.id;
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

  // AGENTS.md: per-project, lives inside output/<slug>/. Two agent
  // windows can now work on two different projects in the same repo
  // without colliding — each cd-s into its own output/<slug>/ folder
  // and finds its own AGENTS.md there. The merge-on-reinit behaviour
  // (managed-block anchors) still applies, just at per-project scope.
  // See mergeAgentsMd for the three branches (created, merged,
  // preserved).
  const agentsPath = path.join(outputDir, 'AGENTS.md');
  const existingAgents = fs.existsSync(agentsPath)
    ? fs.readFileSync(agentsPath, 'utf8')
    : null;
  const { content: agentsContent, action: agentsAction } = mergeAgentsMd(
    existingAgents,
    { name, slug, domain },
  );
  if (agentsAction === 'preserved') {
    log('    ' + gray(`preserved ${agentsPath} (no ba-toolkit managed block — left untouched)`));
  } else {
    fs.writeFileSync(agentsPath, agentsContent);
    log(`    ${agentsAction === 'merged' ? 'updated ' : 'created '} ${agentsPath}`);
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
  log('  ' + cyan(`Project '${name}' (${slug}) is ready in ${outputDir}/.`));
  log('');
  log('  ' + yellow('Next steps:'));
  if (installed === true) {
    log('    1. ' + AGENTS[agentId].restartHint);
    log('    2. ' + bold(`cd ${outputDir}`) + ' — open your AI agent in this folder.');
    log('       Each project has its own AGENTS.md, so two agent windows');
    log('       can work on two different projects in the same repo.');
    log('    3. Optional: run /discovery if you do not yet know what to build,');
    log('       or /principles to define project-wide conventions');
    log('    4. Run /brief to start the BA pipeline');
  } else if (installed === false) {
    log('    1. Skill install was cancelled. To install later, run:');
    log('         ' + gray(`ba-toolkit install --for ${agentId}`));
    log('    2. ' + bold(`cd ${outputDir}`) + ' and open your AI agent there.');
    log('    3. Optional: run /discovery if you do not yet know what to build,');
    log('       or /principles to define project-wide conventions');
    log('    4. Run /brief to start the BA pipeline');
  } else {
    log('    1. Install skills for your agent:');
    log('         ' + gray('ba-toolkit install --for claude-code'));
    log('    2. ' + bold(`cd ${outputDir}`) + ' and open your AI agent there.');
    log('    3. Optional: run /discovery if you do not yet know what to build,');
    log('       or /principles to define project-wide conventions');
    log('    4. Run /brief to start the BA pipeline');
  }
  log('');
  log('  ' + gray(`Artifacts and AGENTS.md live in: ${outputDir}/`));
  log('');
}

// Manifest written into the install destination after a successful copy.
// Replaces the v1.x version sentinel — now also tracks WHICH items
// belong to BA Toolkit, so uninstall/upgrade can selectively remove
// only what we own without touching the user's other skills sitting in
// the same directory.
//
// Hidden filename with no `.md` extension so the skill loader of every
// supported agent ignores it.
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

function writeManifest(destDir, items) {
  const payload = {
    version: PKG.version,
    installedAt: new Date().toISOString(),
    items,
  };
  fs.writeFileSync(
    path.join(destDir, MANIFEST_FILENAME),
    JSON.stringify(payload, null, 2) + '\n',
  );
}

// Detect the v1.x install layout: every previous install path nested
// the v1.x skills under an extra `ba-toolkit/` folder, which made them
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
  log(`    format:       SKILL.md (native)`);
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
    result = copySkills(SKILLS_DIR, destDir, { dryRun });
  } catch (err) {
    logError(err.message);
    process.exit(1);
  }

  if (!dryRun) {
    writeManifest(destDir, result.items);
  }

  log('    ' + green(`${dryRun ? 'would copy' : 'copied'} ${result.copied.length} files (${result.items.length} items).`));
  return true;
}

// Remove every item listed in the given manifest from destDir, then
// remove the manifest file itself. Items are top-level entries
// relative to destDir — folder names like `brief`, `srs`, …,
// `references`. Anything not in the manifest is left alone, including
// the user's other skills sitting in the same directory.
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

// --- Publish (Notion / Confluence export) ------------------------------

// Escape the four HTML special characters that matter inside text
// content. Used by markdownToHtml everywhere user-controlled text is
// emitted into an HTML attribute or body. Keep this list short and
// uncontroversial — any further entity table belongs in a real HTML
// library, which we deliberately avoid (zero deps).
function htmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// GitHub-style heading slug: lowercase, spaces → dashes, drop everything
// that isn't a word char or dash. Used to give every heading a stable
// `id` so cross-references like `02_srs.html#fr-001` resolve.
function slugifyHeading(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Convert the BA Toolkit subset of Markdown to plain HTML. Scope is
// intentionally small (no nested lists, no images, no raw HTML, no
// reference-style links, no footnotes) — these features don't appear in
// any shipped artifact template. The aim is a converter small enough to
// audit by hand and fully covered by snapshot tests.
//
// Block pass: walk lines, group them into blocks (paragraph, heading,
// list, table, fenced code, blockquote, hr). Inline pass: rewrite
// emphasis, links and code spans inside each block's text content.
function markdownToHtml(src) {
  const lines = String(src).replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;

  // Inline-rewrite a single line of text. Order matters: extract code
  // spans first so we don't touch their contents, then links, then
  // emphasis. Each step replaces the matched span with a placeholder,
  // and a final pass swaps placeholders back so emphasis inside link
  // text still resolves.
  function inline(text) {
    const placeholders = [];
    const stash = (html) => {
      placeholders.push(html);
      return `\u0000${placeholders.length - 1}\u0000`;
    };
    // Code spans `x` — stashed first so their contents are immune to
    // every other inline rule.
    text = text.replace(/`([^`\n]+)`/g, (_, code) => stash(`<code>${htmlEscape(code)}</code>`));
    // Links [text](url) — also stashed so the raw <a> tag survives the
    // final htmlEscape pass.
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
      // Recursively inline-format the label so emphasis inside links works.
      const inner = inline(label);
      return stash(`<a href="${htmlEscape(url)}">${inner}</a>`);
    });
    // Bold **x** — stash, otherwise the trailing htmlEscape would
    // re-escape the `<strong>` tags we just emitted.
    text = text.replace(/\*\*([^*\n]+)\*\*/g, (_, body) => stash(`<strong>${htmlEscape(body)}</strong>`));
    // Italic *x* and _x_ — same stashing rule. Narrow patterns avoid
    // eating any leftover ** (there are none after the bold pass, but
    // the guard keeps the regex robust against pathological input).
    text = text.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, (_, pre, body) => `${pre}${stash(`<em>${htmlEscape(body)}</em>`)}`);
    text = text.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, (_, pre, body) => `${pre}${stash(`<em>${htmlEscape(body)}</em>`)}`);
    // Escape every character that survived the stashing passes. The
    // placeholder marker \u0000 is not in the escape list and the
    // ASCII digits inside the marker are also unaffected, so the swap
    // below still finds them.
    text = htmlEscape(text);
    // Restore placeholders.
    text = text.replace(/\u0000(\d+)\u0000/g, (_, idx) => placeholders[Number(idx)]);
    return text;
  }

  while (i < lines.length) {
    const line = lines[i];

    // Blank lines separate blocks; collapse runs of them.
    if (/^\s*$/.test(line)) { i++; continue; }

    // Fenced code block ```lang
    const fenceMatch = /^```(\w*)\s*$/.exec(line);
    if (fenceMatch) {
      const lang = fenceMatch[1];
      const body = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        body.push(lines[i]);
        i++;
      }
      // Skip the closing fence (or accept EOF as the close).
      if (i < lines.length) i++;
      const cls = lang ? ` class="language-${htmlEscape(lang)}"` : '';
      out.push(`<pre><code${cls}>${htmlEscape(body.join('\n'))}</code></pre>`);
      continue;
    }

    // Heading # … ######
    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = slugifyHeading(text);
      out.push(`<h${level} id="${htmlEscape(id)}">${inline(text)}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+\s*$/.test(line)) {
      out.push('<hr>');
      i++;
      continue;
    }

    // Table — header row + alignment row + body rows. We require both
    // the header and the alignment row to exist; otherwise treat the
    // line as a paragraph.
    if (/^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const splitRow = (row) => row.replace(/^\||\|\s*$/g, '').split('|').map((c) => c.trim());
      const header = splitRow(line);
      i += 2; // skip header + alignment
      const body = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        body.push(splitRow(lines[i]));
        i++;
      }
      const thead = '<thead><tr>' + header.map((c) => `<th>${inline(c)}</th>`).join('') + '</tr></thead>';
      const tbody = body.length > 0
        ? '<tbody>' + body.map((row) => '<tr>' + row.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') + '</tbody>'
        : '';
      out.push(`<table>${thead}${tbody}</table>`);
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      const body = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        body.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote><p>${inline(body.join(' '))}</p></blockquote>`);
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      out.push('<ul>' + items.map((it) => `<li>${inline(it)}</li>`).join('') + '</ul>');
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      out.push('<ol>' + items.map((it) => `<li>${inline(it)}</li>`).join('') + '</ol>');
      continue;
    }

    // Default: paragraph (greedy until blank line or another block).
    const para = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^#{1,6}\s/.test(lines[i]) &&
           !/^```/.test(lines[i]) && !/^[-*]\s/.test(lines[i]) && !/^\d+\.\s/.test(lines[i]) &&
           !/^>\s?/.test(lines[i]) && !/^---+\s*$/.test(lines[i]) &&
           !(/^\|.*\|\s*$/.test(lines[i]) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1]))) {
      para.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }

  return out.join('\n');
}

// Match every BA Toolkit artifact filename in a project output dir:
// `00_discovery_<slug>.md`, `00_principles_<slug>.md`, `01_brief_<slug>.md`,
// `07a_research_<slug>.md`, `11_handoff_<slug>.md`, `00_risks_<slug>.md`,
// etc. The pattern is intentionally permissive — anything that starts
// with two digits (and an optional letter) followed by `_<word>_` is
// in.
const ARTIFACT_FILE_RE = /^\d{2}[a-z]?_[a-z]+_.*\.md$/;

// Numeric-aware sort: 01 < 02 < … < 07 < 07a < 08 < … < 11. Strips the
// suffix letter and uses it only as a tiebreaker so `7a` always sorts
// after `7` and before `8`.
function compareArtifactFilenames(a, b) {
  const m1 = /^(\d{2})([a-z]?)/.exec(a);
  const m2 = /^(\d{2})([a-z]?)/.exec(b);
  const n1 = parseInt(m1[1], 10);
  const n2 = parseInt(m2[1], 10);
  if (n1 !== n2) return n1 - n2;
  if (m1[2] !== m2[2]) return m1[2] < m2[2] ? -1 : 1;
  return a < b ? -1 : a > b ? 1 : 0;
}

// Rewrite intra-project markdown links inside an artifact body so they
// survive the import. Mode is one of:
//   'notion'     — `[txt](02_srs_x.md#anchor)` → `[txt](./02_srs_x.md#anchor)`
//                  Notion's bulk markdown importer resolves relative
//                  links between files in the same import batch.
//   'confluence' — `[txt](02_srs_x.md#anchor)` → `[txt](02_srs_x.html#anchor)`
//                  HTML import expects sibling .html filenames.
// External links (http, https, mailto) and anchors-only (#fr-001) pass
// through unchanged.
function rewriteLinks(body, mode) {
  return String(body).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (full, label, url) => {
    if (/^(https?:|mailto:|#|\/)/i.test(url)) return full;
    if (!/\.md(\b|$|#)/.test(url)) return full;
    if (mode === 'notion') {
      const target = url.startsWith('./') || url.startsWith('../') ? url : './' + url;
      return `[${label}](${target})`;
    }
    if (mode === 'confluence') {
      const target = url.replace(/\.md(\b|$|#)/, '.html$1');
      return `[${label}](${target})`;
    }
    return full;
  });
}

// Strip the managed-block markers that `init` writes into AGENTS.md so
// the imported page doesn't render the HTML comments as visible text in
// importers that don't strip comments. Everything between the markers
// (including the markers themselves) is removed.
function stripManagedBlock(body) {
  return String(body).replace(
    /<!-- ba-toolkit:begin managed -->[\s\S]*?<!-- ba-toolkit:end managed -->\s*/g,
    '',
  );
}

async function cmdPublish(args) {
  const formatRaw = (stringFlag(args, 'format') || 'both').toLowerCase();
  const validFormats = new Set(['notion', 'confluence', 'both']);
  if (!validFormats.has(formatRaw)) {
    logError(`Unknown --format value: ${formatRaw}`);
    log('  Valid formats: ' + cyan('notion') + ', ' + cyan('confluence') + ', ' + cyan('both'));
    process.exit(1);
  }
  const dryRun = args.flags['dry-run'] === true;
  const cwd = process.cwd();
  const outDir = stringFlag(args, 'out')
    ? path.resolve(cwd, stringFlag(args, 'out'))
    : path.join(cwd, 'publish');

  const allFiles = fs.readdirSync(cwd);
  const artifacts = allFiles.filter((f) => ARTIFACT_FILE_RE.test(f)).sort(compareArtifactFilenames);
  const hasAgents = allFiles.includes('AGENTS.md');

  if (artifacts.length === 0) {
    logError(`No BA Toolkit artifacts found in ${cwd}.`);
    log('  Run this command from inside ' + cyan('output/<slug>/') + ' after generating artifacts.');
    process.exit(1);
  }

  log('');
  log('  ' + cyan('BA Toolkit — Publish'));
  log('  ' + cyan('===================='));
  log('');
  log(`  source:       ${cwd}`);
  log(`  destination:  ${outDir}`);
  log(`  format:       ${formatRaw}`);
  log(`  artifacts:    ${artifacts.length}${hasAgents ? ' (+ AGENTS.md)' : ''}`);
  if (dryRun) log('  ' + yellow('mode:         dry-run (no files will be written)'));
  log('');

  const writeFile = (relPath, body) => {
    const abs = path.join(outDir, relPath);
    if (dryRun) {
      log('    ' + gray('would write ') + path.relative(cwd, abs));
      return;
    }
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, body);
  };

  // Build the ordered file list once. AGENTS.md goes first if present
  // so the imported workspace has project context up top.
  const ordered = [];
  if (hasAgents) ordered.push('AGENTS.md');
  ordered.push(...artifacts);

  let notionCount = 0;
  let confluenceCount = 0;

  if (formatRaw === 'notion' || formatRaw === 'both') {
    for (const filename of ordered) {
      let body = fs.readFileSync(path.join(cwd, filename), 'utf8');
      if (filename === 'AGENTS.md') body = stripManagedBlock(body);
      body = rewriteLinks(body, 'notion');
      writeFile(path.join('notion', filename), body);
      notionCount++;
    }
  }

  if (formatRaw === 'confluence' || formatRaw === 'both') {
    const indexEntries = [];
    for (const filename of ordered) {
      let body = fs.readFileSync(path.join(cwd, filename), 'utf8');
      if (filename === 'AGENTS.md') body = stripManagedBlock(body);
      body = rewriteLinks(body, 'confluence');
      const html = markdownToHtml(body);
      const htmlName = filename.replace(/\.md$/, '.html');
      // Per-page wrapper. No <head> styles — let Confluence's own page
      // styling take over after import. Title comes from the filename
      // so the importer has something to use.
      const title = filename.replace(/\.md$/, '');
      const page = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${htmlEscape(title)}</title></head>
<body>
${html}
</body>
</html>`;
      writeFile(path.join('confluence', htmlName), page);
      indexEntries.push({ htmlName, title });
      confluenceCount++;
    }
    // index.html — entry point for Confluence's HTML importer. Lists
    // every page in pipeline order with a basic style block so the
    // import preview is readable.
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>BA Toolkit — project artifacts</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 720px; margin: 2em auto; padding: 0 1em; color: #222; }
  h1 { border-bottom: 1px solid #ddd; padding-bottom: 0.3em; }
  ul { line-height: 1.8; }
  a { color: #0052cc; text-decoration: none; }
  a:hover { text-decoration: underline; }
  code { background: #f4f5f7; padding: 0.1em 0.3em; border-radius: 3px; font-family: monospace; }
</style>
</head>
<body>
<h1>BA Toolkit — project artifacts</h1>
<p>Generated by <code>ba-toolkit publish</code>. Each link below becomes a page in the imported Confluence space.</p>
<ul>
${indexEntries.map((e) => `  <li><a href="${htmlEscape(e.htmlName)}">${htmlEscape(e.title)}</a></li>`).join('\n')}
</ul>
</body>
</html>`;
    writeFile(path.join('confluence', 'index.html'), indexHtml);
    confluenceCount++;
  }

  log('');
  if (formatRaw === 'notion' || formatRaw === 'both') {
    log(`  ${green('✓')} Notion bundle:      ${path.relative(cwd, path.join(outDir, 'notion'))}/  (${notionCount} files)`);
  }
  if (formatRaw === 'confluence' || formatRaw === 'both') {
    log(`  ${green('✓')} Confluence bundle:  ${path.relative(cwd, path.join(outDir, 'confluence'))}/  (${confluenceCount} files, including index.html)`);
  }
  log('');
  log('  ' + bold('Next steps:'));
  if (formatRaw === 'notion' || formatRaw === 'both') {
    log('    Notion:     drag-and-drop ' + cyan(path.relative(cwd, path.join(outDir, 'notion')) + '/') + ' into "Import → Markdown & CSV" in your workspace.');
  }
  if (formatRaw === 'confluence' || formatRaw === 'both') {
    log('    Confluence: zip ' + cyan(path.relative(cwd, path.join(outDir, 'confluence')) + '/') + ' and upload via "Space settings → Content tools → Import → HTML".');
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
  publish [--format <fmt>]       Bundle the artifacts in the current
                                 output/<slug>/ folder into import-ready
                                 files for Notion (markdown) and Confluence
                                 (HTML). Format: notion, confluence, or
                                 both (default). No API calls, no tokens —
                                 the user runs the actual import manually.

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
  --dry-run                      init/install/uninstall/upgrade/publish —
                                 preview without writing or removing files
  --format <fmt>                 publish only — notion, confluence, or both
                                 (default: both)
  --out <path>                   publish only — output directory for the
                                 bundles (default: ./publish/)

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

  # Bundle a project's artifacts for Notion + Confluence import.
  cd output/my-app
  ba-toolkit publish
  ba-toolkit publish --format notion --out ./share
  ba-toolkit publish --format confluence --dry-run

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
    case 'publish':
      await cmdPublish(args);
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
