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

No interview. All content is derived from the existing artifacts.

**File:** `11_handoff_{slug}.md`

```markdown
# Development Handoff: {Project Name}

**Date:** {date}
**Domain:** {domain}
**Pipeline completion:** {n}/{total} steps completed

---

## 1. Artifact Inventory

| Artifact | File | Status | Key numbers |
|----------|------|--------|-------------|
| Project Brief | `01_brief_{slug}.md` | ✓ Complete | {n} goals, {n} risks |
| SRS | `02_srs_{slug}.md` | ✓ Complete | {n} FR ({must}/{should}/{could}/{wont}) |
| User Stories | `03_stories_{slug}.md` | ✓ Complete | {n} stories across {n} epics |
| Use Cases | `04_usecases_{slug}.md` | ✓ / ✗ Missing | {n} UC |
| Acceptance Criteria | `05_ac_{slug}.md` | ✓ / ✗ Missing | {n} AC |
| NFR | `06_nfr_{slug}.md` | ✓ / ✗ Missing | {n} NFR across {n} categories |
| Research | `07a_research_{slug}.md` | ✓ / ✗ Missing / — Not run | {tech decisions} |
| Data Dictionary | `07_datadict_{slug}.md` | ✓ / ✗ Missing | {n} entities, {n} attributes |
| API Contract | `08_apicontract_{slug}.md` | ✓ / ✗ Missing | {n} endpoints |
| Wireframes | `09_wireframes_{slug}.md` | ✓ / ✗ Missing | {n} screens |
| Scenarios | `10_scenarios_{slug}.md` | ✓ / ✗ Missing / — Not run | {n} scenarios |

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
|-------|---------|
| FR → US | {n}% ({uncovered} uncovered) |
| US → UC | {n}% |
| US → AC | {n}% |
| FR → NFR | {n}% |
| Entity → FR/US | {n}% |
| Endpoint → FR/US | {n}% |
| WF → US | {n}% |

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

---

## 7. Artifact Files Reference

All files are located in: `{output_directory}`

```
{file tree of all generated artifacts}
```
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

Pipeline complete. This document is the development handoff package.

## Style

Formal, neutral. No emoji in the saved file. Generate in the artifact language. English for IDs, file names, table column headers, and code.
