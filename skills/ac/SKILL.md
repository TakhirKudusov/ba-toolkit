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

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended) based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/ac` (e.g., `/ac focus on US-007 and US-011`), use it as a story-id filter for which acceptance criteria to draft first.

3–7 topics per round, 2–4 rounds.

**Required topics:**
1. Which business rules should be reflected in AC (limits, formulas, thresholds)?
2. Are negative scenarios needed for each US?
3. Which boundary values are critical?
4. Which US need multiple AC (different roles, states)?
5. Are there data precision requirements (decimal places, formats)?
6. **Performance bounds per scenario** — does any AC carry a response-time / throughput requirement that must be verified at acceptance?
7. **Idempotency** — for action-based scenarios, can the action be safely retried? AC must specify whether duplicate requests produce the same result.
8. **Observability** — what audit log entry, metric, or trace must this scenario produce? Verifiable by inspecting logs, not just the user-facing response.
9. **State transitions** — which entity state changes during the scenario? Links the AC to the entity state machines defined in `/datadict`.

Supplement with domain-specific questions from the reference.

## Generation

**File:** `05_ac_{slug}.md`

The full per-AC field set lives at `references/templates/ac-template.md` and is the single source of truth. Each AC carries: ID (`AC-NNN-NN`), Type (positive / negative / boundary / performance / security), Given / When / Then, Linked US, Linked UC, Linked FR, Linked NFR (for performance/security ACs), Source (which business rule from `02_srs_{slug}.md` drove this AC), and Verification method (automated test / manual test / observed in production). The artifact also carries a US → AC coverage matrix at the bottom.

**Rules:**
- Numbering relative to US: AC-001-01 (first AC for US-001).
- Every US has at least one positive AC.
- Must-priority US have at least one negative AC AND at least one boundary AC.
- Given = specific state. When = single action. Then = verifiable result.
- Avoid vague wording — replace "system handles correctly" with concrete observable behaviour ("response status is 401", "audit log contains entry with action=login_failed", "stock count decremented by exactly the ordered quantity").
- Every AC must reference its source business rule via the `Source` field — no AC without provenance.

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

Available commands for this artifact: `/clarify [focus]` · `/revise [AC-NNN-NN]` · `/expand [US-NNN]` · `/split [AC-NNN-NN]` · `/validate` · `/done`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (row `Current = /ac`). Do not hardcode `/nfr` here.

## Style

Formal, neutral. No emoji, slang. Terms explained on first use. Generate the artifact in the language of the user's request.
