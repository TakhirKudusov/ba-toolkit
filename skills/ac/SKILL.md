---
name: ac
description: >
  Generate Acceptance Criteria in Given/When/Then (Gherkin) format for each User Story. Use on /ac command, or when the user asks for "acceptance criteria", "given when then", "gherkin scenarios", "write AC", "definition of done", "how to verify a story", "test scenarios for stories". Fifth step of the BA Toolkit pipeline.
---

# /ac — Acceptance Criteria

Fifth step of the BA Toolkit pipeline. Generates AC in Given/When/Then (Gherkin) format.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply its conventions (artifact language, ID format, traceability requirements, Definition of Ready, quality gate threshold).
1. Read `01_brief_*.md`, `02_srs_*.md`, `03_stories_*.md`, `04_usecases_*.md`. If usecases missing, warn and suggest `/usecases`.
2. Extract: slug, domain, US list, UC list, business rules, roles.
3. If domain supported, load `references/domains/{domain}.md`, section `5. /ac`.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

## Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, offer 3–5 domain-appropriate options (load `references/domains/{domain}.md` for the ones that fit), always include a free-text "Other" option as the last choice, and wait for an answer before asking the next question.

3–7 topics per round, 2–4 rounds.

**Required topics:**
1. Which business rules should be reflected in AC (limits, formulas, thresholds)?
2. Are negative scenarios needed for each US?
3. Which boundary values are critical?
4. Which US need multiple AC (different roles, states)?
5. Are there data precision requirements (decimal places, formats)?

Supplement with domain-specific questions from the reference.

## Generation

**File:** `05_ac_{slug}.md`

```markdown
# Acceptance Criteria: {Name}

## US-{NNN}: {Short description}

### AC-{NNN}-{NN}: {Scenario name}
**Type:** {positive | negative | boundary}
- **Given** {initial state}
- **When** {action}
- **Then** {expected result}

**Links:** US-{NNN}, UC-{NNN}
```

**Rules:**
- Numbering relative to US: AC-001-01 (first AC for US-001).
- Every US has at least one positive AC.
- Must-priority US have at least one negative AC.
- Given = specific state. When = single action. Then = verifiable result.
- Avoid vague wording — replace "system handles correctly" with concrete behavior.

## Back-reference update

After generation, update `03_stories_{slug}.md`: fill the "Acceptance Criteria" field in each US with links to the corresponding AC-{NNN}-{NN}.

## Iterative refinement

- `/revise [AC-NNN-NN]` — rewrite.
- `/expand [US-NNN]` — add AC.
- `/split [AC-NNN-NN]` — split compound AC.
- `/clarify [focus]` — targeted ambiguity pass.
- `/validate` — all US have AC; links correct; Given/When/Then present; stories file updated.
- `/done` — finalize. Next step: `/nfr`.

## Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Total number of AC generated: breakdown by type (positive / negative / boundary).
- Count of user stories covered.
- Confirmation that back-references in `03_stories_{slug}.md` were updated.

Available commands: `/clarify [focus]` · `/revise [AC-NNN-NN]` · `/expand [US-NNN]` · `/split [AC-NNN-NN]` · `/validate` · `/done`

Next step: `/nfr`

## Style

Formal, neutral. No emoji, slang. Terms explained on first use. Generate the artifact in the language of the user's request.
