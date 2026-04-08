# Development Handoff Package: [PROJECT_NAME]

**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**Prepared by:** BA Toolkit `/handoff`
**References:** All pipeline artifacts

---

## Artifact Inventory

| Artifact | File | Status | Last Updated |
|---------|------|--------|-------------|
| Principles | `00_principles_[SLUG].md` | ✅ Complete | [DATE] |
| Project Brief | `01_brief_[SLUG].md` | ✅ Complete | [DATE] |
| SRS | `02_srs_[SLUG].md` | ✅ Complete | [DATE] |
| User Stories | `03_stories_[SLUG].md` | ✅ Complete | [DATE] |
| Use Cases | `04_usecases_[SLUG].md` | ✅ Complete | [DATE] |
| Acceptance Criteria | `05_ac_[SLUG].md` | ✅ Complete | [DATE] |
| NFR | `06_nfr_[SLUG].md` | ✅ Complete | [DATE] |
| Data Dictionary | `07_datadict_[SLUG].md` | ✅ Complete | [DATE] |
| Research / ADRs | `07a_research_[SLUG].md` | ✅ Complete | [DATE] |
| API Contract | `08_apicontract_[SLUG].md` | ✅ Complete | [DATE] |
| Wireframes | `09_wireframes_[SLUG].md` | ✅ Complete | [DATE] |
| Validation Scenarios | `10_scenarios_[SLUG].md` | ✅ Complete | [DATE] |

---

## MVP Scope

**In scope for MVP:**

| ID | Title | Type | Priority |
|----|-------|------|---------|
| FR-[NNN] | [Title] | Functional | Must |
| US-[NNN] | [Story title] | Story | Must |

**Explicitly out of scope (deferred to v2):**

| ID | Title | Reason |
|----|-------|--------|
| FR-[NNN] | [Title] | [Reason — e.g. "dependency on third-party integration not available at launch"] |

---

## Traceability Coverage

| Link | Coverage | Gap |
|------|---------|-----|
| FR → US | [N]% | [N orphaned FRs] |
| US → AC | [N]% | [N stories without AC] |
| FR → API | [N]% | [N FRs without endpoint] |
| US → WF | [N]% | [N stories without wireframe] |

---

## Open Items

| # | Type | Description | Owner | Priority |
|---|------|-------------|-------|---------|
| 1 | [Decision \| Clarification \| Dependency] | [Description] | [Role] | P1 / P2 / P3 |

---

## Top Risks for Development

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|-----------|
| 1 | [Risk] | High / Med / Low | High / Med / Low | [Mitigation] |

---

## Recommended Development Sequence

1. **[Phase / Sprint 1]** — [What to build first and why]
2. **[Phase / Sprint 2]** — [Next priority]
3. **[Phase / Sprint 3]** — [Following priority]

_Rationale: [Why this sequencing — dependencies, risk, user value.]_

---

## Artifact Files Reference

```
output/[SLUG]/
├── 00_principles_[SLUG].md
├── 00_analyze_[SLUG].md
├── 01_brief_[SLUG].md
├── 02_srs_[SLUG].md
├── 03_stories_[SLUG].md
├── 04_usecases_[SLUG].md
├── 05_ac_[SLUG].md
├── 06_nfr_[SLUG].md
├── 07_datadict_[SLUG].md
├── 07a_research_[SLUG].md
├── 08_apicontract_[SLUG].md
├── 09_wireframes_[SLUG].md
├── 10_scenarios_[SLUG].md
└── 11_handoff_[SLUG].md     ← this document
```
