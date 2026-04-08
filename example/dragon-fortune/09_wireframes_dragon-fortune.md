# Wireframe Descriptions: Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-08
**Slug:** dragon-fortune
**References:** `03_stories_dragon-fortune.md`, `08_apicontract_dragon-fortune.md`

---

## WF-001: Slot Game Screen (Main)

**Linked US:** US-002, US-003, US-004
**FR Reference:** FR-002, FR-003, FR-004
**Navigation from:** App launch (after auth)
**Navigation to:** WF-002 (Wallet), WF-004 (Referrals), WF-005 (Settings)

### Layout

```
┌─────────────────────────────────────┐
│ [Dragon Fortune]          [Balance] │  ← Header: game title + live balance
│                           12.50 USD │
├─────────────────────────────────────┤
│                                     │
│   ┌───┬───┬───┬───┬───┐             │
│   │ 🐉│ 💰│ 🎴│ ⭐│ 🔮│  ← Reel row 1
│   ├───┼───┼───┼───┼───┤             │
│   │ 💎│ 🐉│ 💰│ 🐉│ 💎│  ← Reel row 2 (payline highlighted)
│   ├───┼───┼───┼───┼───┤             │
│   │ ⭐│ 🎴│ 🐉│ 💰│ 🔮│  ← Reel row 3
│   └───┴───┴───┴───┴───┘             │
│         WIN: +2.00 USD              │  ← Win banner (visible on win only)
│                                     │
├─────────────────────────────────────┤
│  Lines: [1──────────20]  10 active  │  ← Payline slider
│  Bet:   [◄]  0.10 USD  [►]          │  ← Bet selector
│                                     │
│         [ 🔄  SPIN ]                │  ← Primary CTA button
├─────────────────────────────────────┤
│  [💳 Wallet]  [👥 Refer]  [⚙️ Settings] │  ← Bottom nav
└─────────────────────────────────────┘
```

### States

| State | Description |
|-------|-------------|
| Default | Reels static; Spin button active; balance displayed |
| Spinning | Reels animating; Spin button disabled; balance shows reserved amount |
| Win | Reels stopped; winning paylines highlighted; WIN banner visible for 2 s |
| Loss | Reels stopped; no highlight; balance updated |
| Insufficient balance | Spin button disabled; balance shown in red; "Top up" link visible |
| Session warning | Modal overlay (WF-005-modal) shown; Spin button disabled until dismissed |

### Notes
- Balance is updated optimistically on spin initiation and confirmed on response.
- The Win banner is hidden on losing spins.
- Bet selector respects GameConfig `minBet` and `maxBet`.

---

## WF-002: Wallet Screen

**Linked US:** US-004, US-007, US-008, US-009, US-010
**FR Reference:** FR-004, FR-005, FR-006, FR-007, FR-008
**Navigation from:** WF-001 bottom nav → Wallet
**Navigation to:** WF-002-deposit (Deposit flow), WF-002-withdraw (Withdraw flow), WF-003 (Transaction history)

### Layout

```
┌─────────────────────────────────────┐
│ ← Back                     Wallet   │
├─────────────────────────────────────┤
│                                     │
│       Available Balance             │
│         💵 12.50 USD                │
│       Bonus: 5.00 USD (locked)      │
│                                     │
│   ┌─────────────┐ ┌───────────────┐ │
│   │  + Deposit  │ │  - Withdraw   │ │
│   └─────────────┘ └───────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ Recent Transactions                 │
│ ─────────────────────────────────── │
│ ↑ Deposit  +50.00 USD  Apr 8  ✓    │
│ ↓ Spin      -0.10 USD  Apr 8       │
│ ↑ Win        +1.00 USD Apr 8  ✓    │
│ ↓ Withdraw -20.00 USD  Apr 7  ✓    │
│                  [View all →]       │
└─────────────────────────────────────┘
```

### States

| State | Description |
|-------|-------------|
| Default | Balance, bonus balance, action buttons, last 5 transactions |
| Loading | Skeleton placeholders for balance and transactions |
| Empty (no transactions) | "No transactions yet. Make your first deposit!" |
| KYC required | Yellow banner: "Verify your identity to withdraw more than 50 USD" |

---

## WF-002-deposit: Deposit Flow

**Linked US:** US-007, US-008

### Step 1 — Choose method

```
┌─────────────────────────────────────┐
│ ← Back              Choose method   │
├─────────────────────────────────────┤
│  ┌──────────────────────────────┐   │
│  │ ₿  Cryptocurrency            │   │
│  │    BTC · USDT (ERC-20/TRC20) │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │ 🏦  Local Payment            │   │
│  │    Qiwi · YooMoney · SBP     │   │
│  └──────────────────────────────┘   │
│                                     │
│  Min deposit: 5 USD equivalent      │
└─────────────────────────────────────┘
```

### Step 2a — Crypto deposit address

```
┌─────────────────────────────────────┐
│ ← Back            Crypto Deposit    │
├─────────────────────────────────────┤
│  Currency:  [USDT ▼]  Network: ERC20│
│                                     │
│    ┌───────────────────────────┐    │
│    │         [QR CODE]         │    │
│    └───────────────────────────┘    │
│  0xA1B2C3D4E5F6...E7F8  [Copy]      │
│                                     │
│  ⚠️ Send only USDT (ERC-20) to this │
│     address. Single-use only.       │
│  ⏳ Address valid for 30 minutes    │
│                                     │
│  Awaiting confirmation...           │
└─────────────────────────────────────┘
```

---

## WF-003: Transaction History Screen

**Linked US:** US-010
**FR Reference:** FR-008
**Navigation from:** WF-002 → "View all"

### Layout

```
┌─────────────────────────────────────┐
│ ← Back          Transaction History │
├─────────────────────────────────────┤
│ Filter: [All ▼]  [Apr 1–Apr 8 📅]   │
├─────────────────────────────────────┤
│ Apr 8                               │
│  ↑ Deposit (Qiwi)    +50.00 USD  ✓ │
│  ↓ Spin               -0.10 USD    │
│  ↑ Win (3× Dragon)    +1.00 USD  ✓ │
│ Apr 7                               │
│  ↓ Withdrawal        -20.00 USD  ✓ │
│  ↑ Deposit (USDT)    +30.00 USD  ✓ │
│                                     │
│          [Load more]                │
└─────────────────────────────────────┘
```

### States

| State | Description |
|-------|-------------|
| Default | Grouped by date, 20 per page, oldest last |
| Filtered | Filtered by type and/or date range |
| Empty | "No transactions match your filter." |
| Loading more | Spinner below the last item |

---

## WF-004: Referral Programme Screen

**Linked US:** US-012, US-013, US-014
**FR Reference:** FR-010, FR-011
**Navigation from:** WF-001 bottom nav → Refer

### Layout

```
┌─────────────────────────────────────┐
│ ← Back           Refer & Earn       │
├─────────────────────────────────────┤
│  👥 Invite friends — earn 10% of   │
│     their first deposit (max 50 USD)│
│                                     │
│  Your referral link:                │
│  t.me/DragonFortuneBot?start=ref_…  │
│  [ Share via Telegram ] [ Copy ]    │
│                                     │
├─────────────────────────────────────┤
│  Your Referrals (3)                 │
│  ─────────────────────────────────  │
│  @ivan_k     First deposit ✓  +5 USD│
│  @maria_s    Registered      Pending│
│  @oleg_v     First deposit ✓  +3 USD│
│                                     │
├─────────────────────────────────────┤
│  Active Bonuses                     │
│  Referral bonus: 8 USD              │
│  Wagered: 24/40 USD  ████████░░░░   │
└─────────────────────────────────────┘
```

### States

| State | Description |
|-------|-------------|
| Default | Referral link + share button + referee list + bonus progress |
| No referrals | "No referrals yet. Share your link to start earning!" |
| Bonus released | Green banner: "Your bonus has been unlocked and added to your balance!" |

---

## WF-005: Settings / Responsible Gambling Screen

**Linked US:** US-005, US-015, US-016
**FR Reference:** FR-012, FR-013, FR-014
**Navigation from:** WF-001 bottom nav → Settings

### Layout

```
┌─────────────────────────────────────┐
│ ← Back              Settings        │
├─────────────────────────────────────┤
│  Responsible Gambling               │
│                                     │
│  Session limit                      │
│  Current: 90 min  [Change]          │
│                                     │
│  Deposit limits                     │
│  Daily:   200 USD  [Change]         │
│  Weekly:  500 USD  [Change]         │
│  Monthly: —        [Set]            │
│                                     │
│  ─────────────────────────────────  │
│  ⛔ Self-Exclusion                  │
│  Temporarily or permanently block   │
│  access to your account.            │
│  [ Exclude myself ]                 │
└─────────────────────────────────────┘
```

### WF-005-modal: Session Time Warning Overlay

```
┌─────────────────────────────────────┐
│         ⏰ Session reminder         │
│                                     │
│  You have been playing for 1 hour.  │
│  Total wagered this session: 12 USD │
│                                     │
│  Take a break or set a time limit   │
│  in Settings.                       │
│                                     │
│   [ Exit game ]   [ Continue ]      │
└─────────────────────────────────────┘
```

---

## WF-006: Admin — Player Management Screen

**Linked US:** US-017, US-020
**FR Reference:** FR-015
**Navigation from:** Admin panel sidebar → Players
**Auth:** Admin role required

### Layout

```
┌──────────────────────────────────────────────────┐
│ Dragon Fortune Admin      Players                 │
├──────────────────────────────────────────────────┤
│ Search: [___________________] [🔍 Search]         │
│ Filter: Status [All ▼]  KYC [All ▼]               │
├──────────────────────────────────────────────────┤
│ ID          Username     Status    KYC    Balance │
│ a1b2c3...   alexei_p     Active    ✓ Verif 12 USD │
│ d4e5f6...   maria_s      Active    Pending  5 USD │
│ g7h8i9...   oleg_v       Suspended ✓ Verif  0 USD │
├──────────────────────────────────────────────────┤
│ Showing 1–20 of 12,450            [← Prev][Next →]│
└──────────────────────────────────────────────────┘
```

### Player Detail Drawer (on row click)

```
┌───────────────────────────────────┐
│ Player: alexei_plays              │
│ ID: a1b2c3d4...                   │
│ Telegram: 123456789               │
│ Status: Active     [Change ▼]     │
│ KYC: Verified                     │
│ Balance: 12.50 USD                │
│ Registered: 2026-03-01            │
│ Last spin: 2026-04-08 12:45       │
│                                   │
│ [View transactions] [Flag review] │
└───────────────────────────────────┘
```

### States

| State | Description |
|-------|-------------|
| Default | Paginated player list with search and filter |
| Search results | Filtered list; "No results" if empty |
| Loading | Skeleton rows |
