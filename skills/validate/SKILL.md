---
name: validate
description: >
  Internal completeness and consistency check for a single BA Toolkit artifact. Use on /validate command, or when the user asks to "validate this artifact", "check completeness", "is this artifact complete", "consistency check", "check if ready", "is it done", "quality gate check". Utility skill available at any pipeline stage after the first artifact exists. Unlike /analyze (cross-artifact), /validate focuses on one artifact at a time.
---

# /validate — Artifact Completeness & Consistency Check

Utility skill. Performs a single-artifact validation pass: checks that the target artifact is internally complete, consistent, and ready to `/done`. Does not generate a new file — reports findings in chat and optionally fixes issues in place.

## Syntax

```
/validate [optional: artifact reference]
```

Examples:
- `/validate` — validate the most recent artifact
- `/validate brief` — validate `01_brief_*.md`
- `/validate srs` — validate `02_srs_*.md`
- `/validate 03_stories_sock-market.md` — validate a specific file

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it. Use its Definition of Ready (section 4) as the primary checklist, its ID conventions (section 2) to validate ID formats, and its quality gate (section 6) to determine which severity blocks `/done`.
1. Identify the target artifact:
   - If the user specifies an artifact name or filename, use it.
   - Otherwise, use the most recently generated artifact in the output directory.
2. Read the target artifact fully.
3. Read prior artifacts for cross-reference spot-checks (roles, terms, IDs referenced from the target).

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory. If unavailable, apply the default rule.

## Slug source

Read `references/slug-source.md` from the `ba-toolkit` directory. Follow its rules to resolve the project slug from `AGENTS.md`.

## Validation checklist

Run the following checks against the target artifact. Each check maps to a severity level.

### Structural checks (CRITICAL if missing)

1. **Metadata present.** The artifact has a title, version, status, domain, date, and slug in the header.
2. **All mandatory sections exist.** Compare the artifact's `## N.` headings against the expected template structure for that artifact type.
3. **ID format consistent.** All element IDs (FR-NNN, US-NNN, UC-NNN, AC-NNN, NFR-NNN, etc.) follow the project's ID convention (from `00_principles_*.md` §2, or the default `XX-NNN` pattern).

### Completeness checks (HIGH if missing)

4. **No placeholder text.** Scan for `(TBD)`, `(TODO)`, `(TBC)`, `(placeholder)`, `(имя основателя)`, `(name)`, empty table cells in required columns.
5. **Definition of Ready.** If `00_principles_*.md` exists, check each element against the DoR checklist for its type (FR, US, UC, AC, NFR). Report which elements fail which DoR criteria.
6. **MoSCoW count consistency.** If the artifact has a MoSCoW summary table and individual priorities, verify that the counts match. Report discrepancies with exact numbers.
7. **Cross-reference validity.** Every ID referenced in the artifact (e.g., `FR-003` in a US's "Linked FR" field) must exist within the artifact or in a prior artifact. Flag dangling references.

### Consistency checks (MEDIUM)

8. **Role consistency.** Roles/actors used in the artifact must match the roles defined in the SRS roles section or the brief stakeholders section. Flag unknown roles.
9. **Glossary term usage.** Terms that appear in the glossary (if `00_glossary_*.md` exists) should be used consistently. Flag variant spellings or undefined terms.
10. **Priority distribution.** If every element is marked "Must", warn that the prioritization may not be meaningful.

### Style checks (LOW)

11. **Empty sections.** Sections that exist but contain no content.
12. **Orphan elements.** Elements with no cross-references to or from other elements within the artifact.

## Output format

Present findings grouped by severity, with a summary count at the top:

```
Validation results for `{artifact_file}`:

| Severity | Count |
|----------|-------|
| CRITICAL | N     |
| HIGH     | N     |
| MEDIUM   | N     |
| LOW      | N     |

### CRITICAL

1. **V-001** [Structural] MoSCoW summary says 25 Must, but 34 FRs are marked Must.
   → Fix: update the summary table in §6.

### HIGH

2. **V-002** [Completeness] FR-012 has no Source field.
   → Fix: add `Source: G-2` (brief goal 2).

...
```

If all checks pass, report:

```
✓ Validation passed for `{artifact_file}` — no issues found. Ready to `/done`.
```

## Auto-fix offer

After presenting findings, offer to fix issues automatically:

- If CRITICAL or HIGH findings exist: "Found {N} issues. Want me to fix them? (yes / no / pick specific V-NNN IDs)"
- If only MEDIUM/LOW: "Found {N} minor issues. Want me to fix them, or proceed to `/done`?"

When fixing, update the artifact in place. After each fix, confirm what changed in one line.

## Closing message

After validation (and optional fixes), present the following summary (see `references/closing-message.md` for format):

- Artifact file path.
- Summary of findings by severity.
- Whether the artifact passes the `/done` gate (no CRITICAL findings remaining).

Available commands: `/validate` (re-run) · `/clarify [focus]` · `/revise [section]` · `/done`

No pipeline advancement — return to the current artifact's workflow.

## Style

Formal, neutral. Findings must reference exact element IDs and section numbers. Generate output in the language of the artifact.
