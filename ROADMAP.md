# BA Toolkit — Roadmap

This roadmap is the single source of truth for what BA Toolkit is working on right now and what is planned next. Items move from **Next** into **Now** as they enter active work, then into **Recently shipped** once they ship.

For everything that has already shipped, see [`CHANGELOG.md`](CHANGELOG.md).

---

## Mission

BA Toolkit is an AI-powered Business Analyst pipeline. It takes a project from a vague concept through a brief, a full requirements specification, a development handoff, stakeholder publishing in Notion or Confluence, and a sequenced implementation plan an AI coding agent can execute step by step.

The toolkit ships **29 interconnected skills** and **12 domain references** as a `SKILL.md`-based package that works natively in Claude Code, Codex CLI, Gemini CLI, Cursor, and Windsurf. The CLI is a single Node.js file with **zero runtime dependencies** — `npm install -g @kudusov.takhir/ba-toolkit` and you have the whole pipeline available offline.

The goal is not to replace the BA. It is to give the BA — or the developer-acting-as-BA, or the AI coding agent — the structure, the standards conformance (BABOK, IEEE 830, ISO 25010, ISO 31000, Cockburn use cases, INVEST, MoSCoW, PMBOK 7), and the cross-artifact traceability that a senior BA at a top-tier consultancy would expect on a serious project.

---

## Now

In flight at the moment.

- *(empty — last release just landed)*

---

## Next

Planned for the next handful of releases. Items are ordered by intent to ship, not by alphabet or category. The CHANGELOG is the source of truth for what actually shipped.

### Documentation and reach

- **`ROADMAP.md` (this document) — published in v3.9.0.** Single source of truth for the next-shipping list, replacing scattered backlog mentions.
- **Astro Starlight website on GitHub Pages — v3.10.0.** Responsive docs site that pulls content from `README.md`, `docs/*.md`, `COMMANDS.md`, and `ROADMAP.md` via a build-time sync script — single source of truth, no drift. Hosted at `https://takhirkudusov.github.io/ba-toolkit/`.
- **README and docs sweep — v3.10.1 (conditional).** Only ships if building the website surfaces real inconsistencies. If nothing surfaces, this slot stays empty.
- **GIF / video walkthroughs in README and website.** Short demos (15–60 seconds) embedded in the README and the website landing page so a first-time visitor can see the toolkit in action without reading text. Lands after the website ships.
- **Domain-reference contribution guide.** Explicit contributor checklist for community PRs that add a new domain reference. Today `docs/DOMAINS.md` describes the file structure but is missing a step-by-step contribution flow. Single small PR with a checklist and an example domain skeleton.

### Quality and maintenance

- ~~**CHANGELOG hygiene CI check.**~~ Shipped — see v3.11.0.
- ~~**Skill-template regression tests.**~~ Shipped — see v3.13.1.
- **`ba-toolkit migrate-agents` CLI subcommand.** Detects pre-v3.4 `AGENTS.md` files (no row 12 for `/implement-plan`), pre-v3.2 (no row 0 for `/discovery`, no row 0a for `/principles`), and pre-v3.4.1 (stale domain after `/discovery` ran) and surgically migrates them. Today the toolkit relies on AI-skill instructions to do this case by case in every affected SKILL.md — every migration row is compensation for the absence of this CLI tool. The subcommand turns those instructions into deterministic, testable code.

### New capabilities

- **Cascading artifact update.** When a requirement changes in the SRS, downstream artifacts (stories, AC, use cases, data dictionary, API contract) that reference it should be flagged and optionally updated in a single pass. Today `/clarify` offers a ripple-effect check but only identifies affected files — it does not perform the update. A new `/cascade` utility skill (or extension of `/revise`) would propagate a change through the dependency chain, re-running only the affected sections of each downstream artifact. Inspired by Spec Kit's evolving-specs pattern.

### New skills

- **`/personas` skill.** Extracts persona profiles from `/brief` §3 (audience) and `/stories` (per-story persona field, added in v3.5.0) into a standalone persona library at `00_personas_{slug}.md`. Downstream skills (`/usecases`, `/scenarios`, `/wireframes`) read from the library instead of inlining persona context per-story, eliminating the duplication that v3.5.0 introduced when `/stories` adopted named personas. Single source of truth for "who are the users", composable with everything else in the pipeline.

---

## Known limitations

What BA Toolkit does **not** do, by design. These are not bugs — they are explicit scope boundaries.

- **Does not generate code.** The pipeline produces specifications (Markdown artifacts) and a sequenced implementation plan that an AI coding agent (Claude Code, Cursor, Codex) can execute. It never writes the application code itself. The boundary between "specification" and "code" is the same boundary between BA work and engineering work.
- **Does not validate code against artifacts.** There is no static checker that verifies "the production code actually implements every Must FR". This was considered (and explicitly rejected — see "Removed from the backlog" below) because it would require either per-language AST parsing or LLM reasoning over a large codebase, both of which are far from the toolkit's deterministic-Markdown-generation core.
- **Does not handle secrets, tokens, or credentials.** Every skill is read-only on the user's environment. There is no `--api-token`, no OAuth flow, no credential storage. `/publish` produces import-ready bundles for Notion and Confluence as drag-and-drop files; the user does the actual upload manually with each tool's native importer. `/export` produces JSON / CSV files for Jira / GitHub / Linear with no authentication step — the user runs the tracker's own import command.
- **Does not collect telemetry.** No anonymous usage statistics, no opt-out flag, no network calls beyond the AI agent itself. Adoption is measured via npm download counts on the public npm registry; no in-product instrumentation.
- **Does not support agents without native skills.** The toolkit ships as folder-per-skill `SKILL.md` files for Claude Code, Codex CLI, Gemini CLI, Cursor, and Windsurf. Agents without native skill loading (e.g., chatbot UIs without file-system access, custom integrations on the bare Anthropic / OpenAI SDK without a skill-loader layer) are out of scope. An MCP-server bridge was considered and rejected — see "Removed from the backlog".
- **Does not enforce a particular testing methodology.** The `/principles` §8 Testing Strategy section lets the project declare TDD / Tests-after / Integration-only / Manual-only / None, and `/implement-plan` reads that declaration to decide whether to embed test specs in each task. The toolkit takes no opinion on which methodology is correct — it carries the user's choice through the pipeline consistently.
- **Does not auto-translate.** The toolkit generates artifacts in the language of the user's first message (configured at `/principles` §1), but it does not translate existing artifacts between languages. Domain reference files are English-only by design; runtime variants are translated on the fly per interview-protocol rule 11.
- **Does not maintain a project after handoff.** The pipeline ends at `/implement-plan` (stage 12). Post-launch concerns — incident response, on-call rotations, post-mortem retros, A/B test analysis, customer interview synthesis — are not in scope and live with the development team's own tooling.

---

## Removed from the backlog

These ideas were considered explicitly and rejected with full rationale. Captured here so they do not get re-proposed without new information.

### MCP server
A read-only Model Context Protocol resource server exposing `skills/`, `templates/`, and `domains/` as MCP resources for agents that do not support native skill loading. **Rejected** because it would duplicate the existing native-skills install path for the five officially supported agents (Claude Code, Codex, Gemini, Cursor, Windsurf), and would either break the zero-runtime-deps invariant by depending on `@modelcontextprotocol/sdk`, or require ~300 lines of hand-rolled JSON-RPC over stdio. The five supported agents already cover the target audience; adding an MCP layer creates a second installation path with its own bug surface and its own user-support load. Re-open if a real user reports needing BA Toolkit inside an agent that does not support native skills and a feasible thin-shim implementation surfaces.

### Slash command rename `/brief` → `/ba-toolkit.brief`
Namespacing every slash command under a `/ba-toolkit.` prefix to avoid potential collisions with other skill packs. **Rejected** because it is premature optimisation against an unreported collision. The change would break every existing user's muscle memory, every URL and changelog and blog reference to the current command names, and would require a 4.0.0 major bump plus a backward-compatibility alias on `/brief` for several versions. The cost is concrete; the benefit is hypothetical. Re-open only if a real namespace collision with another skill pack is reported by a real user.

### Use-case-compliance validator skill
A skill that checks the production codebase against the pipeline artifacts and reports "this FR is implemented", "this AC is missing test coverage", "this Use Case has no matching code path". **Rejected** because the implementation is research-grade — it would need either per-language AST parsing (fragile, requires per-stack engineering effort, brittle on dynamic languages) or LLM reasoning over the entire codebase (slow, non-deterministic, no ground truth, expensive at scale). The rest of BA Toolkit is deterministic Markdown generation; this is the opposite direction. Re-open as a separate research spike if a feasible approach emerges (for example, a test-coverage-mapper that joins JUnit / pytest / Vitest output with the AC IDs in the toolkit's artifacts — that is closer to deterministic).

### Dedicated TDD-test-generation skill
A skill that reads `05_ac_<slug>.md` and emits TDD-style test scaffolding (failing tests first) for the AI coding agent to flesh out. **Rejected** because (1) the AC artifact is already test specifications in pure Given/When/Then form — a separate skill would re-state the same information in a third place and require merge logic on every `/ac` or `/implement-plan` regenerate, (2) it imposes TDD as a one-size-fits-all methodology even for projects (prototypes, internal tools, lightweight CLIs) where TDD is not the right discipline, and (3) the principled solution is to let `/principles` §8 Testing Strategy declare which methodology the project follows, then let `/implement-plan` conditionally embed "Tests to write first" blocks per task based on that declaration. The principled solution is shipped (v3.8.0); the dedicated skill is unnecessary.

---

## Recently shipped

The eight most recent releases. For the full history, see [`CHANGELOG.md`](CHANGELOG.md).

| Version | Date | Highlights |
|---------|------|------------|
| 3.10.3 | 2026-04-11 | **Documentation UX refactoring for non-technical users.** New glossary (terms, acronyms, standards in plain English). Prerequisites section in getting-started. README rewrite (value proposition, ASCII pipeline diagram). 8 new troubleshooting entries. Example project page on website. "How to choose your domain" in DOMAINS.md. 4 beginner FAQ entries. Simplified website landing page. |
| 3.10.2 | 2026-04-11 | **Utility skills documentation overhaul.** Standardized terminology ("Cross-cutting command/tool/utility" → "Utility skill") across all 9 utility SKILL.md files and reference docs. Split README pipeline table into Pipeline + Utility Skills sections. New USAGE.md § 9 with decision tree. 2 new FAQ entries. 6 missing prerequisite sections added. |
| 3.10.1 | 2026-04-10 | Website UI/UX polish pass — hero section redesign with brand palette and favicon, feature cards layout, inverted light/dark theme bug fixed. `package.json` homepage now points to the documentation website. |
| 3.10.0 | 2026-04-10 | **Documentation website powered by Astro Starlight** at `https://takhirkudusov.github.io/ba-toolkit/`. Responsive, dark mode, client-side search. Content auto-synced from repo root at build time. GitHub Actions auto-deploy on push. |
| 3.9.0 | 2026-04-10 | **`ROADMAP.md` — single source of truth for next-shipping list, known limitations, and rejected ideas with rationale.** Commitment-only: no Wishlist, no speculation. README gains a "Roadmap" section. |
| 3.8.1 | 2026-04-10 | Fix `/discovery` failing to update the `**Domain:**` field in the `AGENTS.md` managed block when the recommended domain differs from the init domain. Targeted Domain-field exception in the SKILL.md text. |
| 3.8.0 | 2026-04-10 | **Group C senior-BA audit pass on `/discovery`, `/principles`, `/research`, `/handoff`, `/implement-plan`, `/export`** — bookend skills. ~26 Critical and High findings applied. Highlights: full Michael Nygard ADR format for `/research`, expanded `/handoff` inventory covering all 15 pipeline stages plus 6 utility tools, formal Sign-off section, principles DoR synchronised with v3.5.0+ template fields, new Testing Strategy section in `/principles`, full v3.5.0+ stories template field support in `/export`. After this pass, 22 of 24 shipped skills carry the senior-BA improvements. |
| 3.7.0 | 2026-04-10 | **Group B senior-BA audit pass on `/trace`, `/analyze`, `/clarify`, `/estimate`, `/glossary`, `/risk`, `/sprint`** — utility skills. ~33 Critical and High findings applied. Highlights: full ISO 31000 + PMBOK 7 alignment for `/risk`, Cone of Uncertainty plus confidence bands for `/estimate`, IEEE 830 §4.3 quality attributes mapped to `/analyze` finding categories, definition-quality discipline (ISO 1087-1) for `/glossary`, bidirectional traceability for `/trace`, focus-factor and ceremonies-aware net velocity for `/sprint`. |

---

## Versioning policy

BA Toolkit follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html). The project-specific patch / minor / major rules live in [`CLAUDE.md`](CLAUDE.md) §6:

- **Patch** — content hygiene, docs changes, internal refactors that do not change the CLI surface, reference template rewrites, bug fixes that are content-only.
- **Minor** — new skill, new `ba-toolkit` subcommand, new CLI flag, new domain reference, new agent in `install --for`, new template sections or fields that are additive.
- **Major** — renaming or removing a skill, breaking change to `output/` file naming, incompatible change to a CLI flag or subcommand, install path layout changes (for example, the v2.0 drop of the legacy `ba-toolkit/` wrapper, the v4.0 removal of multi-project `output/<slug>/` layout).

Releases are automated via `.github/workflows/release.yml` triggered by pushing a version tag. The workflow creates a GitHub Release with notes extracted from `CHANGELOG.md` and publishes to npm via Trusted Publishing (OIDC) — no `NPM_TOKEN` in secrets.

---

## Contributing to the roadmap

The roadmap is open to contribution.

- **Propose a new item.** Open an issue at <https://github.com/TakhirKudusov/ba-toolkit/issues> with a one-paragraph problem statement, an explicit user persona, and (if you have one) a sketch of the proposed solution. The single best argument is "I tried to do X and got stuck because Y" — concrete user pain beats abstract "would be nice to have".
- **Contest a "Removed from the backlog" decision.** Open an issue and bring new information that changes the cost / benefit calculus — a real user collision report for the slash-rename, a feasible shim implementation for the MCP server, a deterministic AST-coverage approach for the use-case validator. New information re-opens the conversation; restating the original idea does not.
- **Contribute a domain reference.** Adding a new domain is one Markdown file in `skills/references/domains/{domain}.md` plus a one-line entry in the `DOMAINS` array in `bin/ba-toolkit.js`. See [`docs/DOMAINS.md`](docs/DOMAINS.md) for the file structure. New first-class domains are the highest-impact contribution and require zero code changes beyond the registration line.
- **Contribute a code or content fix.** See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the PR workflow.
