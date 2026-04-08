# Acceptance Criteria: Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-08
**Slug:** dragon-fortune
**References:** `03_stories_dragon-fortune.md`, `02_srs_dragon-fortune.md`

---

## US-001: Register and log in via Telegram

### AC-001-01 — New player registration
**Type:** Positive
**Given** a user opens the Dragon Fortune bot link for the first time,
**When** the Telegram Mini App passes valid `initData` to the authentication endpoint,
**Then** the system creates a new Player account, creates a Wallet with balance 0, credits the welcome bonus, and returns a valid JWT token.

### AC-001-02 — Returning player login
**Type:** Positive
**Given** a player has previously registered,
**When** they open the Mini App and the system receives their `initData`,
**Then** the system returns the existing Player account and wallet without creating a duplicate or issuing a second welcome bonus.

### AC-001-03 — Invalid Telegram hash rejected
**Type:** Negative
**Given** a request arrives at `POST /auth/telegram`,
**When** the HMAC hash in `initData` does not match the expected hash derived from the Bot Token,
**Then** the system returns HTTP 401 and the player sees an error message. No account is created or accessed.

---

## US-002: Launch the slot game

### AC-002-01 — Game screen loads with current config
**Type:** Positive
**Given** an authenticated player opens the game,
**When** the slot screen renders,
**Then** the active GameConfig (bet range, payline count) is displayed and the player's wallet balance is shown in real time.

### AC-002-02 — Bet below minimum rejected
**Type:** Boundary
**Given** an authenticated player is on the slot screen,
**When** they attempt to set a bet below the GameConfig `minBet`,
**Then** the UI prevents the input and displays "Minimum bet is [minBet]." No session is started.

---

## US-003: Execute a spin

### AC-003-01 — Successful spin with win
**Type:** Positive
**Given** a player has an active session and sufficient balance,
**When** they press Spin,
**Then** the system debits the bet, calls the RNG, calculates payouts, credits winnings, saves a Spin record with `rngSeed`, and returns the result in ≤ 200 ms at p95.

### AC-003-02 — Losing spin — balance debited, no credit
**Type:** Positive
**Given** the RNG produces no winning combination,
**When** the spin result is returned,
**Then** the wallet is debited by `betAmount` and no credit is made. The spin record is saved with `payout = 0`.

### AC-003-03 — Insufficient balance blocks spin
**Type:** Negative
**Given** a player's wallet balance is less than the selected bet amount,
**When** they press Spin,
**Then** the system returns HTTP 422 with code `INSUFFICIENT_BALANCE`. Wallet is not modified. Frontend shows "Top up your wallet to continue."

### AC-003-04 — Maximum win cap applied
**Type:** Boundary
**Given** the RNG produces a combination with a theoretical payout exceeding 5,000× the bet,
**When** the payout is calculated,
**Then** the payout is capped at `betAmount × 5000`. The cap is recorded in the Spin record.

### AC-003-05 — RNG service unavailable — spin rolled back
**Type:** Negative
**Given** the RNG service is unavailable,
**When** a spin is attempted,
**Then** the wallet debit is rolled back, the spin is not saved, and the player sees a "Service temporarily unavailable" message.

---

## US-004: View wallet balance

### AC-004-01 — Balance updates after spin
**Type:** Positive
**Given** a player completes a spin,
**When** the spin result is returned,
**Then** the balance displayed on the game screen reflects the updated amount without requiring a page refresh.

### AC-004-02 — Balance is real-time — no stale cache
**Type:** Positive
**Given** a player's balance was updated by an external event (e.g., deposit webhook processed),
**When** the player is on the game screen,
**Then** the displayed balance reflects the current value within 5 seconds.

---

## US-005: Receive session time warning

### AC-005-01 — Warning at 60 minutes
**Type:** Positive
**Given** a player has been in an active session for 60 continuous minutes,
**When** the session timer reaches 60 minutes,
**Then** a modal overlay appears within 30 seconds showing elapsed time, total wagered this session, and buttons "Continue" and "Exit".

### AC-005-02 — Warning requires explicit action
**Type:** Negative
**Given** the 60-minute warning modal is displayed,
**When** the player attempts to spin without dismissing the modal,
**Then** the Spin button is disabled until the player clicks "Continue" or "Exit".

### AC-005-03 — Second warning at 120 minutes
**Type:** Positive
**Given** the player clicked "Continue" at the 60-minute mark and the session reaches 120 minutes,
**When** the timer fires,
**Then** a second warning modal is displayed with the same format. The modal also states "You have been playing for 2 hours."

---

## US-007: Deposit via cryptocurrency

### AC-007-01 — Deposit address generated per transaction
**Type:** Positive
**Given** a player selects cryptocurrency deposit,
**When** they choose BTC or USDT,
**Then** the system generates and displays a unique deposit address and QR code. The address is single-use.

### AC-007-02 — Balance credited after required confirmations
**Type:** Positive
**Given** a player sends USDT to their deposit address,
**When** the payment aggregator webhook is received with 1 on-chain confirmation,
**Then** the system credits the player's wallet with the equivalent amount (exchange rate locked at confirmation time) and creates a Transaction record with `type = deposit`, `status = completed`.

### AC-007-03 — Duplicate webhook ignored
**Type:** Negative
**Given** the system has already credited a deposit for a given `externalId`,
**When** the same webhook is received again,
**Then** the system discards it (idempotency check on `externalId`). Wallet is not double-credited.

---

## US-008: Deposit via local payment system

### AC-008-01 — Successful Qiwi deposit
**Type:** Positive
**Given** a player selects Qiwi and enters a valid amount above the minimum,
**When** they complete payment on the Qiwi form,
**Then** the system receives the confirmation webhook, credits the wallet within 5 minutes, and the player sees the updated balance.

### AC-008-02 — Failed payment — wallet not credited
**Type:** Negative
**Given** a player initiates a local payment but cancels or the payment times out,
**When** the provider sends a failure webhook,
**Then** the pending Transaction is closed with `status = failed`. Wallet balance is unchanged.

---

## US-009: Request a withdrawal

### AC-009-01 — Successful withdrawal for verified player
**Type:** Positive
**Given** a KYC-verified player with balance > 10 USD requests a withdrawal,
**When** they submit the withdrawal form,
**Then** the wallet is immediately debited, a Withdrawal Transaction record is created with `status = pending`, and it is processed within 24 hours.

### AC-009-02 — KYC gate for large withdrawals
**Type:** Negative
**Given** a player whose `kycStatus = not_started` attempts to withdraw 60 USD,
**When** they submit the withdrawal,
**Then** the system rejects the request and displays "Please complete identity verification to withdraw more than 50 USD."

### AC-009-03 — Payment failure refunds balance
**Type:** Negative
**Given** a withdrawal is pending and the payment aggregator rejects it,
**When** the failure webhook is received,
**Then** the wallet balance is restored, the Transaction is updated to `status = refunded`, and the player is notified via Telegram.

---

## US-011: Complete KYC identity verification

### AC-011-01 — KYC flow launched from withdrawal block
**Type:** Positive
**Given** a player is blocked from withdrawing due to unverified KYC,
**When** they tap "Verify identity",
**Then** the KYC provider's embedded form is presented within the Mini App.

### AC-011-02 — Verified status unlocks withdrawals
**Type:** Positive
**Given** the KYC provider sends a "verified" webhook,
**When** the system processes it,
**Then** the player's `kycStatus` is updated to `verified` and the player is notified via Telegram: "Your identity has been verified."

### AC-011-03 — Rejected KYC blocks all withdrawals
**Type:** Negative
**Given** the KYC provider returns a "rejected" result,
**When** the system processes it,
**Then** `kycStatus = rejected`. All withdrawal attempts return an error message directing the player to contact support.

---

## US-012: Share a referral link

### AC-012-01 — Referral link is unique per player
**Type:** Positive
**Given** an authenticated player opens the Referrals screen,
**When** they tap "Get my referral link",
**Then** the system returns a unique URL containing their player ID. The link is permanent and the same on every request.

### AC-012-02 — Self-referral is blocked
**Type:** Negative
**Given** a player copies their referral link and tries to use it to register a second account,
**When** the system detects the same Telegram ID or device fingerprint,
**Then** the referral attribution is blocked and no bonus is credited.

---

## US-013: Claim welcome bonus on first deposit

### AC-013-01 — Welcome bonus credited on first deposit
**Type:** Positive
**Given** a new player makes their first deposit ≥ 10 USD,
**When** the deposit is confirmed,
**Then** a Bonus record of `type = welcome` is created with `wagerRequirement = depositAmount × 3` and the bonus amount is added to `bonusBalance`.

### AC-013-02 — Welcome bonus not duplicated
**Type:** Negative
**Given** a player has already received a welcome bonus,
**When** they make a subsequent deposit,
**Then** no second welcome bonus is issued.

---

## US-017: View and search player accounts

### AC-017-01 — Player found by Telegram username
**Type:** Positive
**Given** an admin is on the Player Management screen,
**When** they search for a player by Telegram username,
**Then** the system returns a list of matching players with their ID, status, KYC status, wallet balance, and registration date.

### AC-017-02 — No results for unknown username
**Type:** Negative
**Given** an admin searches for a username that does not exist,
**When** the search completes,
**Then** the system returns an empty list with the message "No players found."

---

## US-018: Adjust RTP and game configuration

### AC-018-01 — RTP change requires second-admin approval
**Type:** Positive
**Given** an admin submits a new GameConfig with a different `rtpTarget`,
**When** the change is saved,
**Then** the system creates a pending config version and notifies a second admin for approval before it becomes active.

### AC-018-02 — RTP outside certified range rejected
**Type:** Boundary
**Given** an admin enters an `rtpTarget` of 93.50%,
**When** they attempt to save,
**Then** the system rejects the input with "RTP must be between 94.00% and 97.00%." No config record is created.

### AC-018-03 — Config takes effect on next spin cycle
**Type:** Positive
**Given** a new GameConfig is approved,
**When** the current spin batch completes,
**Then** subsequent spins use the new config. Spins in progress at the time of approval use the previous config.

---

## Coverage Summary

| Story | AC Count | Covered types |
|-------|---------|---------------|
| US-001 | 3 | Positive, Negative |
| US-002 | 2 | Positive, Boundary |
| US-003 | 5 | Positive, Negative, Boundary |
| US-004 | 2 | Positive |
| US-005 | 3 | Positive, Negative |
| US-007 | 3 | Positive, Negative |
| US-008 | 2 | Positive, Negative |
| US-009 | 3 | Positive, Negative |
| US-011 | 3 | Positive, Negative |
| US-012 | 2 | Positive, Negative |
| US-013 | 2 | Positive, Negative |
| US-017 | 2 | Positive, Negative |
| US-018 | 3 | Positive, Negative, Boundary |

**Total AC:** 35 across 13 Must-priority stories.
