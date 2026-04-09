# User Stories: [PROJECT_NAME]

**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**References:** `01_brief_[SLUG].md`, `02_srs_[SLUG].md`

## Epic Index

| # | Epic | User Stories |
|---|------|--------------|
| E-01 | [Epic name] | US-001 – US-00N |

---

## E-01: [Epic Name]

> [One-sentence description of the epic's goal.]

### US-001: [Story title]

**As** [Persona — named persona with role and one-line context, e.g. "Maria, ops supervisor at a 50-warehouse 3PL handling 200 returns/week"],
**I want to** [action],
**so that** [benefit].

**Persona:** [name + role + context]
**Acceptance Criteria:** → `05_ac_[SLUG].md` → US-001
**FR Reference:** FR-[NNN]
**Priority:** Must | Should | Could | Won't
**Business Value Score:** 1–5  *(captures relative ranking within the same MoSCoW tier)*
**Size:** XS | S | M | L | XL
**Depends on:** US-[NNN], US-[NNN]  *(or `—` if independent)*
**Definition of Ready:** [checklist or "see `00_principles_[SLUG].md` §4 / §6"]
**INVEST self-check:** Independent ✓ · Negotiable ✓ · Valuable ✓ · Estimable ✓ · Small ✓ · Testable ✓
**Notes:** [Edge cases, out-of-scope clarifications.]

---

### US-002: [Story title]

**As** [Persona],
**I want to** [action],
**so that** [benefit].

**Persona:** [name + role + context]
**Acceptance Criteria:** → `05_ac_[SLUG].md` → US-002
**FR Reference:** FR-[NNN]
**Priority:** Must | Should | Could | Won't
**Business Value Score:** 1–5
**Size:** XS | S | M | L | XL
**Depends on:** —
**Definition of Ready:** [checklist or reference]
**INVEST self-check:** Independent ✓ · Negotiable ✓ · Valuable ✓ · Estimable ✓ · Small ✓ · Testable ✓
**Notes:** [Edge cases, out-of-scope clarifications.]

<!-- Repeat US block for each story. Numbering: US-001, US-002, ... -->

---

## Coverage Summary

### By priority

| Priority | Story Count | Story IDs |
|----------|-------------|-----------|
| Must     | [n] | US-001, … |
| Should   | [n] | … |
| Could    | [n] | … |
| Won't    | [n] | … |

### FR → Story coverage matrix

Forward traceability from each Functional Requirement in `02_srs_[SLUG].md` to the User Stories that implement it. Every Must-priority FR must have at least one Must-priority story; uncovered FRs are flagged here as `(uncovered)`.

| FR ID | FR Title (from SRS) | Linked Stories | Coverage Status |
|-------|---------------------|----------------|-----------------|
| FR-001 | [title] | US-001, US-007 | ✓ |
| FR-002 | [title] | US-003 | ✓ |
| FR-003 | [title] | (uncovered) | ✗ |

**Total stories:** [N]
**Total epics:** [N]
