# Development Handoff: Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-08
**Slug:** dragon-fortune
**References:** All pipeline artifacts

---

## 1. Artifact Inventory

| # | Artifact | File | Status |
|---|---------|------|--------|
| 0 | Project Principles | `00_principles_dragon-fortune.md` | ✅ Final |
| 1 | Project Brief | `01_brief_dragon-fortune.md` | ✅ Final |
| 2 | Requirements (SRS) | `02_srs_dragon-fortune.md` | ✅ Final |
| 3 | User Stories | `03_stories_dragon-fortune.md` | ✅ Final |
| 4 | Use Cases | `04_usecases_dragon-fortune.md` | ✅ Final |
| 5 | Acceptance Criteria | `05_ac_dragon-fortune.md` | ✅ Final |
| 6 | Non-functional Requirements | `06_nfr_dragon-fortune.md` | ✅ Final |
| 7 | Data Dictionary | `07_datadict_dragon-fortune.md` | ✅ Final |
| 7a | Technology Research | `07a_research_dragon-fortune.md` | ✅ Final |
| 8 | API Contract | `08_apicontract_dragon-fortune.md` | ✅ Final |
| 9 | Wireframes | `09_wireframes_dragon-fortune.md` | ✅ Final |
| 10 | Validation Scenarios | `10_scenarios_dragon-fortune.md` | ✅ Final |
| — | Risk Register | `00_risks_dragon-fortune.md` | ✅ Final |
| — | Sprint Plan | `00_sprint_dragon-fortune.md` | ✅ Final |

---

## 2. MVP Scope

**In MVP (20 User Stories across 4 sprints, 8 weeks):**

| Epic | Stories | Sprint |
|------|---------|--------|
| E-01 Auth | US-001 | SP-01 |
| E-02 Gameplay | US-002, US-003, US-006 | SP-01 |
| E-03 Wallet | US-004, US-007, US-008, US-009, US-010 | SP-01–SP-02 |
| E-04 Compliance/KYC | US-011 | SP-02 |
| E-05 Responsible Gambling | US-005, US-015, US-016 | SP-01, SP-03 |
| E-06 Referrals | US-012, US-013, US-014 | SP-03 |
| E-07 Admin | US-017, US-018, US-019, US-020 | SP-04 |

**Out of MVP (post-launch):**
- US-021: Export transaction history as PDF
- US-022: Multi-language support
- US-023: Live chat support
- US-024: Affiliate partner dashboard

---

## 3. Traceability Coverage

| Chain | Coverage | Uncovered |
|-------|---------|-----------|
| FR → US | 15/15 (100%) | — |
| Must US → AC | 13/13 (100%) | — |
| US → UC | 10/13 Must (77%) | US-004, US-005, US-016 (no UC needed — simple CRUD) |
| NFR → metric | 10/10 (100%) | — |
| Entity → FR | 9/9 (100%) | — |
| API endpoint → FR | 22/22 (100%) | — |
| WF → US | 6/6 screens → all Must US covered | — |
| Scenario FR coverage | 10/15 FRs (67%) | FR-006, FR-008, FR-012, FR-013, FR-014 (low-risk CRUD; covered by AC) |

---

## 4. Recommended Development Sequence

1. **SP-00 (Setup):** CI/CD, DB schema (Flyway), Telegram Mini App scaffold, RNG service contract signed, payment aggregator sandbox access confirmed.
2. **SP-01:** Auth (US-001) first — all other stories depend on it. Spin execution (US-003) is the riskiest story — tackle early to validate RNG integration and performance budget (NFR-001).
3. **SP-02:** Payment integration — validate deposit webhook handling with the aggregator's sandbox before starting withdrawal logic.
4. **SP-03:** Referral and bonus logic — ensure Bonus state machine (active → wagered → released/expired) is unit-tested to 80% coverage (NFR-008).
5. **SP-04:** Admin panel — can be developed in parallel with SP-03 once the Player and GameConfig entities are stable.

---

## 5. Integration Prerequisites

Before sprint 1 begins, the following must be confirmed:

| Dependency | Owner | Required by |
|------------|-------|-------------|
| RNG service API credentials and sandbox | Tech Lead | SP-01 |
| Payment aggregator sandbox + webhook URL registered | Tech Lead | SP-02 |
| KYC provider test account and API key | Compliance Officer | SP-02 |
| Telegram Bot Token for auth hash verification | Product Owner | SP-01 |
| iGaming licence status update | Product Owner | Pre-launch |
| RTP certification schedule with testing lab | Compliance Officer | Pre-launch |

---

## 6. Open Items

| # | Item | Severity | Owner | Target |
|---|------|---------|-------|--------|
| OI-001 | FR-013 (self-exclusion) demoted to Won't for CIS launch; must be promoted to Must before EU expansion | HIGH | Compliance Officer | Pre-EU launch |
| OI-002 | Fallback payment provider (RISK-01 mitigation) not yet contracted | HIGH | Product Owner | SP-02 start |
| OI-003 | RTP certification timeline not confirmed with testing lab | HIGH | Compliance Officer | SP-00 |
| OI-004 | Leaderboard real-time updates deferred to post-MVP (ADR-002) | LOW | Tech Lead | v1.2 |
| OI-005 | Scenario coverage for FR-006, FR-008, FR-012–FR-014 is AC-only; add E2E tests before v1.1 | MEDIUM | QA | v1.1 |

---

## 7. Key Decisions Carried Forward

| Decision | Rationale | Artifact |
|----------|-----------|---------|
| REST over WebSocket for spin flow | Request-response simplicity; WebSocket deferred to leaderboard feature | ADR-002 |
| Single payment aggregator | Unified API for crypto + fiat; faster integration | ADR-003 |
| Certified managed RNG service | Avoids 6–12 month in-house certification | ADR-005 |
| PostgreSQL for all financial data | ACID transactions; FK integrity; JSONB for spin matrix | ADR-004 |
| React + Vite for Mini App frontend | Team familiarity; build performance for 3 s load budget | ADR-001 |

---

## 8. Definition of Done — Project Level

The MVP is ready for production launch when:

- [ ] All 20 planned User Stories have passed acceptance testing.
- [ ] No CRITICAL or HIGH open `/analyze` findings.
- [ ] NFR-001 (spin ≤ 200 ms p95) and NFR-002 (10,000 concurrent users) validated by load test.
- [ ] NFR-003 (99.9% uptime) monitoring in place with alerting configured.
- [ ] RTP certification letter received from accredited testing laboratory.
- [ ] iGaming operating licence obtained (or soft-launch jurisdiction confirmed as unregulated).
- [ ] KYC and payment provider SLAs signed.
- [ ] Security penetration test completed; no Critical or High findings open.
- [ ] GDPR data processing agreement signed with all third-party processors.
- [ ] Responsible gambling controls tested per NFR-007 checklist.
