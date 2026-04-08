# Software Requirements Specification (SRS): Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-08
**Slug:** dragon-fortune
**Reference:** `01_brief_dragon-fortune.md`

## 1. Introduction

### 1.1 Purpose

This document specifies the functional requirements for Dragon Fortune — an iGaming slot game delivered as a Telegram Mini App. It serves as the primary reference for the engineering team, QA, and Compliance Officer during design, development, and acceptance testing.

### 1.2 Scope

**In scope:**
- Player authentication via Telegram.
- Slot machine gameplay with certified RNG.
- Wallet management: deposits, withdrawals, balance display, transaction history.
- KYC identity verification.
- Referral programme and bonus mechanics.
- Responsible gambling controls.
- Admin panel: player management, game configuration, revenue reporting.

**Out of scope (post-MVP):**
- Live casino games (roulette, blackjack).
- Multi-language localisation (EN, RU, KZ).
- Affiliate partner dashboard.
- Live chat support widget.

### 1.3 Definitions and Abbreviations

| Term | Definition |
|------|-----------|
| RTP | Return to Player — ratio of total payout to total wagered, expressed as a percentage |
| RNG | Random Number Generator — certified algorithm producing unpredictable spin outcomes |
| KYC | Know Your Customer — identity verification required by AML regulation |
| AML | Anti-Money Laundering |
| Mini App | Telegram-native web application |
| Session | A continuous gameplay period from first spin to exit |
| Wagering requirement | Multiplier on bonus amount that must be bet before withdrawal is allowed |
| Payline | A winning combination line across the reel grid |

### 1.4 Document References

- Project Brief: `01_brief_dragon-fortune.md`
- Project Principles: `00_principles_dragon-fortune.md`

---

## 2. General Description

### 2.1 Product Context

Dragon Fortune runs as a Telegram Mini App inside the Telegram messenger client (iOS, Android, desktop). Players open the game via a bot link or shared referral URL. The system consists of:
- A frontend (Telegram Mini App web view).
- A backend API (REST).
- A certified RNG service.
- A payment aggregator integration (deposits and withdrawals).
- A KYC provider integration.

### 2.2 User Roles

| Role | Description | Permissions |
|------|-------------|------------|
| Player | Registered user who plays the game | Authenticate, spin, deposit, withdraw, view history, manage limits |
| Compliance Officer | Internal staff responsible for regulatory adherence | View all player data, manage KYC status, set global limits |
| Admin | Internal staff managing the platform | Full player management, game configuration, reporting |
| Payment Provider | External system (API) | Process deposits and withdrawals, return KYC verification results |

### 2.3 Constraints

- **Telegram API:** Mini App must operate within the Telegram WebApp SDK constraints — no background processing, limited local storage (≤ 5 MB).
- **RTP certification:** The certified RTP range (94–97%) must not be modified without a re-certification process.
- **AML/KYC:** Withdrawals above 50 USD equivalent require completed KYC. Player identity data must be stored in compliance with GDPR.
- **Responsible gambling:** Session time limits, deposit limits, and self-exclusion are mandatory features under the iGaming licence.
- **Payment processing:** Only licensed payment aggregators may handle fiat transactions.

### 2.4 Assumptions and Dependencies

- The Telegram Mini App SDK (version pinned at `2.x`) remains stable.
- The payment aggregator provides a sandbox environment for integration testing.
- The KYC provider returns a result within 24 hours of document submission.
- A certified RNG service is available as a managed external service.
- The iGaming licence is obtained before the production launch.

---

## 3. Functional Requirements

### FR-001: Player Authentication via Telegram

- **Description:** The system must authenticate the player using their Telegram identity without requiring a separate registration form or password.
- **Actor:** Player
- **Input:** Telegram `initData` object (user id, first name, username, language code, auth date, hash).
- **Output / Result:** JWT access token issued; player account created (first login) or retrieved (returning player).
- **Business Rules:** Hash must be verified against the Telegram Bot Token before any account operation. If the Telegram user ID already exists, return the existing account. New accounts receive a welcome bonus as defined in the active promotion configuration.
- **Priority:** Must

---

### FR-002: Slot Machine Game Launch

- **Description:** The system must present the slot machine interface and allow the player to configure bet size and payline count before starting a session.
- **Actor:** Player
- **Input:** Player opens the game; selects bet amount (min–max range) and active paylines (1–20).
- **Output / Result:** Active game session created; slot reels displayed in initial state.
- **Business Rules:** Bet amount must not exceed the player's current wallet balance. Session start is logged with timestamp and player ID.
- **Priority:** Must

---

### FR-003: Slot Spin Execution

- **Description:** The system must execute a slot spin, deduct the bet from the player wallet, call the certified RNG, calculate the result, and credit any winnings.
- **Actor:** Player
- **Input:** Active session ID; bet amount; selected payline count.
- **Output / Result:** Spin result (5×3 symbol matrix, winning paylines, payout amount); updated wallet balance; spin record saved.
- **Business Rules:** Bet must not exceed wallet balance — reject spin if balance insufficient. RTP must remain within 94–97% over a rolling 10,000 spin window. Maximum win per spin: 5,000× bet. Spin result must be deterministic given the RNG seed (for audit).
- **Priority:** Must

---

### FR-004: Wallet Balance Display

- **Description:** The system must display the player's current wallet balance and the last 5 spin outcomes on the main game screen.
- **Actor:** Player
- **Input:** Authenticated player session.
- **Output / Result:** Current balance (formatted currency); last 5 spin results (win/loss, amount).
- **Business Rules:** Balance is read in real time from the wallet service — no caching allowed.
- **Priority:** Must

---

### FR-005: Cryptocurrency Deposit

- **Description:** The system must allow players to deposit funds via BTC or USDT by generating a unique deposit address.
- **Actor:** Player, Payment Provider
- **Input:** Player selects cryptocurrency (BTC / USDT); payment aggregator generates deposit address.
- **Output / Result:** Deposit address and QR code displayed; balance credited when transaction is confirmed on-chain (1 confirmation for USDT, 2 for BTC).
- **Business Rules:** Minimum deposit: 5 USD equivalent. Deposit address is single-use per transaction. Confirmations required before credit: 1 (USDT/ERC-20), 2 (BTC). Exchange rate locked at confirmation time.
- **Priority:** Must

---

### FR-006: Local Payment System Deposit

- **Description:** The system must allow players to deposit via Qiwi, YooMoney, or SBP (Faster Payments).
- **Actor:** Player, Payment Provider
- **Input:** Player selects payment system and enters amount; redirected to payment provider form.
- **Output / Result:** Payment processed; balance credited upon provider webhook confirmation.
- **Business Rules:** Minimum deposit: 100 RUB equivalent. Deposit is credited within 5 minutes of payment provider confirmation. Failed or pending payments must not credit the wallet.
- **Priority:** Must

---

### FR-007: Wallet Withdrawal Request

- **Description:** The system must allow players to request a withdrawal of their wallet balance to a cryptocurrency address or registered bank card.
- **Actor:** Player
- **Input:** Withdrawal amount; destination address (crypto) or registered card (fiat).
- **Output / Result:** Withdrawal request created with status "Pending"; processed within 24 hours; wallet balance debited immediately on request.
- **Business Rules:** Minimum withdrawal: 10 USD equivalent. KYC must be completed before withdrawals above 50 USD equivalent. Active wagering requirements on bonuses must be met before bonus-derived funds can be withdrawn. Wallet balance is debited at request time; refunded if payment fails.
- **Priority:** Must

---

### FR-008: Transaction History

- **Description:** The system must display a paginated list of all wallet transactions for the authenticated player.
- **Actor:** Player
- **Input:** Authenticated player session; optional filters (date range, type: deposit/withdrawal/win/loss).
- **Output / Result:** Paginated list of transactions (type, amount, currency, status, timestamp); total count.
- **Business Rules:** Transactions are displayed newest-first. All transactions are retained for a minimum of 5 years per AML compliance. Page size: 20 records.
- **Priority:** Should

---

### FR-009: KYC Identity Verification

- **Description:** The system must initiate a KYC verification flow for players who request withdrawals above 50 USD equivalent or who trigger an AML risk flag.
- **Actor:** Player, Payment Provider (KYC service)
- **Input:** Player submits identity documents (passport or national ID + selfie) via the KYC provider's embedded form.
- **Output / Result:** KYC status updated (Pending → Verified or Rejected); player notified via Telegram message.
- **Business Rules:** KYC result received within 24 hours. "Rejected" status blocks all withdrawals. "Verified" status unlocks full withdrawal limits. KYC data is stored at the KYC provider — only status and verification ID are stored in the Dragon Fortune database.
- **Priority:** Must

---

### FR-010: Referral Link Generation and Tracking

- **Description:** The system must allow players to generate a personal referral link and track the registration and deposit activity of referred players.
- **Actor:** Player
- **Input:** Player requests referral link.
- **Output / Result:** Unique referral URL generated (contains player ID as referrer); referee list with registration date and first deposit status displayed.
- **Business Rules:** Referral link is permanent for the player's account. A player cannot use their own referral link. Referral attribution is recorded at the referee's first login.
- **Priority:** Must

---

### FR-011: Referral Bonus Crediting

- **Description:** The system must credit the referrer with a bonus when a referred player completes their first deposit.
- **Actor:** System (triggered by payment event)
- **Input:** Referred player completes first deposit ≥ 10 USD equivalent.
- **Output / Result:** Referrer receives 10% of referee's first deposit as a bonus (capped at 50 USD). Bonus is credited to referrer's wallet as a restricted bonus with 5× wagering requirement.
- **Business Rules:** Bonus is credited within 5 minutes of referee's first deposit confirmation. Each referral triggers the bonus only once. Fraudulent self-referral attempts (same device, same IP as referrer) are blocked and flagged for review.
- **Priority:** Must

---

### FR-012: Responsible Gambling — Session Time Warning

- **Description:** The system must display a warning when a player's continuous session exceeds 60 minutes, and again at 120 minutes.
- **Actor:** Player (receives warning); System (initiates)
- **Input:** Session timer reaches 60 or 120 minutes.
- **Output / Result:** Modal overlay displayed with time elapsed, session total wagered, and option to continue or exit.
- **Business Rules:** Warning cannot be dismissed without an explicit player action (Continue or Exit). If the player sets a custom session limit (FR-014), the custom limit supersedes the default 60/120-minute thresholds.
- **Priority:** Must

---

### FR-013: Responsible Gambling — Self-Exclusion

- **Description:** The system must allow a player to self-exclude from the platform for a specified period (1 week, 1 month, 3 months, 6 months, permanent).
- **Actor:** Player
- **Input:** Player selects exclusion period and confirms with a second confirmation step.
- **Output / Result:** Account blocked within 5 minutes; all active sessions terminated; player notified via Telegram message. Wallet balance preserved.
- **Business Rules:** Self-exclusion cannot be reversed before the period expires (except for "permanent", which requires a 7-day cooling-off period to reverse). During exclusion, the player cannot log in, spin, or deposit.
- **Priority:** Must

---

### FR-014: Responsible Gambling — Deposit Limits

- **Description:** The system must allow players to set daily, weekly, or monthly deposit limits.
- **Actor:** Player
- **Input:** Player selects limit type (daily / weekly / monthly) and enters amount.
- **Output / Result:** Limit saved; deposit attempts that would exceed the limit are rejected with an informative message.
- **Business Rules:** Limit decreases take effect immediately. Limit increases take effect after a 24-hour cooling-off period (anti-impulsive gambling measure). Deposit attempts exceeding the limit are rejected before the payment provider is called.
- **Priority:** Should

---

### FR-015: Admin — Player Management and Game Configuration

- **Description:** The Admin must be able to view and manage player accounts and update game configuration parameters.
- **Actor:** Admin, Compliance Officer
- **Input (player management):** Search by player ID, Telegram username, or email; update player status (Active / Suspended / Banned).
- **Input (game config):** RTP target (within certified 94–97% range), volatility setting, min/max bet, active paylines count.
- **Output / Result (player):** Player record updated; status change logged with Admin ID and timestamp.
- **Output / Result (game config):** Configuration saved; changes take effect on next spin cycle; change logged with timestamp and Admin ID.
- **Business Rules:** Admin cannot set RTP outside the certified 94–97% range. Config changes require a second-Admin confirmation for RTP changes. All admin actions are logged in an immutable audit trail.
- **Priority:** Must

---

## 4. Interface Requirements

### 4.1 User Interfaces

The frontend is a web application embedded in the Telegram Mini App WebView. It must:
- Function on iOS and Android Telegram clients (latest 2 major versions).
- Load within 3 seconds on a 4G connection.
- Support Telegram's native theme variables (dark/light mode).

### 4.2 Software Interfaces (API)

The system exposes a REST API consumed by the Mini App frontend. All endpoints require JWT authentication except `POST /auth/telegram`. API versioning: `/api/v1/`.

### 4.3 External System Interfaces

| System | Interface type | Purpose |
|--------|---------------|---------|
| Telegram Bot API | Webhook + HTTPS | Auth hash verification; send notifications to players |
| Payment Aggregator | REST API | Deposit address generation; withdrawal processing; webhook for confirmations |
| KYC Provider | REST API + embedded form | Identity verification; webhook for status updates |
| Certified RNG Service | REST API | Spin seed generation and result calculation |

---

## 5. Non-functional Requirements

_(Detailed in `06_nfr_dragon-fortune.md`)_

| Category | Summary | NFR Reference |
|----------|---------|---------------|
| Performance | Spin API response ≤ 200 ms at p95 | NFR-001 |
| Scalability | Support 10,000 concurrent players | NFR-002 |
| Availability | 99.9% uptime (≤ 8.7 h downtime/year) | NFR-003 |
| Security | JWT auth, HTTPS, encrypted PII at rest | NFR-004, NFR-005 |
| Compliance | RTP 94–97%, AML/KYC, GDPR, responsible gambling | NFR-006, NFR-007 |
| Maintainability | Test coverage ≥ 80% on spin and payment logic | NFR-008 |

---

## 6. Priority Matrix (MoSCoW)

| Priority | FR Count | FR IDs |
|----------|---------|--------|
| Must | 11 | FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-009, FR-010, FR-011, FR-015 |
| Should | 3 | FR-008, FR-012, FR-014 |
| Could | 0 | — |
| Won't | 1 | FR-013 (self-exclusion deprioritised to v1.1 after licence review) |

> **Note:** FR-013 (self-exclusion) was reclassified from Must to Won't after the Compliance Officer confirmed the initial licence tier does not mandate it for the CIS soft-launch. It will be promoted to Must before operating in EU jurisdictions.
