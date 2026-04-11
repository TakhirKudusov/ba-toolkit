# Development Handoff Package: [PROJECT_NAME]

**Version:** 1.0
**Status:** Draft
**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**Prepared by:** BA Toolkit `/handoff`
**References:** All pipeline artifacts

---

## 1. Artifact Inventory

### Pipeline-stage artifacts

| Stage | Artifact | File | Status | Last Updated |
|-------|----------|------|--------|--------------|
| 0 | Discovery | `00_discovery_[SLUG].md` | ✅ Complete / — Not run | [DATE] |
| 0a | Principles | `00_principles_[SLUG].md` | ✅ Complete / — Not run | [DATE] |
| 1 | Project Brief | `01_brief_[SLUG].md` | ✅ Complete | [DATE] |
| 2 | SRS | `02_srs_[SLUG].md` | ✅ Complete | [DATE] |
| 3 | User Stories | `03_stories_[SLUG].md` | ✅ Complete | [DATE] |
| 4 | Use Cases | `04_usecases_[SLUG].md` | ✅ Complete | [DATE] |
| 5 | Acceptance Criteria | `05_ac_[SLUG].md` | ✅ Complete | [DATE] |
| 6 | NFR | `06_nfr_[SLUG].md` | ✅ Complete | [DATE] |
| 7 | Data Dictionary | `07_datadict_[SLUG].md` | ✅ Complete | [DATE] |
| 7a | Research / ADRs | `07a_research_[SLUG].md` | ✅ Complete | [DATE] |
| 8 | API Contract | `08_apicontract_[SLUG].md` | ✅ Complete | [DATE] |
| 9 | Wireframes | `09_wireframes_[SLUG].md` | ✅ Complete | [DATE] |
| 10 | Validation Scenarios | `10_scenarios_[SLUG].md` | ✅ Complete | [DATE] |
| 11 | Handoff | `11_handoff_[SLUG].md` | This document | [DATE] |
| 12 | Implementation Plan | `12_implplan_[SLUG].md` | ✅ Complete / — Not run | [DATE] |

### Utility artifacts

| Tool | File | Status | Last Updated |
|------|------|--------|--------------|
| Trace | `00_trace_[SLUG].md` | ✅ / — Not run | [DATE] |
| Analyze | `00_analyze_[SLUG].md` | ✅ / — Not run | [DATE] |
| Risk Register | `00_risks_[SLUG].md` | ✅ / — Not run | [DATE] |
| Sprint Plan | `00_sprint_[SLUG].md` | ✅ / — Not run | [DATE] |
| Glossary | `00_glossary_[SLUG].md` | ✅ / — Not run | [DATE] |
| Estimate | inline in `03_stories_[SLUG].md` or `00_estimate_[SLUG].md` | ✅ / — Not run | [DATE] |

---

## 2. MVP Scope

**In scope for MVP:**

| ID | Title | Type | Priority |
|----|-------|------|----------|
| FR-[NNN] | [Title] | Functional | Must |
| US-[NNN] | [Story title] | Story | Must |

**Explicitly out of scope (deferred to v2):**

| ID | Title | Reason |
|----|-------|--------|
| FR-[NNN] | [Title] | [Reason — e.g. "dependency on third-party integration not available at launch"] |

---

## 3. Traceability Coverage

| Chain | Coverage | Gap |
|-------|----------|-----|
| Brief Goal → FR | [N]% | [N goals uncovered] |
| FR → US | [N]% | [N orphaned FRs] |
| US → UC | [N]% | [N stories without UC] |
| US → AC (Positive / Negative / Boundary) | [N]% / [N]% / [N]% | [N stories without negative AC] |
| FR → NFR | [N]% | [N FRs without an NFR] |
| FR → Entity | [N]% | [N FRs without entity] |
| FR → API Endpoint | [N]% | [N FRs without endpoint] |
| US → WF | [N]% | [N stories without wireframe] |
| US → Scenario | [N]% | [N stories without scenario] |
| FR → Implementation Task | [N]% | [N FRs without task] |
| NFR → ADR | [N]% | [N NFRs without architectural decision] |

---

## 4. Open Items

| # | Type | Description | Owner | Priority |
|---|------|-------------|-------|----------|
| 1 | Decision / Clarification / Dependency / Risk | [Description] | [Role] | P1 / P2 / P3 |

---

## 5. Top Risks for Development

| # | Risk | Probability | Impact | Velocity | Treatment | Mitigation |
|---|------|-------------|--------|----------|-----------|------------|
| 1 | [Risk] | High / Med / Low | High / Med / Low | Days / Weeks / Months | Avoid / Reduce / Transfer / Accept | [Mitigation] |

*(Pulled from `00_risks_[SLUG].md` — top 5 by score.)*

---

## 6. Recommended Development Sequence

1. **[Phase / Sprint 1]** — [What to build first and why]
2. **[Phase / Sprint 2]** — [Next priority]
3. **[Phase / Sprint 3]** — [Following priority]

_Rationale: [Why this sequencing — dependencies, risk, user value.]_

If `12_implplan_[SLUG].md` has been generated, use the phase ladder + Task DAG appendix from there as the canonical sequence; the recommendation above is the human-friendly summary.

---

## 7. Architecture Decision Summary

Top architectural decisions from `07a_research_[SLUG].md`. Dev team should read each linked ADR before starting the corresponding phase.

| ADR | Decision | Drivers | Phase impact |
|-----|----------|---------|--------------|
| ADR-001 | [chosen tech for layer X] | NFR-[NNN], FR-[NNN] | Phase [N] of `/implement-plan` |
| ADR-002 | [decision] | [drivers] | [phase impact] |

---

## 8. Artifact Files Reference

```
output/[SLUG]/
├── 00_discovery_[SLUG].md
├── 00_principles_[SLUG].md
├── 00_analyze_[SLUG].md
├── 00_glossary_[SLUG].md
├── 00_risks_[SLUG].md
├── 00_sprint_[SLUG].md
├── 00_trace_[SLUG].md
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
├── 11_handoff_[SLUG].md     ← this document
└── 12_implplan_[SLUG].md
```

---

## 9. Sign-off

Formal acceptance of the handoff package. Signing this section means the development team agrees the BA package is sufficient to begin implementation. Outstanding open items (§4) and uncovered traceability chains (§3) must be acknowledged or resolved before sign-off.

| Role | Name | Sign-off Date | Notes |
|------|------|---------------|-------|
| Business Analyst | [name] | [YYYY-MM-DD] | [notes] |
| Product Manager | [name] | [YYYY-MM-DD] | [notes] |
| Tech Lead | [name] | [YYYY-MM-DD] | [notes] |
| QA Lead | [name] | [YYYY-MM-DD] | [notes] |
| Stakeholder / Sponsor | [name] | [YYYY-MM-DD] | [notes] |
