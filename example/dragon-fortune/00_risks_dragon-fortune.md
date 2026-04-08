# Risk Register: Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-08
**Slug:** dragon-fortune
**Sources:** `01_brief_dragon-fortune.md`, `02_srs_dragon-fortune.md`, `06_nfr_dragon-fortune.md`, `07a_research_dragon-fortune.md`, `08_apicontract_dragon-fortune.md`

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
| RISK-03 | Real-time spin throughput at scale unproven | Technical | 3 | 3 | 9 | 🟡 High | Open |
| RISK-04 | Scope creep from stakeholder wish list | Business | 3 | 2 | 6 | 🟢 Medium | Open |
| RISK-05 | Telegram Mini App SDK breaking changes | External | 2 | 3 | 6 | 🟢 Medium | Open |
| RISK-06 | Data model instability after /datadict finalisation | Technical | 2 | 3 | 6 | 🟢 Medium | Open |
| RISK-07 | Development team unfamiliar with iGaming domain | Business | 2 | 1 | 2 | ⚪ Low | Open |

---

## Risk Details

### RISK-01 — Payment provider SLA not guaranteed

**Category:** External
**Probability:** 4 / 5 — Likely
**Impact:** 5 / 5 — Critical
**Score:** 20 🔴 Critical
**Status:** Open
**Source:** `07a_research_dragon-fortune.md` (ADR-003), `08_apicontract_dragon-fortune.md`

**Description:**
The selected payment aggregator has not provided a written SLA. If the provider experiences downtime during peak traffic, deposit and withdrawal webhooks will fail, player funds will be delayed, and trust will erode. This is the highest-impact risk in the project.

**Mitigation:**
Negotiate and sign an SLA before sprint 2 begins (see OI-002 in `11_handoff_dragon-fortune.md`). Contract a fallback payment aggregator. Implement the `PaymentGatewayService` interface (ADR-003) so the fallback can be activated via a feature flag without code changes.

**Contingency:**
If the primary provider's error rate exceeds 5% over a 5-minute window, automatically route new deposit/withdrawal requests to the fallback provider. Alert the Tech Lead and Product Owner immediately.

**Owner:** Product Owner

---

### RISK-02 — Regulatory approval timeline unknown

**Category:** Compliance
**Probability:** 3 / 5 — Possible
**Impact:** 4 / 5 — Major
**Score:** 12 🟡 High
**Status:** Open
**Source:** `01_brief_dragon-fortune.md`

**Description:**
The iGaming licence application is in progress. The timeline is estimated at 3 months but is not guaranteed. If the approval is delayed, the production launch must be postponed regardless of development readiness.

**Mitigation:**
Engage legal counsel to track approval status weekly. Decouple development milestones from the licensing timeline. Prepare a soft-launch plan for an unregulated CIS market that can be activated while the primary jurisdiction approval is pending.

**Contingency:**
Execute the soft-launch contingency (unregulated market) to generate initial revenue and user data. Re-submit licence application with any compliance gaps resolved.

**Owner:** Product Owner / Compliance Officer

---

### RISK-03 — Real-time spin throughput at scale unproven

**Category:** Technical
**Probability:** 3 / 5 — Possible
**Impact:** 3 / 5 — Moderate
**Score:** 9 🟡 High
**Status:** Open
**Source:** `07a_research_dragon-fortune.md` (ADR-002), `06_nfr_dragon-fortune.md` (NFR-001, NFR-002)

**Description:**
The spin execution path (POST /games/sessions/:id/spins) must respond in ≤ 200 ms p95 at 10,000 concurrent users. This relies on the RNG service API responding in ≤ 50 ms. Neither the RNG service SLA nor the system's full-stack performance has been tested under load.

**Mitigation:**
Conduct a load test spike in sprint 1 using k6 at 500 concurrent users. Define the RNG service SLA (≤ 50 ms) in the provider contract before development begins. Instrument the spin endpoint with distributed tracing from day 1.

**Contingency:**
If NFR-001 cannot be met at 10,000 concurrent users, introduce a request queue with a player-visible "Processing…" state (max 1-second wait). This degrades experience but preserves correctness.

**Owner:** Tech Lead

---

### RISK-04 — Scope creep from stakeholder wish list

**Category:** Business
**Probability:** 3 / 5 — Possible
**Impact:** 2 / 5 — Minor
**Score:** 6 🟢 Medium
**Status:** Open
**Source:** `01_brief_dragon-fortune.md`

**Description:**
Several features were explicitly marked out of scope (live casino, affiliate dashboard, multi-language) but stakeholders indicated they "might be needed before launch." Without a formal change control process, these items risk being re-introduced mid-sprint, inflating scope and pushing the delivery date.

**Mitigation:**
Establish a formal change request process documented in `11_handoff_dragon-fortune.md`. All scope additions require a written request, impact assessment, and sign-off by the Product Owner before they enter the backlog. Stories must go through `/stories` and `/estimate` before sprint assignment.

**Contingency:**
Freeze scope at the start of each sprint (sprint planning gate). Defer any mid-sprint additions to the next sprint backlog with a documented trade-off.

**Owner:** Product Owner

---

### RISK-05 — Telegram Mini App SDK breaking changes

**Category:** External
**Probability:** 2 / 5 — Unlikely
**Impact:** 3 / 5 — Moderate
**Score:** 6 🟢 Medium
**Status:** Open
**Source:** `07a_research_dragon-fortune.md` (ADR-001)

**Description:**
Telegram has released breaking changes to the Mini Apps SDK in previous major versions. If the SDK API changes after the frontend is built, UI components, deep links, and theme variable bindings may require rework.

**Mitigation:**
Pin the Telegram Web App SDK to version `2.x` in `package.json`. Wrap all SDK calls in the `useTelegram` adapter hook (ADR-001) — this is the sole point of contact with `window.Telegram.WebApp`. Monitor the `@twa-dev/sdk` release notes and Telegram changelog weekly.

**Contingency:**
Allocate a 3-day buffer in the release plan for SDK compatibility fixes. If a major breaking change is released, assess impact on the `useTelegram` hook only — all other code should be unaffected.

**Owner:** Tech Lead / Frontend Lead

---

### RISK-06 — Data model instability after /datadict finalisation

**Category:** Technical
**Probability:** 2 / 5 — Unlikely
**Impact:** 3 / 5 — Moderate
**Score:** 6 🟢 Medium
**Status:** Open
**Source:** `07_datadict_dragon-fortune.md`

**Description:**
The Data Dictionary was finalised before the API Contract was fully detailed. Late-stage entity or field changes discovered during API design or sprint development may require cascading updates to SRS, Stories, AC, and the Data Dictionary itself.

**Mitigation:**
Run `/trace` after `/apicontract` to detect cross-artifact inconsistencies. Treat the Data Dictionary as the source of truth — all schema migrations must be reflected there before the affected sprint begins.

**Contingency:**
Use `/revise` on affected artifacts to propagate changes. Document the delta in `11_handoff_dragon-fortune.md` open items list. Use Flyway migration versioning to track DB schema changes.

**Owner:** Business Analyst / Tech Lead

---

### RISK-07 — Development team unfamiliar with iGaming domain

**Category:** Business
**Probability:** 2 / 5 — Unlikely
**Impact:** 1 / 5 — Negligible
**Score:** 2 ⚪ Low
**Status:** Open
**Source:** `01_brief_dragon-fortune.md`

**Description:**
The engineering team has limited prior experience with iGaming products. Domain-specific concepts (RTP calculation, wagering requirements, KYC flow, AML triggers) may be misunderstood during implementation, leading to edge-case defects that are costly to fix post-launch.

**Mitigation:**
Include a domain onboarding session as the first activity in SP-00. The Business Analyst presents the iGaming domain reference (`skills/references/domains/igaming.md`) and walks through the Glossary section of `01_brief_dragon-fortune.md`. The Handoff document references this glossary for all team members.

**Contingency:**
Schedule a BA review checkpoint after the first end-to-end feature (auth + spin) is implemented. Review AC against actual behaviour before sprint 1 closes.

**Owner:** Business Analyst
