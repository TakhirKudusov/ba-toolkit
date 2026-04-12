---
name: revise
description: >
  Rewrite a specific section of a BA Toolkit artifact with new feedback. Use on /revise command, or when the user asks to "revise a section", "rewrite this part", "update section", "fix section", "change section", "rework this", "apply feedback". Accepts a section name, section number, or an /analyze finding ID. Utility skill available at any pipeline stage after the first artifact exists.
---

# /revise — Section Rewrite

Utility skill. Rewrites a specific section (or resolves a specific finding) in the target artifact based on the user's feedback. Updates the artifact in place; does not generate a new file.

## Syntax

```
/revise [section reference or finding ID] [optional: inline feedback]
```

Examples:
- `/revise §6` — revise section 6 of the most recent artifact
- `/revise risks` — revise the risks section
- `/revise A1` — resolve finding A1 from the latest `/analyze` report
- `/revise §3 add more detail about payment processing` — revise with inline direction
- `/revise V-002` — resolve finding V-002 from the latest `/validate` report
- `/revise section 7 in brief` — revise section 7 of the brief specifically

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it. Use its conventions for maintaining consistency during the rewrite.
1. Identify the target artifact:
   - If the user specifies an artifact name (e.g., "in brief", "in srs"), use it.
   - If the user specifies a finding ID (e.g., `A1`, `V-002`), locate the finding in `00_analyze_*.md` or the last `/validate` output, and use the artifact referenced by that finding.
   - Otherwise, use the most recently generated artifact in the output directory.
2. Read the target artifact fully.
3. Read prior artifacts for cross-reference context (roles, terms, IDs).
4. If the user referenced an `/analyze` finding, read `00_analyze_*.md` to understand the finding details and recommendation.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory. If unavailable, apply the default rule.

## Slug source

Read `references/slug-source.md` from the `ba-toolkit` directory. Follow its rules to resolve the project slug from `AGENTS.md`.

## Section identification

Identify the target section using one of these strategies (in order of priority):

1. **Section number.** `§3`, `section 3`, `§3.2` — match the `## 3.` or `### 3.2` heading.
2. **Section name keyword.** `risks`, `constraints`, `stakeholders`, `MoSCoW`, `glossary` — match the closest heading by keyword.
3. **Finding ID.** `A1`, `A2`, `V-001` — read the finding's `Location` field to identify the section and element.
4. **Element ID.** `FR-003`, `US-012` — find the element and its containing section.

If the section cannot be identified, ask the user to clarify.

## Revision workflow

### Step 1 — Understand the change

If the user provided inline feedback (e.g., `/revise §3 add payment processing details`), use it directly.

If the user provided only a section reference, ask one focused question:

```
Section {N}: {section title} — {current content summary in one line}.

What should change? (Describe the update, or type "apply A1" to use an /analyze recommendation.)
```

If the user referenced a finding ID, extract the finding's `Recommendation` field and confirm:

```
Finding {ID}: {summary}. Recommendation: {recommendation}.

Apply this recommendation? (yes / adjust — type your version)
```

### Step 2 — Rewrite

Rewrite the identified section following these rules:

1. **Preserve structure.** Keep the same heading level, table format, and element ID scheme.
2. **Preserve unchanged content.** Only modify what needs to change. Do not rewrite adjacent sections.
3. **Maintain cross-references.** If the rewrite changes an element ID, update all internal references within the artifact.
4. **Follow artifact conventions.** Match the style, language, and format of the rest of the artifact.
5. **Update metadata.** Bump the artifact version (e.g., `0.1` → `0.2`) and update the date.

### Step 3 — Ripple-effect check

Before saving, check whether the change affects other artifacts:

- A changed role definition affects `/srs` Roles, `/stories` personas, `/usecases` actors, `/scenarios` personas.
- A changed business rule affects `/srs` business rules, `/ac` Given/When/Then conditions, `/datadict` constraints, `/apicontract` validation rules.
- A changed FR affects `/stories` (linked FR), `/usecases` (linked FR), `/ac` (linked US → FR), `/nfr` (if the FR had NFR implications).
- A removed or renumbered element affects every artifact that references its ID.

If ripple effects are detected, list the affected files and offer to update them:

```
This change affects {N} other artifact(s):
- `02_srs_*.md` — roles section references the changed role
- `03_stories_*.md` — 2 stories link to the modified FR

Update them now? (yes / no / pick files)
```

### Step 4 — Save

Save the updated artifact. If the user approved ripple-effect updates, save those too.

## Closing message

After saving, present the following summary (see `references/closing-message.md` for format):

- Saved file path(s).
- Summary of what changed (section, element count, nature of change).
- Any ripple-effect updates applied or deferred.

Available commands: `/revise [section]` (revise another section) · `/validate` · `/clarify [focus]` · `/done`

No pipeline advancement — return to the current artifact's workflow.

## Style

Formal, neutral. Generate output in the language of the artifact — see `references/language-rule.md` for what to translate and what stays in English.
