# Domain Reference: Fintech

Domain-specific knowledge for Fintech projects: neobanks, payment systems, crypto exchanges, investment platforms, P2P lending, insurance tech, PFM (Personal Finance Management).

---

## 1. /brief — Project Brief

### Domain-specific interview questions
- Product type: neobank, payment gateway, crypto exchange, investment platform, PFM app, P2P lending, insurance aggregator?
- Licenses and regulators: central bank, FCA (UK), BaFin (DE), SEC/FINRA (US), MAS (Singapore)?
- Integrations: card processing (Visa/Mastercard), SWIFT, Open Banking API, exchanges, credit scoring?

### Typical business goals
- Reduce cost-to-serve per transaction.
- Grow MAU (Monthly Active Users) and engagement.
- Enter a new regulatory market.
- Increase AUM (Assets Under Management).
- Launch a new financial product (card, loan, investments).

### Typical risks
- License denial or regulatory restrictions.
- Customer financial data breach.
- Processing rule changes (PCI DSS, PSD2).
- Operational losses due to calculation errors.

---

## 2. /srs — Requirements Specification

### Domain-specific interview questions
- Roles: individual customer, corporate customer, operator, compliance officer, risk manager, support agent?
- External integrations: processing center, SWIFT/SEPA, Open Banking (PSD2), credit bureaus, KYC/AML provider, market data feeds?
- Multi-currency: fiat currencies, crypto, conversion?
- Regulatory requirements: PCI DSS, PSD2 (Strong Customer Authentication), GDPR, SOX, Basel III?

### Typical functional areas
- Onboarding and verification (KYC/KYB).
- Account and balance management.
- Transfers and payments (P2P, C2B, B2B, international).
- Card products (issuance, management, limits).
- Investments / trading (portfolio, orders, market data).
- Lending (scoring, application, servicing).
- Reporting (regulatory, management, customer).

---

## 3. /stories — User Stories

### Domain-specific interview questions
- Critical user flows: onboarding, first transfer, card top-up, investment trade, loan application?
- Edge cases: double charge, transaction reversal, sanctions check, AML block, daily limit exceeded?
- Personas: individual customer, sole proprietor, corporate treasurer, beginner investor, active trader?

### Typical epics
- Onboarding and KYC/KYB.
- Accounts and balances.
- Payments and transfers.
- Cards.
- Investments / trading.
- Loans.
- Notifications and alerts.
- Administration and compliance.

---

## 4. /usecases — Use Cases

### Domain-specific interview questions
- Critical alternative flows: insufficient funds, processing rejection, SCA challenge (Strong Customer Authentication), sanctions stop-list?
- System actors: processing center, SWIFT gateway, credit bureau, market data provider, AML service?

### Typical exceptional flows
- Transaction declined by processor.
- Counterparty on sanctions list.
- SWIFT/SEPA connection failure.
- Market data feed unavailable.
- Credit limit exceeded.

---

## 5. /ac — Acceptance Criteria

### Domain-specific interview questions
- Business rules: daily/monthly transfer limits, fees (fixed, percentage, tiered), minimum investment amount, interest rates?
- Boundary values: minimum transfer, maximum balance, SCA timeout, trade holding period?
- Precision: currency — 2 decimal places, crypto — up to 8, interest rates — up to 4?

---

## 6. /nfr — Non-functional Requirements

### Domain-specific interview questions
- Target TPS (Transactions Per Second) and payment processing time (p95)?
- PCI DSS: which level (Level 1–4)? Certification or SAQ (Self-Assessment Questionnaire)?
- Encryption: HSM (Hardware Security Module) for keys? Card tokenization?

### Mandatory NFR categories for Fintech
- **Performance:** payment processing time < 3s (p95), TPS for peak loads.
- **Security:** PCI DSS compliance, HSM for cryptographic keys, PAN (Primary Account Number) tokenization, encryption at-rest and in-transit.
- **Compliance:** regulatory reporting, transaction data retention 5–10 years, AML monitoring, PSD2 SCA.
- **Availability:** SLA 99.99% for payment processing, RPO (Recovery Point Objective) < 1 min.
- **Audit:** full audit trail for all financial operations, immutable logs.

---

## 7. /datadict — Data Dictionary

### Domain-specific interview questions
- Audit: which operations require immutable log (transfers, limit changes, logins)?
- Amount precision: stored in minor units (cents) or fixed precision (decimal)?

### Mandatory entities for Fintech
- **User / Customer** — customer, KYC status, verification level, risk rating.
- **Account** — account: type, currency, balance, status.
- **Transaction** — transaction: type, amount, currency, status, fee, counterparty.
- **Card** — card: tokenized PAN, status, limits, expiry.
- **KYCRecord** — verification results: documents, check status, provider.
- **AMLCheck** — AML check results: score, decision, timestamp.
- **AuditLog** — audit log: action, actor, IP, timestamp, payload.
- **Fee** — fee: type, calculation, applicability.
- **ExchangeRate** — exchange rates: pair, rate, timestamp, source.

---

## 8. /apicontract — API Contract

### Domain-specific interview questions
- Webhook contracts: processing callback (payment status), AML service notifications, Open Banking events?
- Authentication: OAuth2 + SCA, mTLS for service-to-service?

### Typical endpoint groups
- Auth (registration, login, SCA, refresh).
- Accounts (creation, balance, statement).
- Transfers (P2P, SEPA, SWIFT, internal).
- Cards (issuance, blocking, limits, PIN).
- Investments (portfolio, orders, quotes).
- KYC (document upload, status).
- Admin (customer management, AML review, reports).
- Webhooks (payment status, AML alerts, card events).

---

## 9. /wireframes — Wireframe Descriptions

### Domain-specific interview questions
- Key screens: dashboard, account list, transfer, card, investments, transaction history?
- Specific states: pending verification, card frozen, insufficient funds, SCA required?

### Typical screens
- Dashboard (account summary, recent transactions, quick actions).
- Account (balance, statement, period and type filters).
- Transfer (recipient selection, amount, confirmation, SCA).
- Card (visualization, limits, block/unblock, PIN).
- Investments (portfolio, charts, order placement).
- Profile (data, KYC status, security settings).
- Admin panel: customers, transactions, AML alerts, reports.

---

## Domain Glossary

| Term | Definition |
|------|-----------|
| PCI DSS | Payment Card Industry Data Security Standard |
| PSD2 | Payment Services Directive 2 — EU payment services directive |
| SCA | Strong Customer Authentication — enhanced customer authentication (PSD2 requirement) |
| KYC | Know Your Customer — customer identification |
| KYB | Know Your Business — business entity identification |
| AML | Anti-Money Laundering |
| HSM | Hardware Security Module — hardware module for key storage |
| PAN | Primary Account Number — payment card number |
| SWIFT | Society for Worldwide Interbank Financial Telecommunication |
| SEPA | Single Euro Payments Area |
| TPS | Transactions Per Second |
| RPO | Recovery Point Objective — acceptable data loss on failure |
| RTO | Recovery Time Objective — acceptable recovery time after failure |
| AUM | Assets Under Management |
| MAU | Monthly Active Users |
| SAQ | Self-Assessment Questionnaire — PCI DSS self-assessment |
