---
name: ba-usecases
description: >
  Generate Use Cases (Cockburn format) based on User Stories. Use on /usecases command, or when the user asks for "use cases", "scenarios", "describe scenarios", "interaction flows", "main and alternative flows", "describe system behavior", "user interaction scenario". Fourth step of the BA Toolkit pipeline.
---

# /usecases — Use Cases

Fourth step of the BA Toolkit pipeline. Generates Use Cases in simplified Cockburn format.

## Context loading

1. Read `01_brief_*.md`, `02_srs_*.md`, `03_stories_*.md`. If stories missing, warn and suggest `/stories`.
2. Extract: slug, domain, roles (actors), US list, FR list, business rules.
3. If domain supported, load `references/domains/{domain}.md`, section `4. /usecases`.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

## Interview

3–7 questions per round, 2–4 rounds.

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
- `/validate` — all Must-US covered; references correct; actors consistent.
- `/done` — finalize. Next step: `/ac`.

## Style

Formal, neutral. No emoji, slang. Terms explained on first use. Generate the artifact in the language of the user's request.
