# Validation Scenarios: Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-08
**Slug:** dragon-fortune
**References:** `03_stories_dragon-fortune.md`, `05_ac_dragon-fortune.md`, `09_wireframes_dragon-fortune.md`, `08_apicontract_dragon-fortune.md`

---

## Scenario Index

| ID | Title | Persona | Key artifacts covered |
|----|-------|---------|----------------------|
| SC-001 | New player first spin journey | Alexei (new player) | US-001, US-002, US-003, US-004 |
| SC-002 | Player deposit and withdrawal cycle | Maria (active player) | US-007, US-009, US-011 |
| SC-003 | Referral link sharing and bonus activation | Oleg (referrer) + Ivan (referee) | US-012, US-013 |
| SC-004 | Admin adjusts RTP configuration | Admin Dmitri | US-018 |

---

## SC-001: New Player First Spin Journey

**Persona:** Alexei, 28, Moscow. Casual mobile gamer. Opens Dragon Fortune via a shared Telegram link for the first time.
**Goal:** Register, understand the interface, and complete his first spin.
**Entry point:** Telegram bot link `t.me/DragonFortuneBot`

| Step | Action | Expected Result | AC Reference | API Call |
|------|--------|----------------|--------------|----------|
| 1 | Alexei taps the bot link in Telegram | Telegram opens the Mini App WebView; Dragon Fortune loads | AC-001-01 | — |
| 2 | Mini App sends Telegram `initData` to the backend | System verifies hash, creates Player record, creates Wallet (balance: 0), credits welcome bonus (10 USD, 3× wagering) | AC-001-01 | POST /auth/telegram |
| 3 | Alexei sees the slot game screen (WF-001) | Balance shows "10.00 USD (bonus)"; Spin button visible | AC-004-01 | GET /wallet |
| 4 | Alexei sets bet to 0.10 USD and 10 paylines | Bet selector shows 0.10 USD; payline slider at 10 | AC-002-01 | — |
| 5 | Alexei presses Spin | System debits 0.10 USD from bonusBalance, calls RNG, returns result | AC-003-01 | POST /games/sessions (first), then POST /games/sessions/:id/spins |
| 6 | Spin returns no win | Reels stop; balance shows 9.90 USD; no win banner | AC-003-02 | — |
| 7 | Alexei spins again and wins 0.50 USD | WIN banner shows "+0.50 USD"; balance updates to 10.40 USD | AC-003-01 | POST /games/sessions/:id/spins |
| 8 | Alexei opens the Wallet screen (WF-002) | Balance: 10.40 USD; bonus: 10 USD (locked); last 2 transactions visible | AC-004-01 | GET /wallet |

**Expected final state:**
- Player record created with `status = active`, `kycStatus = not_started`.
- GameSession active with `totalSpins = 2`.
- 1 Bonus record: `type = welcome`, `amount = 1000`, `wagered = 20` (2 × 10-cent bets).

**Failure conditions:**
- FC-1: Telegram hash invalid → Player sees auth error; no account created (AC-001-03).
- FC-2: RNG service unavailable → Spin rolled back; player sees retry prompt (AC-003-05).

---

## SC-002: Player Deposit and Withdrawal Cycle

**Persona:** Maria, 35, Almaty. Experienced player with a KYC-pending account. Wants to deposit 100 USDT and withdraw 80 USD after a winning session.
**Goal:** Deposit, play, and withdraw winnings above the 50 USD KYC threshold.
**Entry point:** WF-001 → Wallet icon

| Step | Action | Expected Result | AC Reference | API Call |
|------|--------|----------------|--------------|----------|
| 1 | Maria opens Wallet screen (WF-002) | Balance: 5.00 USD; KYC banner visible | AC-009-02 | GET /wallet |
| 2 | Maria taps "Deposit → Cryptocurrency → USDT" | System generates unique ERC-20 deposit address and QR code (WF-002-deposit) | AC-007-01 | POST /wallet/deposits/crypto |
| 3 | Maria sends 100 USDT from her external wallet | — | — | — (external) |
| 4 | Payment aggregator sends 1-confirmation webhook | System processes webhook, credits wallet +100.00 USD, creates Transaction (deposit, completed) | AC-007-02 | POST /webhooks/payment |
| 5 | Maria sees updated balance: 105.00 USD | Balance reflects deposit within 5 seconds | AC-004-02 | GET /wallet |
| 6 | Maria plays 20 spins (net result: +30 USD) | GameSession totalSpins = 20; balance: 135.00 USD | AC-003-01 | POST /games/sessions/:id/spins ×20 |
| 7 | Maria opens Wallet and requests withdrawal of 80 USD | System checks: amount > 50 USD → KYC required. Withdrawal blocked with prompt | AC-009-02 | POST /wallet/withdrawals → 403 KYC_REQUIRED |
| 8 | Maria opens KYC flow and submits documents | KYC provider form displayed; submission recorded with status "Pending" | AC-011-01 | POST /kyc/verify |
| 9 | KYC provider sends "verified" webhook (within 24 h) | `kycStatus = verified`; Maria notified via Telegram | AC-011-02 | POST /webhooks/kyc (internal) |
| 10 | Maria retries withdrawal of 80 USD to crypto address | Withdrawal accepted: wallet debited, Transaction created (status: pending) | AC-009-01 | POST /wallet/withdrawals → 202 |
| 11 | Payment aggregator processes withdrawal (within 24 h) | Transaction status → completed; Maria notified via Telegram | AC-009-01 | POST /webhooks/payment |

**Expected final state:**
- Maria's `kycStatus = verified`.
- Wallet balance: 55.00 USD (135 − 80).
- Two Transaction records: one deposit (completed), one withdrawal (completed).

**Failure conditions:**
- FC-1: Duplicate deposit webhook → Idempotency check discards it; balance not double-credited (AC-007-03).
- FC-2: Payment aggregator rejects withdrawal → Balance refunded; Maria notified (AC-009-03).

---

## SC-003: Referral Link Sharing and Bonus Activation

**Persona:** Oleg (referrer), active player. Ivan (referee), new to Dragon Fortune.
**Goal:** Oleg shares his referral link; Ivan registers and deposits; Oleg receives the referral bonus.
**Entry point:** Oleg: WF-001 → Refer icon

| Step | Action | Expected Result | AC Reference | API Call |
|------|--------|----------------|--------------|----------|
| 1 | Oleg opens the Referrals screen (WF-004) | Oleg's referral URL displayed: `t.me/DragonFortuneBot?start=ref_oleg` | AC-012-01 | GET /referrals |
| 2 | Oleg taps "Share via Telegram" and sends the link to Ivan | Telegram share sheet opens with pre-filled message | — | — |
| 3 | Ivan opens the link in Telegram | Mini App opens; referral attribution (Oleg's ID) stored in session | — | — |
| 4 | Ivan registers (UC-001) | Player record created with `referredBy = Oleg.id`; Referral record created (`status = registered`) | AC-001-01 | POST /auth/telegram |
| 5 | Ivan deposits 50 USD (first deposit) | Deposit confirmed; first_deposit event triggers referral bonus logic | AC-013-01 | POST /wallet/deposits/crypto + webhook |
| 6 | System credits Oleg with 10% = 5.00 USD referral bonus | Bonus record created (`type = referral`, `amount = 500`, `wagerRequirement = 2500`); Oleg notified via Telegram | — | — |
| 7 | Oleg opens Referrals screen | Ivan's row shows "First deposit ✓ +5 USD"; bonus progress bar visible | — | GET /referrals |
| 8 | Ivan attempts to use his own referral link | System detects Telegram ID match; self-referral blocked; no bonus issued | AC-012-02 | POST /auth/telegram (self-referral attempt) |

**Expected final state:**
- Referral record: `status = bonus_credited`, `bonusAmount = 500`.
- Oleg's `bonusBalance` increased by 500 cents.
- Ivan's `referredBy = Oleg.id`, welcome bonus credited on first deposit.

**Failure conditions:**
- FC-1: Self-referral attempt → Blocked; Referral record flagged with `status = fraud_flagged` (AC-012-02).
- FC-2: Ivan's first deposit < 10 USD → Referral bonus not triggered; Referral stays at `status = registered`.

---

## SC-004: Admin Adjusts RTP Configuration

**Persona:** Dmitri (Admin), responsible for game performance. Needs to raise RTP from 96.00% to 96.50% based on player feedback.
**Goal:** Update the RTP target with second-admin approval. Verify the new config takes effect without disrupting active sessions.
**Entry point:** Admin panel → Game Configuration (WF-006 equivalent)

| Step | Action | Expected Result | AC Reference | API Call |
|------|--------|----------------|--------------|----------|
| 1 | Dmitri opens Game Configuration screen | Current config: RTP 96.00%, medium volatility, min/max bet 0.10/1000 USD | — | GET /admin/config/game |
| 2 | Dmitri changes RTP to 96.50% and clicks Save | System validates range (94–97%): valid. Creates pending GameConfig version. Notifies second admin (Elena) | AC-018-01 | PUT /admin/config/game |
| 3 | Dmitri tries RTP = 97.50% | System rejects: "RTP must be between 94.00% and 97.00%." No config saved | AC-018-02 | PUT /admin/config/game → 422 |
| 4 | Elena (second admin) receives approval notification | In-app notification: "Dmitri has requested RTP change: 96.00% → 96.50%. Approve?" | AC-018-01 | — |
| 5 | Elena reviews and approves | GameConfig status: pending → approved. System flags config as "activating" | AC-018-01 | PATCH /admin/config/game/:id/approve |
| 6 | Current spin batch completes (≤ 1 spin cycle) | New GameConfig becomes active; `isActive = true`; previous config archived | AC-018-03 | — |
| 7 | Dmitri verifies active config | Active config shows RTP 96.50%; `activatedAt` timestamp updated | AC-018-03 | GET /admin/config/game |
| 8 | Dmitri checks that spins after activation use new RTP | Monitoring dashboard shows RTP trending toward 96.50% over the next 1,000 spins | — | GET /admin/reports/revenue |

**Expected final state:**
- New GameConfig active: `rtpTarget = 96.50`, `approvedBy = Elena.id`.
- Previous GameConfig archived (`isActive = false`), retained for audit.
- Audit log entry: AdminUser = Dmitri, old RTP = 96.00, new RTP = 96.50, approver = Elena, timestamp.

**Failure conditions:**
- FC-1: Elena rejects the change → Pending config discarded; Dmitri notified "RTP change rejected by Elena." Active config unchanged.
- FC-2: System detects RTP drift outside 94–97% range → Compliance alert sent to Compliance Officer; spin execution paused pending investigation.

---

## Coverage Summary

| Scenario | US covered | AC covered | WF covered | API endpoints |
|----------|-----------|-----------|-----------|--------------|
| SC-001 | US-001, US-002, US-003, US-004 | AC-001-01/03, AC-002-01, AC-003-01/02/05, AC-004-01 | WF-001, WF-002 | 4 |
| SC-002 | US-007, US-009, US-011 | AC-007-01/02/03, AC-009-01/02/03, AC-011-01/02 | WF-002, WF-002-deposit | 6 |
| SC-003 | US-012, US-013 | AC-012-01/02, AC-013-01/02 | WF-004 | 3 |
| SC-004 | US-018 | AC-018-01/02/03 | WF-006 | 4 |

**FR coverage:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-007, FR-009, FR-010, FR-011, FR-015 (10/15 FRs validated end-to-end)
