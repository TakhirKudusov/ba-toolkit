# Domain Reference: iGaming

Domain-specific knowledge for iGaming projects: online slots, sports betting, casino lobbies, operator admin panels, Telegram Mini Apps, promotional mechanics (tournaments, bonuses, wheel of fortune).

---

## 1. /brief — Project Brief

### Domain-specific interview questions
- Product type: online slot, sports betting, casino lobby, operator admin panel, promo mechanic, Telegram Mini App?
- Jurisdictions and licenses: MGA (Malta Gaming Authority), Curaçao eGaming, UKGC (UK Gambling Commission), other?
- Competitive products / references in iGaming?
- Integrations: game aggregator, payment providers (which ones), KYC/AML service?

### Typical business goals
- Increase player retention and LTV (Lifetime Value).
- Enter a new regulated market.
- Replace legacy operator platform.
- Grow GGR (Gross Gaming Revenue) through new game mechanics.
- Increase ARPU (Average Revenue Per User) through promo mechanics.

### Typical risks
- License revocation or delay.
- Regulatory changes in the target jurisdiction.
- Dependency on a third-party game aggregator.
- Fraud and bonus hunting.

---

## 2. /srs — Requirements Specification

### Domain-specific interview questions
- Roles: player, operator, administrator, compliance officer, marketing manager, support agent, affiliate?
- External integrations: payment providers, game aggregator, KYC/AML service, CRM, push notifications, analytics, affiliate tracking?
- Multi-currency: which currencies, including crypto? Exchange rate handling?
- Regulatory requirements: responsible gambling, AML (Anti-Money Laundering), data retention per jurisdiction?
- Business rules: bet limits, wagering requirements, cooldown periods, age verification?

### Typical functional areas
- Registration and verification (KYC).
- Deposit and withdrawal.
- Gameplay (lobby, game launch, bet history).
- Bonus system (welcome bonus, free spins, cashback, tournaments).
- Admin panel (player management, reports, settings).
- Responsible gambling (limits, self-exclusion, Reality Check).

---

## 3. /stories — User Stories

### Domain-specific interview questions
- Critical user flows: registration, deposit, game session, withdrawal, bonus activation, verification?
- Edge cases: bonus hunting, multi-accounting, payment timeouts, connection loss during a spin, limit exceeded?
- Personas: newcomer, casual player, high roller, VIP, affiliate?

### Typical epics
- Registration and authentication.
- Payments (deposit, withdrawal).
- Gameplay.
- Bonuses and promotions.
- Profile and settings.
- Administration.
- Responsible gambling.
- Reporting and analytics.

---

## 4. /usecases — Use Cases

### Domain-specific interview questions
- Critical alternative flows: payment timeout, KYC rejection, connection loss during spin, insufficient balance, account blocking?
- System actors: payment provider, game aggregator, RNG service (Random Number Generator), KYC provider?

### Typical exceptional flows
- Payment provider integration failure.
- Fraud suspicion (unusual betting pattern).
- Responsible gambling limit exceeded.
- Account blocked due to AML check.
- Game aggregator unavailable.

---

## 5. /ac — Acceptance Criteria

### Domain-specific interview questions
- Business rules for AC: min/max bet, wagering requirements (playthrough multiplier), cooldown periods, withdrawal limits?
- Boundary values: minimum deposit, maximum bet, session timeout, maximum win?
- Data precision: currency — 2 decimal places, coefficients — 3 decimal places, RTP (Return to Player) — percentage with 0.01% precision?

---

## 6. /nfr — Non-functional Requirements

### Domain-specific interview questions
- Target CCU (Concurrent Users) and RPS (Requests Per Second)?
- RNG: certification required (GLI, eCOGRA, BMM)? Audit?
- Responsible gambling: limits (deposit, bet, loss, session time), self-exclusion, cooling-off, Reality Check?
- Data retention: GDPR, jurisdiction-specific requirements?

### Mandatory NFR categories for iGaming
- **Performance:** spin response time < 200ms, lobby time-to-first-frame < 2s.
- **Security:** TLS 1.2+, PII (Personally Identifiable Information) encryption, 2FA for admins, SQL injection and XSS protection.
- **Compliance:** licensing requirements (MGA/UKGC/Curaçao), transaction audit, log retention 5+ years.
- **Responsible gambling:** self-limitation tools, automatic notifications, forced breaks.
- **RNG:** certified random number generator, independent audit.
- **Availability:** SLA 99.95%+ for gameplay.

---

## 7. /datadict — Data Dictionary

### Domain-specific interview questions
- Which entities require full audit: transactions, bets, sessions, balance changes, admin actions?
- Multi-currency: amounts in minor units (cents) or major? Store exchange rate at transaction time?

### Mandatory entities for iGaming
- **User** — player, including KYC status, verification, limits.
- **Transaction** — financial operations (deposit, withdrawal, bonus, adjustment).
- **Bet / Wager** — bet: amount, coefficient, result, game session link.
- **GameSession** — game session: start, end, game, total bets/wins.
- **Bonus** — bonus: type, status, wagering progress, expiry.
- **AuditLog** — audit log: action, actor, timestamp, payload.
- **Game** — game catalog: provider, RTP, volatility, status.
- **PaymentMethod** — user payment methods.
- **ResponsibleGamblingSettings** — limits and self-limitation settings.

---

## 8. /apicontract — API Contract

### Domain-specific interview questions
- Webhook contracts: payment provider callback, game aggregator events (round start/end, balance check), KYC results?
- WebSocket: real-time balance, game events, tournament leaderboard?

### Typical endpoint groups
- Auth (registration, login, refresh, logout).
- Users (profile, KYC, verification, limits).
- Payments (deposit, withdrawal, transaction history).
- Games (catalog, launch, history).
- Bets (placement, history, details).
- Bonuses (activation, status, cancellation).
- Admin (player management, reports, settings).
- Webhooks (payment callbacks, game aggregator events).

---

## 9. /wireframes — Wireframe Descriptions

### Domain-specific interview questions
- Key screens: lobby, game screen, profile, cashier (deposit/withdrawal), admin panel, bonus section?
- Specific states: restricted region, pending verification, self-excluded, maintenance?

### Typical screens
- Lobby (game catalog with filters and search).
- Game screen (iframe/canvas game + balance overlay).
- Cashier — deposit (method selection, amount, confirmation).
- Cashier — withdrawal (method, amount, verification status).
- Profile (data, KYC, history, responsible gambling settings).
- Bonuses (active, available, history).
- Admin panel: dashboard, player management, transactions, reports.

---

## Domain Glossary

| Term | Definition |
|------|-----------|
| GGR | Gross Gaming Revenue — total bets minus total wins |
| NGR | Net Gaming Revenue — GGR minus bonuses and adjustments |
| RTP | Return to Player — percentage returned to players over time |
| Wagering requirements | Bonus playthrough requirements — how many times the bonus amount must be wagered |
| KYC | Know Your Customer — identity verification procedure |
| AML | Anti-Money Laundering — money laundering prevention |
| MGA | Malta Gaming Authority — Maltese regulator |
| UKGC | UK Gambling Commission — British regulator |
| CCU | Concurrent Users — simultaneous users |
| RNG | Random Number Generator |
| Responsible gambling | A set of self-limitation tools for players |
| Cooldown | Mandatory pause between actions |
| Self-exclusion | Voluntary access block to gambling |
| Reality Check | Periodic notification about session duration and results |
| Freebet / Freespin | Free bet / free spin |
| Game aggregator | Platform aggregating games from multiple providers |
