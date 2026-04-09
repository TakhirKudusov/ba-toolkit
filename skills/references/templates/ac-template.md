# Acceptance Criteria: [PROJECT_NAME]

**Version:** 0.1
**Status:** Draft
**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**References:** `03_stories_[SLUG].md`, `04_usecases_[SLUG].md`, `02_srs_[SLUG].md`

---

## US-001: [Story Title]

> As a [persona], I want to [action], so that [benefit].

### AC-001-01: [Happy path scenario name]

**Type:** Positive
**Source:** [business rule from `02_srs_[SLUG].md` FR-NNN, or stakeholder name]
**Verification:** Automated test | Manual test | Observed in production

**Given** [precondition — concrete state, not "the system is ready"]
**When** [action — single, observable trigger]
**Then** [expected result — concrete and verifiable, not "the system handles it"]

**Links:** US-001, UC-[NNN], FR-[NNN]

---

### AC-001-02: [Negative scenario name]

**Type:** Negative
**Source:** [business rule]
**Verification:** Automated test

**Given** [precondition]
**When** [action]
**Then** [expected error response, error code, user-facing message]

**Links:** US-001, UC-[NNN], FR-[NNN]

---

### AC-001-03: [Boundary scenario name]

**Type:** Boundary
**Source:** [business rule with the limit]
**Verification:** Automated test

**Given** [precondition at the boundary value]
**When** [action]
**Then** [expected behaviour at the boundary — does it allow or reject?]

**Links:** US-001, FR-[NNN]

---

### AC-001-04: [Performance scenario name, if applicable]

**Type:** Performance
**Source:** NFR-[NNN]
**Verification:** Load test | APM measurement
**Linked NFR:** NFR-[NNN]

**Given** [load condition — concurrent users, request rate]
**When** [action]
**Then** [response time / throughput target, e.g. "p95 latency < 300ms"]

**Links:** US-001, NFR-[NNN]

---

**Definition of Done for US-001:**
- [ ] All ACs above pass
- [ ] Edge case [X] handled
- [ ] UI matches wireframe WF-[NNN]
- [ ] Audit log entry produced for AC-001-01 path

---

## US-002: [Story Title]

> As a [persona], I want to [action], so that [benefit].

### AC-002-01: [Happy path]

**Type:** Positive
**Source:** [business rule]
**Verification:** Automated test

**Given** [precondition]
**When** [action]
**Then** [expected result]

**Links:** US-002, FR-[NNN]

<!-- Repeat AC block per scenario. Each US-NNN section mirrors the stories artifact. -->

---

## US → AC Coverage Matrix

Forward traceability from each User Story in `03_stories_[SLUG].md` to its Acceptance Criteria. Every Must-priority story must have at least one positive AC AND at least one negative AC AND at least one boundary AC; uncovered combinations are flagged.

| US ID | Positive AC | Negative AC | Boundary AC | Performance AC | Coverage Status |
|-------|-------------|-------------|-------------|----------------|-----------------|
| US-001 | AC-001-01 | AC-001-02 | AC-001-03 | AC-001-04 | ✓ Full |
| US-002 | AC-002-01 | (missing) | (missing) | — | ⚠ Positive only |
| US-003 | (missing) | (missing) | (missing) | — | ✗ Uncovered |
