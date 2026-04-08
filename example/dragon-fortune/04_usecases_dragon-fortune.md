# Use Cases: Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-08
**Slug:** dragon-fortune
**References:** `01_brief_dragon-fortune.md`, `02_srs_dragon-fortune.md`, `03_stories_dragon-fortune.md`

---

## UC-001: Player Registration via Telegram

**Actor:** Player
**Linked US:** US-001
**FR Reference:** FR-001

**Preconditions:**
- Player has a Telegram account.
- Dragon Fortune bot is accessible via Telegram.

**Main Success Scenario:**
1. Player opens the Dragon Fortune bot link in Telegram.
2. Telegram launches the Mini App WebView and passes `initData` to the frontend.
3. Frontend sends `POST /api/v1/auth/telegram` with `initData`.
4. System verifies the HMAC hash against the Bot Token.
5. System checks if a Player record with this Telegram ID exists.
6. If new player: system creates a Player record, creates a Wallet with 0 balance, credits the welcome bonus.
7. System issues a JWT access token (1-hour expiry).
8. Frontend stores the token in memory and renders the game lobby.

**Alternative Flows:**
- **A1 — Returning player (step 5):** Player record found. System returns existing account data. Welcome bonus is not credited again.

**Exception Flows:**
- **E1 — Invalid hash (step 4):** System returns `401 Unauthorized`. Frontend displays an error message: "Authentication failed. Please reopen the game."
- **E2 — Telegram API unavailable (step 2):** Mini App fails to launch. Player sees Telegram's native error screen.

**Postconditions:**
- Player is authenticated with a valid JWT.
- New players have a Wallet and a pending welcome bonus.

---

## UC-002: Slot Spin Execution

**Actor:** Player
**Linked US:** US-002, US-003
**FR Reference:** FR-002, FR-003

**Preconditions:**
- Player is authenticated (valid JWT).
- Player has an active game session.
- Player's wallet balance ≥ selected bet amount.

**Main Success Scenario:**
1. Player presses the Spin button on the slot screen.
2. Frontend sends `POST /api/v1/games/sessions/:id/spins` with `{ betAmount, linesCount }`.
3. System validates: wallet balance ≥ betAmount; session is active; bet is within GameConfig min/max limits.
4. System debits `betAmount` from the wallet (status: reserved).
5. System calls the certified RNG service to generate the spin seed and symbol matrix.
6. System calculates winning paylines and payout amount using the active GameConfig (RTP target, paytable).
7. System saves the Spin record.
8. System credits payout to wallet (net result: debit bet, credit payout). Wallet debit finalised.
9. System returns spin result to frontend: symbol matrix, winning lines, payout, updated balance.
10. Frontend renders the reel animation and displays the payout.

**Alternative Flows:**
- **A1 — No winning combination (step 6):** Payout = 0. Wallet debit finalised with no credit. Spin recorded as a loss.
- **A2 — Maximum win triggered (step 6):** Payout capped at 5,000× betAmount. Cap applied before wallet credit.

**Exception Flows:**
- **E1 — Insufficient balance (step 3):** System returns `422 Unprocessable Entity` with code `INSUFFICIENT_BALANCE`. Frontend shows "Top up your wallet to continue."
- **E2 — RNG service unavailable (step 5):** Wallet debit is rolled back. System returns `503 Service Unavailable`. Frontend shows retry prompt.
- **E3 — Session expired (step 3):** System returns `404 Not Found`. Frontend prompts player to start a new session.

**Postconditions:**
- Spin record saved with RNG seed, symbol matrix, and payout for audit.
- Wallet balance updated.
- Session spin counter incremented.

---

## UC-003: Wallet Deposit

**Actor:** Player, Payment Provider
**Linked US:** US-007, US-008
**FR Reference:** FR-005, FR-006

**Preconditions:**
- Player is authenticated.
- Player has selected a payment method.

**Main Success Scenario (cryptocurrency):**
1. Player opens the Wallet screen and selects "Deposit → Cryptocurrency".
2. Player selects currency (BTC or USDT) and views the generated deposit address and QR code.
3. Player sends cryptocurrency to the address from an external wallet.
4. Payment aggregator detects the on-chain transaction and sends a webhook to `POST /api/v1/webhooks/payment`.
5. System verifies the webhook signature.
6. System waits for the required number of on-chain confirmations (1 for USDT, 2 for BTC).
7. System credits the player's wallet (converted at the exchange rate locked at confirmation time).
8. Player sees updated balance on the game screen.

**Alternative Flow — local payment (SBP / Qiwi / YooMoney):**
1. Player selects "Deposit → Local Payment" and chooses a provider.
2. System creates a pending deposit record and redirects the player to the provider's payment form.
3. Player completes payment on the provider's page.
4. Payment provider sends a confirmation webhook.
5. System credits the wallet. Player is redirected back to the game.

**Exception Flows:**
- **E1 — Webhook signature invalid (step 5):** System discards the webhook and logs the anomaly. No wallet credit.
- **E2 — Amount below minimum (step 2/1):** System rejects the request before generating an address. Error: "Minimum deposit is 5 USD equivalent."
- **E3 — Payment failed or cancelled (alt flow step 4):** Provider sends a failure webhook. Pending deposit record is closed with status "Failed". Wallet not credited.

**Postconditions:**
- Transaction record created with type "Deposit", amount, currency, provider, and status.
- Wallet balance increased by net deposit amount.

---

## UC-004: Wallet Withdrawal

**Actor:** Player
**Linked US:** US-009
**FR Reference:** FR-007, FR-009

**Preconditions:**
- Player is authenticated.
- Player has a positive wallet balance.
- Active wagering requirements (if any) are met.

**Main Success Scenario:**
1. Player opens the Wallet screen and selects "Withdraw".
2. Player enters the withdrawal amount and destination (crypto address or bank card).
3. System validates: amount ≥ minimum (10 USD equivalent); balance sufficient; KYC status if amount > 50 USD.
4. System debits wallet balance immediately (status: "Pending").
5. System creates a Withdrawal record and queues it for processing.
6. Within 24 hours, the payment aggregator processes the withdrawal and sends a confirmation webhook.
7. System updates the withdrawal status to "Completed". Player notified via Telegram message.

**Exception Flows:**
- **E1 — KYC not completed, amount > 50 USD (step 3):** System blocks the withdrawal and prompts KYC: "Please verify your identity to withdraw more than 50 USD."
- **E2 — Unmet wagering requirement (step 3):** System shows remaining wagering requirement. Withdrawal blocked for bonus-derived funds only; unrestricted balance may be withdrawn.
- **E3 — Payment aggregator rejects withdrawal (step 6):** Webhook received with failure status. System refunds wallet balance. Player notified: "Withdrawal failed — funds returned to your wallet."

**Postconditions:**
- Withdrawal record saved with amount, destination, status, and timestamps.
- If completed: wallet balance permanently reduced.
- If failed: wallet balance restored.

---

## UC-005: Referral Bonus Activation

**Actor:** Player (referrer), Player (referee), System
**Linked US:** US-012, US-013
**FR Reference:** FR-010, FR-011

**Preconditions:**
- Referrer has an active Dragon Fortune account.
- Referee does not have an existing account.

**Main Success Scenario:**
1. Referrer opens the Referrals screen and copies their personal referral link.
2. Referrer shares the link via Telegram.
3. New player (referee) opens the link; referral attribution recorded at first login (FR-010).
4. Referee registers (UC-001) with referrer ID stored on their Player record.
5. Referee makes their first deposit ≥ 10 USD equivalent.
6. System detects the first-deposit event and computes the referral bonus: 10% of deposit, capped at 50 USD.
7. System credits the referral bonus to the referrer's wallet as a restricted bonus with 5× wagering requirement.
8. System sends a Telegram notification to the referrer: "Your referral [username] made their first deposit — you earned X USD!"
9. Referrer sees the updated bonus balance and referee status on the Referrals screen.

**Exception Flows:**
- **E1 — Self-referral detected (step 5):** System detects the same device fingerprint or IP as the referrer. Bonus is blocked and flagged for compliance review.
- **E2 — Referee deposit below minimum (step 5):** Referral bonus not triggered. Referee must deposit ≥ 10 USD to activate the referral.

**Postconditions:**
- Referral record updated with "first_deposit_completed" status.
- Referrer wallet credited with bonus (status: restricted).

---

## UC-006: Admin Game Configuration Update

**Actor:** Admin
**Linked US:** US-018
**FR Reference:** FR-015

**Preconditions:**
- Admin is authenticated with the Admin role.
- A second Admin (approver) is available for RTP change confirmation.

**Main Success Scenario:**
1. Admin opens the Game Configuration screen in the Admin panel.
2. Admin views current GameConfig: RTP target, volatility, min/max bet, active paylines.
3. Admin modifies one or more parameters.
4. System validates: RTP target is within 94–97%. Min bet ≥ 1 USD equivalent. Max bet ≤ 1,000 USD equivalent.
5. If RTP target changed: system sends an in-app notification to the second Admin requesting confirmation.
6. Second Admin reviews and approves the change.
7. System saves the new GameConfig and flags it as "pending" until the current spin batch completes.
8. On the next spin cycle, the new configuration becomes active.
9. System logs the change: Admin ID, old values, new values, approver ID, timestamp.

**Alternative Flows:**
- **A1 — Non-RTP parameter change (step 3):** Single-admin approval. Steps 5–6 skipped. Configuration applied immediately.

**Exception Flows:**
- **E1 — RTP out of certified range (step 4):** System rejects the update: "RTP must be between 94.00% and 97.00%." No change saved.
- **E2 — Approver rejects change (step 6):** System discards the pending configuration. Admin notified: "RTP change was rejected by [approver]."

**Postconditions:**
- GameConfig updated and versioned.
- Audit log entry created for the change.
- Active spins use the previous config until the new config takes effect.
