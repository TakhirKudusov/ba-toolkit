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
| RISK-01 | Payment provider SLA not guaranteed | External | 4 | 5 | 20 | 🔴 Critical | Open |
| RISK-02 | Regulatory approval timeline unknown | Compliance | 3 | 4 | 12 | 🟡 High | Open |
| RISK-03 | Real-time leaderboard at scale unproven | Technical | 3 | 3 | 9 | 🟡 High | Open |
| RISK-04 | Scope creep from stakeholder wish list | Business | 3 | 2 | 6 | 🟢 Medium | Open |
| RISK-05 | Telegram Mini App API breaking changes | External | 2 | 3 | 6 | 🟢 Medium | Open |
| RISK-06 | Data model changes after /datadict | Technical | 2 | 3 | 6 | 🟢 Medium | Open |
| RISK-07 | Development team unfamiliar with domain | Business | 2 | 1 | 2 | ⚪ Low | Open |

---

## Risk Details

### RISK-01 — Payment provider SLA not guaranteed

**Category:** External
**Probability:** 4 / 5 — Likely
**Impact:** 5 / 5 — Critical
**Score:** 20 🔴 Critical
**Status:** Open
**Source:** `07a_research_{slug}.md`

**Description:**
The selected payment provider has not provided a written SLA. If the provider experiences downtime during peak traffic, transactions will fail and user funds may be delayed, directly impacting revenue and trust.

**Mitigation:**
Negotiate and sign an SLA before launch. Implement a fallback payment provider in the API contract. Add payment provider availability as a monitored NFR metric.

**Contingency:**
Enable the fallback provider automatically via feature flag if primary provider error rate exceeds 5% over a 5-minute window.

**Owner:** Tech Lead

---

### RISK-02 — Regulatory approval timeline unknown

**Category:** Compliance
**Probability:** 3 / 5 — Possible
**Impact:** 4 / 5 — Major
**Score:** 12 🟡 High
**Status:** Open
**Source:** `01_brief_{slug}.md`

**Description:**
The product operates in a regulated iGaming jurisdiction. The licensing timeline was listed as an assumption in the Brief. If approval is delayed, the launch date will slip regardless of development readiness.

**Mitigation:**
Engage legal counsel early to track approval status. Decouple development milestones from the licensing timeline so that technical readiness does not block on regulatory process.

**Contingency:**
Prepare a soft launch in an unregulated market while the primary jurisdiction approval is pending.

**Owner:** Product Manager

---

### RISK-03 — Real-time leaderboard at scale unproven

**Category:** Technical
**Probability:** 3 / 5 — Possible
**Impact:** 3 / 5 — Moderate
**Score:** 9 🟡 High
**Status:** Open
**Source:** `07a_research_{slug}.md`

**Description:**
The ADR for the leaderboard service chose Redis Sorted Sets as the primary data structure. This approach has not been load-tested for the projected 10,000 concurrent users. If throughput assumptions are wrong, real-time updates will lag and degrade UX.

**Mitigation:**
Conduct a load test spike in the first development sprint. Define a fallback to polling-based updates (every 5s) if WebSocket throughput targets are not met.

**Contingency:**
Switch to polling-based leaderboard refresh with a 10-second interval. Communicate the change as a phased rollout feature.

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

### RISK-05 — Telegram Mini App API breaking changes

**Category:** External
**Probability:** 2 / 5 — Unlikely
**Impact:** 3 / 5 — Moderate
**Score:** 6 🟢 Medium
**Status:** Open
**Source:** `07a_research_{slug}.md`

**Description:**
The product is built as a Telegram Mini App. Telegram has released breaking changes to the Mini Apps API in previous versions. If the API changes after development, UI components and deep links may require rework.

**Mitigation:**
Pin the Telegram Web App SDK version used in development. Monitor the Telegram changelog and the `@twa-dev/sdk` release notes. Abstract SDK calls behind a thin adapter layer.

**Contingency:**
Allocate a 3-day buffer in the release plan for SDK compatibility fixes.

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

### RISK-07 — Development team unfamiliar with domain

**Category:** Business
**Probability:** 2 / 5 — Unlikely
**Impact:** 1 / 5 — Negligible
**Score:** 2 ⚪ Low
**Status:** Open
**Source:** `01_brief_{slug}.md`

**Description:**
The engineering team has limited prior experience with iGaming products. Domain-specific concepts (RTP, bonus wagering, KYC flows) may be misunderstood during implementation, leading to minor defects in edge cases.

**Mitigation:**
Include a domain onboarding session as part of sprint 0. Reference the iGaming domain glossary in the Handoff document.

**Contingency:**
Schedule a BA review checkpoint after the first feature is implemented end-to-end.

**Owner:** Product Manager
