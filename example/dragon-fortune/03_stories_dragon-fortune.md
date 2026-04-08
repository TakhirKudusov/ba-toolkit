# User Stories: Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-08
**Slug:** dragon-fortune
**References:** `01_brief_dragon-fortune.md`, `02_srs_dragon-fortune.md`

## Epic Index

| # | Epic | User Stories |
|---|------|-------------|
| E-01 | Auth & Onboarding | US-001 |
| E-02 | Gameplay | US-002, US-003, US-006 |
| E-03 | Wallet | US-004, US-007, US-008, US-009, US-010 |
| E-04 | Compliance & KYC | US-011 |
| E-05 | Responsible Gambling | US-005, US-015, US-016 |
| E-06 | Referrals & Bonuses | US-012, US-013, US-014 |
| E-07 | Admin | US-017, US-018, US-019, US-020 |

---

## E-01: Auth & Onboarding

> Players can access Dragon Fortune instantly using their existing Telegram account.

### US-001: Register and log in via Telegram

**As a** new or returning player,
**I want to** open Dragon Fortune inside Telegram and be authenticated automatically,
**so that** I can start playing without filling in a registration form.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-001
**FR Reference:** FR-001
**Priority:** Must
**Estimate:** 5 SP
**Notes:** New players receive a welcome bonus on first login. Returning players resume their last wallet balance.

---

## E-02: Gameplay

> Players can launch and play the slot machine, and review their session history.

### US-002: Launch the slot game

**As a** player,
**I want to** open the slot machine screen and configure my bet and payline settings,
**so that** I can start a game session with my preferred parameters.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-002
**FR Reference:** FR-002
**Priority:** Must
**Estimate:** 3 SP
**Notes:** Bet range and payline count are read from the active GameConfig.

---

### US-003: Execute a spin

**As a** player,
**I want to** press the Spin button and see the result immediately,
**so that** I can play the game and receive payouts for winning combinations.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-003
**FR Reference:** FR-003
**Priority:** Must
**Estimate:** 13 SP
**Notes:** Largest story in the backlog — covers RNG call, payout calculation, animation trigger, and wallet debit/credit. Consider splitting if team velocity is below 35 SP.

---

### US-006: View game history

**As a** player,
**I want to** see my last 20 spin results in the current session,
**so that** I can track my recent wins and losses during gameplay.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-006
**FR Reference:** FR-004
**Priority:** Should
**Estimate:** 5 SP

---

## E-03: Wallet

> Players can deposit, withdraw, and track their funds.

### US-004: View wallet balance

**As a** player,
**I want to** see my current balance on the main game screen at all times,
**so that** I know how much I can wager.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-004
**FR Reference:** FR-004
**Priority:** Must
**Estimate:** 3 SP
**Notes:** Balance must reflect the most recent spin result without a page refresh.

---

### US-007: Deposit via cryptocurrency

**As a** player,
**I want to** deposit funds using Bitcoin or USDT,
**so that** I can fund my wallet without using a bank card.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-007
**FR Reference:** FR-005
**Priority:** Must
**Estimate:** 8 SP
**Notes:** Deposit address is single-use. Balance credited after required on-chain confirmations.

---

### US-008: Deposit via local payment system

**As a** player,
**I want to** deposit funds using Qiwi, YooMoney, or SBP,
**so that** I can top up my wallet with roubles from my local bank.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-008
**FR Reference:** FR-006
**Priority:** Must
**Estimate:** 8 SP

---

### US-009: Request a withdrawal

**As a** player,
**I want to** withdraw my wallet balance to a crypto address or bank card,
**so that** I can access my winnings.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-009
**FR Reference:** FR-007
**Priority:** Must
**Estimate:** 8 SP
**Notes:** KYC must be completed for withdrawals above 50 USD equivalent (FR-009).

---

### US-010: View transaction history

**As a** player,
**I want to** see a paginated list of all my deposits, withdrawals, wins, and losses,
**so that** I can verify my account activity and reconcile my balance.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-010
**FR Reference:** FR-008
**Priority:** Should
**Estimate:** 5 SP

---

## E-04: Compliance & KYC

> Players complete identity verification to unlock full withdrawal limits.

### US-011: Complete KYC identity verification

**As a** player who wants to withdraw more than 50 USD,
**I want to** submit my identity documents through the verification form,
**so that** my account is verified and I can make large withdrawals.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-011
**FR Reference:** FR-009
**Priority:** Must
**Estimate:** 3 SP
**Notes:** KYC is handled by the third-party provider's embedded form. Integration effort is primarily webhook handling and status storage.

---

## E-05: Responsible Gambling

> Players can manage their gambling behaviour with built-in controls.

### US-005: Receive session time warning

**As a** player in an active session,
**I want to** be notified when my session reaches 60 and 120 minutes,
**so that** I can make an informed decision about whether to continue playing.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-005
**FR Reference:** FR-012
**Priority:** Must
**Estimate:** 5 SP

---

### US-015: Set self-exclusion

**As a** player who wants to stop gambling,
**I want to** self-exclude from the platform for a specified period,
**so that** I cannot access my account during that time.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-015
**FR Reference:** FR-013
**Priority:** Should
**Estimate:** 5 SP

---

### US-016: Configure deposit limits

**As a** player,
**I want to** set a daily, weekly, or monthly deposit limit,
**so that** I can control how much I spend on the platform.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-016
**FR Reference:** FR-014
**Priority:** Should
**Estimate:** 7 SP
**Notes:** Limit increases have a 24-hour cooling-off period.

---

## E-06: Referrals & Bonuses

> Players earn bonuses by inviting friends and participating in promotions.

### US-012: Share a referral link

**As a** player,
**I want to** generate and share my personal referral link,
**so that** I can invite friends and earn a bonus when they make their first deposit.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-012
**FR Reference:** FR-010
**Priority:** Must
**Estimate:** 8 SP

---

### US-013: Claim welcome bonus on first deposit

**As a** new player making my first deposit,
**I want to** automatically receive a welcome bonus,
**so that** I have extra funds to explore the game.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-013
**FR Reference:** FR-011
**Priority:** Must
**Estimate:** 5 SP
**Notes:** Welcome bonus is separate from referral bonus — a new player can receive both.

---

### US-014: View active bonuses and wagering progress

**As a** player with an active bonus,
**I want to** see my bonus balance and how much I still need to wager to unlock it,
**so that** I can plan my gameplay accordingly.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-014
**FR Reference:** FR-011
**Priority:** Should
**Estimate:** 5 SP

---

## E-07: Admin

> Admins manage player accounts and configure game parameters.

### US-017: View and search player accounts

**As an** admin,
**I want to** search for a player by ID, username, or phone number and view their profile,
**so that** I can assist with support requests and compliance checks.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-017
**FR Reference:** FR-015
**Priority:** Must
**Estimate:** 5 SP

---

### US-018: Adjust RTP and game configuration

**As an** admin,
**I want to** update the RTP target, volatility, and bet limits within the certified range,
**so that** the game parameters match the current business and compliance requirements.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-018
**FR Reference:** FR-015
**Priority:** Must
**Estimate:** 8 SP
**Notes:** RTP changes require second-admin confirmation and are applied on the next spin cycle.

---

### US-019: View revenue and activity report

**As an** admin,
**I want to** see a revenue summary by day, week, or month with player activity metrics,
**so that** I can monitor business performance.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-019
**FR Reference:** FR-015
**Priority:** Should
**Estimate:** 8 SP

---

### US-020: Flag a player account for review

**As an** admin or compliance officer,
**I want to** flag a suspicious player account and suspend it pending investigation,
**so that** potential fraud or AML violations are contained quickly.

**Acceptance Criteria:** → `05_ac_dragon-fortune.md` → US-020
**FR Reference:** FR-015
**Priority:** Should
**Estimate:** 7 SP

---

## Unplanned Backlog (post-MVP)

| US | Title | Epic | Priority | Estimate | Reason |
|----|-------|------|---------|---------|--------|
| US-021 | Export transaction history as PDF | E-03 Wallet | Could | 5 SP | Capacity exceeded — defer to v1.1 |
| US-022 | Multi-language support (EN / RU / KZ) | E-01 Auth | Could | 8 SP | Deferred — requires i18n infrastructure |
| US-023 | Live chat support widget | — | Could | 3 SP | Deferred — third-party integration |
| US-024 | Affiliate partner dashboard | E-06 Referrals | Won't | 2 SP | Out of MVP scope |

---

## Coverage Summary

| Priority | Story Count | Story IDs |
|----------|------------|-----------|
| Must | 12 | US-001 – US-003, US-004, US-005, US-007 – US-009, US-011 – US-013, US-017, US-018 |
| Should | 8 | US-006, US-010, US-014 – US-016, US-019, US-020 |
| Could | 3 | US-021, US-022, US-023 |
| Won't | 1 | US-024 |

**Total stories:** 24
**Total epics:** 7
