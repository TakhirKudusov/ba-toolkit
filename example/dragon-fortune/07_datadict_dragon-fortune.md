# Data Dictionary: Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-08
**Slug:** dragon-fortune
**References:** `02_srs_dragon-fortune.md`, `03_stories_dragon-fortune.md`

---

## Entity Index

| Entity | Description | FR References |
|--------|-------------|---------------|
| Player | Registered user | FR-001, FR-009, FR-010 |
| Wallet | Player's fund account | FR-004, FR-005, FR-006, FR-007 |
| Transaction | Individual wallet movement | FR-005, FR-006, FR-007, FR-008 |
| GameSession | A continuous gameplay period | FR-002, FR-003 |
| Spin | Single slot spin result | FR-003 |
| Bonus | Promotional credit with wagering rules | FR-011 |
| Referral | Referral link relationship between two players | FR-010, FR-011 |
| AdminUser | Internal platform staff | FR-015 |
| GameConfig | Active slot machine parameters | FR-002, FR-003, FR-015 |

---

## Player

Represents a registered end-user of Dragon Fortune.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Internal unique identifier |
| telegramId | BIGINT | UNIQUE, NOT NULL | Telegram user ID — used for auth and deduplication |
| username | VARCHAR(64) | NULLABLE | Telegram username (may be absent) |
| firstName | VARCHAR(128) | NOT NULL | Player's Telegram first name |
| status | ENUM | NOT NULL, DEFAULT 'active' | `active`, `suspended`, `banned`, `excluded` |
| kycStatus | ENUM | NOT NULL, DEFAULT 'not_started' | `not_started`, `pending`, `verified`, `rejected` |
| kycVerificationId | VARCHAR(128) | NULLABLE | External KYC provider verification reference |
| referredBy | UUID | FK → Player.id, NULLABLE | Referrer's player ID; NULL if no referral |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT now() | Account creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last modification timestamp |

**Business Rules:**
- `status = excluded` blocks login, deposit, and spin.
- `kycStatus = verified` is required for withdrawals > 50 USD equivalent.
- `telegramId` is immutable after creation.

---

## Wallet

One wallet per player. Stores current balance in the smallest currency unit.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Internal identifier |
| playerId | UUID | FK → Player.id, UNIQUE, NOT NULL | Owner |
| balance | BIGINT | NOT NULL, DEFAULT 0, CHECK ≥ 0 | Balance in cents (USD equivalent) |
| bonusBalance | BIGINT | NOT NULL, DEFAULT 0, CHECK ≥ 0 | Restricted bonus funds (wagering required) |
| currency | VARCHAR(3) | NOT NULL, DEFAULT 'USD' | ISO 4217 display currency |
| updatedAt | TIMESTAMP | NOT NULL | Last balance modification |

**Business Rules:**
- `balance` cannot go negative — spin and withdrawal requests are rejected if `betAmount > balance`.
- `bonusBalance` is tracked separately; funds are moved to `balance` only after wagering requirements are met.
- All balance mutations are performed in database transactions with optimistic locking.

---

## Transaction

Immutable record of every wallet balance change.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| walletId | UUID | FK → Wallet.id, NOT NULL | Owning wallet |
| type | ENUM | NOT NULL | `deposit`, `withdrawal`, `spin_debit`, `spin_credit`, `bonus_credit`, `bonus_release` |
| amount | BIGINT | NOT NULL | Amount in cents; always positive — direction implied by `type` |
| currency | VARCHAR(3) | NOT NULL | Currency at the time of transaction |
| status | ENUM | NOT NULL | `pending`, `completed`, `failed`, `refunded` |
| externalId | VARCHAR(256) | NULLABLE | Payment provider transaction reference |
| spinId | UUID | FK → Spin.id, NULLABLE | Linked spin (for `spin_debit` / `spin_credit`) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT now() | |

**Business Rules:**
- Records are immutable once `status = completed`. Corrections use a compensating transaction.
- Retained for a minimum of 5 years per AML compliance requirement.
- `externalId` must be unique per `type` to prevent double-crediting from duplicate webhooks.

---

## GameSession

Represents a continuous gameplay period opened by a player.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| playerId | UUID | FK → Player.id, NOT NULL | |
| gameConfigId | UUID | FK → GameConfig.id, NOT NULL | Config snapshot at session start |
| status | ENUM | NOT NULL, DEFAULT 'active' | `active`, `closed` |
| startedAt | TIMESTAMP | NOT NULL, DEFAULT now() | |
| endedAt | TIMESTAMP | NULLABLE | Set when player exits or session expires |
| totalSpins | INT | NOT NULL, DEFAULT 0 | Running spin count |
| totalWagered | BIGINT | NOT NULL, DEFAULT 0 | Sum of all spin bets in this session (cents) |
| totalPayout | BIGINT | NOT NULL, DEFAULT 0 | Sum of all spin payouts in this session (cents) |

**Business Rules:**
- Only one `active` session per player at a time.
- Session time warnings fire at 60 and 120 minutes (delta from `startedAt`).
- `endedAt` is set when the player closes the Mini App or self-excludes.

---

## Spin

Individual spin result record. Immutable after creation.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| sessionId | UUID | FK → GameSession.id, NOT NULL | Parent session |
| playerId | UUID | FK → Player.id, NOT NULL | Denormalised for fast queries |
| betAmount | BIGINT | NOT NULL, CHECK > 0 | Bet in cents |
| linesCount | INT | NOT NULL, CHECK 1–20 | Active paylines |
| rngSeed | VARCHAR(256) | NOT NULL | RNG seed for audit reproducibility |
| symbolMatrix | JSONB | NOT NULL | 5×3 grid of symbol IDs, e.g. `[[1,2,3],[4,5,1],[2,1,4],[3,3,5],[1,2,2]]` |
| winningLines | JSONB | NOT NULL | Array of `{ lineId, symbols, multiplier }` |
| payout | BIGINT | NOT NULL, DEFAULT 0 | Gross payout in cents (0 for losing spin) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT now() | |

**Business Rules:**
- `rngSeed` is stored for regulatory audit — must allow independent verification of `symbolMatrix`.
- `payout` is capped at `betAmount × 5000`.
- Records are immutable.

---

## Bonus

Promotional credit tied to a wagering requirement.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| playerId | UUID | FK → Player.id, NOT NULL | |
| type | ENUM | NOT NULL | `welcome`, `referral`, `promotional` |
| amount | BIGINT | NOT NULL, CHECK > 0 | Bonus value in cents |
| wagerRequirement | BIGINT | NOT NULL | Total amount that must be wagered to release the bonus |
| wagered | BIGINT | NOT NULL, DEFAULT 0 | Amount wagered so far against this bonus |
| status | ENUM | NOT NULL, DEFAULT 'active' | `active`, `released`, `expired`, `cancelled` |
| expiresAt | TIMESTAMP | NOT NULL | Bonus expires if wagering not met by this date |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT now() | |

**Business Rules:**
- Bonus is `released` (moved from `bonusBalance` to `balance`) when `wagered ≥ wagerRequirement`.
- Bonus is `expired` if `expiresAt` passes before `released`.
- Cancelled bonuses are not refunded.

---

## Referral

Tracks the relationship between a referrer and a referred player.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| referrerId | UUID | FK → Player.id, NOT NULL | Player who shared the link |
| refereeId | UUID | FK → Player.id, UNIQUE, NOT NULL | Player who registered via the link |
| firstDepositAmount | BIGINT | NULLABLE | Referee's first deposit (cents); NULL until made |
| bonusAmount | BIGINT | NULLABLE | Bonus credited to referrer (cents); NULL until triggered |
| status | ENUM | NOT NULL, DEFAULT 'registered' | `registered`, `first_deposit_pending`, `bonus_credited`, `fraud_flagged` |
| createdAt | TIMESTAMP | NOT NULL | |
| bonusCreditedAt | TIMESTAMP | NULLABLE | |

**Business Rules:**
- `refereeId` is unique — a player can only be referred once.
- `referrerId ≠ refereeId` enforced at DB level.
- Fraud flag (`status = fraud_flagged`) blocks bonus crediting pending manual review.

---

## AdminUser

Internal staff account for the admin panel.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| email | VARCHAR(256) | UNIQUE, NOT NULL | Login credential |
| passwordHash | VARCHAR(256) | NOT NULL | bcrypt hash |
| role | ENUM | NOT NULL | `admin`, `compliance_officer`, `super_admin` |
| isActive | BOOLEAN | NOT NULL, DEFAULT true | |
| createdAt | TIMESTAMP | NOT NULL | |
| lastLoginAt | TIMESTAMP | NULLABLE | |

**Business Rules:**
- `compliance_officer` role has read-only access to all player data plus KYC status management.
- `super_admin` role is required for destructive operations (banning a player permanently).
- All admin actions are logged in an immutable audit log (not modelled here; handled at the application layer).

---

## GameConfig

Active slot machine configuration. Versioned — old versions are retained for audit.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| rtpTarget | DECIMAL(5,2) | NOT NULL, CHECK 94.00–97.00 | Target RTP percentage |
| volatility | ENUM | NOT NULL | `low`, `medium`, `high` |
| linesCount | INT | NOT NULL, CHECK 1–20 | Total paylines available |
| minBet | BIGINT | NOT NULL, CHECK > 0 | Minimum bet in cents |
| maxBet | BIGINT | NOT NULL | Maximum bet in cents |
| isActive | BOOLEAN | NOT NULL, DEFAULT false | Only one config is active at a time |
| createdBy | UUID | FK → AdminUser.id, NOT NULL | Admin who created this version |
| approvedBy | UUID | FK → AdminUser.id, NULLABLE | Second admin who approved RTP changes |
| activatedAt | TIMESTAMP | NULLABLE | When this config became active |
| createdAt | TIMESTAMP | NOT NULL | |

**Business Rules:**
- Exactly one `GameConfig` record has `isActive = true` at any time.
- `rtpTarget` outside 94.00–97.00 is rejected at the application layer before saving.
- A new config version is created for every change; the old version is never deleted.
- `approvedBy` is required when `rtpTarget` differs from the previous active config.

---

## Entity Relationship Summary

```
Player ──< Wallet ──< Transaction
Player ──< GameSession ──< Spin
Player ──< Bonus
Player ──< Referral (as referrer or referee)
GameSession >── GameConfig
AdminUser ──< GameConfig (as creator and approver)
Transaction >── Spin (optional, for spin_debit/spin_credit)
```
