# Changelog

All notable changes to BA Toolkit are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **Interview skills now accept inline context after the slash command** (interview-protocol rule 9). `/brief I want to build an online store for construction materials targeting B2B buyers in LATAM` is parsed as the lead-in answer; the skill acknowledges it once, skips the open-ended lead-in question, and jumps straight to the first structured-table question that the inline text didn't already cover. Works for every interview-phase skill, not just `/brief` — `/srs focus on the payments module first`, `/stories plan the onboarding epic`, `/nfr emphasise security and compliance`, etc. Each scope hint narrows what the skill asks about. All 12 interview SKILL.md files updated with a one-line pointer to rule 9 in their Interview section; the regression test that walks every shipped SKILL.md still passes (it just checks the protocol link, which all 12 already had).
- **Open-ended lead-in question for entry-point skills** (interview-protocol rule 8). When `/brief` (or `/principles` for principles-first projects) is invoked with no inline context and no prior brief artifact exists, the very first interview question is now an open-ended free-text prompt: `Tell me about the project in your own words: one or two sentences are enough. What are you building, who is it for, and what problem does it solve?`. The agent extracts whatever it can from the user's reply (product type, target audience, business goal, domain hints) and uses it to pre-fill subsequent structured questions. Subsequent questions follow the regular options-table protocol from rule 2. Non-entry-point skills (`/srs`, `/stories`, …) skip the lead-in entirely because prior artifacts already supply the project context.
- **Two new walkthrough examples in `docs/USAGE.md` §1** — one showing the plain `/brief` flow with the open-ended lead-in, one showing the `/brief <text>` inline-context flow. Both examples use the new option-table format with letter IDs.

### Changed

- **Interview options are now presented as a 2-column markdown table with letter IDs** instead of a numbered list. Every interview-phase skill (12 SKILL.md files) inherits this automatically through the protocol — the change lives in `skills/references/interview-protocol.md` rule 2, no SKILL.md was touched. Each question now carries `| ID | Variant |` columns where ID is `a`, `b`, `c`, … (lowercase letters); the last row is always the free-text "Other" option. Tables render cleanly in Claude Code, Codex CLI, Gemini CLI, Cursor, and Windsurf, scan faster than a numbered list, and let users reply with the letter ID, the verbatim variant text, or — for the free-text row — any text of their own.
- **CLI domain/agent menus now use letter IDs** to match the interview-protocol convention. Arrow-key navigation, vim-bindings (`j/k`), Enter, and Esc/Ctrl+C are unchanged; the jump key is now `a-z` instead of `1-9`. The non-TTY numbered fallback (CI, piped input) accepts a letter ID as the primary input, with digit and verbatim id-string kept as backward-compat fallbacks so existing scripts and muscle memory still work. New regression test asserts both letter and digit input paths through the fallback. `menuStep`, `renderMenu`, and `runMenuTty` were updated; the keypress handler accepts `[a-z]` as primary and `[0-9]` as fallback.

---

## [3.0.0] — 2026-04-09

### ⚠️ BREAKING — Cursor and Windsurf install paths moved to native Agent Skills

Cursor and Windsurf both have **two separate features**: Rules (`.cursor/rules/*.mdc`, `.windsurf/rules/*.mdc`) and Agent Skills (`.cursor/skills/<skill>/SKILL.md`, `.windsurf/skills/<skill>/SKILL.md`). BA Toolkit is a pipeline of skills, not rules, but every previous version installed it as `.mdc` rules under `.cursor/rules/` and `.windsurf/rules/`. Both editors loaded those files as **rules**, never as skills, so `/brief`, `/srs`, … slash commands were never registered with the agent. Users reported that the skills did not show up. v3.0 fixes this by switching to the native Agent Skills paths and the native folder-per-skill `SKILL.md` layout (the same one Claude Code, Codex CLI, and Gemini CLI use). Confirmed against the official Cursor and Windsurf documentation via ctx7 MCP:

| Agent | v2.0 path (broken) | v3.0 path (correct) | Format |
|---|---|---|---|
| Cursor | `.cursor/rules/<skill>.mdc` (flat) | `.cursor/skills/<skill>/SKILL.md` (folder-per-skill) | Native |
| Windsurf | `.windsurf/rules/<skill>.mdc` (flat) | `.windsurf/skills/<skill>/SKILL.md` (folder-per-skill) | Native |

**Migration for v2.0 Cursor/Windsurf users:**

```bash
# 1. Upgrade the package
npm install -g @kudusov.takhir/ba-toolkit@latest

# 2. Reinstall — the old install was at the wrong path; upgrade can't find
#    its manifest there, so just run install fresh against the correct path.
ba-toolkit install --for cursor      # writes to .cursor/skills/
ba-toolkit install --for windsurf    # writes to .windsurf/skills/

# 3. Manually clean up the orphaned old install (it never actually worked
#    as skills anyway — Cursor/Windsurf were loading it as rules):
rm -rf .cursor/rules/*.mdc           # if those .mdc files came from BA Toolkit
rm -rf .windsurf/rules/*.mdc
```

After this you'll see the BA Toolkit skills register as actual Agent Skills in Cursor and Windsurf for the first time — `/brief`, `/srs`, `/ac`, `/nfr`, … become real slash commands. Reload the editor window after install. Claude Code, Codex CLI, and Gemini CLI users are unaffected — their paths and behavior are unchanged.

### Added

- **Integration test suite for every CLI subcommand** (`test/cli.integration.test.js`, 33 tests). Spawns the real CLI as a child process against temporary directories and asserts exit codes, stdout/stderr content, and filesystem state. Covers `--version`/`--help`/no-args, typo detection for unknown flags, `init` with flag combinations and validation failures, `install`/`upgrade`/`uninstall` dry-runs for every supported agent, end-to-end install → manifest → status → upgrade → uninstall round-trips for both Claude Code and Cursor (native skill format), and a regression guard proving that `uninstall` leaves the user's own unrelated skills in the shared destination untouched (manifest-driven removal guarantee).
- **Test gate in `.github/workflows/release.yml`**. A new `Run tests` step runs `npm test` between the smoke test and the npm publish step — if any unit or integration test fails, the `publish-npm` job exits before the classic-auth strip + publish steps, and no broken release reaches npm. The GitHub Release created by the preceding job still happens; npm and GitHub are intentionally independent.
- **Test job in `.github/workflows/validate.yml`**. A new `run-tests` job mirrors the release gate at PR time, so regressions are caught on the PR instead of at tag push. Triggered for changes under `bin/**`, `test/**`, `skills/**`, `output/**`, or `package.json`.
- **ASCII banner at the top of `ba-toolkit init`**. Decorative `ba-toolkit` wordmark printed before the "New Project Setup" heading. Suppressed on non-TTY stdout (CI logs, piped output, captured test stdout) via an `isTTY` guard in `printBanner()`, so the banner never pollutes automation. Covered by a regression test that asserts the banner glyphs don't appear in non-TTY runs.
- **Arrow-key menu navigation in `ba-toolkit init`** for the domain and agent selection prompts. Real terminals now get an interactive menu — `↑/↓` (also `j/k`) to move, `1-9` to jump by index, `Enter` to confirm, `Esc` or `Ctrl+C` to cancel cleanly with exit code 130. The previous numbered prompt is the automatic fallback when stdin/stdout is not a TTY (CI, piped input, `TERM=dumb`, IDE shells), so all CI/integration tests and the `printf | ba-toolkit init` use case keep working unchanged. Cross-platform via Node's `readline.emitKeypressEvents` + `setRawMode` — works the same on bash, zsh, fish, Windows Terminal (PowerShell, cmd, WSL), Git Bash, and VSCode integrated terminal. Three-layer design for testability: `menuStep(state, key)` — pure state machine, 11 unit tests; `renderMenu(state, opts)` — pure renderer, 7 unit tests; `runMenuTty` — the I/O glue, manually smoke-tested.
- **Interview Protocol for every interview-phase skill** (`skills/references/interview-protocol.md`). Codifies the rule that AI skills must ask ONE question at a time, offer 3–5 domain-appropriate options per question sourced from `references/domains/{domain}.md`, always include a free-text "Other" option as the last choice, and wait for an answer before asking the next question. Replaces the previous "dump a numbered questionnaire of 5+ questions at once" style that made users abandon long interviews. Every shipped SKILL.md with an `Interview` heading — 12 files: `brief`, `srs`, `stories`, `usecases`, `ac`, `nfr`, `datadict`, `apicontract`, `wireframes`, `scenarios`, `research`, `principles` — now opens its Interview section with a blockquote pointing to this protocol. A Node-level regression test in `test/cli.test.js` walks every shipped SKILL.md and fails if any interview skill ever ships without the protocol link; a mirror validation step in `.github/workflows/validate.yml` catches the same at PR time.

### Changed

- **`ba-toolkit init` now merges `AGENTS.md` instead of overwriting it.** The `agents-template.md` wraps the Active Project block (name/slug/domain/date) in `<!-- ba-toolkit:begin managed -->` / `<!-- ba-toolkit:end managed -->` anchors. On re-init, only the managed block is refreshed — Pipeline Status edits, Key Constraints, Open Questions, user notes, and anything else outside the anchors is preserved byte-for-byte. If an existing `AGENTS.md` has no anchors (legacy file or fully user-authored), it's left untouched and a `preserved` note is printed instead of overwriting. The old interactive "AGENTS.md already exists. Overwrite? (y/N)" prompt is removed — the merge is always safe. New pure helper `mergeAgentsMd(existing, ctx)` exported from `bin/ba-toolkit.js` with unit tests covering all three branches (`created`, `merged`, `preserved`) plus malformed-anchor edge cases; integration tests verify the double-init scenario and the unmanaged-file preservation.
- `npm test` now runs both the pre-existing unit suite (`test/cli.test.js`) and the new integration suite — 154 tests total, ~2 seconds, still zero dependencies (only Node built-ins: `node:test`, `node:assert`, `node:child_process`).
- `.gitignore` now excludes `.claude/settings.local.json` and `.claude/skills/` — local Claude Code state, never part of the package. `settings.local.json` was previously tracked and required a stash dance around `npm version`; that workaround is no longer needed.

### Fixed

- **Cursor install now targets `.cursor/skills/` with native SKILL.md format, not `.cursor/rules/` with `.mdc` conversion.** See the BREAKING section above for the full story and migration steps.
- **Windsurf install now targets `.windsurf/skills/` with native SKILL.md format, not `.windsurf/rules/` with `.mdc` conversion.** Mirror of the Cursor fix. Confirmed against the [Windsurf Agent Skills documentation](https://docs.windsurf.com/windsurf/cascade/skills) via ctx7 MCP: Windsurf loads skills from `.windsurf/skills/<skill-name>/SKILL.md` as folder-per-skill with the same YAML frontmatter (`name`, `description`) as Claude Code and Cursor.
- **`ba-toolkit init` no longer crashes on a single typo during interactive input.** The domain menu, agent menu, and manual slug entry now re-prompt on invalid input via a new `promptUntilValid(question, resolver, { maxAttempts, invalidMessage })` helper. After three consecutive invalid answers the command aborts with a clear "Too many invalid attempts — aborting." message so piped input can't infinite-loop. The flag-path (`--domain=banana`, `--for=vim`) still hard-fails immediately — that's the correct behavior for CI and scripting, and its tests are untouched.
- **`prompt()` race condition that silently dropped piped input lines.** The previous implementation used `rl.question()` on a shared `readline.Interface`; when stdin was piped with multiple answers at once (e.g. `printf "banana\nsaas\n" | ba-toolkit init`, or any test feeding a full input buffer via `spawnSync`), readline emitted `'line'` events before the next `question()` handler had been attached, and those answers were silently lost. The second prompt then saw EOF and aborted with `INPUT_CLOSED` despite the answer being in the buffer. The new `prompt()` owns the `'line'` event directly, buffers arriving lines into an internal `lineQueue`, and parks `waiters` when the queue is empty — no more lost input. Uncovered while wiring up the `promptUntilValid` retry path.

### Removed

- **`.mdc` rule format conversion path is gone** — every shipped agent now uses native Agent Skills, so the conversion was dead code. Deleted: `skillToMdcContent()` (and its 2 unit tests), the `mdc` branch of `copySkills()`, the `format` field on every entry in `AGENTS`, the `format` parameter passed to `copySkills` and `writeManifest`, the runtime "format: .mdc (converted from SKILL.md)" log line. The `format` field is also gone from new manifests, but `readManifest` still parses legacy manifests that have it (covered by a forward-compat unit test). Net removal: ~80 lines of code + 2 unit tests; CLI surface unchanged.

---

## [2.0.0] — 2026-04-09

### ⚠️ BREAKING — install layout dropped the `ba-toolkit/` wrapper

**Every previous version of this package was broken.** The CLI installed skills under a `ba-toolkit/` wrapper folder (e.g. `.claude/skills/ba-toolkit/brief/SKILL.md`), but Claude Code, Codex CLI, Gemini CLI, Cursor and Windsurf all expect skills as **direct children** of their skills/rules root (`.claude/skills/<skill-name>/SKILL.md`). The wrapper made every shipped skill invisible to the agent — `/brief`, `/srs`, etc. silently did nothing because the agent didn't know they existed. The README, examples and all documentation referenced `/brief`, but the install path made it impossible for that command to ever resolve. Confirmed against the [official Claude Code skills documentation](https://code.claude.com/docs/en/skills.md): *"Each skill is a directory with `SKILL.md` as the entrypoint"* under `.claude/skills/<skill-name>/`, with no nested-namespace support.

v2.0 fixes this for real:

- **All 5 agent install paths drop the `ba-toolkit/` wrapper.** New paths:
  - Claude Code: `.claude/skills/` (project) and `~/.claude/skills/` (global)
  - OpenAI Codex CLI: `~/.codex/skills/` (global only)
  - Gemini CLI: `.gemini/skills/` and `~/.gemini/skills/`
  - Cursor: `.cursor/rules/` (project only, flat .mdc files)
  - Windsurf: `.windsurf/rules/` (project only, flat .mdc files)
- **Cursor and Windsurf layouts are now flat.** Previously each skill was nested under `.cursor/rules/ba-toolkit/<skill>/<skill>.mdc` (3 levels). Now each becomes a single `.mdc` file at the rules root: `.cursor/rules/<skill>.mdc`. Cursor's rule loader expects flat `.mdc` files, never recurses.
- **SKILL.md `name:` field renamed.** The 21 SKILL.md files used `name: ba-brief`, `name: ba-srs`, etc. But Claude Code derives the slash command from the `name` field — so the actual command was `/ba-brief`, not `/brief` as the README promised. All 21 files now use bare names (`name: brief`, `name: srs`, ...), and the slash commands `/brief`, `/srs`, `/ac`, … finally match the documentation.
- **Manifest replaces sentinel.** `runInstall` now writes `.ba-toolkit-manifest.json` listing every item it owns at the destination root. `cmdUninstall` and `cmdUpgrade` read the manifest and remove **only** those items — the destination directory is now shared with the user's other skills, so we can never `rm -rf` the whole root. Without a manifest, uninstall and upgrade refuse to do anything destructive. Manifest format:
  ```json
  {
    "version": "2.0.0",
    "installedAt": "2026-04-09T...",
    "format": "skill",
    "items": ["brief", "srs", "ac", ..., "references"]
  }
  ```
- **Legacy v1.x detection.** `runInstall`, `cmdUpgrade`, `cmdUninstall`, and `cmdStatus` now detect the old `ba-toolkit/` wrapper folder if it's still on disk and print a yellow warning with the exact `rm -rf` command to clean it up. The legacy folder is never auto-deleted — it might contain user state.

### Migration from v1.x

If you have a v1.x install on disk, the legacy `ba-toolkit/` wrapper will be sitting in the same parent directory as the new layout — it doesn't conflict with v2.0 file-wise, but it never worked, so you should remove it:

```bash
# Manual cleanup (one-time, per agent that had a v1.x install):
rm -rf .claude/skills/ba-toolkit          # claude-code project-level
rm -rf ~/.claude/skills/ba-toolkit         # claude-code global
rm -rf ~/.codex/skills/ba-toolkit          # codex
rm -rf .gemini/skills/ba-toolkit           # gemini project-level
rm -rf ~/.gemini/skills/ba-toolkit         # gemini global
rm -rf .cursor/rules/ba-toolkit            # cursor
rm -rf .windsurf/rules/ba-toolkit          # windsurf

# Then reinstall with v2.0:
ba-toolkit install --for claude-code
```

`ba-toolkit status` lists any legacy wrappers it finds on the system as a warning row, so you can audit before cleaning up.

### Internal

- **`copySkills(srcRoot, destRoot, { format })` replaces the previous `copyDir` + `skillToMdc`** combo. The new copy logic understands the per-format layout (folder-per-skill for `skill` format, flat `.mdc` files for `mdc` format) and reads the SKILL.md frontmatter to derive the canonical skill name from the `name:` field. References go to `<destRoot>/references/` regardless of format — non-`.mdc` files there are ignored by Cursor's rule loader.
- **Manifest helpers** (`readManifest`, `writeManifest`, `removeManifestItems`) replace the previous `readSentinel` / `writeSentinel`. The sentinel was a 2-field marker; the manifest is also the source of truth for what to remove on uninstall.
- **`detectLegacyInstall(agent)`** helper, used by every command that touches the install layout.
- **Test count 91 → 95.** Sentinel tests replaced with manifest tests; new tests for `detectLegacyInstall` (positive and negative cases) and `skillToMdcContent` (frontmatter + body extraction). All 95 tests pass.

---

## [1.5.0] — 2026-04-08

### Added

- **Typo detection on unknown CLI flags**, with a Levenshtein-based "Did you mean ...?" hint. Previously the parser silently accepted any `--flag` and stored it in `args.flags`, where most code paths then ignored it — users would hit `ba-toolkit init --drry-run`, get no error, and watch the script start an interactive session wondering why their flag did nothing. Now `validateFlags` runs immediately after parsing and rejects anything not in `KNOWN_FLAGS`:
  ```
  $ ba-toolkit init --drry-run
  error: Unknown option: --drry-run
    Did you mean --dry-run?
  Run ba-toolkit --help for the full list of options.
  ```
  The Levenshtein threshold is calibrated (`max(1, floor(input.length / 3))`) so common typos like `--domian`, `--gloabl`, `--no-installl`, `--foo`/`--for` get matched, but unrelated inputs like `--foobar` (distance 3 from "global") get no suggestion at all — better to say nothing than suggest something wildly off.

### Changed

- **Help output is ~20 lines shorter.** Four nearly-duplicate options sections (`INIT OPTIONS`, `INSTALL OPTIONS`, `UNINSTALL OPTIONS`, `UPGRADE OPTIONS`) collapsed into a single `OPTIONS` section. Each flag is listed exactly once with a per-command scope annotation (`init only — ...`, `install/uninstall/upgrade — ...`). Three sections after v1.4.0 added `uninstall`/`upgrade` repeated the same four flags with only wording differences; the dedup removes the noise without losing any information.
- **Domain and agent menu column widths are now computed dynamically** from the longest entry instead of being hardcoded to magic constants (`padEnd(13)` and `padEnd(20)`). If a future commit adds a domain or agent with a longer display name, the em-dash column on the right stays aligned automatically. No visible change for the current set.

### Internal

- **`AGENTS.md` template extracted** to `skills/references/templates/agents-template.md`. Previously it lived as a 44-line embedded string in `bin/ba-toolkit.js`, which was the only artifact template not in `skills/references/templates/`. Now follows the same `[NAME]` / `[SLUG]` / `[DOMAIN]` / `[DATE]` placeholder convention as `brief-template.md`, `srs-template.md`, etc. `renderAgentsMd` shrinks from a 60-line string template to a 12-line file read + four `String.replace` calls. Adding a field to the auto-generated AGENTS.md is now a Markdown edit, not a JS edit.
- **`stringFlag(args, key)` helper extracted** to centralise the `flag && flag !== true` (and inverse `!flag || flag === true`) pattern that was repeated across `cmdInit` (4 sites), `cmdInstall`, `cmdUninstall`, `cmdUpgrade` (3 sites). Returns the string value or `null` for absent / boolean / empty-string flags. The seven call sites collapse to single-line `stringFlag(args, 'name')` reads.
- **`parseSkillFrontmatter(content)` mini-parser** replaces the three regexes that `skillToMdc` used to extract `name` and `description` from SKILL.md frontmatter. The previous folded-scalar regex (`description:\s*>\s*\r?\n([\s\S]*?)(?:\r?\n\w|$)`) used a fragile `\r?\n\w` lookahead that would have over-captured on multi-paragraph descriptions and silently misparsed the `|` literal block scalar form (no shipped SKILL.md uses it yet, but the trap was there). The new walker handles inline / folded / literal forms uniformly, recognises chomping indicators (`>+`/`>-`/`|+`/`|-`), and correctly collapses multi-paragraph blocks with blank lines. Backward-compat verified by running `ba-toolkit install --for cursor` and confirming all 21 generated `.mdc` files have the same descriptions as before.
- **Unit-test infrastructure (78 → 91 tests).** Pure helper functions (`sanitiseSlug`, `parseArgs`, `resolveDomain`, `resolveAgent`, `stringFlag`, `parseSkillFrontmatter`, `readSentinel`, `renderAgentsMd`, `levenshtein`, `closestMatch`) are now exported from `bin/ba-toolkit.js` (guarded by `require.main === module` so the CLI still runs directly), and covered by `test/cli.test.js` using Node's built-in `node:test` runner — zero added dependencies. The test file does not ship to npm consumers (`test/` is not in `package.json`'s `files` whitelist). Includes one integration test that loads every shipped `SKILL.md` and asserts the parser produces a non-empty single-line description for each — catches regressions where a future skill is added with a frontmatter form the parser doesn't understand.

---

## [1.4.0] — 2026-04-08

### Added

- **`ba-toolkit uninstall --for <agent>`** — remove BA Toolkit skills from an agent's directory. Symmetric to `install`: same `--for`, `--global`, `--project`, `--dry-run` flag set, same project-vs-global default. Counts files in the destination, asks `Remove {dest}? (y/N)` (defaults to N), and prints `Removed N files` after the rm completes. The pre-removal safety guard refuses to proceed unless `path.basename(destDir) === 'ba-toolkit'` — this is the only place in the CLI that calls `fs.rmSync({recursive: true})`, so it gets the strictest validation against future bugs that could turn it into `rm -rf $HOME`.
- **`ba-toolkit upgrade --for <agent>`** (aliased as `update`) — refresh skills after a toolkit version bump. Reads the new version sentinel (see below), compares to `PKG.version`, and either prints `Already up to date` or wipes the destination wholesale and re-runs install with `force: true` (skipping the overwrite prompt). The wipe-and-reinstall approach guarantees that files removed from the toolkit between versions don't linger as ghost files in the destination — fixes the same class of bug that motivated `cmdUninstall`'s safety check. Pre-1.4 installs with no sentinel are treated as out-of-date and get a clean reinstall on first upgrade.
- **`ba-toolkit status`** — pure read-only inspection: scans every (agent × scope) combination — 5 agents × project/global where supported, 8 real locations in total — and reports which versions of BA Toolkit are installed where. Output is grouped per installation, multi-line for readability, with colored version labels (`green: current` / `yellow: outdated` / `gray: pre-1.4 install with no sentinel`) and a summary footer pointing at `upgrade` for stale installs. Drives the natural follow-up to the version sentinel: now there's something to read it back with.
- **Version sentinel `.ba-toolkit-version`** — `runInstall` now writes a hidden JSON marker file (`{"version": "1.4.0", "installedAt": "..."}`) into the install destination after a successful copy. The file has no `.md`/`.mdc` extension, so all five supported agents' skill loaders ignore it. Lets `upgrade` and `status` tell which package version is currently installed without diffing every file.
- **`runInstall({..., force: true})` option** — skips the existing-destination overwrite prompt. Used by `cmdUpgrade` because it has already wiped the destination (or is in dry-run) and the prompt would just be noise. Not exposed as a CLI flag — `force` is an internal API surface only.

### Fixed

- **Five Tier 1 CLI fixes were already shipped in 1.3.2**, but they're worth restating in context here because 1.4.0 builds directly on the same `bin/ba-toolkit.js` improvements: `cmdInit` now honours `runInstall`'s return value (no false success message after a declined overwrite), `parseArgs` accepts `--key=value` form, the readline lifecycle and SIGINT handling are unified through a single shared interface with `INPUT_CLOSED` rejection, the slug-derivation path prints a clear error when the input has no ASCII letters, and `AGENTS.md` now lists all 21 skills (the previous template was missing the 8 cross-cutting utilities added in v1.1 and v1.2). See the 1.3.2 entry below for the per-fix detail.

### Internal

- **`resolveAgentDestination(...)` helper** — extracted scope-resolution logic from `runInstall`'s inline checks. `cmdUninstall` and `cmdUpgrade` reuse it. `runInstall` itself could be refactored to call the helper too in a follow-up — kept inline for now to keep this release's diff focused on the user-facing features.
- **Documentation:** `CLAUDE.md` added at the repo root, with project conventions, the release flow (including the `.claude/settings.local.json` stash dance), the npm publish CI gotchas (curl tarball bypass for the broken bundled npm, `_authToken` strip for OIDC), and the do-not-touch list. Future Claude Code sessions get the institutional context without reading the full git log.

---

## [1.3.2] — 2026-04-08

### Fixed

- **`bin/ba-toolkit.js` `cmdInit` ignored `runInstall` return value.** When the user declined the "Overwrite? (y/N)" prompt for an existing skill destination, `runInstall` returned `false`, but `cmdInit` ignored it and printed the success path ("Project is ready. Next steps: Restart Claude Code to load the new skills") even though no skills were installed. The next-steps block now branches on the install result and tells the user how to retry: `ba-toolkit install --for {agentId}`.
- **`parseArgs` did not accept `--key=value` form.** The hand-rolled parser only understood `--key value` (space-separated). Users typing the GNU long-option style accepted by git/npm/gh (`--name=MyApp`, `--domain=saas`) silently lost the value — the flag was stored as `name=MyApp` set to `true` and the script then prompted for the project name interactively. Both forms now work and can be mixed in a single invocation. Splits on the first `=` only, so values containing further `=` characters are preserved (e.g. `--name="Foo=Bar"`).
- **No SIGINT handler / readline lifecycle issues.** Each `prompt()` call previously created a fresh `readline.Interface` and closed it after the answer. Hitting Ctrl+C mid-prompt killed Node abruptly and left some terminals in raw mode. Piped stdin that closed mid-flow caused the next prompt's promise to hang forever and the process to exit silently with no error message. Fixed by switching to a single shared `readline.Interface` per CLI invocation, adding a `process.on('SIGINT')` handler that prints a clean `Cancelled.` message and exits with code 130, and rejecting in-flight prompt promises with `err.code = 'INPUT_CLOSED'` when the input stream closes prematurely. The outer `main().catch(...)` filters this code to print a friendly two-line message instead of a Node stack trace.
- **Silent failure when slug could not be derived from a non-ASCII name.** `sanitiseSlug` strips everything outside `[a-z0-9-]`, so `--name "Проект Космос"` or `--name "🚀"` produced an empty derived slug. In the non-interactive path the script then exited with a generic `Invalid or empty slug` error with no clue about why. Now in the non-interactive path it prints `Cannot derive a slug from "{name}" — it contains no ASCII letters or digits` plus a one-line workaround (`Pass an explicit slug with --slug, e.g. --slug my-project`). In the interactive path it prints a gray hint above the manual slug prompt explaining we couldn't auto-derive.
- **`AGENTS.md` template was missing 8 of the 21 skills.** `renderAgentsMd` emitted a "Pipeline Status" table with 13 rows — the 12 numbered stages + the `7a` sub-step. The 8 cross-cutting utilities added in v1.1 and v1.2 (`/trace`, `/clarify`, `/analyze`, `/estimate`, `/glossary`, `/export`, `/risk`, `/sprint`) were missing entirely. Since `AGENTS.md` is the project context every AI agent reads on entry to a new session, those 8 skills were effectively invisible — agents didn't know they existed without re-reading README. Added a second "Cross-cutting Tools" section below the pipeline table listing all 8, with descriptions copied from the canonical README pipeline table. A `MAINTENANCE` comment above the function reminds future-me to update both tables when adding a new skill.

---

## [1.3.1] — 2026-04-08

### Fixed

- **`/brief` and `/srs` now load all 9 domain references, not just 3.** Both `skills/brief/SKILL.md` and `skills/srs/SKILL.md` hardcoded a check for `igaming`, `fintech`, `saas` only — a stale list from v1.0 that was never updated when v1.1.0 added six new domain references (`ecommerce`, `healthcare`, `logistics`, `on-demand`, `social-media`, `real-estate`). As a result, users on any of those six domains silently got no domain-specific interview questions, mandatory entities, or glossary. The check now covers all nine shipped domain files, matching the supported list advertised in the CLI and README. No other skill files had the same stale list — only `brief` and `srs` did hardcoded domain matching.

### Changed

- **`sprint-template.md` rewritten end-to-end as Nova Analytics (SaaS).** The sprint-plan reference template loaded by `/sprint` was previously a Dragon Fortune iGaming example (slot games, RTP, responsible gambling, bonus wagering, Telegram Mini App). It's now a B2B SaaS product analytics plan — workspace sign-up, data source integration, dashboards with funnel/cohort widgets, metric alerts, SSO, and admin workspace management. Structure (sprint goals, DoD, capacity math, epic labels) is unchanged.
- **`risk-template.md` rewritten end-to-end as Nova Analytics.** The risk-register reference template loaded by `/risk` had iGaming-specific risks (regulated iGaming jurisdiction, Telegram Mini App API breakage, RTP / bonus wagering knowledge gap). It's now a SaaS analytics risk register: third-party data source rate limits, GDPR DPA, columnar query performance at scale, OIDC/SSO library breaking changes, and columnar analytics storage knowledge gap. Structure (probability × impact scoring, priority tiers, mitigation/contingency sections) is unchanged.
- **`export-template.md`** — one-line fix: the example Jira label changed from `dragon-fortune` to `nova-analytics`.
- **iGaming-first ordering removed from user-facing documentation.** README intro, README Domain support table, `docs/FAQ.md`, `docs/USAGE.md`, and `docs/TROUBLESHOOTING.md` all listed iGaming first when enumerating the 9 supported domains. They now follow the SaaS-first order the CLI has used since v1.3.0: `saas → fintech → ecommerce → healthcare → logistics → on-demand → social-media → real-estate → igaming`. The iGaming row in the Domain support table stays — it just moved from position 1 to position 9.
- **`dragon-fortune` slug example in README.md:186 replaced with `nova-analytics`.** This was the last stray placeholder outside the real `example/dragon-fortune/` project.

### Not changed (deliberately)

- `skills/references/domains/igaming.md` — the domain reference itself. iGaming remains a first-class supported domain.
- `example/dragon-fortune/` — the real end-to-end example project referenced from README.
- `bin/ba-toolkit.js` / `init.sh` / `init.ps1` `DOMAINS` array iGaming entry — iGaming remains a menu choice in the CLI and shell initialisers.

---

## [1.3.0] — 2026-04-08

### Changed

- **`ba-toolkit init` is now a one-command setup.** It prompts for project name, slug (auto-derived from the name), domain, and AI agent, then creates `output/{slug}/`, writes `AGENTS.md`, and installs the skills into the chosen agent's directory — in a single interactive flow. Previously this required two commands: `ba-toolkit init` followed by `ba-toolkit install --for <agent>`. The old two-step flow is still available via `ba-toolkit init --no-install` + `ba-toolkit install --for <agent>`.
- **Domain and agent selection now use numbered menus** instead of free-text input. Domains are listed 1–10 with name and short description; agents are listed 1–5 with their registered id. Users can type either the menu number (`1`, `2`, …) or the id (`saas`, `claude-code`, …).
- **`DOMAINS` reordered** so general-purpose industries (SaaS, Fintech, E-commerce, Healthcare) appear first; iGaming moved to position 9. The toolkit is no longer iGaming-first in its defaults.
- **Setup placeholders no longer use "Dragon Fortune"** (the iGaming example project). The CLI, `init.sh`, `init.ps1`, `docs/USAGE.md` AGENTS.md example, and `skills/references/environment.md` file listings now use neutral placeholders (`My App` / `my-app` / `saas`). The actual example project in `example/dragon-fortune/` and the skill templates that reference it are unchanged — they remain a real iGaming walkthrough.

### Added

- `ba-toolkit init --for <agent>` flag — skip the agent menu (e.g. `--for claude-code`). Accepts the same set as `ba-toolkit install --for`.
- `ba-toolkit init --no-install` flag — create the project structure only; don't install skills. Restores the pre-1.3.0 behavior for CI pipelines that run `init` and `install` as separate steps.
- `ba-toolkit init --global` / `--project` / `--dry-run` flags — forwarded to the embedded install step.
- `init.sh` and `init.ps1` shell fallbacks now use the same numbered domain menu and auto-derived slug UX as the CLI, with pointers to `npx @kudusov.takhir/ba-toolkit install --for <agent>` for the skill install step (they remain zero-dependency scripts and don't install skills themselves).

### Migration note

CI scripts that relied on the old behaviour (`init` creates files only, `install` is a separate step) need one of:

- Pass all the new flags to get fully non-interactive behaviour:
  ```bash
  npx @kudusov.takhir/ba-toolkit init --name "My App" --domain saas --for claude-code
  ```
- Or add `--no-install` to keep the two-step flow:
  ```bash
  npx @kudusov.takhir/ba-toolkit init --name "My App" --domain saas --no-install
  npx @kudusov.takhir/ba-toolkit install --for claude-code
  ```

---

## [1.2.5] — 2026-04-08

### Changed

- **README refactor (3-step):** cut README from 843 to 288 lines (−66%) without losing any factual content.
  - PR 1 — extracted Usage Guide, Troubleshooting, FAQ, Contributing, and "Adding a new domain" into `docs/USAGE.md`, `docs/TROUBLESHOOTING.md`, `docs/FAQ.md`, `CONTRIBUTING.md`, and `docs/DOMAINS.md`. README now links to each instead of duplicating the content.
  - PR 2 — reordered sections to follow the reader funnel (what → install → see result → details → advanced). Collapsed manual install variants (Claude Code, Codex, Gemini, Cursor/Windsurf, init scripts, manual updates) under a single `<details>` block. Removed the `## Contents` TOC (GitHub auto-generates one), the ASCII Pipeline diagram (duplicated the table below it), the ASCII "How each skill works" block, the ~80-line `## Repository Structure` tree, and the `## Quick Start` section (duplicated `docs/USAGE.md` section 1). Moved `What the output looks like` up to sit right after Install. Moved the time-estimates table to `docs/USAGE.md` as an appendix.
  - PR 3 — style pass: one-line hero, emoji removed from every H2 heading and from Pipeline/Platform/Domain table contents, "Who is this for?" bullets removed, the "Why not just prompt ChatGPT / Claude directly?" comparison table replaced with a single paragraph in the intro, callout blockquotes inlined, all headings switched to sentence case.
- `docs/*` follow-up style pass: sentence-case H1s in `docs/USAGE.md` and `docs/DOMAINS.md`. Fixed a stale anchor in `docs/FAQ.md` (pointed to `../README.md#-installation` from before the emoji-stripped H2 rename; now points to `#install`).

### Removed

- `README.ru.md` and every remaining Russian-language reference across the repo (`README.md` language switcher, `package.json` files whitelist, the 1.2.0 CHANGELOG note about the Russian translation, and the planning item in `todo.md`). The toolkit is now single-language (English); localisation can be re-added later as a separate effort if needed.

---

## [1.2.4] — 2026-04-08

### Fixed

- `.github/workflows/release.yml` — added a "Strip classic auth from .npmrc" step before `npm publish`. `actions/setup-node` with `registry-url` writes `//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}` into `.npmrc`; with our empty `NODE_AUTH_TOKEN` this registered as a configured-but-empty classic token, so npm refused to start the OIDC flow and failed with `ENEEDAUTH`. Stripping both `:_authToken=` and `always-auth=` lines lets npm 11.5.1+ detect GitHub Actions OIDC and use Trusted Publishing.
- Also removed the now-unused `NODE_AUTH_TOKEN: ''` override on the publish step — with the `.npmrc` cleaned up, it's redundant.

### Changed

- Supersedes the unpublished `1.2.3` (which reached the publish step but died on auth) — carries forward all prior changes.

---

## [1.2.3] — 2026-04-08 _(GitHub Release only — npm publish failed on auth, superseded by 1.2.4)_

### Fixed

- `.github/workflows/release.yml` — replaced the `npm install -g npm@latest` step with a direct tarball download via `curl`, bypassing the broken bundled npm in Node 22.22.2 (whose `@npmcli/arborist` is missing its transitive `promise-retry` dep, causing any `npm install` — including self-upgrade, with or without `--force` — to die with `MODULE_NOT_FOUND`). The workaround pulls `npm-11.5.1.tgz` directly from the registry and drops it into the toolcache's `node_modules` without invoking npm at all. Both `1.2.1` and `1.2.2` failed the `publish-npm` job for this reason and were never published to npm; `1.2.3` supersedes both.

### Changed

- Supersedes the unpublished `1.2.1` and `1.2.2` — carries forward all of their documentation, rename, and CI changes.

---

## [1.2.2] — 2026-04-08 _(GitHub Release only — npm publish failed, superseded by 1.2.3)_

### Fixed

- `.github/workflows/release.yml` — added `--force` to the `npm install -g npm@latest` step to work around a known self-upgrade bug where arborist unlinks its own transitive `promise-retry` mid-upgrade and fails with `MODULE_NOT_FOUND`. _(This workaround was insufficient — the bundled npm is broken at rest, not just during self-upgrade. Fixed properly in 1.2.3.)_

### Changed

- Supersedes the unpublished `1.2.1` — carries forward all of its documentation and rename changes.

---

## [1.2.1] — 2026-04-08 _(GitHub Release only — npm publish failed, superseded by 1.2.2)_

### Changed

- npm package renamed from `ba-toolkit` to scoped `@kudusov.takhir/ba-toolkit` to avoid name collisions in the public registry. The CLI binary name (`ba-toolkit`) is unchanged. Install commands are now `npx @kudusov.takhir/ba-toolkit <command>` or `npm install -g @kudusov.takhir/ba-toolkit`.
- `README.md` updated to use the scoped package name in all `npx` and `npm install -g` examples.

---

## [1.2.0] — 2026-04-08

### Added

- `/sprint` skill — sprint planning from estimated User Stories: groups stories into sprints by velocity and capacity, applies risk-weighted prioritisation, outputs sprint goals and Definition of Done per sprint (`00_sprint_{slug}.md`).
- `skills/references/templates/sprint-template.md` — full example sprint plan for the Dragon Fortune project.
- `example/dragon-fortune/` — complete example project with all 15 pipeline artifacts for an iGaming Telegram Mini App. Fully cross-referenced: FR → US → UC → AC → NFR → Entity → ADR → API → WF → Scenario + Risk Register + Sprint Plan.
- **npm package** — BA Toolkit is now publishable to npm as `ba-toolkit`. Two commands supported:
  - `npx ba-toolkit init` — interactive project initialiser (creates `output/{slug}/` and `AGENTS.md`).
  - `npx ba-toolkit install --for <agent>` — copies skills to the correct path for Claude Code, Codex CLI, Gemini CLI, Cursor, or Windsurf. Supports `--global`, `--project`, and `--dry-run` flags.
  - Cursor and Windsurf installs auto-convert `SKILL.md` → `.mdc` rule format.
  - Zero runtime dependencies; Node.js ≥ 18.
- `bin/ba-toolkit.js` — CLI entry point (~450 lines, single file, no framework).
- `package.json` — npm manifest with `bin`, `files` whitelist, and repository metadata.
- `.github/workflows/release.yml` extended with a `publish-npm` job that runs on version tag push after the GitHub Release step. Uses **npm Trusted Publishing via OIDC** — no `NPM_TOKEN` secret required, publishes provenance attestations automatically. Verifies tag matches `package.json` version and runs a CLI smoke test before publishing.

### Fixed

- README.md tagline: outdated "19 skills" → "21 skills" (matches badge and body counters).
- `release.yml` — fixed broken `awk` regex that interpreted `[` and `]` in version headings as character class metacharacters; now uses literal `index()` matching, so release notes are correctly extracted from `## [X.Y.Z]` sections.
- `CHANGELOG.md` compare links — replaced `your-username` placeholder with actual GitHub user `TakhirKudusov`.

---

## [1.1.0] — 2026-04-07

### Added

**New skills**
- `/estimate` — effort estimation for User Stories: Fibonacci Story Points, T-shirt sizes, or person-days. Includes splitting recommendations for oversized stories.
- `/glossary` — unified project glossary extraction. Scans all artifacts, detects terminology drift, finds undefined terms, generates `00_glossary_{slug}.md`.
- `/export` — artifact export to external issue trackers: Jira (JSON), GitHub Issues (JSON + `gh` CLI script), Linear (JSON), and universal CSV.

**Templates**
- Added 12 new artifact templates to `skills/references/templates/`, covering all pipeline stages: `stories`, `usecases`, `ac`, `nfr`, `datadict`, `research`, `apicontract`, `wireframes`, `scenarios`, `trace`, `analyze`, `handoff`.

**Domains**
- Added 6 new domain reference files: `ecommerce`, `healthcare`, `logistics`, `on-demand`, `social-media`, `real-estate`.
- Domain count increased from 3 to 9.

**Tooling**
- `init.ps1` — PowerShell project initialiser for Windows. Creates `output/{slug}/` and `AGENTS.md` with full pipeline status table.
- `init.sh` — Bash project initialiser for macOS / Linux. Same behaviour.
- `.github/workflows/validate.yml` — GitHub Actions CI workflow. Validates artifact structure on PRs to `output/`. Checks SKILL.md frontmatter and domain reference sections.
- `.github/scripts/validate_artifacts.py` — Python validator used by the CI workflow.

### Changed
- `skills badge` updated from 16 to 18 (estimate, glossary, export pending `.skill` packaging).
- `domains badge` updated from 3 to 9.
- `README.md`: added "Starting a new project" section to Installation, updated Repository Structure, added `estimate.skill` and `glossary.skill` to Claude.ai install list.
- `skills/references/templates/README.md`: updated template table to list all 15 templates.

---

## [1.0.0] — 2026-03-15

### Added

**Core pipeline (16 skills)**
- `/principles` — project constitution: language, ID format, traceability rules, Definition of Ready, NFR baseline, quality gates, output folder structure.
- `/brief` — project brief: goals, audience, stakeholders, constraints, risks, glossary. Creates `AGENTS.md`.
- `/srs` — software requirements specification: functional requirements (FR), roles, interfaces, MoSCoW matrix. Updates `AGENTS.md`.
- `/stories` — user stories with epics, FR links, priority, and size.
- `/usecases` — use cases with main success scenario, alternative flows, exception flows.
- `/ac` — acceptance criteria in Given / When / Then format, Definition of Done checklists.
- `/nfr` — non-functional requirements: performance, scalability, availability, security, maintainability, usability.
- `/datadict` — data dictionary: entities, fields, types, constraints, relationships, enums.
- `/research` — technology research and architecture decision records (ADRs), integration map, storage decisions, compliance notes.
- `/apicontract` — API contract: endpoints (REST/GraphQL), request/response schemas, webhooks, error codes.
- `/wireframes` — textual wireframe descriptions: layout, states, interactions, design notes per screen.
- `/scenarios` — end-to-end validation scenarios with persona, steps, expected outcome, failure conditions, coverage summary.
- `/handoff` — development handoff package: artifact inventory, MVP scope, traceability coverage, risks, recommended dev sequence.
- `/trace` — cross-artifact traceability matrix: FR → US → UC → AC → NFR → Entity → ADR → API → WF → Scenario. Coverage gaps and statistics.
- `/clarify` — targeted ambiguity resolution: metrics-free adjectives, undefined terms, conflicting rules, missing fields, ambiguous actors, duplicates.
- `/analyze` — cross-artifact quality report: duplication, ambiguity, coverage gaps, terminology drift, invalid references. Severity-rated findings.

**Iterative refinement subcommands**
- `/revise [section]` — rewrite a specific section.
- `/expand [section]` — add more detail.
- `/split [element]` — split a large User Story or FR into smaller elements.
- `/validate` — completeness and consistency check.
- `/done` — finalise artifact and advance to the next pipeline step.

**Domain references (3 initial)**
- `igaming.md` — iGaming: slots, sports betting, casino lobbies, Telegram Mini Apps, promo mechanics.
- `fintech.md` — Fintech: neobanks, payment systems, crypto exchanges, investment platforms.
- `saas.md` — SaaS: B2B platforms, CRM, analytics, marketplaces, EdTech, HRTech.

**Reference files**
- `skills/references/environment.md` — platform-specific output paths and flat/subfolder modes.
- `skills/references/closing-message.md` — standardised closing message template used by all skills.
- `skills/references/prerequisites.md` — per-step prerequisite checklists for all 16 skills.
- `skills/references/templates/` — base artifact templates: `principles`, `brief`, `srs`.

**Packaged skills**
- 16 `.skill` files in the repo root for direct upload to Claude.ai.

**AGENTS.md synchronisation**
- `/brief` creates `AGENTS.md` with project context (slug, domain, constraints, pipeline stage).
- `/srs` updates `AGENTS.md` with roles and integrations.

**Project files**
- `README.md` — full documentation: pipeline diagram, platform compatibility, usage guide, FAQ, contributing guide, domain table, example artifacts, MVP paths.
- `LICENSE` — MIT license.

---

[Unreleased]: https://github.com/TakhirKudusov/ba-toolkit/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.5.0...v2.0.0
[1.5.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.3.2...v1.4.0
[1.3.2]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.5...v1.3.0
[1.2.5]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.4...v1.2.5
[1.2.4]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.3...v1.2.4
[1.2.3]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/TakhirKudusov/ba-toolkit/releases/tag/v1.0.0
