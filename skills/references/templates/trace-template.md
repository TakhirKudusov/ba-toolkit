# Traceability Matrix: [PROJECT_NAME]

**Version:** 0.1
**Status:** Draft
**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**Direction:** Forward + Reverse (bidirectional)
**Severity source:** `00_principles_[SLUG].md` §3 (or defaults if absent)
**References:** All artifacts `01_brief_[SLUG].md` → `12_implplan_[SLUG].md`

---

## Forward Traceability: FR → Downstream Artifacts

| FR | Title | US | UC | AC | NFR | Entity | ADR | API | WF | SC | Task |
|----|-------|----|----|----|-----|--------|-----|-----|----|----|------|
| FR-001 | [Title] | US-[NNN] | UC-[NNN] | AC-[NNN]-[NN] | NFR-[NNN] | [Entity] | ADR-[NNN] | `POST /[ep]` | WF-[NNN] | SC-[NNN] | T-[NN]-[NNN] |
| FR-002 | [Title] | US-[NNN] | — | AC-[NNN]-[NN] | — | [Entity] | — | `GET /[ep]` | WF-[NNN] | — | T-[NN]-[NNN] |

_Legend: `—` = not applicable or not yet linked. `Task` column populated only when `12_implplan_[SLUG].md` exists._

---

## Reverse Traceability: Downstream Artifacts → FR

### User Stories → FR

| US | Title | Linked FR | Priority |
|----|-------|-----------|----------|
| US-001 | [Title] | FR-[NNN] | Must |

### Use Cases → FR (via US)

| UC | Title | Linked US | Linked FR | Coverage Status |
|----|-------|-----------|-----------|-----------------|
| UC-001 | [Title] | US-[NNN] | FR-[NNN] | ✓ |

### NFR → FR

| NFR | Category | Linked FR | Coverage Status |
|-----|----------|-----------|-----------------|
| NFR-001 | Performance Efficiency | FR-[NNN] | ✓ |

### API Endpoints → FR

| Endpoint | Linked FR | Coverage Status |
|----------|-----------|-----------------|
| `POST /auth/login` | FR-[NNN] | ✓ |

### Wireframes → FR (via US)

| WF | Linked US | Linked FR | Coverage Status |
|----|-----------|-----------|-----------------|
| WF-001 | US-[NNN] | FR-[NNN] | ✓ |

### Scenarios → FR

| SC | Linked US | Linked FR | Linked NFR | Coverage Status |
|----|-----------|-----------|------------|-----------------|
| SC-001 | US-[NNN] | FR-[NNN] | NFR-[NNN] | ✓ |

### Tasks → FR (if `12_implplan_[SLUG].md` exists)

| Task | Phase | Linked references | Coverage Status |
|------|-------|-------------------|-----------------|
| T-04-007 | 4 — Core Domain | FR-[NNN], US-[NNN], AC-[NNN]-[NN] | ✓ |

---

## Coverage Gaps by Severity

Severity thresholds are read from `00_principles_[SLUG].md` §3 if present, otherwise defaults apply: Must FR with no US = CRITICAL, Should = HIGH, Could = MEDIUM, Won't = LOW.

### 🔴 Critical

| Artifact | Orphan ID | Note | Recommended Action |
|----------|-----------|------|--------------------|
| FR (Must) | FR-[NNN] | No linked US | `/stories` to add a story |

### 🟠 High

| Artifact | Orphan ID | Note | Recommended Action |
|----------|-----------|------|--------------------|
| FR (Should) | FR-[NNN] | No linked NFR | `/nfr` to add a quality requirement |

### 🟡 Medium

| Artifact | Orphan ID | Note | Recommended Action |
|----------|-----------|------|--------------------|
| US (Should) | US-[NNN] | No UC | `/usecases` to add a UC |

### 🟢 Low

| Artifact | Orphan ID | Note | Recommended Action |
|----------|-----------|------|--------------------|
| FR (Won't) | FR-[NNN] | Won't priority — uncovered by design | None |

---

## Coverage Statistics

| Artifact | Total | Linked | Coverage % |
|----------|-------|--------|------------|
| Functional Requirements | [N] | [N] | [N]% |
| User Stories | [N] | [N] | [N]% |
| Use Cases | [N] | [N] | [N]% |
| Acceptance Criteria | [N] | [N] | [N]% |
| NFR items | [N] | [N] | [N]% |
| Data Entities | [N] | [N] | [N]% |
| API Endpoints | [N] | [N] | [N]% |
| Wireframe Screens | [N] | [N] | [N]% |
| Validation Scenarios | [N] | [N] | [N]% |
| Implementation Tasks | [N] | [N] | [N]% |

**Overall traceability score:** [N]% (lowest single coverage % across the table)

---

## Recommended Actions

1. [Action to close gap — e.g. "Add AC for US-NNN"]
2. [Action — e.g. "Link FR-NNN to an API endpoint"]
