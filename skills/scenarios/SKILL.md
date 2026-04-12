---
name: scenarios
description: >
  Generate end-to-end validation scenarios linking user stories, acceptance criteria, API endpoints, and wireframes into complete user journeys for acceptance testing. Use on /scenarios command, or when the user asks for "validation scenarios", "end-to-end scenarios", "user journeys", "acceptance test scenarios", "E2E scenarios", "test cases", "walkthrough scenarios", "happy path scenarios", "test the product", "QA scenarios". Optional step — run after /wireframes.
---

# /scenarios — Validation Scenarios

Optional step after `/wireframes`. Generates end-to-end user journeys that can be used for acceptance testing, UX walkthroughs, and stakeholder demos. Each scenario traces a complete user path from entry point to outcome, linking US, AC, API endpoints, and wireframes.

Scenarios are not unit or integration tests — they describe observable behavior from the user's perspective.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply its conventions.
1. Read `01_brief_*.md`, `03_stories_*.md`, `05_ac_*.md`, `09_wireframes_*.md`. Stories and AC are required; wireframes strongly recommended.
2. If `08_apicontract_*.md` exists, use it to link API calls within steps.
3. Extract: slug, domain, roles, Must-priority US list, AC per US, WF per US, API endpoints.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory. If unavailable, apply the default rule.

## Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended) based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/scenarios` (e.g., `/scenarios focus on the new-user onboarding journey`), use it to scope which end-to-end scenarios to draft.

1 round, 3–5 topics.

**Required topics:**
1. Coverage priority — generate scenarios for Must-priority US only, or include Should as well?
2. Negative paths — include error and edge-case journeys alongside happy paths?
3. Persona depth — use generic role names (e.g., "Player") or named personas with context (e.g., "Andrei, a new player from Germany")?
4. Platform — which platform does the primary scenario run on (web / mobile / Telegram Mini App)?
5. Demo focus — are any scenarios intended for a stakeholder demo? If so, which flows should be highlighted?
6. **Frequency** — how often does this scenario run in production? Rare = lower test priority; common = higher test investment.
7. **Stakes / blast radius** — what's the cost of failure for this scenario? Data loss? Lost revenue? Reputation damage? Drives test frequency and recovery investment.
8. **Recovery scenarios** — what happens after a system crash or network drop mid-scenario? Are there scenarios that test the recovery path itself?

## Generation

**Slug:** read the `**Slug:**` line from the managed block of `AGENTS.md` (project root, or `../AGENTS.md` if cwd is `output/`) and use it verbatim. See [`../references/slug-source.md`](../references/slug-source.md).

**File:** `10_scenarios_{slug}.md`

The full per-scenario field set lives at `references/templates/scenarios-template.md` and is the single source of truth. Each scenario carries: ID (`SC-NNN`), Title, Persona (named with context), Type (happy / negative / edge / performance / security), Priority (P1 / P2 / P3), Entry point, Platform, **Source** (Linked US, Linked FR, Linked NFR), Linked AC, Steps table, Expected Outcome, Failure Conditions. The artifact carries a coverage matrix at the bottom showing US, AC scenario, FR, NFR, and WF coverage.

**Rules:**
- Numbering: SC-001, SC-002, ...
- Every Must-priority US must have at least one happy-path scenario AND at least one negative scenario.
- Each step must reference a WF screen if wireframes were generated.
- Each step must reference the AC it verifies (if applicable).
- API calls reference endpoints from `08_apicontract_{slug}.md` using the exact method and path.
- Failure conditions are mandatory for each scenario — what the user sees if the scenario fails, and what recovery action exists.
- Every scenario carries an explicit **Linked FR** and (if applicable) **Linked NFR** so a scenario validates both functional and quality concerns.

## Iterative refinement

- `/revise [SC-NNN]` — rewrite a scenario.
- `/expand [SC-NNN]` — add more steps or paths.
- `/split [SC-NNN]` — separate a long scenario into focused ones.
- `/clarify [focus]` — targeted ambiguity pass.
- `/validate` — all Must-US covered; AC links correct; WF references exist; API paths match contract.
- `/done` — finalize.

## Closing message

After saving the artifact, present the following summary (see `references/closing-message.md` for format):

- Saved file path.
- Total number of scenarios generated, broken down by type (happy path / negative / edge case).
- Count of Must-priority US covered.
- Any Must-priority US without a scenario.

Available commands: `/clarify [focus]` · `/revise [SC-NNN]` · `/expand [SC-NNN]` · `/split [SC-NNN]` · `/validate` · `/done`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (look up the row where `Current` is `/scenarios`). Do not hardcode the next step here — that table is the single source of truth.

## Style

Formal, neutral. No emoji, slang. Generate the artifact in the language of the user's request — see `references/language-rule.md` for what to translate and what stays in English. Persona names, screen labels, and API paths remain in their original language/format.
