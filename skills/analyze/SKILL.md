---
name: analyze
description: >
  Cross-artifact quality analysis across all BA Toolkit pipeline artifacts. Use on /analyze command, or when the user asks for "quality check", "analyze artifacts", "find inconsistencies", "cross-artifact check", "check quality", "find duplicates", "terminology check", "coverage analysis", "what is inconsistent". Available at any pipeline stage after /srs. Generates a structured finding report with severity levels.
---

# /analyze — Cross-Artifact Quality Analysis

Utility skill. Performs a read-only analysis across all existing pipeline artifacts and generates a structured finding report. Does not modify artifacts — use `/clarify` or `/revise` to act on findings.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it. Use its traceability requirements (section 3) to set CRITICAL/HIGH/MEDIUM thresholds, its Definition of Ready (section 4) to check mandatory fields, its NFR Baseline (section 5) to flag missing categories, and its quality gate (section 6) to determine which severity blocks `/done`.
1. Read all pipeline artifacts present in the output directory.
2. Minimum required: `02_srs_*.md`. If only `01_brief_*.md` is available, warn that coverage analysis is limited and proceed with what is available.
3. Domain reference is not needed — all information comes from the artifacts themselves.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory. If unavailable, apply the default rule.

## Calibration interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 options plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended), render variants in the user's language (rule 11), and wait for an answer.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/analyze` (e.g., `/analyze focus on security and performance`), parse it as a category-focus hint and run only those categories.

If the user invokes `/analyze` with no inline hint, run a short calibration interview (skip any question already answered by `00_principles_*.md`):

1. **Severity threshold** — which severity blocks `/done`? Read from `00_principles_*.md` §6 if present, otherwise ask. **Recommended:** CRITICAL only.
2. **Categories to include** — all 8 canonical categories, or focus on a subset (e.g., only Coverage Gap and Invalid Reference for a fast pre-handoff sanity check)?
3. **Delta mode** — produce a full report, or a delta against the prior `00_analyze_*.md` (only new findings since the last run)?

## Analysis categories

The 8 canonical categories cover the IEEE 830 §4.3 SRS quality attributes (correct, unambiguous, complete, consistent, verifiable, modifiable, traceable, ranked) plus modern BA concerns (terminology drift, source provenance, validation gaps).

### 1. Duplication (DUP) — *IEEE 830: consistency*
- Functionally equivalent or near-duplicate FRs within SRS.
- User stories that describe the same action for the same role.
- Repeated business rules across multiple artifacts.

### 2. Ambiguity (AMB) — *IEEE 830: unambiguous*
- Requirements containing metrics-free adjectives: "fast", "reliable", "scalable", "secure", "simple", "efficient" without a measurable criterion.
- Underspecified scope: "the system" or "the user" without a concrete actor.
- Conditional requirements without defined conditions.
- Modal verb confusion: inconsistent use of "must / shall / should / may" — IEEE 830 expects strict modal discipline.

### 3. Coverage Gap (GAP) — *IEEE 830: complete + traceable*
- FR without at least one linked US.
- US without linked UC (if Use Cases artifact exists).
- US without AC (if AC artifact exists).
- FR without NFR coverage for cross-cutting concerns (security, performance) where domain-expected.
- Data entities not linked to any FR or US.
- API endpoints not linked to any FR or US.
- Wireframes not linked to any US.
- Tasks (from `12_implplan_*.md`) not linked to any FR/US/AC.

### 4. Terminology Drift (TERM) — *IEEE 830: consistent*
- The same concept referred to by different names across artifacts (e.g., "Wallet" in SRS vs "Balance" in Stories vs "Account" in Data Dictionary).
- Abbreviations expanded differently in different artifacts.

### 5. Invalid Reference (REF) — *IEEE 830: traceable*
- Links to IDs that do not exist (FR-NNN, US-NNN, UC-NNN, etc.).
- References to roles not defined in the SRS roles section.
- API endpoint links in wireframes pointing to non-existent endpoints.
- Brief Goal references (G-N) in the SRS §7 traceability table that do not exist in `01_brief_*.md` §2.

### 6. Inconsistency (INC) — *IEEE 830: consistent*
- Same fact stated differently across artifacts (e.g., `01_brief` says €1.5M GMV target, `02_srs` §1.2 says €2M).
- A constraint in `01_brief` §6 contradicted by an FR in `02_srs` §3.
- Priority disagreement: same item Must in one artifact and Should in another.

### 7. Underspecified Source (SRC) — *post-v3.5.0 provenance discipline*
- FR without `Source` field (introduced in v3.5.0).
- Use Case without `Source` field.
- AC without `Source` field.
- Entity without `Source` or `Owner` field.
- Endpoint without `Source` field.
- Stakeholder name referenced as a source but missing from `01_brief` §5 stakeholders table.

### 8. Stakeholder Validation Gap (VAL) — *post-v3.5.0 assumption discipline*
- Assumption in `01_brief` §7 with no `Owner` or `Validate by` date.
- Assumption past its `Validate by` date and still not converted to a fact or risk.
- Brief goal in §2 with no measurable success metric.

## Generation

**Slug:** read the `**Slug:**` line from the managed block of `AGENTS.md` (project root, or `../AGENTS.md` if cwd is `output/`) and use it verbatim. See [`../references/slug-source.md`](../references/slug-source.md).

**File:** `00_analyze_{slug}.md`

The full report layout lives at `references/templates/analyze-template.md` and is the single source of truth. Each finding carries: ID, Severity, Category (one of the 8 above), Location (artifact + element ID), Description, Recommendation, and **Owner** (which role is accountable for fixing the finding — assigned by `00_principles_*.md` §4 Definition of Ready ownership where applicable, otherwise by domain default).

```markdown
# Cross-Artifact Quality Analysis: {Name}

**Date:** {date}
**Artifacts analyzed:** {list of files found}

## Finding Report

| ID | Category | Severity | Location | Summary | Recommendation | Owner |
|----|----------|----------|----------|---------|----------------|-------|
| A1 | Duplication | HIGH | srs:FR-003, srs:FR-017 | Both describe user authentication | Merge into a single FR | BA |
| A2 | Ambiguity | MEDIUM | srs:NFR-002 | "Low latency" has no metric | Add target value in ms | BA |
| A3 | Coverage Gap | CRITICAL | srs:FR-008 | No linked user story | Create US or remove FR | BA |
| A4 | Terminology | HIGH | srs, stories | "Wallet" vs "Balance" used interchangeably | Standardize in glossary | BA |
| A5 | Invalid Ref | CRITICAL | ac:AC-003-01 | Links US-099 which does not exist | Fix reference | BA |
| A6 | Underspecified Source | HIGH | srs:FR-012 | No `Source` field per v3.5.0+ template | Add Source field | BA |
| A7 | Stakeholder Validation Gap | HIGH | brief:Assumption-3 | No Owner; past Validate by date | Convert to risk or validate | PM |

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

**Severity scale** *(read from `00_principles_*.md` §6 if present, otherwise defaults below):*
- **CRITICAL** — blocks pipeline advancement or handoff (missing mandatory link, non-existent ID, IEEE 830 traceability violation).
- **HIGH** — significant quality risk (duplication, key term drift, missing metric for Must-priority item, Underspecified Source on a Must-priority artifact).
- **MEDIUM** — quality concern, does not block (missing metric for Should-priority, minor overlap, IEEE 830 modifiability concern).
- **LOW** — style or completeness suggestion.

**Rules:**
- Finding IDs are sequential: A1, A2, ...
- Each finding references the exact artifact file and element ID.
- Each finding has an **Owner** assigned (BA / PM / Tech Lead / Designer / Stakeholder name).
- Coverage rows are generated only for artifact pairs where both files exist.
- The report is read-only — no artifacts are modified by `/analyze`. Use `/clarify` or `/revise` to act on findings.

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
