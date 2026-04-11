---
name: implement-plan
description: >
  Generate a sequenced implementation plan for an AI coding agent based on the BA Toolkit pipeline artifacts. Use on /implement-plan command, or when the user asks to "create an implementation plan", "what to build first", "how to implement this project", "build order", "agent task list", "buildplan", "next steps for an AI coding agent", "hand the project to Claude Code". Optional final step of the BA Toolkit pipeline — runs after /handoff. Produces 12_implplan_{slug}.md with a phase-by-phase roadmap and a machine-traversable Task DAG appendix.
---

# /implement-plan — Implementation Plan for AI Coding Agents

Final step of the BA Toolkit pipeline. Reads every artifact produced by the earlier skills and emits a sequenced implementation plan an AI coding agent (Claude Code, Cursor, Codex, …) can execute step by step. The output bridges the gap between the BA artifacts and actual development.

`/implement-plan` is **not the same as** `/sprint`. `/sprint` groups stories into time-based sprints by team velocity for a scrum master. `/implement-plan` produces a dependency-ordered build sequence with per-task file paths, references back to FRs / US / AC, and a tech-stack header — for an AI coding agent that wants to build the project, not for a person planning a quarter.

## Workflow

### 1. Environment detection

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

### 2. Pipeline check

If `12_implplan_*.md` already exists, load it and offer to:
- View the current plan.
- Amend a specific phase (`/revise [phase]`) — regenerates one phase against the latest source artifacts without touching the others.
- Regenerate from scratch.

### 3. Context loading

Read every BA Toolkit artifact present in the output directory. The plan quality scales with how complete the pipeline is.

**Required minimum:**
- `01_brief_*.md` — project name, domain, business goals.
- `02_srs_*.md` — functional requirements (the source of truth for what to build).

**Strongly recommended:**
- `03_stories_*.md` — user-story decomposition for sequencing within phases.
- `05_ac_*.md` — acceptance criteria (drives Definition of Done per task).
- `07_datadict_*.md` — entities for the Data Layer phase.
- `08_apicontract_*.md` — endpoints for the API Surface phase.
- `09_wireframes_*.md` — screens for the UI phase.

**Auto-consumed if present (optional):**
- `00_principles_*.md` — language, ID conventions, Definition of Ready, NFR baseline.
- `00_estimate_*.md` — task sizing hints.
- `00_sprint_*.md` — if a sprint plan exists, use sprint-level dependencies as cross-phase prerequisite hints.
- `00_risks_*.md` — elevate tasks that mitigate Critical / High risks within their phase.
- `06_nfr_*.md` — drives Phase 8 (Quality & NFRs).
- `07a_research_*.md` — primary tech-stack source (see step 4).
- `04_usecases_*.md` — flow context for Phase 4 (Core Domain) tasks.
- `10_scenarios_*.md` — drives Phase 9 (Validation) tasks.
- `11_handoff_*.md` — open items become explicit pre-launch tasks in Phase 9.

If `02_srs_*.md` is missing, **stop**. Tell the user there is nothing to sequence without functional requirements and ask them to run `/srs` first.

### 4. Tech stack resolution

The plan must record an explicit tech stack so an AI coding agent can pick file extensions, framework idioms, and dependency files without guessing.

**Step 1 — `07a_research_*.md` (primary source).** If the research artifact exists, parse the chosen frontend, backend, database, hosting, auth, and integration choices from its sections. Record where each value came from so it appears in the output's "Tech stack" header (`Source: 07a_research`).

**Step 2 — calibration interview (fallback).** If `/research` was not run, OR if `/research` left specific decisions as TBD, run a short calibration interview.

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended) based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/implement-plan` (e.g., `/implement-plan use Next.js, FastAPI, and Postgres on Fly.io`), parse it as the tech-stack hint and skip whichever interview questions it already answers.

Required topics for the calibration interview (skip any topic already answered by `07a_research` or inline context):
1. Frontend stack (framework, language, build tool).
2. Backend / API stack (framework, language, runtime).
3. Database (engine, version, hosting model).
4. Hosting / deployment target.
5. Auth / identity approach (in-house vs. SSO vs. managed service).
6. **Observability platform** — logging, metrics, traces stack (Datadog / New Relic / Grafana / OpenTelemetry self-hosted). Drives Phase 8 (Quality & NFRs) tasks.
7. **CI/CD platform** — GitHub Actions / GitLab CI / CircleCI / Jenkins / other. Drives Phase 1 (Foundation) tasks.
8. **Secret management** — environment variables / Vault / AWS Secrets Manager / Doppler / 1Password CLI. Drives Phase 1 (Foundation) tasks.
9. Mandatory integrations from `02_srs` (carry over verbatim — do not re-decide them).

**Step 3 — TBD slots.** If neither `/research` nor the interview yields a value for a slot (e.g. user picked "Other" without a concrete answer), record `[TBD: <slot>]` in the output's "Tech stack" header AND add a row to the "Open Assumptions" section so the AI coding agent knows it must ask before starting any task that touches that slot.

### 5. Phase derivation

Build a phase ladder from the canonical 9 phases below. **Drop any phase that has no tasks for the current project** — for example, a CLI tool drops Phase 6 (UI), an infra-only project drops Phases 5–6, an analytics dashboard with a managed auth provider can shrink Phase 3 to a single integration task.

Canonical phase order:

1. **Foundation** — repo init, language toolchain, lint / format / test scaffolding, CI skeleton, environment-variable scheme, secret management. **Always present.**
2. **Data Layer** — schema from `07_datadict`, migrations, ORM / query layer, seed data, backup config. Skipped only if no datadict and no entities are inferable from `02_srs`.
3. **Auth & Identity** — sign-up / sign-in / session, SSO / OAuth if mandated by `02_srs` or `06_nfr`, password / token policy, RBAC scaffolding from roles in `02_srs`. Skipped only if `02_srs` has zero auth-related FRs.
4. **Core Domain** — Must-priority FRs and their corresponding US, ordered by `03_stories` epic and dependencies recorded in `02_srs` or `00_sprint`.
5. **API Surface** — endpoints from `08_apicontract` mapped to the core-domain handlers built in Phase 4. Skipped if no API contract artifact.
6. **UI / Wireframes** — screens from `09_wireframes` wired to the API. Skipped if no wireframes artifact.
7. **Integrations** — external systems listed in `02_srs` / `07a_research` (payment provider, email, search, analytics, third-party APIs). One task per integration, naming the integration and the FR it fulfils.
8. **Quality & NFRs** — observability, performance budgets from `06_nfr`, security hardening from `06_nfr`, accessibility checks if domain mandates them (govtech, edtech, healthcare).
9. **Validation & Launch Prep** — end-to-end scenario tests from `10_scenarios`, pre-launch checks from `11_handoff` "Open Items", documentation, deployment runbook.

For each surviving phase, derive:
- **Goal** — one sentence describing the user-facing or build-output outcome ("Stand up the foundation so every later phase has a working CI loop", "Make every Must FR addressable via a typed endpoint").
- **Prerequisites** — which earlier phases must be done. By default phase N depends on phase N−1; cross-phase prerequisites are explicit (e.g. Phase 5 API tasks depend on Phase 2 Data Layer for the entities they read).
- **Reads** — which BA Toolkit artifact files this phase consults.
- **Tasks** — ordered list (see step 6).

### 6. Task derivation

Each task is one atomic, AI-actionable unit of work. Rules:

- **Atomicity:** a task should be completable in 30–120 minutes by an experienced developer. If a derived task is bigger, split it; if smaller, merge with the next task in the same phase.
- **id:** `T-<phase>-<seq>`, e.g. `T-04-007`. Phase number → first segment; sequence → second segment, zero-padded to 3 digits.
- **title:** imperative, ≤ 10 words ("Create `users` table with email-unique constraint", "Implement `POST /auth/login` handler").
- **dependsOn:** list of task ids that must complete first. Defaults to the previous task in the same phase, plus any explicit cross-phase prerequisites. Empty for the first task in Phase 1.
- **parallel:** if this task has the same `dependsOn` as one or more sibling tasks (i.e., they share the same prerequisites and do not depend on each other), mark all of them with `**[parallel]**` next to the title. An AI coding agent can execute `[parallel]` tasks concurrently. Only mark tasks parallel when they are genuinely independent — touching different files, different entities, or different API endpoints with no shared state.
- **references:** list of `FR-NNN`, `US-NNN`, `UC-NNN`, `AC-NNN-NN`, `NFR-NNN`, `Entity:Name`, `Endpoint: METHOD /path`, `WF-NNN`, `SC-NNN` ids that this task implements. **Always at least one.** Phase 1 tasks (Foundation) are the only exception and may reference `01_brief` or `00_principles` as their source.
- **files:** list of file paths the AI agent should create or modify (best-effort; framework-dependent). Optional. Examples: `src/db/schema.sql`, `apps/api/src/auth/login.controller.ts`. **If unknown, omit rather than guess.**
- **definitionOfDone:** bullet list of acceptance hooks. Pull from the linked AC where possible ("AC-001-03 passes", "endpoint returns 401 on invalid credentials"). Always include a type-check / lint hook on backend tasks and a render-state hook on UI tasks.

Within a phase, order tasks so each task's `dependsOn` list points only at tasks already listed. **Risk-elevated tasks come earliest within their phase**: any task whose `references` include an FR / US / NFR linked to a 🔴 Critical or 🟡 High risk in `00_risks_*.md` is pulled to the front of its phase, ahead of equally-prioritised tasks. Rationale: validate risky bets early, when there's still time to pivot. Tag risk-elevated tasks with `**Risk:** RISK-NN ↑` next to their title so the AI agent and the human reviewer both see the elevation reason.

### 7. Generation

**File:** `12_implplan_{slug}.md`

```markdown
# Implementation Plan: {Project Name}

**Domain:** {domain}
**Date:** {date}
**Slug:** {slug}
**Generated from:** {ordered list of artifact filenames actually consumed}

---

## Tech Stack

| Layer | Choice | Source |
|-------|--------|--------|
| Frontend | {value or [TBD]} | 07a_research / interview / TBD |
| Backend | {…} | … |
| Database | {…} | … |
| Hosting | {…} | … |
| Auth | {…} | … |
| Observability (logs / metrics / traces) | {…} | … |
| CI / CD | {…} | … |
| Secret management | {…} | … |
| Mandatory integrations | {…} | … |

---

## How to use this plan (for AI coding agents)

- Phases are ordered. Do not start phase N+1 until every task in phases 1..N is complete (or explicitly waived in writing).
- Within a phase, follow task ids in ascending order unless `dependsOn` says otherwise.
- Tasks marked **[parallel]** share the same prerequisites and do not depend on each other — they can be executed concurrently.
- Every task has a `references` list — read those BA artifact sections before writing code.
- Every task has a `definitionOfDone` — do not mark a task complete until every box is checked.
- The Task DAG appendix is the machine-readable source of truth for dependencies.
- If you encounter a `[TBD]` slot or a task that depends on an open assumption, **stop and ask the user** before generating code.

---

## Phase 1 — Foundation

**Goal:** {one sentence}
**Prerequisites:** —
**Reads:** 01_brief, 00_principles

### T-01-001 — {title}
- **References:** {ids}
- **Files:** {paths or —}
- **Definition of Done:**
  - [ ] {hook 1}
  - [ ] {hook 2}

### T-01-002 — {title}
- **dependsOn:** T-01-001
- **References:** {ids}
- **Files:** {paths or —}
- **Definition of Done:**
  - [ ] {hook 1}

---

## Phase 2 — Data Layer

**Goal:** {one sentence}
**Prerequisites:** Phase 1
**Reads:** 07_datadict, 02_srs

### T-02-001 — {title}
- **References:** Entity:User, FR-001
- **Files:** {paths}
- **Definition of Done:** …

…

---

## Phase 3 — Auth & Identity

…

## Phase 4 — Core Domain

…

## Phase 5 — API Surface

…

## Phase 6 — UI / Wireframes

…

## Phase 7 — Integrations

…

## Phase 8 — Quality & NFRs

…

## Phase 9 — Validation & Launch Prep

…

---

## Open Assumptions

Items the plan could not resolve from existing artifacts. The AI coding agent must ask the user before starting any task that touches them.

- {assumption 1 with reason and which task ids depend on it}
- {assumption 2}

---

## Task DAG (appendix)

Machine-readable dependency graph. A topological sort of this table yields a valid execution order.

| id | phase | title | dependsOn | parallel | references |
|----|-------|-------|-----------|----------|------------|
| T-01-001 | 1 | {title} | — | — | {ids} |
| T-01-002 | 1 | {title} | T-01-001 | ✓ | {ids} |
| T-01-003 | 1 | {title} | T-01-001 | ✓ | {ids} |
| T-02-001 | 2 | {title} | T-01-002, T-01-003 | — | Entity:User, FR-001 |
| … | … | … | … | … | … |
```

### 8. AGENTS.md update

`ba-toolkit init` already created `AGENTS.md` next to where the artifact lives. After saving `12_implplan_{slug}.md`, find the project's `AGENTS.md` (look in cwd first; fall back to walking up the directory tree if cwd has none, for legacy single-project layouts).

**Update only the `## Pipeline Status` row for `/implement-plan`** — toggle its status from `⬜ Not started` to `✅ Done` and fill in the artifact filename in the `File` column. **Do not touch the managed block** (`<!-- ba-toolkit:begin managed -->` … `<!-- ba-toolkit:end managed -->`) — that's owned by `ba-toolkit init`.

If the existing `AGENTS.md` predates v3.4 and has no `/implement-plan` row in its Pipeline Status table, append a new row at stage `12` (the existing rows 0–11 stay as they are, no renumbering). Mention the migration in your reply so the user knows their AGENTS.md was updated.

If you find no `AGENTS.md` at all (neither in cwd nor up the tree), warn the user that the project was likely set up before v3.1 and tell them to run `ba-toolkit init --name "..." --slug {slug}` to scaffold the per-project `AGENTS.md`. Do not create one yourself with arbitrary structure.

### 9. Iterative refinement

- `/clarify [focus]` — targeted ambiguity pass.
- `/revise [phase]` — regenerate one phase against the latest source artifacts without touching the others (mirror of how `/sprint` regenerates one sprint at a time).
- `/expand [phase]` — add more tasks or detail to one phase.
- `/validate` — check that every task has at least one reference, every `dependsOn` id exists in the table, and the Task DAG has no cycles.
- `/done` — finalize and update `AGENTS.md`.

### 10. Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Phase count and total task count (e.g. "8 phases, 47 tasks").
- Tech stack one-liner ("React + FastAPI + Postgres on Fly.io").
- Number of `[TBD]` slots remaining in "Open Assumptions" — if > 0, warn that the AI coding agent will have to stop and ask before touching those areas.
- Length of the longest dependency chain in the Task DAG (so the user has a sense of critical-path depth).

Available commands for this artifact: `/clarify [focus]` · `/revise [phase]` · `/expand [phase]` · `/validate` · `/done`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (look up the row where `Current` is `/implement-plan`). Do not hardcode the next step here — that table is the single source of truth.

## Style

Formal, neutral, imperative. No emoji in the saved file. Phase goals are user-outcome sentences, not task lists. Task titles are imperative verbs ("Create", "Implement", "Wire", "Migrate", "Document"). Definition-of-Done bullets are checkable, not aspirational. Generate the artifact in the language of the user's request; section headings, table headers, and labels also in the user's language. ID columns and code identifiers (`T-04-007`, `FR-001`, `Entity:User`, file paths) stay ASCII.
