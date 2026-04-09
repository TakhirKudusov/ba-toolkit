---
name: srs
description: >
  Generate a Software Requirements Specification (SRS) based on the Project Brief. Adapted IEEE 830 format. Use on /srs command, or when the user asks for "requirements specification", "SRS", "functional requirements", "system requirements", "describe requirements", "write a technical specification". Second step of the BA Toolkit pipeline.
---

# /srs — Requirements Specification

Second step of the BA Toolkit pipeline. Generates an SRS adapted from IEEE 830.

**Scope boundary:** The SRS describes *what* the system must do and *why* — functional requirements, roles, business rules, and interface contracts at a logical level. It does not prescribe *how* to build it: technology stack, DBMS choice, cloud provider, infrastructure, and architecture decisions belong in `/research` (step 7a). If the user mentions specific technologies during the interview, note them as constraints or assumptions, not as requirements.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply its conventions (artifact language, ID format, traceability requirements, Definition of Ready, quality gate threshold).
1. Read `01_brief_*.md` from the output directory. If missing, warn and suggest running `/brief`.
2. Extract: slug, domain, business goals, functionality, stakeholders, constraints, glossary.
3. If a matching `references/domains/{domain}.md` file exists (currently: `saas`, `fintech`, `ecommerce`, `healthcare`, `logistics`, `on-demand`, `social-media`, `real-estate`, `igaming`), load it and apply its section `2. /srs`.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

## Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of 3–5 domain-appropriate options, always include a free-text "Other" row as the last option, and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/srs` (e.g., `/srs focus on the payments module first`), parse it as a scope hint and use it to prioritise which functional areas you ask about.

3–7 topics per round, 2–4 rounds. Do not re-ask information already known from the brief.

**Required topics:**
1. User roles — which roles interact with the system?
2. External integrations — which systems require connection?
3. Multi-language and multi-currency support — if applicable.
4. Regulatory requirements — which standards and laws apply?
5. Prioritization method — MoSCoW (Must, Should, Could, Won't) or other.
6. Key business rules — limits, thresholds, calculation formulas.

Supplement with domain-specific questions and typical functional areas from the reference.

## Generation

**File:** `02_srs_{slug}.md`

```markdown
# Software Requirements Specification (SRS): {Name}

## 1. Introduction
### 1.1 Purpose
### 1.2 Scope
### 1.3 Definitions and Abbreviations
### 1.4 Document References

## 2. General Description
### 2.1 Product Context
### 2.2 User Roles
### 2.3 Constraints
### 2.4 Assumptions and Dependencies

## 3. Functional Requirements
### FR-{NNN}: {Title}
- **Description:** ...
- **Actor:** ...
- **Input:** ...
- **Output / Result:** ...
- **Business Rules:** ...
- **Priority:** Must | Should | Could | Won't

## 4. Interface Requirements
### 4.1 User Interfaces
### 4.2 Software Interfaces (API)
### 4.3 External System Interfaces

## 5. Non-functional Requirements
_(detailed in /nfr artifact)_

## 6. Priority Matrix (MoSCoW)
```

FR numbering: sequential, three-digit (FR-001, FR-002, ...).

## AGENTS.md update

After `/done`, find the project's `AGENTS.md` (look in cwd first; fall back to walking up the directory tree for legacy v3.0 single-project layouts). **Update only the `## Pipeline Status` row for `/srs`** — toggle its status from `⬜ Not started` to `✅ Done` and fill in the artifact filename (`02_srs_{slug}.md`) in the `File` column. **Do not touch the managed block** (`<!-- ba-toolkit:begin managed -->` … `<!-- ba-toolkit:end managed -->`) — that's owned by `ba-toolkit init`. **Do not add `## Artifacts` / `## Key context` sections** — those are not part of the v3.1+ template.

If you find no `AGENTS.md` at all, warn the user that the project was likely set up before v3.1 and tell them to run `ba-toolkit init --name "..." --slug {slug}` to scaffold the per-project file. Do not create one yourself with arbitrary structure.

## Iterative refinement

- `/revise [section]` — rewrite.
- `/expand [section]` — add detail.
- `/split [FR-NNN]` — split a large requirement.
- `/clarify [focus]` — targeted ambiguity pass.
- `/validate` — all brief functions covered by FR; no duplicates; roles consistent.
- `/done` — finalize and update `AGENTS.md`. Next step: `/stories`.

## Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Total number of functional requirements (FR) generated, broken down by MoSCoW priority.
- User roles identified.
- External integrations and regulatory requirements captured.

Available commands: `/clarify [focus]` · `/revise [section]` · `/expand [section]` · `/split [FR-NNN]` · `/validate` · `/done`

Next step: `/stories`

## Style

Formal, neutral. No emoji, slang. Terms explained in parentheses on first use. Generate the artifact in the language of the user's request.
