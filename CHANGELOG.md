# Changelog

All notable changes to BA Toolkit are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

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

[Unreleased]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.5...v1.3.0
[1.2.5]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.4...v1.2.5
[1.2.4]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.3...v1.2.4
[1.2.3]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/TakhirKudusov/ba-toolkit/releases/tag/v1.0.0
