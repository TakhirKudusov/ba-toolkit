# CLAUDE.md — BA Toolkit project context

> Project-specific guidance for Claude Code. Supplements the user's global `~/.claude/CLAUDE.md`. Override rule: anything in this file takes precedence over the global rules for work inside this repo.

## 1. What this project is

BA Toolkit is an AI-powered Business Analyst pipeline: 24 interconnected skills that take a project from a vague concept through brief, handoff, stakeholder publishing (Notion + Confluence), and a sequenced implementation plan an AI coding agent can execute. Published to npm as **`@kudusov.takhir/ba-toolkit`** (scoped, public). Works with Claude Code, Codex CLI, Gemini CLI, Cursor, and Windsurf. The CLI is a single-file Node.js script with **zero runtime dependencies**.

## 2. Language rule — English only

**This project is English-only.** Comments, docs, CHANGELOG entries, commit messages, workflow files, todo.md, skill files — all in English. This **overrides** the global CLAUDE.md rule about Russian commits/comments. The single exception: the user talks to me in Russian, and I reply in Russian — but anything I write into files is English.

## 3. Commands

```bash
# Smoke test (this is also `npm test`)
node bin/ba-toolkit.js --help > /dev/null && echo ok

# Full dry-run of the user setup flow
rm -rf /tmp/ba-check && mkdir -p /tmp/ba-check && cd /tmp/ba-check
node $REPO/bin/ba-toolkit.js init --name "Nova Analytics" --domain saas --for claude-code --dry-run

# Check what's currently on npm
npm view @kudusov.takhir/ba-toolkit version
npm view @kudusov.takhir/ba-toolkit versions
```

There is **no build step** — the CLI runs directly with `node`. There are **no linters or formatters configured** in `package.json` (the global CLAUDE.md's `npm run lint` / `npm run format` commands don't apply here).

## 4. Repository layout

```
bin/ba-toolkit.js         # CLI entry point (~550 lines, single file, zero deps)
skills/                   # 24 SKILL.md files + references/ (entry: /discovery → /brief; finish: /handoff → /implement-plan; utility: /trace, /clarify, /analyze, /estimate, /glossary, /export, /publish, /risk, /sprint)
  {skill}/SKILL.md        # Each skill has YAML frontmatter (name, description)
  references/
    domains/              # 12 domain files + placeholder entries for custom
    templates/            # Reference artifact templates (loaded by skills)
    environment.md        # Output directory detection logic
    closing-message.md    # Shared closing message for all skills
    prerequisites.md      # Per-step prerequisite checklists
example/lumen-goods/      # Real end-to-end example project (e-commerce D2C) — do NOT edit
docs/                     # Extracted from README in v1.2.5
  USAGE.md · TROUBLESHOOTING.md · FAQ.md · DOMAINS.md
CONTRIBUTING.md           # Extracted from README in v1.2.5
init.sh · init.ps1        # Zero-dependency shell/PowerShell fallbacks for the CLI
.github/workflows/
  release.yml             # Tag push → GitHub Release + npm publish via OIDC
  validate.yml            # PR validation (skill frontmatter, artifact structure)
CHANGELOG.md              # Keep a Changelog format, SemVer
todo.md                   # Planning backlog — keep in sync after task completion
```

## 5. Conventions

### Style
- **README + docs:** sentence case in H2+ headings (`## What is this`, not `## What Is This`). No emojis in H2+. H1 may keep a single logo emoji (`# 📋 BA Toolkit`). Emojis are allowed in bullets, tables, and blockquotes.
- **Placeholder names:** `My App` / `my-app` in CLI prompts and `AGENTS.md` template. `Nova Analytics` / `nova-analytics` in reference templates that need a concrete fictional project. Never use `Lumen Goods` as a placeholder outside `example/lumen-goods/` — that's a real example project, not a stand-in.
- **Domain order:** SaaS-first everywhere. Canonical order from `bin/ba-toolkit.js` `DOMAINS` array: `saas → fintech → ecommerce → healthcare → logistics → on-demand → social-media → real-estate → igaming → edtech → govtech → ai-ml → custom`. The original 9 first-class domains stay in their established slots; new domains are appended before `custom` so existing AGENTS.md files and downstream tooling do not need to renumber. Any doc enumeration that lists domains must follow this order.

### Commits
- **English**, Conventional Commits format: `<type>(<scope>): <description>`. Types: `feat`, `fix`, `docs`, `refactor`, `chore`, `style`, `test`, `perf`. Subject line under 72 chars.
- Use HEREDOC for multiline messages.
- Always add `Co-Authored-By: Claude <model> <noreply@anthropic.com>` trailer when I generated the commit.
- **Direct to `main`** — no feature branches for this repo. All commits land on `main`.

### todo.md
Per user memory rule: update `todo.md` immediately after completing any task, same turn — don't wait for a separate request. If a todo item describes work that's now done, move it to "Recently completed" or strike it.

## 6. Release flow

Releases are automated via `.github/workflows/release.yml` triggered by pushing a version tag. The workflow creates a GitHub Release (notes extracted from `CHANGELOG.md`) and publishes to npm via **Trusted Publishing (OIDC)** — no `NPM_TOKEN` in secrets.

### Step-by-step

```bash
# 1. Update CHANGELOG.md: move [Unreleased] entries to new [X.Y.Z] section,
#    add compare link at the bottom.
$EDITOR CHANGELOG.md

# 2. Stage CHANGELOG.md and any other changes, commit.
git add CHANGELOG.md $OTHER_FILES
git commit -m "..."

# 3. Bump version (creates commit and tag vX.Y.Z).
#    .claude/settings.local.json is gitignored now, so no stash dance.
npm version patch -m "chore(release): %s"    # bug fix / docs
npm version minor -m "chore(release): %s"    # new feature
npm version major -m "chore(release): %s"    # breaking change

# 4. Push.
git push origin main --follow-tags

# 5. Verify after ~1-2 minutes.
npm view @kudusov.takhir/ba-toolkit version
```

### SemVer for this project

- **Patch** — docs changes, CHANGELOG-only fixes, content hygiene, internal refactors that don't change CLI surface, reference template rewrites.
- **Minor** — new skill, new `ba-toolkit` subcommand, new CLI flag, new domain reference, new agent in `install --for`.
- **Major** — renaming/removing a skill, breaking change to `output/{slug}/` file naming, incompatible change to a CLI flag or subcommand, install path layout changes (e.g. v2.0 dropped the `ba-toolkit/` wrapper).

## 7. CI gotchas — the npm publish saga (don't re-solve these)

The `release.yml` workflow contains two non-obvious hacks that took v1.2.1–v1.2.4 to land. **Do not simplify them.**

### Hack 1: curl tarball instead of `npm install -g npm@latest`

Node 22.22.2 in the GitHub runner toolcache ships a **broken bundled npm** — `@npmcli/arborist` is missing its transitive `promise-retry` dep, so any `npm install` (including the self-upgrade `npm install -g npm@latest`) dies with `MODULE_NOT_FOUND` before reify starts. Adding `--force` doesn't help — the bundled npm can't run `install` at all.

Workaround in the workflow: download `npm-11.5.1.tgz` directly via `curl`, extract with `tar`, and drop it into `$NODE_PREFIX/lib/node_modules/npm`, replacing the broken copy. No npm is invoked during the replacement. See the `Install npm 11.5.1 (bypass broken bundled npm)` step in `release.yml`.

### Hack 2: Strip `_authToken` from `.npmrc` before publish

`actions/setup-node` with `registry-url` writes this into `.npmrc`:

```
//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}
always-auth=true
```

With our `NODE_AUTH_TOKEN` empty (we rely on OIDC), the stub token registers as "classic auth configured", and npm refuses to start the OIDC flow — it dies with `ENEEDAUTH` instead of exchanging the GitHub Actions OIDC token.

Workaround: a `Strip classic auth from .npmrc (enable OIDC flow)` step that `sed`-deletes both `:_authToken=` and `^always-auth=` lines right before `npm publish`. The publish step then reads a clean `.npmrc`, detects it's in a GitHub Actions OIDC-capable environment, and uses Trusted Publishing.

### Trusted Publisher config on npmjs.com

Trusted Publishing also requires a one-time manual config on npmjs.com → Package Settings → Trusted Publishers:
- Publisher: GitHub Actions
- Organization/user: `TakhirKudusov`
- Repository: `ba-toolkit`
- Workflow filename: `release.yml`
- Environment name: (empty)

If CI fails with `ENEEDAUTH` on a new package, check this first.

## 8. Do NOT touch

- `example/lumen-goods/*` — the real end-to-end example project referenced from README. E-commerce D2C themed.
- `skills/references/domains/igaming.md` — the legitimate iGaming domain reference. iGaming is a supported domain.
- `CHANGELOG.md` historical sections — only add new `[X.Y.Z]` blocks above existing ones. Never edit released versions retroactively (except for stale-anchor fixes that are cosmetic).
- The two CI hacks in `.github/workflows/release.yml` (see section 7).
- `.claude/settings.local.json` and `.claude/skills/` — gitignored. Local Claude Code state, not part of the package. Don't try to stage or commit them.

## 9. Quirks to remember

- **Windows Unix-ish shell:** commands run via bash, use `/dev/null` not `NUL`, forward slashes in paths, `/tmp/` for throwaway dirs works.
- **No `gh` CLI** available on this machine — can't use `gh` for GitHub interactions. Use web links or `git` commands directly.
- **`init.sh` and `init.ps1`** are zero-dep fallbacks that only create the project structure — they do **not** install skills. They direct users at `npx @kudusov.takhir/ba-toolkit install --for <agent>`. The npm CLI is the single-command path; the shell scripts exist for users who can't run Node.
- **All five agents use native Agent Skills format.** Every supported agent (Claude Code, Codex, Gemini, Cursor, Windsurf) loads `<skills-root>/<skill-name>/SKILL.md` as folder-per-skill. There is no `.mdc` conversion path anymore — `skillToMdcContent` and the `mdc` branch of `copySkills()` were removed in Unreleased. Cursor's Rules feature (`.cursor/rules/*.mdc`) is a different feature; we do NOT install there. Same for Windsurf rules.
- **v2.0 install layout:** every install path drops directly into the agent's skills root, NOT under a `ba-toolkit/` wrapper. Versions before v2.0 used a wrapper which made every shipped skill invisible to Claude Code (which scans only one level under `.claude/skills/`). The destination is shared with the user's other skills, so install/uninstall/upgrade are all manifest-driven: `runInstall` writes `.ba-toolkit-manifest.json` listing the items it owns; `removeManifestItems` deletes only those items. Never `rm -rf` the destination root — that would nuke user data.
- **Manifest format:** `{ version, installedAt, items }` where `items` is an array of folder names relative to the destination root (e.g., `["brief", "srs", ..., "references"]`). Read with `readManifest(destDir)`, write with `writeManifest(destDir, items)`. Older manifests with a `format` field still parse — `readManifest` does plain `JSON.parse` and the field is ignored.
- **Legacy v1.x detection:** `detectLegacyInstall(agent)` returns paths to any leftover `ba-toolkit/` wrapper folders. Called by `runInstall`, `cmdUpgrade`, `cmdUninstall`, `cmdStatus` to warn the user. We never auto-delete legacy folders — they might contain user state.
- **`AGENTS.md`** gets auto-generated by `ba-toolkit init` and then auto-updated by `/brief` and `/srs` skills at runtime. It's project context for AI agents in future sessions — not something I should hand-edit unless the user asks.
- **v1.2.1/v1.2.2/v1.2.3 exist as GitHub Releases but not on npm** — CI failures during the publish saga. The v1.2.4 release superseded all three. Don't panic if `npm view versions` shows gaps; this is expected.
