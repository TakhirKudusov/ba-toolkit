---
name: nfr
description: >
  Generate Non-functional Requirements (NFR): performance, security, availability, scalability, compliance, localization. Use on /nfr command, or when the user asks for "non-functional requirements", "NFR", "performance requirements", "security requirements", "SLA", "compliance requirements", "load requirements", "uptime requirements", "regulatory requirements", "GDPR". Sixth step of the BA Toolkit pipeline.
---

# /nfr — Non-functional Requirements

Sixth step of the BA Toolkit pipeline. Generates NFR with measurable metrics.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply its conventions (artifact language, ID format, traceability requirements, Definition of Ready, quality gate threshold). Pay special attention to section 5 (NFR Baseline) — all listed categories are mandatory for this project.
1. Read `01_brief_*.md`, `02_srs_*.md`, `03_stories_*.md`. SRS is the minimum requirement.
2. Extract: slug, domain, integrations, roles, FR list.
3. If domain supported, load `references/domains/{domain}.md`, section `6. /nfr`. Use mandatory NFR categories for the domain.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

## Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row **Recommended** based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/nfr` (e.g., `/nfr emphasise security and compliance`), use it as a category hint for which NFR areas to prioritise.

3–7 topics per round, 2–4 rounds.

**Required topics:**
1. Performance — target CCU (Concurrent Users), RPS (Requests Per Second), acceptable response time?
2. Availability — required SLA? Acceptable downtime? Maintenance windows?
3. Security — encryption, authentication, access audit?
4. Compliance — applicable standards and laws? Data retention?
5. Scalability — expected growth, horizontal scaling?
6. Compatibility — browsers, OS, devices?

Supplement with domain-specific questions and mandatory categories from the reference.

## Generation

**File:** `06_nfr_{slug}.md`

```markdown
# Non-functional Requirements: {Name}

## NFR-{NNN}: {Category} — {Short Description}
- **Category:** {performance | security | availability | scalability | compatibility | localization | compliance | audit | ...}
- **Description:** {detailed description}
- **Metric:** {measurable criterion}
- **Verification Method:** {how it will be tested}
- **Priority:** {Must | Should | Could | Won't}
- **Linked FR/US:** {references}
```

**Rules:**
- Numbering: NFR-001, NFR-002, ...
- Every NFR must have a measurable metric. Avoid "the system should be fast."
- Group by category.
- Domain-specific mandatory categories from the reference.

## Back-reference update

After generation, update section 5 of `02_srs_{slug}.md` with links to specific NFR-{NNN}.

## Iterative refinement

- `/revise [NFR-NNN]` — rewrite.
- `/expand [category]` — add NFR.
- `/clarify [focus]` — targeted ambiguity pass (especially useful for surfacing NFR without measurable metrics).
- `/validate` — mandatory categories covered; every NFR has a metric; links correct.
- `/done` — finalize. Next step: `/datadict`.

## Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Total number of NFR generated, grouped by category.
- Confirmation that section 5 of `02_srs_{slug}.md` was updated with NFR links.
- Any categories flagged as missing or lacking measurable metrics.

Available commands for this artifact: `/clarify [focus]` · `/revise [NFR-NNN]` · `/expand [category]` · `/validate` · `/done`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (row `Current = /nfr`). Do not hardcode `/datadict` here.

## Style

Formal, neutral. No emoji, slang. Terms explained on first use. Generate the artifact in the language of the user's request.
