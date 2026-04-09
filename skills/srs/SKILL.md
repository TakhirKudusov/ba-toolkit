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
3. If a matching `references/domains/{domain}.md` file exists (currently: `saas`, `fintech`, `ecommerce`, `healthcare`, `logistics`, `on-demand`, `social-media`, `real-estate`, `igaming`, `edtech`, `govtech`, `ai-ml`), load it and apply its section `2. /srs`.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

## Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row **Recommended** based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/srs` (e.g., `/srs focus on the payments module first`), parse it as a scope hint and use it to prioritise which functional areas you ask about.

3–7 topics per round, 2–4 rounds. Do not re-ask information already known from the brief.

**Required topics:**
1. User roles — which roles interact with the system?
2. **Authentication and authorisation model** — how do users authenticate (password / SSO / SAML / OIDC / passwordless)? RBAC or ABAC? Preset roles or custom? Multi-factor for which roles?
3. External integrations — which systems require connection?
4. Multi-language and multi-currency support — if applicable.
5. Regulatory requirements — which standards and laws apply?
6. **Data ownership and stewardship** — who owns each data class? Who can read it? Who can correct it? Who is liable if it leaks?
7. **Audit and logging** — which events must be logged for SOC 2 / SOX / regulatory audit? What is the log retention period?
8. **Data retention and deletion** — how long is each data class retained? What is the deletion policy under GDPR right-to-erasure (and equivalent local laws)?
9. **Reporting needs** — which reports must the system produce, for whom, on what cadence, in what format?
10. Prioritization method — MoSCoW (Must, Should, Could, Won't) or other.
11. Key business rules — limits, thresholds, calculation formulas.

Supplement with domain-specific questions and typical functional areas from the reference.

## Generation

**File:** `02_srs_{slug}.md`

```markdown
# Software Requirements Specification (SRS): {Name}

**Version:** 0.1
**Status:** Draft | In Review | Approved
**Domain:** {domain}
**Date:** {date}
**Slug:** {slug}
**Reference:** 01_brief_{slug}.md

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

**Grouping rule:** FRs are grouped by feature area as `### 3.N [Area name]` subsections (e.g. `### 3.1 Authentication`, `### 3.2 Catalog`, `### 3.3 Checkout`). Each area gets a reserved numeric range (FR-001..099 for area 1, FR-100..199 for area 2, FR-200..299 for area 3, …). New FRs added later go into their area's free numbers, not the global tail — IDs stay stable.

### 3.1 [Feature area]

#### FR-{NNN}: {Title}
- **Description:** [What the system must do.]
- **Actor:** [Role that triggers or benefits from this requirement.]
- **Input:** [What data or event initiates this.]
- **Output / Result:** [What the system produces or changes.]
- **Business Rules:** [Formulas, limits, conditions.]
- **Source:** [Which stakeholder, brief goal, regulatory requirement, or parent FR-NNN drove this requirement. Required for traceability.]
- **Verification:** Test | Demo | Inspection | Analysis
- **Rationale:** [Why this requirement exists. Not what — why. Helps future maintainers know what is safe to push back on.]
- **Priority:** Must | Should | Could | Won't

## 4. Interface Requirements
### 4.1 User Interfaces
### 4.2 Software Interfaces (API)
### 4.3 External System Interfaces

## 5. Non-functional Requirements
_(detailed in /nfr artifact)_

## 6. Priority Matrix (MoSCoW)

| Priority | FR Count | FR IDs |
|----------|----------|--------|
| Must     | [n]      | …      |
| Should   | [n]      | …      |
| Could    | [n]      | …      |
| Won't    | [n]      | …      |

## 7. Traceability — Brief Goal → FR

Forward traceability from the Project Brief's business goals to the FRs that satisfy them. Every Brief goal must have at least one linked FR; uncovered goals are flagged.

| Goal ID | Goal Description (from 01_brief) | Linked FRs |
|---------|----------------------------------|------------|
| G1      | [goal from brief §2]             | FR-001, FR-007, FR-014 |
| G2      | [goal from brief §2]             | FR-003 |
```

FR numbering: sequential within each feature area, three-digit, with reserved ranges per area (FR-001..099 for area 1, FR-100..199 for area 2, …). New FRs inserted later use the next free number in their area's range, not the global tail — IDs stay stable.

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

Available commands for this artifact: `/clarify [focus]` · `/revise [section]` · `/expand [section]` · `/split [FR-NNN]` · `/validate` · `/done`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (look up the row where `Current` is `/srs`). Do not hardcode `/stories` here — copy the four `→` lines verbatim from the lookup table row.

## Style

Formal, neutral. No emoji, slang. Terms explained in parentheses on first use. Generate the artifact in the language of the user's request.
