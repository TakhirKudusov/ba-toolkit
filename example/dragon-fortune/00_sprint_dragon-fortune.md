# Sprint Plan: Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-08
**Slug:** dragon-fortune
**Sprint length:** 2 weeks
**Team velocity:** 35 SP per sprint
**Sources:** `03_stories_dragon-fortune.md`, `00_risks_dragon-fortune.md`, `02_srs_dragon-fortune.md`

---

## Summary

| Sprint | Goal | Stories | Points | Capacity |
|--------|------|:-------:|:------:|:--------:|
| SP-00 | Setup: environment, CI/CD, Telegram Mini App scaffold | — | — | — |
| SP-01 | Players can register via Telegram and spin a slot for the first time | 6 | 34 SP | 97% |
| SP-02 | Players can deposit, withdraw, and verify their identity | 5 | 32 SP | 91% |
| SP-03 | Referral programme and responsible gambling controls are live | 5 | 30 SP | 86% |
| SP-04 | Admin panel: player management, game configuration, reporting | 4 | 28 SP | 80% |
| **Total** | | **20** | **124 SP** | |

**Planned:** 20 stories / 124 SP across 4 sprints (8 weeks)
**Unplanned backlog:** 4 stories / 18 SP

---

## Sprint Details

### SP-00 — Setup and environment

**Duration:** Week 0 (pre-sprint)
**Capacity:** Setup only — no Story Points assigned

**Tasks:**
- Configure CI/CD pipeline (GitHub Actions): lint, test, Docker build on every PR.
- Provision PostgreSQL + Redis on staging.
- Scaffold Telegram Mini App project: React + Vite + `useTelegram` adapter hook (ADR-001).
- Establish baseline DB schema (Flyway migration v1) from `07_datadict_dragon-fortune.md`.
- Confirm RNG service API credentials and sandbox access (integration prerequisite).
- Domain onboarding session: team reviews iGaming domain reference and project glossary.

**Definition of Done for SP-00:**
- [ ] All developers can run the project locally with `docker-compose up`.
- [ ] Staging environment is accessible from a Telegram client.
- [ ] Base CI pipeline passes on a "hello world" endpoint.

---

### SP-01 — Players can register via Telegram and spin a slot for the first time

**Duration:** Weeks 1–2
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-001 | Register and log in via Telegram | E-01 Auth | Must | RISK-02 ↑ | 5 SP |
| US-002 | Launch the slot game | E-02 Gameplay | Must | — | 3 SP |
| US-003 | Execute a spin | E-02 Gameplay | Must | RISK-03 ↑ | 13 SP |
| US-004 | View wallet balance | E-03 Wallet | Must | — | 3 SP |
| US-005 | Receive session time warning | E-05 Resp. Gambling | Must | — | 5 SP |
| US-006 | View game history | E-02 Gameplay | Should | — | 5 SP |

**Sprint total:** 34 SP / 35 SP capacity (97%)

**Definition of Done for SP-01:**
- [ ] All stories pass their Acceptance Criteria (`05_ac_dragon-fortune.md`).
- [ ] Telegram login tested on iOS and Android Telegram clients.
- [ ] Spin endpoint p95 ≤ 200 ms verified in load test (k6, 200 concurrent users).
- [ ] RNG seed stored in every Spin record for audit.
- [ ] Session warning fires within 30 s of 60-minute threshold.

---

### SP-02 — Players can deposit, withdraw, and verify their identity

**Duration:** Weeks 3–4
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-007 | Deposit via cryptocurrency | E-03 Wallet | Must | RISK-01 ↑ | 8 SP |
| US-008 | Deposit via local payment system | E-03 Wallet | Must | RISK-01 ↑ | 8 SP |
| US-009 | Request a withdrawal | E-03 Wallet | Must | — | 8 SP |
| US-010 | View transaction history | E-03 Wallet | Should | — | 5 SP |
| US-011 | Complete KYC identity verification | E-04 Compliance | Must | — | 3 SP |

**Sprint total:** 32 SP / 35 SP capacity (91%)

**Definition of Done for SP-02:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] Deposit webhook idempotency confirmed (duplicate webhooks do not double-credit).
- [ ] Withdrawal blocked for unverified players attempting > 50 USD.
- [ ] KYC status webhook processed correctly in all 3 states (pending, verified, rejected).
- [ ] Payment provider sandbox integration verified end-to-end.

---

### SP-03 — Referral programme and responsible gambling controls are live

**Duration:** Weeks 5–6
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-012 | Share a referral link | E-06 Referrals | Must | RISK-04 ↑ | 8 SP |
| US-013 | Claim welcome bonus on first deposit | E-06 Referrals | Must | — | 5 SP |
| US-014 | View active bonuses and wagering progress | E-06 Referrals | Should | — | 5 SP |
| US-015 | Set self-exclusion | E-05 Resp. Gambling | Should | — | 5 SP |
| US-016 | Configure deposit limits | E-05 Resp. Gambling | Should | — | 7 SP |

**Sprint total:** 30 SP / 35 SP capacity (86%)

**Definition of Done for SP-03:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] Self-referral fraud detection blocks same-Telegram-ID attempts.
- [ ] Self-exclusion takes effect within 5 minutes of confirmation.
- [ ] Deposit limit decrease effective immediately; increase has 24 h delay.
- [ ] Bonus wagering state machine unit-tested to ≥ 80% coverage (NFR-008).

---

### SP-04 — Admin panel: player management, game configuration, reporting

**Duration:** Weeks 7–8
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-017 | View and search player accounts | E-07 Admin | Must | — | 5 SP |
| US-018 | Adjust RTP and game configuration | E-07 Admin | Must | — | 8 SP |
| US-019 | View revenue and activity report | E-07 Admin | Should | — | 8 SP |
| US-020 | Flag a player account for review | E-07 Admin | Should | — | 7 SP |

**Sprint total:** 28 SP / 35 SP capacity (80%)

**Definition of Done for SP-04:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] RTP change blocked if outside 94–97% range.
- [ ] Second-admin approval flow tested end-to-end.
- [ ] New GameConfig takes effect on next spin cycle; previous version archived.
- [ ] All admin actions logged in the immutable audit trail.

---

## Unplanned Backlog

| US | Title | Epic | Priority | Estimate | Reason |
|----|-------|------|---------|---------|--------|
| US-021 | Export transaction history as PDF | E-03 Wallet | Could | 5 SP | Capacity exceeded — defer to v1.1 |
| US-022 | Multi-language support (EN / RU / KZ) | E-01 Auth | Could | 8 SP | Deferred — requires i18n infrastructure |
| US-023 | Live chat support widget | — | Could | 3 SP | Deferred — third-party integration |
| US-024 | Affiliate partner dashboard | E-06 Referrals | Won't | 2 SP | Out of MVP scope |

---

## Assumptions

- Team velocity: 35 SP per sprint based on 4 full-stack developers (SP values calibrated using US-001 as 5 SP reference anchor).
- SP-00 is a setup week; its effort is not tracked in Story Points.
- Frontend and backend are developed in parallel within each sprint.
- No hard release deadline; plan targets 8-week MVP window from SP-01 start.
- RISK-01 and RISK-03 elevated stories (US-007, US-008, US-003) placed in earliest possible sprints to validate mitigations before mid-project.
