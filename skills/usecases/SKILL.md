---
name: usecases
description: >
  Generate Use Cases (Cockburn format) based on User Stories. Use on /usecases command, or when the user asks for "use cases", "scenarios", "describe scenarios", "interaction flows", "main and alternative flows", "describe system behavior", "user interaction scenario". Fourth step of the BA Toolkit pipeline.
---

# /usecases — Use Cases

Fourth step of the BA Toolkit pipeline. Generates Use Cases in simplified Cockburn format.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply its conventions (artifact language, ID format, traceability requirements, Definition of Ready, quality gate threshold).
1. Read `01_brief_*.md`, `02_srs_*.md`, `03_stories_*.md`. If stories missing, warn and suggest `/stories`.
2. Extract: slug, domain, roles (actors), US list, FR list, business rules.
3. If domain supported, load `references/domains/{domain}.md`, section `4. /usecases`.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

## Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row **Recommended** based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/usecases` (e.g., `/usecases focus on admin flows`), use it as a scope hint for which use cases to draft.

3–7 topics per round, 2–4 rounds.

**Required topics:**
1. Detail level — summary, user-goal, subfunction?
2. Which alternative flows are most critical?
3. Which exceptional flows (errors) must be formalized?
4. Which external systems act as actors?
5. Grouping — which US should be combined into a single UC?

Supplement with domain-specific questions and typical exceptional flows from the reference.

## Generation

**File:** `04_usecases_{slug}.md`

```markdown
# Use Cases: {Name}

## UC-{NNN}: {Title}
- **Actor:** {primary actor}
- **Level:** {user-goal | summary | subfunction}
- **Linked US:** US-{NNN}
- **Preconditions:**
  1. {condition}
- **Trigger:** {event}
- **Main Flow:**
  1. {Actor performs action.}
  2. {System responds.}
- **Alternative Flows:**
  - {N}a: {description}
- **Exceptional Flows:**
  - {N}e: {description}
- **Postconditions:**
  - Success: {result}
  - Failure: {result}
```

**Rules:**
- Numbering: UC-001, UC-002, ...
- Each UC linked to at least one US.
- Steps: "Actor does X" / "System does Y".
- Alternative flows reference main flow step numbers.

## Iterative refinement

- `/revise [UC-NNN]` — rewrite.
- `/expand [UC-NNN]` — add flows.
- `/split [UC-NNN]` — split.
- `/clarify [focus]` — targeted ambiguity pass.
- `/validate` — all Must-US covered; references correct; actors consistent.
- `/done` — finalize. Next step: `/ac`.

## Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Total number of use cases generated.
- Count of alternative and exceptional flows documented.
- External system actors identified.

Available commands for this artifact: `/clarify [focus]` · `/revise [UC-NNN]` · `/expand [UC-NNN]` · `/split [UC-NNN]` · `/validate` · `/done`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (row `Current = /usecases`). Do not hardcode `/ac` here.

## Style

Formal, neutral. No emoji, slang. Terms explained on first use. Generate the artifact in the language of the user's request.
