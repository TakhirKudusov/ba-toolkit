'use strict';

// Integration tests for the ba-toolkit CLI subcommands.
// Run with: node --test test/
//
// These tests spawn the real CLI as a child process against temporary
// directories — they verify the contract the user actually sees:
// exit codes, stdout/stderr content, and filesystem state after each
// command. Unit tests for the pure helper functions live in cli.test.js.
//
// Zero new dependencies — same node:test + node:assert/strict stack as
// the unit tests, in line with the package's zero-runtime-deps policy.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const CLI_PATH = path.resolve(__dirname, '..', 'bin', 'ba-toolkit.js');
const PKG_VERSION = require('../package.json').version;

// Spawn the CLI as a child process with a clean environment. Returns
// { status, stdout, stderr }. Defaults to cwd = os.tmpdir() so tests
// that forget to set cwd don't accidentally touch the repo root.
function runCli(args, { cwd, input, env } = {}) {
  const result = spawnSync(process.execPath, [CLI_PATH, ...args], {
    cwd: cwd || os.tmpdir(),
    input: input || '',
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1', ...env },
  });
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

// Create a fresh temp directory for a test, pass it to the body, clean
// up afterwards — even if the body throws.
function withTempDir(body) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ba-int-'));
  try {
    return body(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// --------------------------------------------------------------------
// Group 1 — global flags and help
// --------------------------------------------------------------------

test('--version prints package version and exits 0', () => {
  const r = runCli(['--version']);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), PKG_VERSION);
});

test('-v prints package version and exits 0', () => {
  const r = runCli(['-v']);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), PKG_VERSION);
});

test('--help prints usage and exits 0', () => {
  const r = runCli(['--help']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /USAGE/);
  assert.match(r.stdout, /ba-toolkit <command>/);
});

test('-h prints usage and exits 0', () => {
  const r = runCli(['-h']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /USAGE/);
});

test('no arguments prints usage and exits 0', () => {
  const r = runCli([]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /USAGE/);
  assert.match(r.stdout, /COMMANDS/);
});

test('help subcommand prints usage and exits 0', () => {
  const r = runCli(['help']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /USAGE/);
});

test('unknown subcommand exits non-zero with error message', () => {
  const r = runCli(['foobar']);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /Unknown command: foobar/);
});

// --------------------------------------------------------------------
// Group 2 — typo detection for flags
// --------------------------------------------------------------------

test('typo: --drry-run suggests --dry-run', () => {
  const r = runCli(['init', '--drry-run']);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /Unknown option: --drry-run/);
  assert.match(r.stdout, /Did you mean .*--dry-run/);
});

test('typo: --domian suggests --domain', () => {
  const r = runCli(['init', '--domian', 'saas']);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /Unknown option: --domian/);
  assert.match(r.stdout, /Did you mean .*--domain/);
});

test('typo: --gloabl suggests --global', () => {
  const r = runCli(['install', '--for', 'claude-code', '--gloabl']);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /Unknown option: --gloabl/);
  assert.match(r.stdout, /Did you mean .*--global/);
});

test('unknown flag --xyzzy produces no suggestion but still fails', () => {
  const r = runCli(['init', '--xyzzy']);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /Unknown option: --xyzzy/);
  // "xyzzy" is far from every known flag — closestMatch returns null,
  // so no "Did you mean" line should appear.
  assert.doesNotMatch(r.stdout, /Did you mean/);
});

// --------------------------------------------------------------------
// Group 3 — init command (non-interactive paths)
// --------------------------------------------------------------------

test('init: full flags, dry-run, fresh tmp cwd succeeds', () => {
  withTempDir((cwd) => {
    const r = runCli(
      ['init', '--name', 'Nova Analytics', '--domain', 'saas', '--for', 'claude-code', '--dry-run'],
      { cwd },
    );
    assert.equal(r.status, 0, `stderr: ${r.stderr}\nstdout: ${r.stdout}`);
    const outputDir = path.join(cwd, 'output');
    assert.ok(fs.existsSync(outputDir));
    assert.ok(fs.existsSync(path.join(cwd, 'AGENTS.md')));
    assert.equal(fs.existsSync(path.join(cwd, '.claude', 'skills')), false);
    const agentsMd = fs.readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8');
    assert.match(agentsMd, /Nova Analytics/);
    assert.match(agentsMd, /nova-analytics/);
    assert.match(agentsMd, /saas/);
  });
});

test('init: --name with no ASCII characters fails loudly without a derived slug', () => {
  withTempDir((cwd) => {
    const r = runCli(
      ['init', '--name', 'Проект', '--domain', 'saas', '--for', 'claude-code', '--dry-run'],
      { cwd },
    );
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Cannot derive a slug/);
  });
});

test('init: unknown --domain fails with list of valid ids', () => {
  withTempDir((cwd) => {
    const r = runCli(
      ['init', '--name', 'Foo', '--domain', 'banana', '--for', 'claude-code', '--dry-run'],
      { cwd },
    );
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Unknown domain: banana/);
    assert.match(r.stdout, /saas/);
    assert.match(r.stdout, /fintech/);
  });
});

test('init: unknown --for agent fails with supported list', () => {
  withTempDir((cwd) => {
    const r = runCli(
      ['init', '--name', 'Foo', '--domain', 'saas', '--for', 'vim', '--dry-run'],
      { cwd },
    );
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Unknown agent: vim/);
    assert.match(r.stdout, /claude-code/);
  });
});

test('init: ASCII banner is suppressed when stdout is not a TTY', () => {
  // The banner is decorative and must NOT appear in CI logs, piped
  // output, or captured test stdout. `spawnSync` gives us a
  // non-TTY stdout by default, which is exactly the condition
  // printBanner() checks for.
  withTempDir((cwd) => {
    const r = runCli(
      ['init', '--name', 'Foo', '--domain', 'saas', '--no-install'],
      { cwd },
    );
    assert.equal(r.status, 0, `stderr: ${r.stderr}\nstdout: ${r.stdout}`);
    // No `$$$$$$$` glyph runs from the banner anywhere in stdout.
    assert.doesNotMatch(r.stdout, /\$\$\$\$\$\$\$/);
  });
});

test('init: non-TTY menu fallback accepts a letter ID (b → second item)', () => {
  // Two pieces of input: letter for the domain menu (b → fintech),
  // letter for the agent menu (a → claude-code).
  withTempDir((cwd) => {
    const r = runCli(
      ['init', '--name', 'Letter Test'],
      { cwd, input: 'b\na\n' },
    );
    assert.equal(r.status, 0, `stderr: ${r.stderr}\nstdout: ${r.stdout}`);
    // Domain menu fallback should print letter IDs, not 1-9 digits.
    assert.match(r.stdout, /^\s+a\) SaaS/m);
    assert.match(r.stdout, /^\s+b\) Fintech/m);
    const agents = fs.readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8');
    assert.match(agents, /\*\*Domain:\*\* fintech/);
  });
});

test('init: non-TTY menu fallback still accepts a digit (backward compat)', () => {
  withTempDir((cwd) => {
    const r = runCli(
      ['init', '--name', 'Digit Compat'],
      { cwd, input: '2\n1\n' },
    );
    assert.equal(r.status, 0, `stderr: ${r.stderr}\nstdout: ${r.stdout}`);
    const agents = fs.readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8');
    assert.match(agents, /\*\*Domain:\*\* fintech/);
  });
});

test('init: invalid interactive domain input re-prompts, then accepts valid answer', () => {
  // Scenario: `ba-toolkit init` was launched without --domain, so it
  // shows the numbered menu. User types "banana" (unknown), gets a
  // retry message, then types "saas". Should succeed.
  withTempDir((cwd) => {
    const r = runCli(
      ['init', '--name', 'Retry Test', '--no-install'],
      { cwd, input: 'banana\nsaas\n' },
    );
    assert.equal(r.status, 0, `stderr: ${r.stderr}\nstdout: ${r.stdout}`);
    // Retry message appeared.
    assert.match(r.stdout, /Invalid selection/);
    assert.match(r.stdout, /attempts? left/);
    const agentsPath = path.join(cwd, 'AGENTS.md');
    assert.ok(fs.existsSync(agentsPath));
    const agents = fs.readFileSync(agentsPath, 'utf8');
    assert.match(agents, /\*\*Domain:\*\* saas/);
  });
});

test('init: three invalid domain inputs in a row abort with non-zero', () => {
  withTempDir((cwd) => {
    const r = runCli(
      ['init', '--name', 'Retry Test', '--no-install'],
      { cwd, input: 'banana\nbanana\nbanana\n' },
    );
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Too many invalid attempts/);
  });
});

test('init twice with the same slug: second run updates managed block, preserves user edits outside it', () => {
  withTempDir((cwd) => {
    const r1 = runCli(
      ['init', '--name', 'First Name', '--slug', 'shared', '--domain', 'saas', '--no-install'],
      { cwd },
    );
    assert.equal(r1.status, 0, `first init stderr: ${r1.stderr}`);
    const agentsPath = path.join(cwd, 'AGENTS.md');
    assert.ok(fs.existsSync(agentsPath));

    // User edits a row in Pipeline Status AND adds a section below.
    const original = fs.readFileSync(agentsPath, 'utf8');
    const edited = original
      .replace(
        '| 1 | /brief | ⬜ Not started | — |',
        '| 1 | /brief | ✅ Done | 01_brief_shared.md |',
      )
      + '\n## My handwritten notes\n\nCall CEO on Monday.\n';
    fs.writeFileSync(agentsPath, edited);

    // Second init with different name and domain but same slug.
    const r2 = runCli(
      ['init', '--name', 'Second Name', '--slug', 'shared', '--domain', 'fintech', '--no-install'],
      { cwd },
    );
    assert.equal(r2.status, 0, `second init stderr: ${r2.stderr}`);

    // Managed block reflects the NEW values.
    const merged = fs.readFileSync(agentsPath, 'utf8');
    assert.match(merged, /\*\*Project:\*\* Second Name/);
    assert.match(merged, /\*\*Domain:\*\* fintech/);
    assert.doesNotMatch(merged, /\*\*Project:\*\* First Name/);
    // User edits OUTSIDE the managed block survived.
    assert.match(merged, /\/brief \| ✅ Done \| 01_brief_shared\.md/);
    assert.match(merged, /## My handwritten notes/);
    assert.match(merged, /Call CEO on Monday/);
    // stdout mentions the merge (not "created").
    assert.match(r2.stdout, /updated.*AGENTS\.md/);
  });
});

test('init preserves existing root AGENTS.md without managed-block anchors', () => {
  withTempDir((cwd) => {
    const rootAgentsPath = path.join(cwd, 'AGENTS.md');
    const userContent = '# My hand-written AGENTS.md\n\nCustom content, no managed block.\n';
    fs.writeFileSync(rootAgentsPath, userContent);

    const r = runCli(
      ['init', '--name', 'Gamma', '--slug', 'gamma', '--domain', 'saas', '--no-install'],
      { cwd },
    );
    assert.equal(r.status, 0, `stderr: ${r.stderr}`);

    assert.equal(fs.readFileSync(rootAgentsPath, 'utf8'), userContent);
    assert.match(r.stdout, /preserved/);
  });
});

test('init warns when output/ already has artifacts', () => {
  withTempDir((cwd) => {
    fs.mkdirSync(path.join(cwd, 'output'), { recursive: true });
    fs.writeFileSync(path.join(cwd, 'output', '01_brief_old.md'), '# Old brief\n');

    const r = runCli(
      ['init', '--name', 'New Project', '--domain', 'saas', '--no-install'],
      { cwd },
    );
    assert.equal(r.status, 0, `stderr: ${r.stderr}`);
    assert.match(r.stdout, /already has.*artifact/);
  });
});

test('init --no-install skips the skill install entirely', () => {
  withTempDir((cwd) => {
    const r = runCli(
      ['init', '--name', 'Foo', '--domain', 'saas', '--no-install'],
      { cwd },
    );
    assert.equal(r.status, 0, `stderr: ${r.stderr}\nstdout: ${r.stdout}`);
    assert.ok(fs.existsSync(path.join(cwd, 'output')));
    assert.ok(fs.existsSync(path.join(cwd, 'AGENTS.md')));
    assert.equal(fs.existsSync(path.join(cwd, '.claude', 'skills')), false);
  });
});

// --------------------------------------------------------------------
// Group 4 — install command (dry-run)
// --------------------------------------------------------------------

test('install without --for fails with clear error', () => {
  const r = runCli(['install']);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /--for <agent> is required/);
});

test('install --for claude-code --project --dry-run: no files written', () => {
  withTempDir((cwd) => {
    const r = runCli(
      ['install', '--for', 'claude-code', '--project', '--dry-run'],
      { cwd },
    );
    assert.equal(r.status, 0, `stderr: ${r.stderr}\nstdout: ${r.stdout}`);
    assert.match(r.stdout, /destination:/);
    assert.match(r.stdout, /dry-run/);
    // Nothing in the destination.
    assert.equal(fs.existsSync(path.join(cwd, '.claude', 'skills')), false);
  });
});

test('install --for cursor --project --dry-run targets .cursor/skills with native SKILL.md', () => {
  withTempDir((cwd) => {
    const r = runCli(
      ['install', '--for', 'cursor', '--project', '--dry-run'],
      { cwd },
    );
    assert.equal(r.status, 0, `stderr: ${r.stderr}\nstdout: ${r.stdout}`);
    // Destination line must mention the skills path, not rules.
    assert.match(r.stdout, /\.cursor[\\/]+skills/);
    // Format is now 'skill' (native SKILL.md), not .mdc conversion.
    assert.match(r.stdout, /SKILL\.md \(native\)/);
    // Nothing written in either location on dry-run.
    assert.equal(fs.existsSync(path.join(cwd, '.cursor', 'skills')), false);
    assert.equal(fs.existsSync(path.join(cwd, '.cursor', 'rules')), false);
  });
});

test('install --for gemini --project --dry-run succeeds', () => {
  withTempDir((cwd) => {
    const r = runCli(
      ['install', '--for', 'gemini', '--project', '--dry-run'],
      { cwd },
    );
    assert.equal(r.status, 0, `stderr: ${r.stderr}\nstdout: ${r.stdout}`);
    assert.equal(fs.existsSync(path.join(cwd, '.gemini', 'skills')), false);
  });
});

test('install --for windsurf --project --dry-run targets .windsurf/skills with native SKILL.md', () => {
  withTempDir((cwd) => {
    const r = runCli(
      ['install', '--for', 'windsurf', '--project', '--dry-run'],
      { cwd },
    );
    assert.equal(r.status, 0, `stderr: ${r.stderr}\nstdout: ${r.stdout}`);
    assert.match(r.stdout, /\.windsurf[\\/]+skills/);
    assert.match(r.stdout, /SKILL\.md \(native\)/);
    assert.equal(fs.existsSync(path.join(cwd, '.windsurf', 'skills')), false);
    assert.equal(fs.existsSync(path.join(cwd, '.windsurf', 'rules')), false);
  });
});

test('end-to-end: install → uninstall for windsurf uses folder-per-skill SKILL.md layout at .windsurf/skills/', () => {
  withTempDir((cwd) => {
    const rInstall = runCli(
      ['install', '--for', 'windsurf', '--project'],
      { cwd },
    );
    assert.equal(rInstall.status, 0, `install stderr: ${rInstall.stderr}`);

    const skillsRoot = path.join(cwd, '.windsurf', 'skills');
    const manifestPath = path.join(skillsRoot, '.ba-toolkit-manifest.json');
    assert.ok(fs.existsSync(manifestPath));

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.ok(Array.isArray(manifest.items));
    assert.ok(manifest.items.length >= 20);
    assert.ok(manifest.items.includes('references'));

    const skillItems = manifest.items.filter((i) => i !== 'references');
    for (const item of skillItems) {
      assert.ok(fs.existsSync(path.join(skillsRoot, item, 'SKILL.md')));
    }
    // Legacy `.windsurf/rules/` path must NOT be touched.
    assert.equal(fs.existsSync(path.join(cwd, '.windsurf', 'rules')), false);

    const rUninstall = runCli(
      ['uninstall', '--for', 'windsurf', '--project'],
      { cwd, input: 'y\n' },
    );
    assert.equal(rUninstall.status, 0, `uninstall stderr: ${rUninstall.stderr}`);
    assert.equal(fs.existsSync(manifestPath), false);
  });
});

test('install --for codex --project fails — codex is global-only', () => {
  withTempDir((cwd) => {
    const r = runCli(
      ['install', '--for', 'codex', '--project', '--dry-run'],
      { cwd },
    );
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /does not support project-level install/);
  });
});

test('install --for cursor --global fails — cursor is project-only', () => {
  withTempDir((cwd) => {
    const r = runCli(
      ['install', '--for', 'cursor', '--global', '--dry-run'],
      { cwd },
    );
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /does not support --global install/);
  });
});

test('install --for bogus-agent fails with supported list', () => {
  const r = runCli(['install', '--for', 'bogus-agent', '--dry-run']);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /Unknown agent: bogus-agent/);
});

// --------------------------------------------------------------------
// Group 5 — real install + manifest + status + uninstall (end-to-end)
// --------------------------------------------------------------------

test('end-to-end: install → manifest → status → uninstall for claude-code', () => {
  withTempDir((cwd) => {
    // 1. Install.
    const rInstall = runCli(
      ['install', '--for', 'claude-code', '--project'],
      { cwd },
    );
    assert.equal(rInstall.status, 0, `install stderr: ${rInstall.stderr}`);

    const skillsRoot = path.join(cwd, '.claude', 'skills');
    const manifestPath = path.join(skillsRoot, '.ba-toolkit-manifest.json');
    assert.ok(fs.existsSync(manifestPath), 'manifest should exist after install');

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.version, PKG_VERSION);
    assert.ok(Array.isArray(manifest.items));
    assert.ok(manifest.items.length >= 20, `expected >=20 items, got ${manifest.items.length}`);
    assert.ok(manifest.items.includes('references'));

    // At least one real skill folder with its SKILL.md should exist.
    const firstSkill = manifest.items.find((i) => i !== 'references');
    assert.ok(firstSkill, 'manifest should include at least one skill item');
    assert.ok(fs.existsSync(path.join(skillsRoot, firstSkill, 'SKILL.md')));

    // 2. Status picks it up.
    const rStatus = runCli(['status'], { cwd });
    assert.equal(rStatus.status, 0);
    assert.match(rStatus.stdout, /claude-code/);
    assert.match(rStatus.stdout, new RegExp(PKG_VERSION.replace(/\./g, '\\.')));

    // 3. Upgrade --dry-run on the just-installed tree — same version,
    //    should report "Already up to date" and not delete anything.
    const rUpgrade = runCli(
      ['upgrade', '--for', 'claude-code', '--project', '--dry-run'],
      { cwd },
    );
    assert.equal(rUpgrade.status, 0, `upgrade stderr: ${rUpgrade.stderr}`);
    assert.match(rUpgrade.stdout, /up to date/i);
    // Manifest is untouched after the no-op upgrade.
    assert.ok(fs.existsSync(manifestPath));

    // 4. Uninstall (interactive — feed 'y\n' to confirm).
    const rUninstall = runCli(
      ['uninstall', '--for', 'claude-code', '--project'],
      { cwd, input: 'y\n' },
    );
    assert.equal(rUninstall.status, 0, `uninstall stderr: ${rUninstall.stderr}`);
    // Manifest and skill folders are gone.
    assert.equal(fs.existsSync(manifestPath), false);
    assert.equal(fs.existsSync(path.join(skillsRoot, firstSkill)), false);
  });
});

test('end-to-end: install → uninstall for cursor uses folder-per-skill SKILL.md layout at .cursor/skills/', () => {
  withTempDir((cwd) => {
    const rInstall = runCli(
      ['install', '--for', 'cursor', '--project'],
      { cwd },
    );
    assert.equal(rInstall.status, 0, `install stderr: ${rInstall.stderr}`);

    // New layout: `.cursor/skills/<skill-name>/SKILL.md`, not `.cursor/rules/<skill>.mdc`.
    const skillsRoot = path.join(cwd, '.cursor', 'skills');
    const manifestPath = path.join(skillsRoot, '.ba-toolkit-manifest.json');
    assert.ok(fs.existsSync(manifestPath), 'manifest should exist at .cursor/skills/');

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.ok(Array.isArray(manifest.items));
    assert.ok(manifest.items.length >= 20, `expected >=20 items, got ${manifest.items.length}`);
    assert.ok(manifest.items.includes('references'));

    // Every non-references item must be a folder containing SKILL.md,
    // matching Cursor's Agent Skills discovery contract.
    const skillItems = manifest.items.filter((i) => i !== 'references');
    assert.ok(skillItems.length > 0);
    for (const item of skillItems) {
      const skillMd = path.join(skillsRoot, item, 'SKILL.md');
      assert.ok(fs.existsSync(skillMd), `expected ${skillMd} to exist`);
      // No .mdc files should be produced for cursor anymore.
      assert.equal(fs.existsSync(path.join(skillsRoot, item + '.mdc')), false);
    }

    // And the legacy path must NOT be touched.
    assert.equal(fs.existsSync(path.join(cwd, '.cursor', 'rules')), false);

    // Uninstall.
    const rUninstall = runCli(
      ['uninstall', '--for', 'cursor', '--project'],
      { cwd, input: 'y\n' },
    );
    assert.equal(rUninstall.status, 0, `uninstall stderr: ${rUninstall.stderr}`);
    assert.equal(fs.existsSync(manifestPath), false);
    for (const item of skillItems) {
      assert.equal(fs.existsSync(path.join(skillsRoot, item)), false);
    }
  });
});

// --------------------------------------------------------------------
// Group 6 — uninstall must not touch user's own skills in the shared
// destination (manifest-driven removal guarantee)
// --------------------------------------------------------------------

test('uninstall leaves user-owned skills in the same destination untouched', () => {
  withTempDir((cwd) => {
    // Seed a user-owned skill BEFORE install. It lives in the same
    // .claude/skills/ root and must survive install+uninstall.
    const userSkillDir = path.join(cwd, '.claude', 'skills', 'my-own-skill');
    fs.mkdirSync(userSkillDir, { recursive: true });
    const userSkillFile = path.join(userSkillDir, 'SKILL.md');
    fs.writeFileSync(
      userSkillFile,
      '---\nname: my-own-skill\ndescription: user-owned skill that BA toolkit must not touch\n---\n\nBody.\n',
    );

    // Install.
    const rInstall = runCli(
      ['install', '--for', 'claude-code', '--project'],
      { cwd },
    );
    assert.equal(rInstall.status, 0, `install stderr: ${rInstall.stderr}`);
    // User skill still exists after install.
    assert.ok(fs.existsSync(userSkillFile));

    // Uninstall.
    const rUninstall = runCli(
      ['uninstall', '--for', 'claude-code', '--project'],
      { cwd, input: 'y\n' },
    );
    assert.equal(rUninstall.status, 0, `uninstall stderr: ${rUninstall.stderr}`);

    // The critical assertion: user-owned skill is STILL there.
    assert.ok(
      fs.existsSync(userSkillFile),
      'user-owned skill must survive BA Toolkit uninstall — manifest-driven removal was violated',
    );
  });
});

test('uninstall without manifest is a no-op (refuses to touch destination)', () => {
  withTempDir((cwd) => {
    // Create an unrelated file in the skills root — no manifest.
    const skillsRoot = path.join(cwd, '.claude', 'skills');
    fs.mkdirSync(skillsRoot, { recursive: true });
    const foreignFile = path.join(skillsRoot, 'not-ours.md');
    fs.writeFileSync(foreignFile, '# not ours\n');

    const r = runCli(
      ['uninstall', '--for', 'claude-code', '--project'],
      { cwd, input: 'y\n' },
    );
    assert.equal(r.status, 0, `stderr: ${r.stderr}`);
    assert.match(r.stdout, /No BA Toolkit manifest found/);
    // Foreign file must remain.
    assert.ok(fs.existsSync(foreignFile));
  });
});

// --------------------------------------------------------------------
// Group 7 — status with no installs
// --------------------------------------------------------------------

test('status in an empty directory reports no installations', () => {
  withTempDir((cwd) => {
    const r = runCli(['status'], { cwd });
    assert.equal(r.status, 0);
    assert.match(r.stdout, /No BA Toolkit installations found/);
  });
});

// --------------------------------------------------------------------
// Group 8 — publish (Notion / Confluence bundle export)
// --------------------------------------------------------------------

// Helper for the publish tests: write three minimal artifacts with
// known content and a cross-reference between them. Mirrors what a
// real project's output/ folder looks like after running the
// pipeline through /stories.
function writePublishFixture(dir) {
  fs.writeFileSync(
    path.join(dir, '01_brief_test.md'),
    '# Project Brief: Test\n\n**Domain:** saas\n\n## 1. Goal\n\nBuild a thing. See [FR-001](02_srs_test.md#fr-001) for details.\n',
  );
  fs.writeFileSync(
    path.join(dir, '02_srs_test.md'),
    '# Requirements: Test\n\n## FR-001\n\nThe **system** shall do `X`.\n\n| ID | Priority |\n|----|----------|\n| FR-001 | Must |\n',
  );
  fs.writeFileSync(
    path.join(dir, '03_stories_test.md'),
    '# Stories: Test\n\n- US-001: as a user I can foo\n- US-002: as a user I can bar\n',
  );
}

test('publish in an empty directory exits non-zero with a clear error', () => {
  withTempDir((cwd) => {
    const r = runCli(['publish'], { cwd });
    assert.notEqual(r.status, 0);
    assert.match(r.stderr + r.stdout, /No BA Toolkit artifacts found/);
  });
});

test('publish --format both produces notion and confluence bundles', () => {
  withTempDir((cwd) => {
    writePublishFixture(cwd);
    const r = runCli(['publish', '--format', 'both'], { cwd });
    assert.equal(r.status, 0, `stderr: ${r.stderr}\nstdout: ${r.stdout}`);
    // Both bundles exist.
    assert.ok(fs.existsSync(path.join(cwd, 'publish', 'notion')));
    assert.ok(fs.existsSync(path.join(cwd, 'publish', 'confluence')));
    // Notion bundle: one .md per artifact, original filenames preserved.
    const notionFiles = fs.readdirSync(path.join(cwd, 'publish', 'notion')).sort();
    assert.deepEqual(notionFiles, ['01_brief_test.md', '02_srs_test.md', '03_stories_test.md']);
    // Notion link rewrite: cross-reference now starts with `./`.
    const briefNotion = fs.readFileSync(path.join(cwd, 'publish', 'notion', '01_brief_test.md'), 'utf8');
    assert.match(briefNotion, /\[FR-001\]\(\.\/02_srs_test\.md#fr-001\)/);
    // Confluence bundle: one .html per artifact + index.html.
    const confluenceFiles = fs.readdirSync(path.join(cwd, 'publish', 'confluence')).sort();
    assert.deepEqual(confluenceFiles, ['01_brief_test.html', '02_srs_test.html', '03_stories_test.html', 'index.html']);
    // Confluence link rewrite: cross-reference now points at .html sibling.
    const briefHtml = fs.readFileSync(path.join(cwd, 'publish', 'confluence', '01_brief_test.html'), 'utf8');
    assert.match(briefHtml, /<a href="02_srs_test\.html#fr-001">FR-001<\/a>/);
    // Confluence: SRS table renders as <table>.
    const srsHtml = fs.readFileSync(path.join(cwd, 'publish', 'confluence', '02_srs_test.html'), 'utf8');
    assert.match(srsHtml, /<table><thead>/);
    assert.match(srsHtml, /<strong>system<\/strong>/);
    assert.match(srsHtml, /<code>X<\/code>/);
    // Confluence: index.html lists every artifact in pipeline order.
    const index = fs.readFileSync(path.join(cwd, 'publish', 'confluence', 'index.html'), 'utf8');
    const briefIdx = index.indexOf('01_brief_test.html');
    const srsIdx = index.indexOf('02_srs_test.html');
    const storiesIdx = index.indexOf('03_stories_test.html');
    assert.ok(briefIdx > 0 && srsIdx > briefIdx && storiesIdx > srsIdx, 'index.html must list pages in pipeline order');
    // Stdout summary mentions both bundles.
    assert.match(r.stdout, /Notion bundle/);
    assert.match(r.stdout, /Confluence bundle/);
    assert.match(r.stdout, /Next steps/);
  });
});

test('publish --format notion only writes the notion bundle', () => {
  withTempDir((cwd) => {
    writePublishFixture(cwd);
    const r = runCli(['publish', '--format', 'notion'], { cwd });
    assert.equal(r.status, 0);
    assert.ok(fs.existsSync(path.join(cwd, 'publish', 'notion')));
    assert.ok(!fs.existsSync(path.join(cwd, 'publish', 'confluence')));
  });
});

test('publish --format confluence only writes the confluence bundle', () => {
  withTempDir((cwd) => {
    writePublishFixture(cwd);
    const r = runCli(['publish', '--format', 'confluence'], { cwd });
    assert.equal(r.status, 0);
    assert.ok(!fs.existsSync(path.join(cwd, 'publish', 'notion')));
    assert.ok(fs.existsSync(path.join(cwd, 'publish', 'confluence')));
  });
});

test('publish --dry-run writes nothing but reports the planned files', () => {
  withTempDir((cwd) => {
    writePublishFixture(cwd);
    const r = runCli(['publish', '--format', 'both', '--dry-run'], { cwd });
    assert.equal(r.status, 0);
    assert.ok(!fs.existsSync(path.join(cwd, 'publish')));
    assert.match(r.stdout, /dry-run/);
    assert.match(r.stdout, /would write/);
  });
});

test('publish --format invalid exits non-zero', () => {
  withTempDir((cwd) => {
    writePublishFixture(cwd);
    const r = runCli(['publish', '--format', 'pdf'], { cwd });
    assert.notEqual(r.status, 0);
    assert.match(r.stderr + r.stdout, /Unknown --format/);
  });
});

test('publish includes AGENTS.md as the first page when present', () => {
  withTempDir((cwd) => {
    writePublishFixture(cwd);
    fs.writeFileSync(
      path.join(cwd, 'AGENTS.md'),
      '# Test project\n\n<!-- ba-toolkit:begin managed -->\n## Active Project\n**Project:** Test\n<!-- ba-toolkit:end managed -->\n\n## Pipeline Status\n\n- /brief done\n',
    );
    const r = runCli(['publish', '--format', 'both'], { cwd });
    assert.equal(r.status, 0);
    // Notion bundle includes AGENTS.md.
    const notionFiles = fs.readdirSync(path.join(cwd, 'publish', 'notion')).sort();
    assert.ok(notionFiles.includes('AGENTS.md'));
    // Managed block is stripped from the published copy.
    const agentsBody = fs.readFileSync(path.join(cwd, 'publish', 'notion', 'AGENTS.md'), 'utf8');
    assert.ok(!agentsBody.includes('ba-toolkit:begin managed'));
    assert.ok(!agentsBody.includes('Active Project'));
    assert.ok(agentsBody.includes('Pipeline Status'));
    // Confluence bundle has AGENTS.html before the artifact pages in index.html.
    const index = fs.readFileSync(path.join(cwd, 'publish', 'confluence', 'index.html'), 'utf8');
    const agentsIdx = index.indexOf('AGENTS.html');
    const briefIdx = index.indexOf('01_brief_test.html');
    assert.ok(agentsIdx > 0 && agentsIdx < briefIdx, 'AGENTS.html must appear before the first pipeline artifact in the index');
  });
});
