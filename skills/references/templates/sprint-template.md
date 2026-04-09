# Sprint Plan: [PROJECT_NAME]

**Version:** 0.1
**Status:** Draft
**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**Sprint length:** [N] weeks
**Theoretical velocity:** [N] SP per sprint (at 100% capacity)
**Focus factor:** [N]%
**Buffer / slack:** [N]%
**Ceremonies cost:** [N] SP per sprint
**Net velocity:** [N] SP per sprint  *(theoretical × focus × (1 − buffer) − ceremonies)*
**Sources:** [list of artifacts used: 03_stories, 00_estimate, 00_risks, 02_srs, 00_principles, 00_discovery]

---

## Summary

| Sprint | Goal | Stories | Points | Capacity (vs net) |
|--------|------|:-------:|:------:|:------------------:|
| SP-00  | Setup and environment | — | — | — |
| SP-01  | [User-outcome goal in one sentence] | [N] | [N] SP | [N]% |
| SP-02  | [Goal] | [N] | [N] SP | [N]% |
| SP-03  | [Goal] | [N] | [N] SP | [N]% |
| **Total** | | **[N]** | **[N] SP** | |

**Planned:** [N] stories / [N] SP across [N] sprints ([N] weeks total)
**Unplanned backlog:** [N] stories / [N] SP (capacity exceeded or marked Could/Won't)

---

## Sprint Details

### SP-00 — Setup and environment

**Duration:** Week 0 (pre-sprint)
**Capacity:** Setup only — no Story Points assigned

**Tasks:**
- [Configure CI/CD pipeline]
- [Provision staging environment]
- [Scaffold the project structure based on `12_implplan_[SLUG].md` Phase 1]
- [Establish baseline schema from `07_datadict_[SLUG].md`]
- [Team alignment session on the project domain]

**Definition of Done for SP-00:**
- [ ] All developers can run the project locally.
- [ ] Staging environment reachable from the team's workstations.
- [ ] Base CI pipeline runs lint + unit tests on every push.

---

### SP-01 — [Sprint Goal — single user-outcome sentence]

**Duration:** Weeks 1–[N]
**Net capacity:** [N] SP

| US | Title | Epic | Persona | Priority | Value | Risk | Depends on | Estimate |
|----|-------|------|---------|----------|:-----:|------|------------|---------:|
| US-001 | [Title] | E-01 | [Persona name] | Must | 5 | RISK-02 ↑ | — | 5 SP |
| US-002 | [Title] | E-01 | [Persona name] | Must | 4 | — | — | 3 SP |
| US-005 | [Title] | E-02 | [Persona name] | Should | 3 | — | US-001 | 8 SP |

**Sprint total:** [N] SP / [N] SP net capacity ([N]%)

**Definition of Done for this sprint:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] API endpoints for this sprint are integrated and tested.
- [ ] No 🔴 Critical open items in `/analyze` for completed stories.
- [ ] [Sprint-specific gate, e.g. "End-to-end latency under 1s p95"]

---

### SP-02 — [Sprint Goal]

**Duration:** Weeks [N]–[N]
**Net capacity:** [N] SP

| US | Title | Epic | Persona | Priority | Value | Risk | Depends on | Estimate |
|----|-------|------|---------|----------|:-----:|------|------------|---------:|
| US-[NNN] | [Title] | E-[NN] | [Persona] | Must | [1–5] | [—/RISK-NN ↑] | [—/US-NNN] | [N] SP |

**Sprint total:** [N] SP / [N] SP net capacity ([N]%)

**Definition of Done for this sprint:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] [Sprint-specific gate]

<!-- Repeat sprint blocks as needed. SP-01, SP-02, SP-03, ... -->

---

## Unplanned Backlog

Stories not assigned to any sprint — below MVP capacity, marked Could/Won't, or deferred for dependency reasons:

| US | Title | Epic | Persona | Priority | Estimate | Reason |
|----|-------|------|---------|----------|---------:|--------|
| US-[NNN] | [Title] | E-[NN] | [Persona] | Could | [N] SP | Capacity exceeded — defer to v1.1 |
| US-[NNN] | [Title] | E-[NN] | [Persona] | Won't | [N] SP | Out of MVP scope |

---

## Capacity model

| Component | Value |
|-----------|-------|
| Theoretical velocity (100% capacity) | [N] SP |
| Focus factor | [N]% (industry baseline 65%) |
| Buffer / slack for bugs and support | [N]% (industry baseline 15%) |
| Ceremonies cost (planning + review + retro + refinement) | [N] SP per sprint |
| **Net velocity used for assignment** | **[N] SP per sprint** |

---

## Assumptions

- Sprint velocity is based on [source: user input / team-size estimate / historical data].
- Focus factor of [N]% reflects [reason — meeting load / ceremonies overhead / mentoring / context-switching].
- Buffer of [N]% reserved for [reason — production bugs / customer support / unplanned work].
- SP-00 is a pre-sprint setup week; its effort is not tracked in Story Points.
- Frontend and backend are developed in parallel within each sprint.
- [Hard release deadline if applicable, or "no fixed deadline; the plan targets an N-week MVP delivery window"].
- Risk-elevated stories are pulled into earlier sprints to validate mitigations sooner.
