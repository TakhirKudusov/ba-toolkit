---
name: expand
description: >
  Add more depth and detail to an under-developed section of a BA Toolkit artifact. Use on /expand command, or when the user asks to "expand this section", "add more detail", "flesh out", "elaborate on", "go deeper on", "add depth to", "develop further". Utility skill available at any pipeline stage after the first artifact exists.
---

# /expand — Section Expansion

Utility skill. Adds depth, detail, and coverage to a thin or under-developed section of the target artifact. Updates the artifact in place; does not generate a new file.

## Syntax

```
/expand [section reference] [optional: inline guidance]
```

Examples:
- `/expand risks` — expand the risks section of the most recent artifact
- `/expand §7` — expand section 7
- `/expand §3.2 add edge cases for payment failures` — expand with specific direction
- `/expand assumptions in brief` — expand the assumptions section of the brief
- `/expand FR-003` — expand a specific functional requirement with more detail

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it.
1. Identify the target artifact:
   - If the user specifies an artifact name (e.g., "in brief", "in srs"), use it.
   - Otherwise, use the most recently generated artifact in the output directory.
2. Read the target artifact fully.
3. Read prior artifacts for context that can inform the expansion.
4. Load the domain reference (`references/domains/{domain}.md`) if available — domain-specific knowledge helps generate richer content.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory. If unavailable, apply the default rule.

## Slug source

Read `references/slug-source.md` from the `ba-toolkit` directory. Follow its rules to resolve the project slug from `AGENTS.md`.

## Section identification

Use the same identification strategy as `/revise`:

1. **Section number.** `§3`, `section 3`, `§3.2`.
2. **Section name keyword.** `risks`, `constraints`, `assumptions`, `glossary`.
3. **Element ID.** `FR-003`, `US-012` — expand that specific element.

If the section cannot be identified, ask the user to clarify.

## Expansion workflow

### Step 1 — Assess current state

Read the target section and assess what is thin or missing:

- **Tables with few rows** — can more rows be added based on the domain reference, prior artifacts, or industry knowledge?
- **Single-sentence descriptions** — can they be expanded with acceptance criteria, edge cases, or examples?
- **Missing sub-sections** — does the template for this artifact type include sub-sections that are absent?
- **Bare elements** — elements with only required fields but no optional fields (Source, Rationale, Verification method, etc.)?

### Step 2 — Generate expansion

If the user provided inline guidance, follow it. Otherwise, use domain knowledge and prior artifacts to determine what to add.

Follow these rules:

1. **Add, don't replace.** Preserve all existing content. New content is appended or inserted at the appropriate position.
2. **Follow the artifact's conventions.** Match ID scheme, heading levels, table columns, and language.
3. **Ground in prior artifacts.** Every new element (FR, risk, assumption, etc.) should trace back to something in a prior artifact or in the domain reference. Do not invent requirements that contradict existing decisions.
4. **Respect MoSCoW.** New elements added during expansion are typically Should or Could priority unless the user explicitly marks them higher.
5. **Update counts.** If the artifact has a summary table with counts (e.g., MoSCoW distribution), update it after adding new elements.

### Step 3 — Present and confirm

Before saving, present a summary of what will be added:

```
Expanding §{N}: {section title}

Adding:
- {N} new {element type}(s): {brief list}
- {N} fields enriched on existing elements
- Sub-section "{name}" added

Total section size: {before} → {after} elements.

Apply? (yes / adjust — describe what to change)
```

For small expansions (fewer than 3 changes), skip the confirmation and apply directly with a one-line acknowledgment.

### Step 4 — Save

Save the updated artifact. Bump the version (e.g., `0.1` → `0.2`) and update the date.

## Closing message

After saving, present the following summary (see `references/closing-message.md` for format):

- Saved file path.
- Summary of what was added (element counts, new sub-sections).
- Any new cross-references created.

Available commands: `/expand [section]` (expand another section) · `/validate` · `/clarify [focus]` · `/revise [section]` · `/done`

No pipeline advancement — return to the current artifact's workflow.

## Style

Formal, neutral. Generate output in the language of the artifact.
