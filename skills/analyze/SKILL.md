---
name: ba-analyze
description: >
  Cross-artifact quality analysis across all BA Toolkit pipeline artifacts. Use on /analyze command, or when the user asks for "quality check", "analyze artifacts", "find inconsistencies", "cross-artifact check", "check quality", "find duplicates", "terminology check", "coverage analysis", "what is inconsistent". Available at any pipeline stage after /srs. Generates a structured finding report with severity levels.
---

# /analyze — Cross-Artifact Quality Analysis

Cross-cutting command. Performs a read-only analysis across all existing pipeline artifacts and generates a structured finding report. Does not modify artifacts — use `/clarify` or `/revise` to act on findings.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it. Use its traceability requirements (section 3) to set CRITICAL/HIGH/MEDIUM thresholds, its Definition of Ready (section 4) to check mandatory fields, its NFR Baseline (section 5) to flag missing categories, and its quality gate (section 6) to determine which severity blocks `/done`.
1. Read all pipeline artifacts present in the output directory.
2. Minimum required: `02_srs_*.md`. If only `01_brief_*.md` is available, warn that coverage analysis is limited and proceed with what is available.
3. Domain reference is not needed — all information comes from the artifacts themselves.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory. If unavailable, apply the default rule.

## Analysis categories

### 1. Duplication (DUP)
- Functionally equivalent or near-duplicate FRs within SRS.
- User stories that describe the same action for the same role.
- Repeated business rules across multiple artifacts.

### 2. Ambiguity (AMB)
- Requirements containing metrics-free adjectives: "fast", "reliable", "scalable", "secure", "simple", "efficient" without a measurable criterion.
- Underspecified scope: "the system" or "the user" without a concrete actor.
- Conditional requirements without defined conditions.

### 3. Coverage Gap (GAP)
- FR without at least one linked US.
- US without linked UC (if Use Cases artifact exists).
- US without AC (if AC artifact exists).
- FR without NFR coverage for cross-cutting concerns (security, performance) where domain-expected.
- Data entities not linked to any FR or US.
- API endpoints not linked to any FR or US.
- Wireframes not linked to any US.

### 4. Terminology Drift (TERM)
- The same concept referred to by different names across artifacts (e.g., "Wallet" in SRS vs "Balance" in Stories vs "Account" in Data Dictionary).
- Abbreviations expanded differently in different artifacts.

### 5. Invalid Reference (REF)
- Links to IDs that do not exist (FR-NNN, US-NNN, UC-NNN, etc.).
- References to roles not defined in the SRS roles section.
- API endpoint links in wireframes pointing to non-existent endpoints.

## Generation

**File:** `00_analyze_{slug}.md`

```markdown
# Cross-Artifact Quality Analysis: {Name}

**Date:** {date}
**Artifacts analyzed:** {list of files found}

## Finding Report

| ID | Category | Severity | Location | Summary | Recommendation |
|----|----------|----------|----------|---------|----------------|
| A1 | Duplication | HIGH | srs:FR-003, srs:FR-017 | Both describe user authentication | Merge into a single FR |
| A2 | Ambiguity | MEDIUM | srs:NFR-002 | "Low latency" has no metric | Add target value in ms |
| A3 | Coverage Gap | CRITICAL | srs:FR-008 | No linked user story | Create US or remove FR |
| A4 | Terminology | HIGH | srs, stories | "Wallet" vs "Balance" used interchangeably | Standardize in glossary |
| A5 | Invalid Ref | CRITICAL | ac:AC-003-01 | Links US-099 which does not exist | Fix reference |

## Coverage Summary

| Artifact pair | Total source | Covered | Uncovered | Coverage % |
|---------------|-------------|---------|-----------|------------|
| FR → US | {n} | {n} | {n} | {%} |
| US → UC | {n} | {n} | {n} | {%} |
| US → AC | {n} | {n} | {n} | {%} |
| FR → NFR | {n} | {n} | {n} | {%} |
| Entity → FR/US | {n} | {n} | {n} | {%} |
| Endpoint → FR/US | {n} | {n} | {n} | {%} |
| WF → US | {n} | {n} | {n} | {%} |

_(Rows for artifact pairs where the second artifact has not yet been created are omitted.)_

## Priority Actions

Top 5 highest-severity items to address first, with recommended commands:
1. {Finding ID} — {summary} → `/clarify FR-NNN` or `/revise [section]`
```

**Severity scale:**
- **CRITICAL** — blocks pipeline advancement or handoff (missing mandatory link, non-existent ID).
- **HIGH** — significant quality risk (duplication, key term drift, missing metric for Must-priority item).
- **MEDIUM** — quality concern, does not block (missing metric for Should-priority, minor overlap).
- **LOW** — style or completeness suggestion.

**Rules:**
- Finding IDs are sequential: A1, A2, ...
- Each finding references the exact artifact file and element ID.
- Coverage rows are generated only for artifact pairs where both files exist.
- The report is read-only — no artifacts are modified.

## Iterative refinement

- `/analyze` again — regenerate after fixes to track progress.
- `/clarify [FR-NNN or focus]` — resolve specific ambiguities from the report.
- `/revise [section in artifact]` — fix a specific finding.
- `/trace` — rebuild the full traceability matrix after fixes.

## Closing message

After saving the report, present the following summary (see `references/closing-message.md` for format):

- Saved file path.
- Total findings by severity: CRITICAL / HIGH / MEDIUM / LOW.
- Overall coverage percentage (lowest across all artifact pairs).
- Top 3 recommended actions with specific commands.

Available commands: `/clarify [focus]` · `/revise [section]` · `/trace` · `/analyze` (re-run after fixes)

No pipeline advancement — this is a quality checkpoint, not a pipeline step.

## Style

Formal, neutral. No emoji, slang. Generate output in the language of the artifacts. Element IDs, file names, and table column headers remain in English.
