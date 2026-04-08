# Sprint Plan: Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-08
**Slug:** dragon-fortune
**Sprint length:** 2 weeks
**Team velocity:** 35 SP per sprint
**Sources:** `00_estimate_dragon-fortune.md`, `03_stories_dragon-fortune.md`, `00_risks_dragon-fortune.md`, `02_srs_dragon-fortune.md`

---

## Summary

| Sprint | Goal | Stories | Points | Capacity |
|--------|------|:-------:|:------:|:--------:|
| SP-00 | Setup: environment, CI/CD, Telegram Mini App scaffold | — | — | — |
| SP-01 | Players can register via Telegram and spin a slot for the first time | 6 | 34 SP | 97% |
| SP-02 | Players can deposit, withdraw, and view wallet balance | 5 | 32 SP | 91% |
| SP-03 | Referral programme and bonus mechanics are live | 5 | 30 SP | 86% |
| SP-04 | Admin panel: player management, game configuration, reporting | 4 | 28 SP | 80% |
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
- Scaffold Telegram Mini App project with base authentication stub.
- Establish database schema baseline from `/datadict`.
- Team domain onboarding session (iGaming concepts, RTP, KYC flow).

**Definition of Done for SP-00:**
- [ ] All developers can run the project locally.
- [ ] Staging environment is accessible via Telegram.
- [ ] Base CI pipeline runs lint + unit tests on every push.

---

### SP-01 — Players can register via Telegram and spin a slot for the first time

**Duration:** Weeks 1–2
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-001 | Register via Telegram | E-01 Auth | Must | RISK-02 ↑ | 5 SP |
| US-002 | Launch slot game from Mini App | E-02 Gameplay | Must | — | 3 SP |
| US-003 | Execute a spin and see result | E-02 Gameplay | Must | RISK-03 ↑ | 13 SP |
| US-004 | View current wallet balance | E-03 Wallet | Must | — | 3 SP |
| US-005 | See responsible gambling session limit warning | E-05 Compliance | Must | — | 5 SP |
| US-006 | View game history (last 20 spins) | E-02 Gameplay | Should | — | 5 SP |

**Sprint total:** 34 SP / 35 SP capacity (97%)

**Definition of Done for SP-01:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] Telegram login tested on iOS and Android Telegram clients.
- [ ] RNG certified spin result returned in under 200 ms at p95.
- [ ] No 🔴 Critical open items in `/analyze` for completed stories.

---

### SP-02 — Players can deposit, withdraw, and view wallet balance

**Duration:** Weeks 3–4
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-007 | Deposit via cryptocurrency | E-03 Wallet | Must | RISK-01 ↑ | 8 SP |
| US-008 | Deposit via local payment system | E-03 Wallet | Must | RISK-01 ↑ | 8 SP |
| US-009 | Request withdrawal | E-03 Wallet | Must | — | 8 SP |
| US-010 | View full transaction history | E-03 Wallet | Should | — | 5 SP |
| US-011 | Complete KYC identity verification | E-04 Compliance | Must | — | 3 SP |

**Sprint total:** 32 SP / 35 SP capacity (91%)

**Definition of Done for SP-02:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] Payment provider sandbox integration verified end-to-end.
- [ ] KYC flow tested with test credentials from the provider.
- [ ] Withdrawal processed within 24 h in staging environment.

---

### SP-03 — Referral programme and bonus mechanics are live

**Duration:** Weeks 5–6
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-012 | Share referral link and earn bonus | E-06 Referrals | Must | RISK-04 ↑ | 8 SP |
| US-013 | Claim welcome bonus on first deposit | E-06 Referrals | Must | — | 5 SP |
| US-014 | View active bonuses and wagering progress | E-06 Referrals | Should | — | 5 SP |
| US-015 | Set self-exclusion period | E-05 Compliance | Must | — | 5 SP |
| US-016 | Configure deposit limits | E-05 Compliance | Should | — | 7 SP |

**Sprint total:** 30 SP / 35 SP capacity (86%)

**Definition of Done for SP-03:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] Fraud scoring on referral payouts is active and logged.
- [ ] Self-exclusion blocks all game access within 5 minutes of activation.

---

### SP-04 — Admin panel: player management, game configuration, reporting

**Duration:** Weeks 7–8
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-017 | Admin views player list and profile | E-07 Admin | Must | — | 5 SP |
| US-018 | Admin adjusts RTP and payline configuration | E-07 Admin | Must | — | 8 SP |
| US-019 | Admin views revenue and activity report | E-07 Admin | Should | — | 8 SP |
| US-020 | Admin flags a player account for review | E-07 Admin | Should | — | 7 SP |

**Sprint total:** 28 SP / 35 SP capacity (80%)

**Definition of Done for SP-04:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] RTP configuration change takes effect within 1 spin cycle.
- [ ] Revenue report matches transaction ledger to within 0.01%.

---

## Unplanned Backlog

Stories not assigned to any sprint — below MVP capacity or marked Could/Won't:

| US | Title | Epic | Priority | Estimate | Reason |
|----|-------|------|---------|---------|--------|
| US-021 | Export transaction history as PDF | E-03 Wallet | Could | 5 SP | Capacity exceeded — defer to v1.1 |
| US-022 | Multi-language support (EN / RU / KZ) | E-01 Auth | Could | 8 SP | Deferred — requires i18n infrastructure |
| US-023 | Live chat support widget | E-08 Support | Could | 3 SP | Deferred — third-party integration |
| US-024 | Affiliate dashboard | E-06 Referrals | Won't | 2 SP | Out of MVP scope |

---

## Assumptions

- Sprint velocity: 35 SP based on a team of 4 full-stack developers (2 sprints of historical data from similar projects).
- SP-00 is a pre-sprint setup week; its effort is not tracked in Story Points.
- Frontend and backend are developed in parallel within each sprint.
- No hard release deadline was specified; the plan targets an 8-week MVP delivery window.
- Risk-elevated stories (RISK-01, RISK-02, RISK-03, RISK-04) were pulled into earlier sprints to validate mitigations sooner.
