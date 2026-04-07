---
name: ba-trace
description: >
  Build and update the traceability matrix across all BA Toolkit pipeline artifacts: FR ↔ US ↔ UC ↔ AC ↔ NFR ↔ Data Entity ↔ API Endpoint ↔ Wireframe. Use on /trace command, or when the user asks for "traceability matrix", "requirements traceability", "coverage check", "uncovered requirements", "artifact links", "check coverage", "find missing requirements", "what is not covered". Cross-cutting command available at any stage after /stories.
---

# /trace — Traceability Matrix

Cross-cutting command of the BA Toolkit pipeline. Available after `/stories` is complete. Builds a traceability matrix across all existing artifacts.

## Context loading

1. Read all pipeline artifacts from the output directory. Minimum required: `02_srs_*.md` and `03_stories_*.md`.
2. Determine which artifacts are available and adapt matrix columns accordingly.
3. Domain reference not needed for this skill — all information comes from the artifacts.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

## Generation

No interview needed. Information is extracted from existing artifacts automatically.

**File:** `00_trace_{slug}.md`

```markdown
# Traceability Matrix: {Name}

**Date:** {date}
**Artifacts:** {list of found pipeline files}

## Matrix

| FR | US | UC | AC | NFR | Data Entity | API Endpoint | Wireframe |
|----|----|----|----|----|-------------|-------------|-----------|
| FR-001 | US-001, US-002 | UC-001 | AC-001-01 | NFR-003 | User, Bet | POST /bets | WF-005 |

## Coverage Statistics

| Artifact | Total | Covered | Uncovered | Coverage % |
|----------|-------|---------|-----------|------------|

## Uncovered Elements

### FR without linked US
### US without linked UC
### US without AC
### FR without NFR coverage
### Data entities without FR/US link
### API endpoints without FR/US link
### Wireframes without US link

## Recommendations
Specific actions to close coverage gaps.
```

**Rules:**
- Columns include only artifact types that have been created. Missing columns marked with `—`.
- Links extracted from "Linked FR/US" fields in each artifact.
- Inconsistency (link present in one artifact but missing in another) is flagged.
- Coverage: an element is covered if it has at least one link in the next matrix column.

## Iterative refinement

- `/revise` — regenerate (re-read all artifacts).
- `/validate` — extended check: nonexistent IDs, circular dependencies, duplicate links.

## Style

Formal, neutral. No emoji, slang. Generate the artifact in the language of the user's request.
