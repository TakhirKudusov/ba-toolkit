# Risk Register: {PROJECT_NAME}

**Domain:** {DOMAIN}
**Date:** {DATE}
**Slug:** {SLUG}
**Sources:** {list of artifacts scanned}

---

## Summary

| Priority | Count |
|---------|-------|
| 🔴 Critical | 1 |
| 🟡 High | 2 |
| 🟢 Medium | 3 |
| ⚪ Low | 1 |
| **Total** | **7** |

---

## Risk Register

| ID | Title | Category | Probability | Impact | Score | Priority | Status |
|----|-------|----------|:-----------:|:------:|:-----:|---------|--------|
| RISK-01 | Third-party data source rate limits unclear | External | 4 | 5 | 20 | 🔴 Critical | Open |
| RISK-02 | GDPR data-processing agreement unsigned | Compliance | 3 | 4 | 12 | 🟡 High | Open |
| RISK-03 | Columnar query performance under concurrent load unproven | Technical | 3 | 3 | 9 | 🟡 High | Open |
| RISK-04 | Scope creep from stakeholder wish list | Business | 3 | 2 | 6 | 🟢 Medium | Open |
| RISK-05 | OIDC / SSO library breaking changes | External | 2 | 3 | 6 | 🟢 Medium | Open |
| RISK-06 | Data model changes after /datadict | Technical | 2 | 3 | 6 | 🟢 Medium | Open |
| RISK-07 | Development team unfamiliar with analytics domain | Business | 2 | 1 | 2 | ⚪ Low | Open |

---

## Risk Details

### RISK-01 — Third-party data source rate limits unclear

**Category:** External
**Probability:** 4 / 5 — Likely
**Impact:** 5 / 5 — Critical
**Score:** 20 🔴 Critical
**Status:** Open
**Source:** `07a_research_{slug}.md`

**Description:**
The product depends on timely event delivery from third-party integrations (Segment and warehouse connectors). The published rate limits do not guarantee sustained throughput at the projected MVP event volume. If a critical integration is rate-limited or breaks its contract, dashboards will show stale or incomplete data and user trust erodes quickly.

**Mitigation:**
Run a sustained-throughput test against each integration in sprint 0. Negotiate higher quotas with the providers before launch. Add per-source ingestion lag as a monitored NFR metric with an alert threshold.

**Contingency:**
Enable an ingestion backpressure queue and surface a workspace-level banner when a source is lagging more than 5 minutes behind real-time. Prioritise critical event streams over low-value ones until the lag recovers.

**Owner:** Tech Lead

---

### RISK-02 — GDPR data-processing agreement unsigned

**Category:** Compliance
**Probability:** 3 / 5 — Possible
**Impact:** 4 / 5 — Major
**Score:** 12 🟡 High
**Status:** Open
**Source:** `01_brief_{slug}.md`

**Description:**
The product collects first-party user-behavioural events from EU workspaces. The Brief listed the GDPR data-processing agreement (DPA) with the selected cloud provider as an assumption. If the DPA is delayed or blocked by legal review, the EU launch date will slip regardless of development readiness.

**Mitigation:**
Engage legal counsel early to track DPA status. Decouple development milestones from the legal timeline so that technical readiness does not block on paperwork. Draft the workspace-level privacy controls (PII redaction, data residency) independently of the final DPA text.

**Contingency:**
Launch in non-EU regions first (US, CA, APAC) while the EU DPA is pending. Gate EU workspace signups behind a feature flag tied to DPA status.

**Owner:** Product Manager

---

### RISK-03 — Columnar query performance under concurrent load unproven

**Category:** Technical
**Probability:** 3 / 5 — Possible
**Impact:** 3 / 5 — Moderate
**Score:** 9 🟡 High
**Status:** Open
**Source:** `07a_research_{slug}.md`

**Description:**
The ADR for the analytics query layer chose ClickHouse as the primary store. This setup has not been load-tested for the projected 200 concurrent dashboard viewers reading against a 10 M-event dataset. If query throughput assumptions are wrong, dashboards will exceed the 500 ms p95 NFR target and degrade UX.

**Mitigation:**
Run a load-test spike in the first development sprint against the reference dataset. Define a caching fallback (5-minute materialised query cache) if raw query throughput does not meet targets.

**Contingency:**
Enable the query cache globally and mark cached dashboards with a "last refreshed" timestamp. Communicate the change as a phased rollout feature.

**Owner:** Tech Lead

---

### RISK-04 — Scope creep from stakeholder wish list

**Category:** Business
**Probability:** 3 / 5 — Possible
**Impact:** 2 / 5 — Minor
**Score:** 6 🟢 Medium
**Status:** Open
**Source:** `01_brief_{slug}.md`

**Description:**
Several features were marked out of scope during the Brief interview but stakeholders indicated they "might be needed later." Without a change control process, these may be re-introduced mid-development, inflating the MVP scope.

**Mitigation:**
Establish a formal change request process referenced in the Handoff document. All scope additions must go through `/stories` and be re-estimated.

**Contingency:**
Freeze scope at the start of each sprint. Defer any mid-sprint scope additions to the next sprint backlog.

**Owner:** Product Manager

---

### RISK-05 — OIDC / SSO library breaking changes

**Category:** External
**Probability:** 2 / 5 — Unlikely
**Impact:** 3 / 5 — Moderate
**Score:** 6 🟢 Medium
**Status:** Open
**Source:** `07a_research_{slug}.md`

**Description:**
The product uses a third-party OIDC / SAML library for workspace SSO. Similar libraries have released breaking changes in previous majors without long deprecation windows. If the library releases a breaking change after development, sign-up and SSO flows may require rework.

**Mitigation:**
Pin the library version used in development. Monitor the library changelog and security advisories. Abstract SSO calls behind a thin adapter layer so a future swap to a different provider is isolated to one module.

**Contingency:**
Allocate a 3-day buffer in the release plan for library compatibility fixes.

**Owner:** Frontend Lead

---

### RISK-06 — Data model changes after /datadict

**Category:** Technical
**Probability:** 2 / 5 — Unlikely
**Impact:** 3 / 5 — Moderate
**Score:** 6 🟢 Medium
**Status:** Open
**Source:** `07_datadict_{slug}.md`

**Description:**
The Data Dictionary was finalised before the API Contract was fully detailed. Late-stage entity or field changes discovered during API design may require cascading updates across the SRS, Stories, and AC artifacts.

**Mitigation:**
Run `/trace` after `/apicontract` to detect any new cross-artifact inconsistencies. Address CRITICAL gaps before handoff.

**Contingency:**
Use `/revise` on affected artifacts to propagate changes. Document the delta in the Handoff open items list.

**Owner:** Business Analyst

---

### RISK-07 — Development team unfamiliar with analytics domain

**Category:** Business
**Probability:** 2 / 5 — Unlikely
**Impact:** 1 / 5 — Negligible
**Score:** 2 ⚪ Low
**Status:** Open
**Source:** `01_brief_{slug}.md`

**Description:**
The engineering team has limited prior experience with columnar analytics storage. Domain-specific concepts (event schemas, funnel aggregation, cohort joins) may be misunderstood during implementation, leading to query correctness bugs on edge cases.

**Mitigation:**
Include a domain onboarding session as part of sprint 0. Reference the SaaS domain glossary in the Handoff document.

**Contingency:**
Schedule a BA review checkpoint after the first feature is implemented end-to-end.

**Owner:** Product Manager
