# Technology Research: Dragon Fortune

**Domain:** iGaming
**Date:** 2026-04-08
**Slug:** dragon-fortune
**References:** `02_srs_dragon-fortune.md`, `07_datadict_dragon-fortune.md`, `06_nfr_dragon-fortune.md`

---

## Integration Map

| External System | Protocol | Direction | Purpose |
|-----------------|----------|-----------|---------|
| Telegram Bot API | HTTPS Webhook | Inbound | Auth hash verification; outbound player notifications |
| Telegram Mini App SDK | JavaScript SDK | Client | UI host; initData injection; theme variables |
| Payment Aggregator | REST API + Webhook | Bidirectional | Deposit address generation; withdrawal processing; confirmations |
| KYC Provider | REST API + Embedded Form | Bidirectional | Identity verification; status webhooks |
| RNG Service | REST API | Outbound | Spin seed generation and symbol matrix calculation |

---

## ADR-001: Frontend Framework — React + Telegram Mini App SDK

**Status:** Accepted

**Context:**
The frontend runs inside the Telegram Mini App WebView. It must load in ≤ 3 seconds (NFR-010), use Telegram native theme variables, and handle SDK events (back button, viewport changes).

**Options considered:**
| Option | Pros | Cons |
|--------|------|------|
| React + Vite | Fast build, large ecosystem, team familiarity | Bundle size management needed |
| Vue 3 | Lighter weight | Team less familiar |
| Vanilla JS | Smallest bundle | Slow to build; no component reuse |

**Decision:** React 18 + Vite. The team has React experience, and Vite's code splitting keeps the initial bundle under the load-time budget (NFR-010). All Telegram SDK calls are wrapped in a `useTelegram` adapter hook to isolate breaking changes (Constraint: Telegram API risk, RISK-02).

**Consequences:**
- The `useTelegram` hook must be the only point of contact with `window.Telegram.WebApp`.
- If the SDK introduces breaking changes, only the hook requires updates.

---

## ADR-002: Real-time Spin State — Server-Sent Events vs WebSocket vs REST

**Status:** Accepted

**Context:**
Spin results must be returned in ≤ 200 ms at p95 (NFR-001). The connection model affects both latency and infrastructure complexity.

**Options considered:**
| Option | Latency | Complexity | Notes |
|--------|---------|------------|-------|
| REST (request-response) | 100–200 ms | Low | Single HTTP round-trip per spin |
| WebSocket | 50–100 ms | High | Persistent connection; harder to scale horizontally |
| Server-Sent Events | 80–150 ms | Medium | One-way; not needed for spin flow |

**Decision:** REST. The spin flow is inherently request-response (player initiates, server responds once). WebSocket adds connection management overhead and horizontal scaling complexity without a latency benefit that justifies it. If multiplayer features are added post-MVP, WebSocket can be introduced for leaderboard updates.

**Consequences:**
- Leaderboard (if added) will use polling at 5-second intervals until WebSocket is introduced.
- Spin endpoint must be optimised to stay within NFR-001 budget (RNG call is the critical path).

---

## ADR-003: Payment Integration — Aggregator-First vs Direct Integration

**Status:** Accepted

**Context:**
The system must support BTC, USDT, Qiwi, YooMoney, and SBP. Direct integration with each provider is an option but multiplies maintenance surface.

**Options considered:**
| Option | Pros | Cons |
|--------|------|------|
| Payment aggregator (single API) | One integration, handles crypto + fiat, KYC built-in | Aggregator SLA risk (RISK-01); revenue share fee |
| Direct integration per provider | No middleman fee | 4–5 separate integrations; 4× compliance overhead |

**Decision:** Single payment aggregator. The aggregator provides a unified API for all payment methods, handles fiat-to-crypto conversion, and includes a KYC verification module. A fallback aggregator will be contracted for redundancy (RISK-01 mitigation). The system will abstract payment calls behind a `PaymentGatewayService` interface so the aggregator can be swapped without changing business logic.

**Consequences:**
- `PaymentGatewayService` interface must be defined before sprint 2 to decouple implementation from tests.
- SLA terms must be signed with the primary aggregator before sprint 2 begins.
- Fallback aggregator integration is a post-MVP item unless primary SLA is not guaranteed.

---

## ADR-004: Data Storage — PostgreSQL vs MongoDB

**Status:** Accepted

**Context:**
The data model (see `07_datadict_dragon-fortune.md`) has strong relational characteristics: Player → Wallet → Transaction → Spin, with foreign key integrity requirements. Financial records must be immutable and auditable.

**Options considered:**
| Option | Pros | Cons |
|--------|------|------|
| PostgreSQL | ACID transactions, FK constraints, JSONB for flexible fields | Slightly higher operational complexity than managed NoSQL |
| MongoDB | Flexible schema | Weaker transactional guarantees; no FK enforcement at DB level |

**Decision:** PostgreSQL. ACID transaction support is non-negotiable for wallet operations (balance must not go negative; no double-crediting). FK constraints enforce data integrity at the DB layer. JSONB is used for `Spin.symbolMatrix` and `Spin.winningLines` where schema flexibility is needed.

**Consequences:**
- Redis is added for session state (active game sessions) and rate-limiting counters to reduce read load on PostgreSQL.
- Database migrations use a schema versioning tool (Flyway or Liquibase) to maintain audit trail of schema changes.

---

## ADR-005: RNG Integration — Managed Service vs In-house

**Status:** Accepted

**Context:**
The iGaming licence requires the RNG to be certified by an accredited testing laboratory (e.g., eCOGRA, BMM). Building and certifying an in-house RNG is a 6–12 month certification process.

**Options considered:**
| Option | Pros | Cons |
|--------|------|------|
| Certified managed RNG service | Certification already in place; low time-to-market | Per-spin API cost; external dependency |
| In-house RNG + certification | Full control | 6–12 month certification; blocks launch |

**Decision:** Certified managed RNG service (e.g., Scientific Games, Inspired Entertainment). The service provides a REST API that accepts a game configuration and returns a certified spin result with a verifiable seed. This unblocks the launch timeline and transfers the certification burden to the provider.

**Consequences:**
- RNG API call is on the critical path of every spin (NFR-001). SLA with the RNG provider must guarantee ≤ 50 ms response time.
- `Spin.rngSeed` is stored for every spin to allow independent verification by the regulator.
- In-house RNG remains a post-MVP option if cost per spin becomes significant at scale.

---

## Compliance Notes

| Topic | Requirement | Implementation |
|-------|-------------|----------------|
| GDPR | Player PII encrypted at rest (NFR-005) | AES-256 at PostgreSQL column level for `Player.firstName`, KYC references stored at provider only |
| AML | Transaction records retained 5 years | `Transaction` table has no delete operation; archival to cold storage after 2 years |
| Responsible Gambling | Session warning, self-exclusion, deposit limits | Server-side timers; exclusion enforced at auth middleware |
| RTP Audit | Spin results reproducible from seed | `Spin.rngSeed` stored; RNG provider supplies audit report on demand |
| Licence | Operating licence in progress | Soft-launch in unregulated CIS market pending licence approval (RISK-01 contingency) |
