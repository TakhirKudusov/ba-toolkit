---
name: done
description: >
  Finalize the current artifact and advance to the next pipeline step. Use on /done command, or when the user says "done with this", "finalize", "lock this artifact", "move on", "next step", "mark as done", "approve this artifact". Gates on CRITICAL findings from /validate or /analyze. Updates AGENTS.md pipeline status.
---

# /done — Finalize & Advance

Utility skill. Finalizes the current artifact, updates `AGENTS.md`, and presents the next pipeline step. This is the only refinement skill that advances the pipeline.

## Syntax

```
/done [optional: artifact reference]
```

Examples:
- `/done` — finalize the most recent artifact
- `/done brief` — finalize the brief specifically
- `/done srs` — finalize the SRS

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it. Use its quality gate (section 6) to determine which severity blocks finalization.
1. Identify the target artifact:
   - If the user specifies an artifact name, use it.
   - Otherwise, use the most recently generated artifact in the output directory.
2. Read the target artifact fully.
3. Read `AGENTS.md` to find the pipeline status table.
4. If `00_analyze_*.md` exists, check for unresolved CRITICAL findings against this artifact.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory. If unavailable, apply the default rule.

## Slug source

Read `references/slug-source.md` from the `ba-toolkit` directory. Follow its rules to resolve the project slug from `AGENTS.md`.

## Finalization workflow

### Step 1 — Quality gate check

Before finalizing, run a lightweight validation:

1. **Check for CRITICAL findings.** If `00_analyze_*.md` exists and contains unresolved CRITICAL findings for this artifact, block finalization:

```
Cannot finalize — {N} CRITICAL finding(s) remain:
- A1: MoSCoW counts mismatch in §6
- A5: FR-012 referenced but does not exist

Fix these with `/revise` or `/validate`, then retry `/done`.
```

2. **Quick completeness scan.** Check for placeholder text (`(TBD)`, `(TODO)`, empty required fields). If found, warn but do not block:

```
⚠ {N} placeholder(s) found — consider resolving before finalizing:
- §5: "(имя основателя)" in stakeholders table
- FR-018: Source field is "(TBD)"

Finalize anyway? (yes / fix first)
```

3. **If no blockers**, proceed to finalization.

### Step 2 — Update artifact metadata

Update the artifact header:

- **Version:** bump to `1.0` (or the next whole number if already versioned).
- **Status:** change from `Draft` to `Approved`.
- **Date:** update to today's date.

### Step 3 — Update AGENTS.md

Find the `## Pipeline Status` table in `AGENTS.md`. Update the row for the current skill:

- **Status:** `⬜ Not started` or `🔄 In progress` → `✅ Done`
- **File:** fill in the artifact filename (e.g., `output/01_brief_sock-market.md`)

**Do not touch the managed block** (`<!-- ba-toolkit:begin managed -->` … `<!-- ba-toolkit:end managed -->`) — that is owned by `ba-toolkit init`.

### Step 4 — Present next step

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md`. Look up the row where `Current` matches the skill that produced the finalized artifact, and present the four `→` lines:

```
✓ Artifact finalized: `{file_path}` — Version 1.0, Status: Approved.

AGENTS.md updated: {skill} → ✅ Done.

Next step: /{next_command}

  → What it produces: {description}
  → Output file: {NN}_{name}_{slug}.md
  → Time estimate: {min}–{max} minutes
  → After that: /{step_after_next} ({description})
```

If the finalized artifact is from `/implement-plan` (the last pipeline step), present:

```
✓ Artifact finalized: `{file_path}` — Version 1.0, Status: Approved.

Pipeline complete. Hand `12_implplan_{slug}.md` to your AI coding agent (Claude Code, Cursor, Windsurf, Codex, Gemini) to begin implementation.
```

## Edge cases

- **Artifact already finalized.** If the artifact's Status is already `Approved` and AGENTS.md already shows `✅ Done`, inform the user and do nothing.
- **Multiple artifacts pending.** `/done` finalizes one artifact at a time. If the user wants to finalize multiple, they run `/done` once per artifact.
- **No AGENTS.md.** Warn the user that the project was likely not scaffolded with `ba-toolkit init`. Finalize the artifact metadata but skip the AGENTS.md update.

## Style

Formal, neutral. Generate output in the language of the artifact.
