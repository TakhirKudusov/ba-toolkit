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

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row **Recommended** based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/scenarios` (e.g., `/scenarios focus on the new-user onboarding journey`), use it to scope which end-to-end scenarios to draft.

1 round, 3–5 topics.

**Required topics:**
1. Coverage priority — generate scenarios for Must-priority US only, or include Should as well?
2. Negative paths — include error and edge-case journeys alongside happy paths?
3. Persona depth — use generic role names (e.g., "Player") or named personas with context (e.g., "Andrei, a new player from Germany")?
4. Platform — which platform does the primary scenario run on (web / mobile / Telegram Mini App)?
5. Demo focus — are any scenarios intended for a stakeholder demo? If so, which flows should be highlighted?

## Generation

**File:** `10_scenarios_{slug}.md`

```markdown
# Validation Scenarios: {Project Name}

**Date:** {date}
**Coverage:** {Must / Must + Should} priority user stories
**Platform:** {web | mobile | Telegram Mini App | all}

---

## SC-{NNN}: {Scenario Title}

**Persona:** {Role or named persona with brief context}
**Entry point:** {Where the journey starts — screen, URL, or trigger}
**Goal:** {What the user is trying to achieve}
**Linked US:** US-{NNN}, US-{NNN}
**Type:** {happy path | negative | edge case}

### Steps

| # | User action | System response | Screen (WF) | API call | AC verified |
|---|-------------|-----------------|-------------|----------|-------------|
| 1 | {what the user does} | {what the system shows/does} | WF-{NNN} | {METHOD /path} | AC-{NNN}-{NN} |
| 2 | … | … | … | … | … |

### Expected outcome
{Specific, observable result — what the user sees or receives at the end of the scenario.}

### Failure conditions
{Conditions under which this scenario fails and what the user should see instead.}

---

_(Repeat SC block for each scenario.)_

## Coverage Summary

| US | Scenario(s) | Happy path | Negative path |
|----|-------------|------------|---------------|
| US-001 | SC-001, SC-002 | ✓ | ✓ |
| US-002 | SC-003 | ✓ | — |
```

**Rules:**
- Numbering: SC-001, SC-002, ...
- Every Must-priority US must have at least one happy-path scenario.
- Each step must reference a WF screen if wireframes were generated.
- Each step must reference the AC it verifies (if applicable).
- API calls reference endpoints from `08_apicontract_{slug}.md` using the exact method and path.
- Failure conditions are mandatory for each scenario.

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

Pipeline complete. Proceed to `/handoff` to package all artifacts for development.

## Style

Formal, neutral. No emoji, slang. Generate in the artifact language. Persona names, screen labels, and API paths remain in their original language/format.
