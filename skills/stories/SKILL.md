---
name: stories
description: >
  Generate User Stories based on the SRS. Format: "As a [role], I want [action], so that [value]". Use on /stories command, or when the user asks for "user stories", "create stories", "write user stories", "story decomposition", "epics and stories", "backlog", "break requirements into stories". Third step of the BA Toolkit pipeline.
---

# /stories — User Stories

Third step of the BA Toolkit pipeline. Generates User Stories from functional requirements in the SRS.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply its conventions (artifact language, ID format, traceability requirements, Definition of Ready, quality gate threshold).
1. Read `01_brief_*.md` and `02_srs_*.md`. If SRS is missing, warn and suggest `/srs`.
2. Extract: slug, domain, roles, FR list, business rules, priorities.
3. If domain is supported, load `references/domains/{domain}.md`, section `3. /stories`.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

## Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended) based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/stories` (e.g., `/stories focus on the onboarding epic`), parse it as a scope hint and use it to narrow which areas you draft user stories for.

3–7 topics per round, 2–4 rounds.

**Required topics:**
1. Which user flows are most critical?
2. Are there edge cases requiring separate stories?
3. Is an Epic → Feature → Story hierarchy needed?
4. Are there specific personas for roles?
5. What is the Definition of Ready for a story?

Supplement with domain-specific questions and typical epics from the reference.

## Generation

**File:** `03_stories_{slug}.md`

The full template lives at `references/templates/stories-template.md` and is the single source of truth for the per-story field set. The fields are:

- **Persona** — named persona with role and one-line context (e.g. "Maria, ops supervisor at a 50-warehouse 3PL handling 200 returns/week"). Personas, not bare job titles.
- **Action** — the atomic capability the persona wants.
- **Value** — the business outcome the persona gets.
- **Business Value Score** — 1–5 (or High / Med / Low). Captures relative ranking *within* the same MoSCoW priority tier so PMs can sequence inside a tier.
- **Priority** — MoSCoW (Must | Should | Could | Won't).
- **Size** — XS | S | M | L | XL.
- **Linked FR** — FR-NNN (cross-reference to `02_srs_{slug}.md`).
- **Depends on** — US-NNN list of stories that must complete before this one can start, or `—` if independent. Critical for sprint planning.
- **Acceptance Criteria** — `→ 05_ac_{slug}.md → US-NNN` (detailed in `/ac`).
- **Definition of Ready** — checklist or "see `00_principles_{slug}.md`".
- **INVEST self-check** — one line confirming the story passes Independent / Negotiable / Valuable / Estimable / Small / Testable.
- **Notes** — edge cases, out-of-scope clarifications.

**Rules:**
- Sequential numbering: US-001, US-002, ...
- One story = one atomic action by one persona.
- All Must-priority FR from SRS must have at least one US.
- **INVEST is the quality gate.** A story that fails any of the six INVEST criteria must be revised or split. `/split` should be used when a story violates **Small** or **Independent**, or when it matches one of Mike Cohn's nine story-splitting patterns (workflow steps, business-rule variations, happy / unhappy paths, data variations, simple-vs-complex, deferred performance, CRUD operations, input options, or break-out a spike).

## Iterative refinement

- `/revise [US-NNN or section]` — rewrite.
- `/expand [US-NNN]` — add detail.
- `/split [US-NNN]` — split into smaller stories.
- `/clarify [focus]` — targeted ambiguity pass.
- `/validate` — all FR covered; no orphan stories; numbering correct; personas consistent; **every story passes the INVEST checklist** (Independent, Negotiable, Valuable, Estimable, Small, Testable).
- `/done` — finalize. Next step: `/usecases`.

## Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Total number of user stories generated, grouped by Epic and MoSCoW priority.
- Count of Must-priority FR covered.
- Any stories flagged for `/split` due to complexity.

Available commands for this artifact: `/clarify [focus]` · `/revise [US-NNN]` · `/expand [US-NNN]` · `/split [US-NNN]` · `/validate` · `/done`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (row `Current = /stories`). Do not hardcode `/usecases` here.

## Style

Formal, neutral. No emoji, slang. Terms explained on first use. Generate the artifact in the language of the user's request.
