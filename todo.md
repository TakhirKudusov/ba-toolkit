> **Definition of done — meta-rule.** Every feature release must end with a `CLAUDE.md` / `README.md` / `docs/` sync. This is part of the standard release flow, not a separate backlog item — do not list it as its own todo.

Bugs and improvements batch 1:
1. ✅ `init` now merges `AGENTS.md` via `mergeAgentsMd` + managed-block anchors. Legacy files without anchors are preserved untouched. Done in Unreleased.
2. Invalid input during interactive init crashes the script. Split into:
   - **2a.** ✅ Non-flag interactive path re-prompts on invalid input via `promptUntilValid(question, resolver, { maxAttempts = 3 })`. Applied to domain menu, agent menu, and manual slug entry. Done in Unreleased. Also uncovered and fixed a piped-input race in `prompt()` (readline `'line'` events were being dropped between consecutive `rl.question()` calls) — prompt now owns the `'line'` event and buffers lines in an internal queue.
   - **2b.** ✅ Arrow-key menu navigation for domain/agent selection. `↑/↓` + `j/k`, `1-9` jump, `Enter`, `Esc`/`Ctrl+C`. TTY-only, automatic numbered fallback under non-TTY/`TERM=dumb`. Three-layer design: `menuStep` (pure state machine), `renderMenu` (pure renderer), `runMenuTty` (I/O glue). 18 new unit tests cover the pure layers; the I/O glue is manually smoke-tested. Done in Unreleased.
3. ✅ Print the ASCII `ba-toolkit` banner at the start of `init`. Done in Unreleased: `printBanner()` gated on `process.stdout.isTTY`, not shown in CI/piped output.
4. ✅ AI interview skills follow the new `skills/references/interview-protocol.md`: one question at a time, 3–5 domain-appropriate options, free-text "Other" option, wait for answer. Applied to all 12 interview-phase skills. Guarded by unit test (`test/cli.test.js`) and CI validation step (`.github/workflows/validate.yml`). Done in Unreleased.
5. ✅ Cursor install now targets `.cursor/skills/` with native folder-per-skill `SKILL.md` layout (`format: 'skill'`). Was writing to `.cursor/rules/` as flat `.mdc` files — wrong Cursor feature. Done in Unreleased.
6. ✅ Windsurf install now targets `.windsurf/skills/` natively. Mirror of the Cursor fix in pt.5. Done in Unreleased — also removed all dead `.mdc` conversion code (`skillToMdcContent`, `mdc` branch of `copySkills`, `format` field across the AGENTS map and the manifest payload). All 5 supported agents now use a single uniform install path.

Improvements batch 2:
1. ✅ Present interview questions and their answer options as a markdown table. Done in v3.1.0 — interview-protocol rule 2 now requires a `| ID | Variant |` markdown table under each question.
2. Improve the user experience of slash commands:
- Make the overall experience more user-friendly.
- ✅ Use letters instead of numbers for answer options. Done in v3.1.0 — letter IDs `a-z` in interview-protocol and in the CLI menu (TTY arrow-key path and non-TTY fallback). Digit IDs are kept as a backward-compat fallback.
- ✅ Make the toolkit usable for working on several projects in parallel — for example, two agent windows open in the same repo. Previously, starting a new project just overwrote `AGENTS.md`. Done in v3.1.0 — `init` now writes `output/<slug>/AGENTS.md`, not the repo-root file. Two agent windows do `cd output/<slug-A> && claude` and `cd output/<slug-B> && claude` for full isolation. Skills look for `AGENTS.md` in cwd first, falling back to walking up the tree for legacy v3.0 layouts.
- ✅ Provide a more detailed description of how to continue after finishing work with each command. Done in v3.1.0 — `closing-message.md` now contains a 13-row lookup table (Current → Next → output → time → after that), and every pipeline skill copies its row from there instead of hardcoding `Next step:`. Plus two regression tests catch any future SKILL.md that tries to hardcode a `Next step:` line.
- ✅ Allow inline text after a slash command — for example, `/brief I want to build an online store for construction materials...`. Done in v3.1.0 — interview-protocol rule 9 (inline context). Applied to all 12 interview-phase skills. `/brief I want to build...`, `/srs focus on payments`, `/nfr emphasise security` — every skill parses inline text as a scope hint and skips repeat questions about anything the inline text already covered.
- ✅ Make `/brief` clarify what kind of project it is and the necessary details first when no inline text was provided, then start the structured interview. Done in v3.1.0 — interview-protocol rule 8 (open-ended lead-in question). Applied to `/brief` and `/principles` (entry-point skills). If inline text is present, the lead-in is skipped and the skill jumps straight to the structured questions.

Improvements batch 3:
1. ✅ Highlight one of the answer options as `Recommended` — the option the AI judges most likely to fit the user's project context, based on the domain reference and prior interview answers. Done in Unreleased — `interview-protocol.md` new rule 10, all 12 interview-phase SKILL.md summaries updated, regression test in `test/cli.test.js`.
2. ✅ Cap the number of options at 5 total, including the free-text custom answer (so: 4 predefined variants + 1 free-text "Other" row). Done in Unreleased — `interview-protocol.md` rule 3 rewritten as a hard cap, all 12 SKILL.md summaries updated, regression test rejects the legacy `3–5 domain-appropriate options` wording.
3. ✅ Variant text in `/brief` is always written in the language of the user's first request — domain references should be translated on the fly when the interview language is not English. Done in Unreleased — `interview-protocol.md` new rule 11, applies to every interview-phase skill (not just `/brief`); domain reference files stay English-only per the project convention, translation happens at runtime; example block now includes a Russian rendering.
4. ✅ Replaced `example/dragon-fortune/` with `example/lumen-goods/` — a sustainable home-goods D2C e-commerce walkthrough. All 15 artifacts rewritten end-to-end; CLAUDE.md and README updated. Done in Unreleased.

Improvements batch 4:
1. ✅ Add an AI brain-storm command to draft an initial concept for users who haven't decided on a project domain or feature set yet (priority 1). Done in Unreleased — new `/discovery` skill at `skills/discovery/SKILL.md`, template at `skills/references/templates/discovery-template.md`, wired into `agents-template.md` (stage 0, /principles → 0a) and `closing-message.md` lookup table; `/brief` consumes `00_discovery_*.md` if present.
2. ✅ Extend examples as needed (priority 2). Done in Unreleased — `example/lumen-goods/00_discovery_lumen-goods.md` added so the walkthrough is end-to-end consistent with the new pipeline entry point.
3. ✅ Update CLAUDE.md to match the current project state (priority 3). Done in Unreleased — bumped skill count 21 → 22 in §1 and §4, added /discovery as the entry point.
4. ✅ Sync project documentation and the README (priority 4). Done in Unreleased — `README.md`, `COMMANDS.md`, `package.json`, `docs/USAGE.md`, `docs/FAQ.md`, `bin/ba-toolkit.js` comments, and the `test/cli.test.js` skill-count assertion all updated.

Improvements batch 5:
1. Pilot skill audit — read three of the most-used SKILL.md files (`/brief`, `/srs`, `/stories`) and draft an improvement plan for each as a senior US business analyst with 25+ years of experience would. The plan stays local (gitignored) and is intentionally scoped to 3 skills as a pilot — only roll out to the remaining 20 skills if the pilot surfaces systemic patterns worth generalising. (priority 4)
2. ✅ Command for preparing exports of artifact files to Notion or Confluence. (priority 1) Done in Unreleased — new `ba-toolkit publish` CLI subcommand + thin `/publish` skill, zero-deps `markdownToHtml` helper, both Notion (Markdown bundle) and Confluence (HTML bundle + index.html) targets, intra-project cross-reference rewriting per target, AGENTS.md auto-included as the first page with managed-block stripped, 23 new unit + integration tests.
3. ✅ Expand the number of domain references. (priority 2) Done in Unreleased — three new first-class domains (`edtech`, `govtech`, `ai-ml`) added under `skills/references/domains/`, each following the 9-section template plus a domain glossary; `DOMAINS` array, `brief`/`srs` SKILL.md enumerations, README, CHANGELOG, and `CLAUDE.md` §4+§5 (canonical order, count 9 → 12) all updated.

Improvements batch 6:
1. ✅ Add a skill that generates a sequential implementation plan for an AI coding agent based on the artifacts produced by the other skills. (priority 1) Done in Unreleased — new `/implement-plan` skill at `skills/implement-plan/SKILL.md` (stage 12), produces `12_implplan_<slug>.md` with a 9-phase ladder + Task DAG appendix; tech stack from `07a_research_*.md` with calibration-interview fallback; `agents-template.md` row 12, `closing-message.md` lookup-table extension, `/handoff` now points at `/implement-plan` as the canonical follow-up.
2. Add a skill that generates the tests required for TDD based on the produced artifacts. (priority 1 — unblocked: now that `/implement-plan` ships and the handoff payload shape is known (`12_implplan_<slug>.md` with phase + DAG + per-task references and DoD), TDD test scaffolding can be built on top of that.)

Improvements batch 7:
1. Build a roadmap for further development / improvements and bug fixes. Possibly additional useful skills, for example. (priority 1)
2. Build a GitHub-hosted website for the project. The site must surface the documentation, the roadmap, and links (npm, GitHub, my LinkedIn). It must be responsive and look good on both desktop and mobile. (priority 2)
3. Review and rework the README and the documentation once more if the website work surfaces inconsistencies. (priority 3)

---

## Removed from the backlog (with rationale)

Items previously parked here that we decided not to ship. Captured so we don't re-add them on autopilot.

- **Batch 5 — MCP server.** Removed by user decision. Read-only MCP resource server would duplicate the existing native-skills install path for the 5 supported agents (Claude Code, Codex, Gemini, Cursor, Windsurf) and would either break the zero-runtime-deps invariant or require ~300 LoC of hand-rolled JSON-RPC. Defer until a real user reports needing BA Toolkit inside an agent that does not support native skills.
- **Batch 6 — rename `/brief` → `/ba-toolkit.brief` (slash-command namespacing).** Premature optimisation against an unreported collision. Would break every existing user's muscle memory, every URL / doc / changelog reference, and require a 4.0.0 major bump plus a backward-compat alias on `/brief` for N versions. Re-open only if a real namespace collision with another skill pack is reported.
- **Batch 6 — skill that validates a project against the generated artifacts (use-case compliance checker).** Research-grade idea: would need either per-language AST parsing (fragile, work per-stack) or LLM reasoning over a large codebase (slow, non-deterministic, no ground truth). The rest of BA Toolkit is about deterministic Markdown generation; this is the opposite direction. Re-open as a separate research spike if a feasible approach emerges.
