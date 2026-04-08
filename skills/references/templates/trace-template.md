# Traceability Matrix: [PROJECT_NAME]

**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**References:** All artifacts `01_brief_[SLUG].md` → `10_scenarios_[SLUG].md`

---

## Forward Traceability: FR → Downstream Artifacts

| FR | Title | US | UC | AC | NFR | Entity | ADR | API | WF | SC |
|----|-------|----|----|----|-----|--------|-----|-----|----|----|
| FR-001 | [Title] | US-[NNN] | UC-[NNN] | US-[NNN] S[N] | NFR-[NNN] | [Entity] | ADR-[NNN] | `POST /[ep]` | WF-[NNN] | SC-[NNN] |
| FR-002 | [Title] | US-[NNN] | — | US-[NNN] S[N] | — | [Entity] | — | `GET /[ep]` | WF-[NNN] | — |

_Legend: `—` = not applicable or not yet linked_

---

## Reverse Traceability: User Stories → FR

| US | Title | FR | Priority |
|----|-------|----|---------|
| US-001 | [Title] | FR-[NNN] | Must |

---

## Coverage Gaps

| Artifact | Orphaned Items | Note |
|---------|---------------|------|
| FR | FR-[NNN] | No US linked |
| US | US-[NNN] | No AC defined |
| UC | UC-[NNN] | No FR reference |
| NFR | NFR-[NNN] | No FR or US linked |

---

## Coverage Statistics

| Artifact | Total | Linked | Coverage % |
|---------|-------|--------|-----------|
| Functional Requirements | [N] | [N] | [N]% |
| User Stories | [N] | [N] | [N]% |
| Use Cases | [N] | [N] | [N]% |
| Acceptance Criteria (scenarios) | [N] | [N] | [N]% |
| NFR items | [N] | [N] | [N]% |
| API Endpoints | [N] | [N] | [N]% |
| Wireframe Screens | [N] | [N] | [N]% |

**Overall traceability score:** [N]%

---

## Recommended Actions

1. [Action to close gap — e.g. "Add AC for US-NNN"]
2. [Action — e.g. "Link FR-NNN to an API endpoint"]
