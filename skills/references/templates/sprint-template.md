# Sprint Plan: Nova Analytics

**Domain:** saas
**Date:** 2026-04-08
**Slug:** nova-analytics
**Sprint length:** 2 weeks
**Team velocity:** 35 SP per sprint
**Sources:** `00_estimate_nova-analytics.md`, `03_stories_nova-analytics.md`, `00_risks_nova-analytics.md`, `02_srs_nova-analytics.md`

---

## Summary

| Sprint | Goal | Stories | Points | Capacity |
|--------|------|:-------:|:------:|:--------:|
| SP-00 | Setup: environment, CI/CD, event-ingestion pipeline scaffold | — | — | — |
| SP-01 | Users can sign up, connect a data source, and see events arrive | 6 | 34 SP | 97% |
| SP-02 | Users can build dashboards with funnel, cohort, and trend widgets | 5 | 32 SP | 91% |
| SP-03 | Alerts and collaboration: thresholds, notifications, sharing, SSO | 5 | 30 SP | 86% |
| SP-04 | Admin workspace: usage, retention, billing, audit log | 4 | 28 SP | 80% |
| **Total** | | **20** | **124 SP** | |

**Planned:** 20 stories / 124 SP across 4 sprints (8 weeks)
**Unplanned backlog:** 4 stories / 18 SP (scope exceeds MVP capacity or marked Could/Won't)

---

## Sprint Details

### SP-00 — Setup and environment

**Duration:** Week 0 (pre-sprint)
**Capacity:** Setup only — no story points assigned

**Tasks:**
- Configure CI/CD pipeline (GitHub Actions).
- Provision staging environment on cloud infrastructure.
- Scaffold Next.js web app and Node ingestion service with a base authentication stub.
- Establish OLTP (Postgres) and columnar analytics (ClickHouse) schema baselines from `/datadict`.
- Team alignment session on analytics domain concepts (event taxonomy, funnel modelling, cohort analysis).

**Definition of Done for SP-00:**
- [ ] All developers can run the project locally.
- [ ] Staging environment is reachable from the team's workstations.
- [ ] Base CI pipeline runs lint + unit tests on every push.

---

### SP-01 — Users can sign up, connect a data source, and see events arrive

**Duration:** Weeks 1–2
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-001 | Sign up via email or Google SSO | E-01 Onboarding | Must | RISK-02 ↑ | 5 SP |
| US-002 | Create a workspace and invite a teammate | E-01 Onboarding | Must | — | 3 SP |
| US-003 | Connect first data source (Segment or warehouse) | E-06 Integrations | Must | RISK-03 ↑ | 13 SP |
| US-004 | View the live event stream from the connected source | E-03 Events | Must | — | 3 SP |
| US-005 | Validate the incoming event schema against expected taxonomy | E-03 Events | Must | — | 5 SP |
| US-006 | View the default dashboard with sample metrics | E-02 Dashboards | Should | — | 5 SP |

**Sprint total:** 34 SP / 35 SP capacity (97%)

**Definition of Done for SP-01:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] Sign-up and SSO flows tested on Chrome, Safari, and Firefox.
- [ ] End-to-end event ingestion latency under 1 s at p95 from source emit to dashboard read.
- [ ] No 🔴 Critical open items in `/analyze` for completed stories.

---

### SP-02 — Users can build dashboards with funnel, cohort, and trend widgets

**Duration:** Weeks 3–4
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-007 | Create a custom dashboard from scratch | E-02 Dashboards | Must | RISK-01 ↑ | 8 SP |
| US-008 | Add a funnel widget with 3 configurable steps | E-02 Dashboards | Must | RISK-01 ↑ | 8 SP |
| US-009 | Add a cohort retention widget for the last 30 days | E-02 Dashboards | Must | — | 8 SP |
| US-010 | Save a dashboard to the workspace library | E-02 Dashboards | Should | — | 5 SP |
| US-011 | Filter a dashboard by date range and segment | E-02 Dashboards | Must | — | 3 SP |

**Sprint total:** 32 SP / 35 SP capacity (91%)

**Definition of Done for SP-02:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] Dashboard read query latency under 500 ms at p95 for the reference dataset (10 M events).
- [ ] Funnel and cohort calculations verified against the reference dataset to within 0.1%.
- [ ] Saved dashboards survive workspace reload and session refresh.

---

### SP-03 — Alerts and collaboration: thresholds, notifications, sharing, SSO

**Duration:** Weeks 5–6
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-012 | Set a metric threshold alert on any dashboard widget | E-04 Alerts | Must | RISK-04 ↑ | 8 SP |
| US-013 | Receive an alert email within 60 s of threshold breach | E-04 Alerts | Must | — | 5 SP |
| US-014 | Invite a teammate and assign a role (admin, editor, viewer) | E-05 Collaboration | Should | — | 5 SP |
| US-015 | Share a dashboard read-only link with internal and external viewers | E-05 Collaboration | Must | — | 5 SP |
| US-016 | Enable SSO (SAML / OIDC) for the workspace | E-05 Collaboration | Should | — | 7 SP |

**Sprint total:** 30 SP / 35 SP capacity (86%)

**Definition of Done for SP-03:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] Alert evaluation runs within 60 s of threshold breach in staging.
- [ ] Read-only share links respect role permissions and expire as configured.

---

### SP-04 — Admin workspace: usage, retention, billing, audit log

**Duration:** Weeks 7–8
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-017 | Admin views the workspace list with per-workspace event volume | E-07 Admin | Must | — | 5 SP |
| US-018 | Admin adjusts data retention window and event quota per workspace | E-07 Admin | Must | — | 8 SP |
| US-019 | Admin views the usage-based billing report for the current period | E-07 Admin | Should | — | 8 SP |
| US-020 | Admin reviews the audit log of workspace and permission changes | E-07 Admin | Should | — | 7 SP |

**Sprint total:** 28 SP / 35 SP capacity (80%)

**Definition of Done for SP-04:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] Retention changes take effect on the next hourly compaction run.
- [ ] Billing report matches the underlying usage ledger to within 0.01%.

---

## Unplanned Backlog

Stories not assigned to any sprint — below MVP capacity or marked Could/Won't:

| US | Title | Epic | Priority | Estimate | Reason |
|----|-------|------|---------|---------|--------|
| US-021 | Export a dashboard snapshot as PDF | E-02 Dashboards | Could | 5 SP | Capacity exceeded — defer to v1.1 |
| US-022 | Mobile companion app for alert notifications | E-04 Alerts | Could | 8 SP | Deferred — requires mobile infrastructure |
| US-023 | In-app chat support widget | E-08 Support | Could | 3 SP | Deferred — third-party integration |
| US-024 | White-label dashboards for embedded use | E-05 Collaboration | Won't | 2 SP | Out of MVP scope |

---

## Assumptions

- Sprint velocity: 35 SP based on a team of 4 full-stack developers (2 sprints of historical data from similar projects).
- SP-00 is a pre-sprint setup week; its effort is not tracked in Story Points.
- Frontend and backend are developed in parallel within each sprint.
- No hard release deadline was specified; the plan targets an 8-week MVP delivery window.
- Risk-elevated stories (RISK-01, RISK-02, RISK-03, RISK-04) were pulled into earlier sprints to validate mitigations sooner.
