---
name: handoff
description: >
  Generate a development handoff package summarising the entire BA Toolkit pipeline: artifact inventory, MVP scope, open items, top risks, and recommended next steps. Use on /handoff command, or when the user asks to "prepare handoff", "create handoff document", "summarise the pipeline", "package for developers", "ready for development", "export to Jira", "what is left to do", "pipeline summary". Optional final step — available after /wireframes.
---

# /handoff — Development Handoff Package

Optional final step of the BA Toolkit pipeline. Reads all existing artifacts and generates a single handoff document for the development team. No interview — all information is extracted from the pipeline artifacts.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply its conventions.
1. Read all pipeline artifacts from the output directory.
2. Minimum required: `01_brief_*.md` and `02_srs_*.md`. Warn about any missing artifacts and note them as incomplete in the handoff.
3. If `00_trace_*.md` exists, use it as the source of coverage statistics. If not, compute coverage from available artifacts.
4. If `00_analyze_*.md` exists, import its open findings into the handoff.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory. If unavailable, apply the default rule.

## Generation

No interview. All content is derived from the existing artifacts. The full template lives at `references/templates/handoff-template.md` and is the single source of truth — including the full inventory of pipeline-stage and cross-cutting artifacts (`/discovery`, `/principles`, `/implement-plan`, `/sprint`, `/risk`, `/glossary`, `/trace`, `/analyze`, `/estimate`), the Brief Goal → FR / FR → NFR / FR → API forward-traceability tables, the ADR summary, and the formal Sign-off section.

**File:** `11_handoff_{slug}.md`

```markdown
# Development Handoff: {Project Name}

**Version:** 1.0
**Status:** Draft | In Review | Approved
**Date:** {date}
**Domain:** {domain}
**Pipeline completion:** {n}/{total} steps completed

---

## 1. Artifact Inventory

### Pipeline-stage artifacts

| Stage | Artifact | File | Status | Key numbers |
|-------|----------|------|--------|-------------|
| 0 | Discovery | `00_discovery_{slug}.md` | ✓ / ✗ Missing / — Not run | {recommended domain, MVP feature count} |
| 0a | Principles | `00_principles_{slug}.md` | ✓ / ✗ Missing / — Not run | {testing strategy, ID conventions, NFR baseline characteristics} |
| 1 | Project Brief | `01_brief_{slug}.md` | ✓ Complete | {n} goals, {n} stakeholders, {n} risks, {n} assumptions |
| 2 | SRS | `02_srs_{slug}.md` | ✓ Complete | {n} FR ({must}/{should}/{could}/{wont}) |
| 3 | User Stories | `03_stories_{slug}.md` | ✓ Complete | {n} stories across {n} epics |
| 4 | Use Cases | `04_usecases_{slug}.md` | ✓ / ✗ Missing | {n} UC |
| 5 | Acceptance Criteria | `05_ac_{slug}.md` | ✓ / ✗ Missing | {n} AC ({pos}/{neg}/{boundary}/{perf}) |
| 6 | NFR | `06_nfr_{slug}.md` | ✓ / ✗ Missing | {n} NFR across {n} ISO 25010 characteristics |
| 7 | Data Dictionary | `07_datadict_{slug}.md` | ✓ / ✗ Missing | {n} entities, {n} attributes |
| 7a | Research | `07a_research_{slug}.md` | ✓ / ✗ Missing / — Not run | {n} ADRs, {n} integrations |
| 8 | API Contract | `08_apicontract_{slug}.md` | ✓ / ✗ Missing | {n} endpoints |
| 9 | Wireframes | `09_wireframes_{slug}.md` | ✓ / ✗ Missing | {n} screens |
| 10 | Scenarios | `10_scenarios_{slug}.md` | ✓ / ✗ Missing / — Not run | {n} scenarios |
| 11 | Handoff | `11_handoff_{slug}.md` | This document | — |
| 12 | Implementation Plan | `12_implplan_{slug}.md` | ✓ / ✗ Missing / — Not run | {n} phases, {n} tasks |

### Utility artifacts

| Tool | File | Status | Key numbers |
|------|------|--------|-------------|
| Trace | `00_trace_{slug}.md` | ✓ / — Not run | Overall coverage {n}% |
| Analyze | `00_analyze_{slug}.md` | ✓ / — Not run | {n} CRITICAL, {n} HIGH findings |
| Risk | `00_risks_{slug}.md` | ✓ / — Not run | {n} risks ({n} Critical / {n} High) |
| Sprint | `00_sprint_{slug}.md` | ✓ / — Not run | {n} sprints, {n} weeks |
| Glossary | `00_glossary_{slug}.md` | ✓ / — Not run | {n} terms, {n} drift findings |
| Estimate | inline in stories or `00_estimate_{slug}.md` | ✓ / — Not run | {n} SP total ± {confidence band} |

---

## 2. MVP Scope

Must-priority items confirmed for the first release:

### Functional Requirements (Must)
{List of Must FR from SRS with one-line description each}

### User Stories (Must)
{List of Must US with Epic grouping}

---

## 3. Traceability Coverage

| Chain | Coverage |
|-------|----------|
| Brief Goal → FR | {n}% ({uncovered} goals uncovered) |
| FR → US | {n}% ({uncovered} uncovered) |
| US → UC | {n}% |
| US → AC (Positive / Negative / Boundary) | {n}% / {n}% / {n}% |
| FR → NFR | {n}% |
| FR → Entity | {n}% |
| FR → API Endpoint | {n}% |
| US → WF | {n}% |
| US → Scenario | {n}% |
| FR → Implementation Task (if `12_implplan` exists) | {n}% |
| NFR → ADR | {n}% |

{If coverage is below 100% for any CRITICAL chain, list uncovered items explicitly.}

---

## 4. Open Items

{If 00_analyze_{slug}.md or open findings from /validate exist:}

| ID | Severity | Location | Summary |
|----|----------|----------|---------|
| {A1} | CRITICAL | {location} | {summary} |

{If no open items:} No open CRITICAL or HIGH findings. Pipeline is ready for handoff.

---

## 5. Top Risks

{Consolidated from 01_brief risks + any gaps identified during the pipeline:}

| # | Risk | Impact | Source |
|---|------|--------|--------|
| 1 | {risk description} | {High/Medium/Low} | Brief / Analysis |

---

## 6. Recommended Next Steps

1. **Resolve open items** — address any CRITICAL findings listed in section 4 before development begins.
2. **Development environment** — use `07a_research_{slug}.md` (if present) for tech stack decisions and `07_datadict_{slug}.md` for schema initialisation.
3. **Task breakdown** — import Must-priority US from section 2 into your backlog tool (Jira, Linear, GitHub Issues).
4. **Spec-driven implementation** — consider using [Spec Kit](https://github.com/github/spec-kit) with `/speckit.specify` to generate implementation tasks from this handoff.
5. **Validation** — use `10_scenarios_{slug}.md` (if present) for end-to-end acceptance testing scenarios.
6. **Generate the implementation plan** — run `/implement-plan` to produce a phase-and-DAG plan an AI coding agent can execute step by step. Output: `12_implplan_{slug}.md`.

---

## 7. Architecture Decision Summary

Top architectural decisions from `07a_research_{slug}.md`. Dev team should read each linked ADR before starting the corresponding phase.

| ADR | Decision | Drivers | Phase impact |
|-----|----------|---------|--------------|
| ADR-001 | {chosen tech for layer X} | NFR-{NNN}, FR-{NNN} | Phase {N} of `/implement-plan` |
| ADR-002 | {decision} | {drivers} | {phase impact} |

## 8. Artifact Files Reference

All files are located in: `{output_directory}`

```
{file tree of all generated artifacts}
```

## 9. Sign-off

Formal acceptance of the handoff package. Signing this section means the development team agrees the BA package is sufficient to begin implementation.

| Role | Name | Sign-off Date | Notes |
|------|------|---------------|-------|
| Business Analyst | {name} | {date} | {notes} |
| Product Manager | {name} | {date} | {notes} |
| Tech Lead | {name} | {date} | {notes} |
| QA Lead | {name} | {date} | {notes} |
| Stakeholder | {name} | {date} | {notes} |
```

## Iterative refinement

- `/revise [section]` — update a section.
- `/analyze` — run quality analysis before finalising.
- `/trace` — rebuild traceability matrix before finalising.

## Closing message

After saving the artifact, present the following summary (see `references/closing-message.md` for format):

- Saved file path.
- Pipeline completion percentage.
- Count of open CRITICAL/HIGH items.
- Whether the package is ready for handoff or has blockers.

Available commands: `/revise [section]` · `/analyze` · `/trace`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (look up the row where `Current` is `/handoff`). Do not hardcode the next step here — that table is the single source of truth and now points at `/implement-plan` as the canonical follow-up after a handoff.

## Style

Formal, neutral. No emoji in the saved file. Generate in the artifact language. English for IDs, file names, table column headers, and code.
