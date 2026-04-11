---
name: trace
description: >
  Build and update the traceability matrix across all BA Toolkit pipeline artifacts: FR ↔ US ↔ UC ↔ AC ↔ NFR ↔ Data Entity ↔ API Endpoint ↔ Wireframe. Use on /trace command, or when the user asks for "traceability matrix", "requirements traceability", "coverage check", "uncovered requirements", "artifact links", "check coverage", "find missing requirements", "what is not covered". Utility skill available at any stage after /stories.
---

# /trace — Traceability Matrix

Utility skill. Available after `/stories` is complete. Builds a traceability matrix across all existing artifacts.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it. Use its traceability requirements (section 3) to determine which links are CRITICAL, HIGH, or MEDIUM severity when flagging gaps. The principles file is the source of truth for severity thresholds — `/trace` does not invent its own.
1. Read all pipeline artifacts from the output directory. Minimum required: `02_srs_*.md` and `03_stories_*.md`. Auto-consume any of: `00_discovery_*.md`, `00_principles_*.md`, `04_usecases_*.md`, `05_ac_*.md`, `06_nfr_*.md`, `07_datadict_*.md`, `07a_research_*.md`, `08_apicontract_*.md`, `09_wireframes_*.md`, `10_scenarios_*.md`, `11_handoff_*.md`, `12_implplan_*.md`.
2. Determine which artifacts are available and adapt matrix columns accordingly. The implementation plan (`12_implplan_*.md`) introduces a new traceability column: FR → Task (T-NN-NNN), so the chain is now `FR → US → UC → AC → NFR → Entity → ADR → API → WF → SC → Task`.
3. Domain reference not needed for this skill — all information comes from the artifacts.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

## Calibration interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 options plus a free-text "Other" row last (5 rows max), mark exactly one row **Recommended**, render variants in the user's language (rule 11), and wait for an answer.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/trace` (e.g., `/trace forward only, focus on FR→US`), parse it as the focus hint and skip the matching questions.

If the user invokes `/trace` with no inline hint, ask the following short calibration interview (skip any question already answered by inline context or by `00_principles_*.md`):

1. **Direction** — forward (FR → downstream), reverse (downstream → FR), or bidirectional (both)? **Recommended:** bidirectional, because senior BA practice always produces both directions.
2. **Scope** — full pipeline, or focus on a specific artifact pair (e.g., FR → API only)?
3. **Severity-thresholds source** — use the thresholds from `00_principles_*.md` §3 if it exists, or apply the defaults (Must FR with no US = CRITICAL, Should FR with no US = HIGH, Could FR with no US = MEDIUM, Won't FR uncovered = LOW)?

## Generation

**File:** `00_trace_{slug}.md`

The full per-axis matrix layout lives at `references/templates/trace-template.md` and is the single source of truth. The artifact carries: a Forward Traceability matrix (FR → all downstream artifacts), a Reverse Traceability matrix (US, UC, AC, NFR, Entity, API, WF, SC, Task → FR), Coverage Gaps grouped by severity (Critical / High / Medium / Low per the principles thresholds), Coverage Statistics per artifact pair, and Recommended Actions sorted by severity.

**Rules:**
- Columns include only artifact types that have been created. Missing columns marked with `—`.
- **Both forward and reverse traceability are produced by default.** Forward catches "what does this requirement become?", reverse catches "why does this artifact exist?" — a senior BA needs both directions to validate provenance.
- Links extracted from `Linked FR`, `Source`, and `Linked US` fields in each artifact (per the v3.5.0+ provenance template fields).
- Inconsistency (link present in one artifact but missing in another) is flagged as a separate finding.
- **Severity is read from `00_principles_*.md` §3** if present; otherwise default thresholds apply (Must = CRITICAL on uncovered, Should = HIGH, Could = MEDIUM, Won't = LOW).
- Coverage: an element is covered if it has at least one link in the relevant downstream column. Orphaned elements in any direction are flagged at their stated severity.

## Iterative refinement

- `/revise` — regenerate (re-read all artifacts).
- `/validate` — extended check: nonexistent IDs, circular dependencies, duplicate links.

## Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Overall coverage percentage per artifact type.
- Count of uncovered FRs, orphan US, and US without AC.
- Specific recommendations to close the highest-severity gaps.

Available commands: `/revise` (regenerate) · `/validate` · `/analyze` (full quality report)

No further pipeline step — use `/analyze` for a detailed cross-artifact quality report.

## Style

Formal, neutral. No emoji, slang. Generate the artifact in the language of the user's request.
