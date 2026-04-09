# Use Cases: [PROJECT_NAME]

**Version:** 0.1
**Status:** Draft
**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**References:** `01_brief_[SLUG].md`, `02_srs_[SLUG].md`, `03_stories_[SLUG].md`

## Use Case Index

| ID | Title | Goal in Context | Primary Actor | Linked Stories |
|----|-------|-----------------|---------------|----------------|
| UC-001 | [Title] | G-1 | [Actor] | US-[NNN] |

---

## UC-001: [Use Case Title]

**ID:** UC-001
**Goal in Context:** [Which Brief goal G-N from `01_brief_[SLUG].md` §2 this UC serves. Required.]
**Scope:** System | Subsystem | Component
**Level:** User-goal | Summary | Subfunction
**Primary Actor:** [Role]
**Supporting Actors:** [Other roles or external systems — payment provider, notification service, etc.]

**Stakeholders and Interests:**

| Stakeholder | Interest |
|-------------|----------|
| [Primary actor] | [What they want from this UC] |
| [Other stakeholder] | [What they want / what they want to avoid] |

**Pre-conditions:**
- [Condition that must be true before the use case starts]

**Trigger:** [What event or action initiates this use case]

**Source:** US-[NNN] | FR-[NNN] | regulatory requirement | parent UC-NNN  *(Required — what drove this UC into existence.)*

### Main Success Scenario

| Step | Actor | Action / System Response |
|------|-------|--------------------------|
| 1 | [Actor] | [Does something] |
| 2 | System | [Responds with something] |
| 3 | [Actor] | [Continues] |

### Extensions / Alternative Flows

**Alt 1 — [Name]:** At step [N], if [condition], then [action]. Resume at step [M].

### Exception Flows

**Exc 1 — [Name]:** At step [N], if [error condition], then [system response, recovery action, and final outcome].

### Post-conditions

**Success Guarantees:** [What is true after the Main Success Scenario completes — the contract for the happy path.]

**Minimal Guarantees:** [What is true after *any* termination of the UC, including failure — e.g. "stock reservation released, no partial order created, audit log entry written".]

**Linked Stories:** US-[NNN], US-[NNN]
**Linked FR:** FR-[NNN]
**Linked AC:** AC-[NNN]-[NN], AC-[NNN]-[NN]
**Linked Wireframe:** WF-[NNN]

<!-- Repeat UC block for each use case. Numbering: UC-001, UC-002, ... -->

---

## US → UC Coverage Matrix

Forward traceability from each User Story in `03_stories_[SLUG].md` to the Use Cases that detail it. Every Must-priority story should have at least one linked UC; uncovered stories are flagged here as `(uncovered)` so they cannot silently fall through to AC without UC context.

| US ID | US Title | Linked UCs | Coverage Status |
|-------|----------|------------|-----------------|
| US-001 | [title] | UC-001, UC-007 | ✓ |
| US-002 | [title] | UC-003 | ✓ |
| US-003 | [title] | (uncovered) | ✗ |
