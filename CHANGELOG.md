# Changelog

All notable changes to BA Toolkit are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [1.2.1] — 2026-04-08

### Changed

- npm package renamed from `ba-toolkit` to scoped `@kudusov.takhir/ba-toolkit` to avoid name collisions in the public registry. The CLI binary name (`ba-toolkit`) is unchanged. Install commands are now `npx @kudusov.takhir/ba-toolkit <command>` or `npm install -g @kudusov.takhir/ba-toolkit`.
- `README.md` and `README.ru.md` updated to use the scoped package name in all `npx` and `npm install -g` examples.

---

## [1.2.0] — 2026-04-08

### Added

- `/sprint` skill — sprint planning from estimated User Stories: groups stories into sprints by velocity and capacity, applies risk-weighted prioritisation, outputs sprint goals and Definition of Done per sprint (`00_sprint_{slug}.md`).
- `skills/references/templates/sprint-template.md` — full example sprint plan for the Dragon Fortune project.
- `example/dragon-fortune/` — complete example project with all 15 pipeline artifacts for an iGaming Telegram Mini App. Fully cross-referenced: FR → US → UC → AC → NFR → Entity → ADR → API → WF → Scenario + Risk Register + Sprint Plan.
- `README.ru.md` — full Russian translation of `README.md`. Language switcher added to both versions (🇺🇸 English / 🇷🇺 Русский). EN remains the source of truth per sync rule.
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

[Unreleased]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.1...HEAD
[1.2.1]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/TakhirKudusov/ba-toolkit/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/TakhirKudusov/ba-toolkit/releases/tag/v1.0.0
