# API Contract: Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-08
**Slug:** dragon-fortune
**References:** `02_srs_dragon-fortune.md`, `07_datadict_dragon-fortune.md`, `07a_research_dragon-fortune.md`

**Base URL:** `https://api.dragon-fortune.app/api/v1`
**Authentication:** Bearer JWT (except `POST /auth/telegram`)
**Content-Type:** `application/json`

---

## Endpoint Index

| # | Method | Path | FR | US |
|---|--------|------|----|----|
| 1 | POST | `/auth/telegram` | FR-001 | US-001 |
| 2 | GET | `/players/me` | FR-001 | US-001 |
| 3 | POST | `/games/sessions` | FR-002 | US-002 |
| 4 | POST | `/games/sessions/:id/spins` | FR-003 | US-003 |
| 5 | GET | `/games/sessions/:id` | FR-002 | US-006 |
| 6 | GET | `/wallet` | FR-004 | US-004 |
| 7 | POST | `/wallet/deposits/crypto` | FR-005 | US-007 |
| 8 | POST | `/wallet/deposits/local` | FR-006 | US-008 |
| 9 | POST | `/wallet/withdrawals` | FR-007 | US-009 |
| 10 | GET | `/wallet/transactions` | FR-008 | US-010 |
| 11 | POST | `/kyc/verify` | FR-009 | US-011 |
| 12 | GET | `/bonuses` | FR-011 | US-014 |
| 13 | GET | `/referrals` | FR-010 | US-012 |
| 14 | POST | `/limits/session` | FR-012 | US-005 |
| 15 | POST | `/exclusions` | FR-013 | US-015 |
| 16 | POST | `/limits/deposit` | FR-014 | US-016 |
| 17 | GET | `/admin/players` | FR-015 | US-017 |
| 18 | PATCH | `/admin/players/:id` | FR-015 | US-020 |
| 19 | GET | `/admin/reports/revenue` | FR-015 | US-019 |
| 20 | GET | `/admin/config/game` | FR-015 | US-018 |
| 21 | PUT | `/admin/config/game` | FR-015 | US-018 |
| 22 | POST | `/webhooks/payment` | FR-005, FR-006, FR-007 | — |

---

## 1. POST /auth/telegram

**Description:** Authenticate a player using Telegram `initData`.
**Auth:** None

**Request:**
```json
{
  "initData": "user=%7B%22id%22%3A123456789...&hash=abcdef1234567890"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-04-08T15:00:00Z",
  "player": {
    "id": "a1b2c3d4-...",
    "telegramId": 123456789,
    "firstName": "Alexei",
    "status": "active",
    "kycStatus": "not_started",
    "isNewPlayer": true
  }
}
```

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_HASH` | 401 | Telegram HMAC hash verification failed |
| `PLAYER_EXCLUDED` | 403 | Player is self-excluded — login blocked |

---

## 2. GET /players/me

**Description:** Retrieve the authenticated player's profile.

**Response 200:**
```json
{
  "id": "a1b2c3d4-...",
  "telegramId": 123456789,
  "firstName": "Alexei",
  "username": "alexei_plays",
  "status": "active",
  "kycStatus": "verified",
  "createdAt": "2026-03-01T10:00:00Z"
}
```

---

## 3. POST /games/sessions

**Description:** Start a new game session.

**Request:**
```json
{
  "betAmount": 100,
  "linesCount": 10
}
```

**Response 201:**
```json
{
  "sessionId": "s1s2s3s4-...",
  "gameConfig": {
    "rtpTarget": 96.00,
    "volatility": "medium",
    "minBet": 10,
    "maxBet": 100000,
    "linesCount": 20
  },
  "startedAt": "2026-04-08T12:00:00Z"
}
```

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `SESSION_ALREADY_ACTIVE` | 409 | Player already has an active session |
| `BET_OUT_OF_RANGE` | 422 | Bet amount outside GameConfig min/max |

---

## 4. POST /games/sessions/:id/spins

**Description:** Execute a single spin. Critical path — must respond ≤ 200 ms p95 (NFR-001).

**Request:**
```json
{
  "betAmount": 100,
  "linesCount": 10
}
```

**Response 200:**
```json
{
  "spinId": "sp1sp2sp3-...",
  "symbolMatrix": [[1,2,3],[4,5,1],[2,1,4],[3,3,5],[1,2,2]],
  "winningLines": [
    { "lineId": 3, "symbols": [1,1,1], "multiplier": 10 }
  ],
  "payout": 1000,
  "betAmount": 100,
  "balance": 10900,
  "bonusBalance": 500
}
```

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `INSUFFICIENT_BALANCE` | 422 | Wallet balance < betAmount |
| `SESSION_NOT_FOUND` | 404 | Session ID not found or closed |
| `RNG_UNAVAILABLE` | 503 | RNG service did not respond; spin not executed |

---

## 5. GET /games/sessions/:id

**Description:** Get session summary and last 20 spins.

**Response 200:**
```json
{
  "sessionId": "s1s2s3s4-...",
  "status": "active",
  "startedAt": "2026-04-08T12:00:00Z",
  "totalSpins": 47,
  "totalWagered": 4700,
  "totalPayout": 4230,
  "recentSpins": [
    {
      "spinId": "sp1sp2-...",
      "betAmount": 100,
      "payout": 500,
      "createdAt": "2026-04-08T12:45:00Z"
    }
  ]
}
```

---

## 6. GET /wallet

**Description:** Get current wallet balance.

**Response 200:**
```json
{
  "walletId": "w1w2w3-...",
  "balance": 10900,
  "bonusBalance": 500,
  "currency": "USD",
  "updatedAt": "2026-04-08T12:45:00Z"
}
```

---

## 7. POST /wallet/deposits/crypto

**Description:** Generate a cryptocurrency deposit address.

**Request:**
```json
{
  "currency": "USDT",
  "network": "ERC20"
}
```

**Response 201:**
```json
{
  "transactionId": "tx-...",
  "depositAddress": "0xA1B2C3D4E5F6...",
  "qrCode": "data:image/png;base64,...",
  "currency": "USDT",
  "network": "ERC20",
  "minimumAmount": 500,
  "requiredConfirmations": 1,
  "expiresAt": "2026-04-08T13:00:00Z"
}
```

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `UNSUPPORTED_CURRENCY` | 422 | Currency/network combination not supported |

---

## 8. POST /wallet/deposits/local

**Description:** Initiate a local payment system deposit.

**Request:**
```json
{
  "provider": "qiwi",
  "amount": 50000,
  "currency": "RUB"
}
```

**Response 201:**
```json
{
  "transactionId": "tx-...",
  "paymentUrl": "https://qiwi.com/pay?...",
  "amount": 50000,
  "currency": "RUB",
  "expiresAt": "2026-04-08T12:30:00Z"
}
```

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `AMOUNT_BELOW_MINIMUM` | 422 | Amount below 100 RUB minimum |
| `PROVIDER_UNAVAILABLE` | 503 | Payment provider not responding |

---

## 9. POST /wallet/withdrawals

**Description:** Request a wallet withdrawal.

**Request:**
```json
{
  "amount": 5000,
  "currency": "USD",
  "method": "crypto",
  "destination": "0xA1B2C3..."
}
```

**Response 202:**
```json
{
  "withdrawalId": "wd-...",
  "amount": 5000,
  "status": "pending",
  "estimatedProcessingTime": "24h",
  "createdAt": "2026-04-08T12:00:00Z"
}
```

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `KYC_REQUIRED` | 403 | Amount exceeds 5,000 cents and KYC not verified |
| `WAGERING_REQUIREMENT_NOT_MET` | 422 | Active bonus wagering prevents withdrawal of bonus funds |
| `AMOUNT_BELOW_MINIMUM` | 422 | Amount below 1,000 cents (10 USD) minimum |
| `INSUFFICIENT_BALANCE` | 422 | Requested amount exceeds available balance |

---

## 10. GET /wallet/transactions

**Description:** Get paginated transaction history.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `pageSize` | int | 20 | Records per page (max 100) |
| `type` | string | all | Filter: `deposit`, `withdrawal`, `spin_debit`, `spin_credit`, `bonus_credit` |
| `from` | ISO date | — | Start date filter |
| `to` | ISO date | — | End date filter |

**Response 200:**
```json
{
  "total": 142,
  "page": 1,
  "pageSize": 20,
  "transactions": [
    {
      "id": "tx-...",
      "type": "spin_credit",
      "amount": 500,
      "currency": "USD",
      "status": "completed",
      "createdAt": "2026-04-08T12:45:00Z"
    }
  ]
}
```

---

## 11. POST /kyc/verify

**Description:** Initiate the KYC verification flow.

**Request:** `{}` (empty — KYC is handled via embedded provider form)

**Response 200:**
```json
{
  "kycSessionUrl": "https://kyc-provider.com/session/abc123",
  "expiresAt": "2026-04-08T13:00:00Z"
}
```

---

## 12. GET /bonuses

**Description:** List active bonuses for the authenticated player.

**Response 200:**
```json
{
  "bonuses": [
    {
      "id": "bn-...",
      "type": "welcome",
      "amount": 1000,
      "wagerRequirement": 3000,
      "wagered": 1200,
      "status": "active",
      "expiresAt": "2026-05-08T00:00:00Z"
    }
  ]
}
```

---

## 13. GET /referrals

**Description:** Get the player's referral link and referee activity.

**Response 200:**
```json
{
  "referralUrl": "https://t.me/DragonFortuneBot?start=ref_a1b2c3",
  "totalReferrals": 3,
  "referrals": [
    {
      "refereeId": "r1r2r3-...",
      "status": "bonus_credited",
      "bonusAmount": 500,
      "bonusCreditedAt": "2026-04-01T10:00:00Z"
    }
  ]
}
```

---

## 14. POST /limits/session

**Description:** Set a custom session time limit (minutes).

**Request:**
```json
{ "limitMinutes": 90 }
```

**Response 200:**
```json
{ "limitMinutes": 90, "updatedAt": "2026-04-08T12:00:00Z" }
```

---

## 15. POST /exclusions

**Description:** Initiate self-exclusion.

**Request:**
```json
{ "period": "1_month", "confirmationCode": "EXCLUDE" }
```

**Response 200:**
```json
{
  "status": "excluded",
  "excludedUntil": "2026-05-08T12:00:00Z",
  "message": "Your account has been excluded. It will be re-activated on 2026-05-08."
}
```

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_CONFIRMATION` | 422 | `confirmationCode` must be "EXCLUDE" |

---

## 16. POST /limits/deposit

**Description:** Set a deposit limit.

**Request:**
```json
{ "type": "daily", "amount": 20000 }
```

**Response 200:**
```json
{
  "type": "daily",
  "amount": 20000,
  "effectiveAt": "2026-04-08T12:00:00Z",
  "note": "Limit decreases are effective immediately. Increases take effect in 24 hours."
}
```

---

## 17. GET /admin/players

**Description:** Search and list players (Admin only).
**Auth:** Admin JWT

**Query Parameters:** `search` (string), `status` (enum), `kycStatus` (enum), `page`, `pageSize`

**Response 200:**
```json
{
  "total": 12450,
  "players": [
    {
      "id": "a1b2-...",
      "telegramId": 123456789,
      "username": "alexei_plays",
      "status": "active",
      "kycStatus": "verified",
      "balance": 10900,
      "createdAt": "2026-03-01T10:00:00Z"
    }
  ]
}
```

---

## 18. PATCH /admin/players/:id

**Description:** Update player status (Admin only).

**Request:**
```json
{ "status": "suspended", "reason": "AML review triggered" }
```

**Response 200:**
```json
{
  "id": "a1b2-...",
  "status": "suspended",
  "updatedAt": "2026-04-08T12:00:00Z"
}
```

---

## 19. GET /admin/reports/revenue

**Description:** Revenue summary report (Admin only).

**Query Parameters:** `from` (date), `to` (date), `granularity` (day/week/month)

**Response 200:**
```json
{
  "totalGGR": 152430,
  "totalDeposits": 890000,
  "totalWithdrawals": 480000,
  "activePlayers": 3241,
  "breakdown": [
    { "date": "2026-04-07", "ggr": 21450, "deposits": 125000, "withdrawals": 68000 }
  ]
}
```

---

## 20. GET /admin/config/game

**Description:** Get current active GameConfig.

**Response 200:**
```json
{
  "id": "gc-...",
  "rtpTarget": 96.00,
  "volatility": "medium",
  "linesCount": 20,
  "minBet": 10,
  "maxBet": 100000,
  "isActive": true,
  "activatedAt": "2026-04-01T08:00:00Z"
}
```

---

## 21. PUT /admin/config/game

**Description:** Create a new GameConfig version (Admin only). RTP changes require second-admin approval.

**Request:**
```json
{
  "rtpTarget": 96.50,
  "volatility": "high",
  "minBet": 10,
  "maxBet": 200000,
  "linesCount": 20
}
```

**Response 202:**
```json
{
  "configId": "gc-new-...",
  "status": "pending_approval",
  "message": "RTP change requires second-admin approval. Notification sent to approvers."
}
```

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `RTP_OUT_OF_RANGE` | 422 | `rtpTarget` outside 94.00–97.00% |

---

## 22. POST /webhooks/payment

**Description:** Receive payment events from the payment aggregator. Internal endpoint — not accessible from the Mini App frontend.
**Auth:** Webhook signature (HMAC-SHA256 in `X-Signature` header)

**Request (deposit confirmation):**
```json
{
  "event": "deposit.confirmed",
  "transactionId": "tx-...",
  "externalId": "prov-tx-98765",
  "amount": 50000,
  "currency": "RUB",
  "confirmedAt": "2026-04-08T12:05:00Z"
}
```

**Response 200:** `{ "status": "processed" }`

**Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_SIGNATURE` | 401 | Webhook signature verification failed |
| `ALREADY_PROCESSED` | 200 | Idempotency: event already processed (returns 200, not error) |
