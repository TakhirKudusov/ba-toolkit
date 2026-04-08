# Pipeline Prerequisites

This file lists what must exist before each BA Toolkit skill can proceed. Skills check these prerequisites during context loading and warn the user if they are not met.

Prerequisites marked **Required** block execution — the skill should prompt the user to run the missing step first. Prerequisites marked **Recommended** allow execution with a warning.

---

## /principles (Step 0 — optional)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| None | — | Can be run at any time, even before /brief |

---

## /brief (Step 1)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| None | — | First required pipeline step |
| `00_principles_*.md` | Optional | If present, apply conventions |

---

## /srs (Step 2)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| `01_brief_*.md` | **Required** | Source of goals, domain, stakeholders, constraints |
| `00_principles_*.md` | Optional | If present, apply conventions |

---

## /stories (Step 3)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| `02_srs_*.md` | **Required** | Source of FR list, roles, priorities |
| `01_brief_*.md` | **Required** | Source of domain and slug |
| `00_principles_*.md` | Optional | |

---

## /usecases (Step 4)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| `03_stories_*.md` | **Required** | Source of US list and roles |
| `02_srs_*.md` | **Required** | Source of FR and business rules |
| `01_brief_*.md` | **Required** | Source of domain and slug |
| `00_principles_*.md` | Optional | |

---

## /ac (Step 5)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| `03_stories_*.md` | **Required** | Source of US list |
| `04_usecases_*.md` | Recommended | Needed for UC cross-references in AC |
| `02_srs_*.md` | **Required** | Source of business rules |
| `01_brief_*.md` | **Required** | Source of domain and slug |
| `00_principles_*.md` | Optional | |

---

## /nfr (Step 6)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| `02_srs_*.md` | **Required** | Source of integrations, roles, FR list |
| `01_brief_*.md` | **Required** | Source of domain, constraints, risks |
| `03_stories_*.md` | Recommended | Useful for linking NFR to specific stories |
| `00_principles_*.md` | Optional | Section 5 (NFR Baseline) defines mandatory categories |

---

## /datadict (Step 7)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| `02_srs_*.md` | **Required** | Source of entities mentioned in FR |
| `03_stories_*.md` | **Required** | Source of entities mentioned in US |
| `01_brief_*.md` | **Required** | Source of domain and slug |
| `00_principles_*.md` | Optional | Section 2 defines entity naming convention |

---

## /research (Step 7a — optional)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| `07_datadict_*.md` | **Required** | Entity model must be stable before tech decisions |
| `02_srs_*.md` | **Required** | Source of integrations and regulatory constraints |
| `01_brief_*.md` | **Required** | Source of domain, constraints, slug |
| `06_nfr_*.md` | Recommended | NFR drives many architecture decisions |
| `00_principles_*.md` | Optional | |

---

## /apicontract (Step 8)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| `07_datadict_*.md` | **Required** | API schemas must be consistent with the data model |
| `02_srs_*.md` | **Required** | Source of FR with interface requirements |
| `03_stories_*.md` | **Required** | Source of US for endpoint linking |
| `07a_research_*.md` | Recommended | ADRs inform protocol, auth, and versioning choices |
| `00_principles_*.md` | Optional | |

---

## /wireframes (Step 9)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| `03_stories_*.md` | **Required** | Source of US for screen linking |
| `02_srs_*.md` | **Required** | Source of roles, interface requirements |
| `01_brief_*.md` | **Required** | Source of domain, platform, slug |
| `08_apicontract_*.md` | Recommended | Enables API endpoint links in wireframe elements |
| `00_principles_*.md` | Optional | |

---

## /scenarios (Step 10 — optional)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| `03_stories_*.md` | **Required** | Source of US and personas |
| `05_ac_*.md` | **Required** | AC referenced in each scenario step |
| `09_wireframes_*.md` | Recommended | Needed to link WF screens to scenario steps |
| `08_apicontract_*.md` | Recommended | Needed to link API calls to scenario steps |
| `00_principles_*.md` | Optional | |

---

## /handoff (Step 11 — optional)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| `01_brief_*.md` | **Required** | Minimum viable context |
| `02_srs_*.md` | **Required** | FR inventory for MVP scope |
| `03_stories_*.md` | Recommended | US for MVP scope table |
| `00_trace_*.md` | Recommended | Use existing coverage stats if available |
| `00_analyze_*.md` | Recommended | Import open findings if available |
| `00_principles_*.md` | Optional | |

---

## /trace (Cross-cutting)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| `02_srs_*.md` | **Required** | Minimum for FR → US matrix |
| `03_stories_*.md` | **Required** | Minimum for FR → US matrix |
| `00_principles_*.md` | Optional | Section 3 defines CRITICAL/HIGH/MEDIUM severity thresholds |

---

## /clarify (Cross-cutting)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| At least one pipeline artifact | **Required** | Target artifact must exist |
| `00_principles_*.md` | Optional | Section 4 (DoR) used to identify missing mandatory fields |

---

## /analyze (Cross-cutting)

| Prerequisite | Status | Notes |
|-------------|--------|-------|
| `02_srs_*.md` | **Required** | Minimum for meaningful analysis |
| `00_principles_*.md` | Optional | Sections 3–6 used to calibrate severity thresholds |

---

## Quick reference: minimum viable pipeline

To reach a development-ready handoff with the smallest number of steps:

```
/brief → /srs → /stories → /ac → /nfr → /datadict → /apicontract → /wireframes → /handoff
```

To reach a fully traced, quality-checked handoff:

```
/principles → /brief → /srs → /stories → /usecases → /ac → /nfr → /datadict → /research → /apicontract → /wireframes → /scenarios → /trace → /analyze → /handoff
```
